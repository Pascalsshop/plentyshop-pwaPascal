import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { PayPalNamespace } from '@paypal/paypal-js';
import { usePayPal } from '../usePayPal';

const { sdkLoader, emit } = vi.hoisted(() => ({
  sdkLoader: vi.fn(),
  emit: vi.fn(),
}));
vi.mock('@paypal/paypal-js', () => ({ loadScript: sdkLoader }));
mockNuxtImport('usePlentyEvent', () => () => ({ emit }));

const deferred = () => {
  let resolve!: (value: PayPalNamespace | null) => void;
  const promise = new Promise<PayPalNamespace | null>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
const namespace = () => ({ Buttons: vi.fn() }) as unknown as PayPalNamespace;

describe('PayPal SDK loading', () => {
  beforeEach(() => {
    sdkLoader.mockReset();
    useNuxtApp().$i18n.locale.value = 'de';
    const { state } = usePayPal();
    state.value.loadedConfig = true;
    state.value.config = { clientId: 'test-client', merchantId: 'test-merchant' } as typeof state.value.config;
    state.value.paypalScript = null;
    state.value.loadingScripts = {};
    state.value.requestedScriptKey = '';
    state.value.isReady = false;
  });

  it('shares simultaneous loads and stays unready until the SDK resolves', async () => {
    const pending = deferred();
    const sdk = namespace();
    sdkLoader.mockReturnValue(pending.promise);
    const paypal = usePayPal();
    const first = paypal.getScript('EUR');
    const second = paypal.getScript('EUR');
    await Promise.resolve();
    expect(sdkLoader).toHaveBeenCalledTimes(1);
    expect(paypal.isReady.value).toBe(false);
    pending.resolve(sdk);
    expect(await first).toBe(sdk);
    expect(await second).toBe(sdk);
    expect(paypal.isReady.value).toBe(true);
    expect(paypal.state.value.loadingScripts).toEqual({});
    expect(await paypal.getScript('EUR')).toBe(sdk);
    expect(sdkLoader).toHaveBeenCalledTimes(1);
  });

  it('isolates currency and commit SDKs without overwriting a newer result', async () => {
    const gbp = deferred();
    const eur = deferred();
    sdkLoader.mockReturnValueOnce(gbp.promise).mockReturnValueOnce(eur.promise);
    const paypal = usePayPal();
    const older = paypal.getScript('GBP');
    const newer = paypal.getScript('EUR');
    await Promise.resolve();
    const euroSdk = namespace();
    eur.resolve(euroSdk);
    await newer;
    gbp.resolve(namespace());
    await older;
    expect(paypal.state.value.paypalScript?.currency).toBe('EUR');
    expect(paypal.getCurrentScript()).toBe(euroSdk);
    expect(sdkLoader.mock.calls[0]![0].dataNamespace).toBe('plenty_paypal_GBP_de_DE_express');
    expect(sdkLoader.mock.calls[1]![0].dataNamespace).toBe('plenty_paypal_EUR_de_DE_express');
    sdkLoader.mockResolvedValueOnce(namespace());
    await paypal.getScript('EUR', true);
    expect(sdkLoader.mock.calls[2]![0].dataNamespace).toBe('plenty_paypal_EUR_de_DE_commit');
    expect(sdkLoader.mock.calls[2]![0].enableFunding).toBe('paylater');
    expect(sdkLoader.mock.calls[2]![0].components).not.toContain('&');
  });

  it('allows retry after a failed SDK load instead of caching null permanently', async () => {
    sdkLoader.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(namespace());
    const paypal = usePayPal();
    expect(await paypal.getScript('EUR')).toBeNull();
    expect(paypal.isReady.value).toBe(false);
    expect(paypal.state.value.loadingScripts).toEqual({});
    expect(await paypal.getScript('EUR')).not.toBeNull();
    expect(sdkLoader).toHaveBeenCalledTimes(2);
  });
});
