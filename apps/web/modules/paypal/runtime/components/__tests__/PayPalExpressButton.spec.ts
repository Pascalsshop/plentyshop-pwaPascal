import { flushPromises, mount } from '@vue/test-utils';
import { reactive, ref, nextTick } from '#imports';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PayPalExpressButton from '../PayPalExpressButton.vue';
import PayPalPayLaterBanner from '../PayPalPayLaterBanner.vue';

const { getScript, loadConfig, readyCallbacks, paymentAction, visibility } = vi.hoisted(() => ({
  getScript: vi.fn(),
  loadConfig: vi.fn().mockResolvedValue(true),
  readyCallbacks: [] as Array<() => unknown>,
  paymentAction: vi.fn(),
  visibility: { payLater: false },
}));
const cart = reactive({ value: { currency: 'EUR' } });
vi.mock('@plentymarkets/shop-api', () => ({
  cartGetters: { getCurrency: (data: { currency: string }) => data.currency },
}));
vi.mock('../../composables/usePayPal', () => ({
  usePayPal: () => ({
    getScript,
    loadConfig,
    order: ref(null),
    isReady: ref(true),
    config: ref({}),
    isAvailable: () => ref(true),
    payPalVisibility: { getVisibility: () => true },
    payLaterVisibility: { getVisibility: () => visibility.payLater },
    createTransaction: paymentAction,
    captureOrder: paymentAction,
    createPlentyOrder: paymentAction,
    createPlentyPaymentFromPayPalOrder: paymentAction,
    resetAPMs: vi.fn(),
  }),
}));
mockNuxtImport('onNuxtReady', () => (callback: () => unknown) => {
  readyCallbacks.push(callback);
});
mockNuxtImport('useCart', () => () => ({ data: cart, clearCartItems: paymentAction }));
mockNuxtImport('useFetchSession', () => () => ({ fetchSession: vi.fn() }));
mockNuxtImport('usePlentyEvent', () => () => ({ emit: vi.fn() }));
mockNuxtImport('useLocalizedPath', () => () => (path: string) => path);

const makeButton = () => ({
  isEligible: vi.fn(() => true),
  render: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
});
const makeSdk = (button: ReturnType<typeof makeButton>) => ({
  FUNDING: { PAYPAL: 'paypal' },
  Buttons: vi.fn(() => button),
});
const render = () => mount(PayPalExpressButton, { props: { location: 'itemPage', type: 'SingleItem' } });

describe('PayPal express button lifecycle (no payments)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readyCallbacks.length = 0;
    cart.value.currency = 'EUR';
    getScript.mockReset();
    visibility.payLater = false;
  });

  it('closes the owned button and stops currency watchers when navigating away', async () => {
    const button = makeButton();
    getScript.mockResolvedValue(makeSdk(button));
    const wrapper = render();
    await readyCallbacks[0]!();
    expect(button.render).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    await flushPromises();
    expect(button.close).toHaveBeenCalledTimes(1);
    cart.value.currency = 'GBP';
    await nextTick();
    expect(getScript).toHaveBeenCalledTimes(1);
    expect(paymentAction).not.toHaveBeenCalled();
  });

  it('does not render an obsolete SDK after a currency change while loading', async () => {
    let finishOld!: (value: unknown) => void;
    const oldButton = makeButton();
    const newButton = makeButton();
    getScript
      .mockReturnValueOnce(
        new Promise((resolve) => {
          finishOld = resolve;
        }),
      )
      .mockResolvedValueOnce(makeSdk(newButton));
    const wrapper = render();
    const initialRender = readyCallbacks[0]!();
    await flushPromises();
    cart.value.currency = 'GBP';
    await flushPromises();
    finishOld(makeSdk(oldButton));
    await initialRender;
    expect(newButton.render).toHaveBeenCalledTimes(1);
    expect(oldButton.render).not.toHaveBeenCalled();
    expect(paymentAction).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('does not start SDK loading if readiness occurs after unmount', async () => {
    const wrapper = render();
    wrapper.unmount();
    await readyCallbacks[0]!();
    expect(getScript).not.toHaveBeenCalled();
  });

  it('handles render rejection without launching any transaction', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const button = makeButton();
    button.render.mockRejectedValueOnce(new Error('SDK render failed'));
    getScript.mockResolvedValue(makeSdk(button));
    const wrapper = render();
    await expect(readyCallbacks[0]!()).resolves.toBeUndefined();
    expect(warning).toHaveBeenCalledWith('[PayPal] Could not render an express button.', expect.any(Error));
    expect(paymentAction).not.toHaveBeenCalled();
    wrapper.unmount();
    warning.mockRestore();
  });

  it('handles an in-flight iframe render cancelled by navigation', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let rejectRender!: (error: Error) => void;
    const button = makeButton();
    button.render.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectRender = reject;
      }),
    );
    getScript.mockResolvedValue(makeSdk(button));
    const wrapper = render();
    const initialRender = readyCallbacks[0]!();
    await flushPromises();
    wrapper.unmount();
    rejectRender(new Error('Component destroyed'));
    await expect(initialRender).resolves.toBeUndefined();
    expect(button.close).toHaveBeenCalledTimes(1);
    expect(warning).not.toHaveBeenCalled();
    expect(paymentAction).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it('renders the pay-later message after the SDK and its container are ready', async () => {
    visibility.payLater = true;
    const message = { render: vi.fn().mockResolvedValue(undefined) };
    getScript.mockResolvedValue({ ...makeSdk(makeButton()), Messages: () => message });
    const wrapper = mount(PayPalPayLaterBanner, {
      attachTo: document.body,
      props: { location: 'itemPage', placement: 'product', amount: 100 },
    });
    await readyCallbacks[0]!();
    expect(message.render).toHaveBeenCalledTimes(1);
    expect(paymentAction).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('ignores a late pay-later SDK and disposes its watcher after unmount', async () => {
    visibility.payLater = true;
    let finish!: (value: unknown) => void;
    getScript.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const wrapper = mount(PayPalPayLaterBanner, { props: { location: 'itemPage', placement: 'product', amount: 100 } });
    const initialRender = readyCallbacks[0]!();
    await flushPromises();
    wrapper.unmount();
    const message = { render: vi.fn() };
    finish({ ...makeSdk(makeButton()), Messages: () => message });
    await initialRender;
    cart.value.currency = 'GBP';
    await nextTick();
    expect(message.render).not.toHaveBeenCalled();
    expect(getScript).toHaveBeenCalledTimes(1);
    expect(paymentAction).not.toHaveBeenCalled();
  });
});
