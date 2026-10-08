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
    state.value.sdkLoadQueue = null;
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
    await vi.waitFor(() => expect(sdkLoader).toHaveBeenCalledTimes(1));
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

  it('serializes currency and commit changes without handing out a superseded SDK', async () => {
    const gbp = deferred();
    const eur = deferred();
    sdkLoader.mockReturnValueOnce(gbp.promise).mockReturnValueOnce(eur.promise);
    const paypal = usePayPal();
    const older = paypal.getScript('GBP');
    await vi.waitFor(() => expect(sdkLoader).toHaveBeenCalledTimes(1));
    const newer = paypal.getScript('EUR');
    await Promise.resolve();
    expect(sdkLoader).toHaveBeenCalledTimes(1);
    gbp.resolve(namespace());
    expect(await older).toBeNull();
    await vi.waitFor(() => expect(sdkLoader).toHaveBeenCalledTimes(2));
    const euroSdk = namespace();
    eur.resolve(euroSdk);
    await newer;
    expect(paypal.state.value.paypalScript?.currency).toBe('EUR');
    expect(paypal.getCurrentScript()).toBe(euroSdk);
    expect(sdkLoader.mock.calls[0]![0].dataNamespace).toBe('plenty_paypal');
    expect(sdkLoader.mock.calls[1]![0].dataNamespace).toBe('plenty_paypal');
    sdkLoader.mockResolvedValueOnce(namespace());
    await paypal.getScript('EUR', true);
    expect(sdkLoader.mock.calls[2]![0].dataNamespace).toBe('plenty_paypal');
    expect(sdkLoader.mock.calls[2]![0].commit).toBe(true);
    expect(sdkLoader.mock.calls[2]![0].enableFunding).toBe('paylater');
    expect(sdkLoader.mock.calls[2]![0].components).not.toContain('&');
  });

  it('uses the same SDK namespace through all four languages and back to German', async () => {
    sdkLoader.mockImplementation(async () => namespace());
    const paypal = usePayPal();
    for (const language of ['de', 'en', 'fr', 'nl', 'de'] as const) {
      useNuxtApp().$i18n.locale.value = language;
      expect(await paypal.getScript('EUR')).not.toBeNull();
    }
    expect(sdkLoader.mock.calls.map(([options]) => options.locale)).toEqual([
      'de_DE',
      'en_US',
      'fr_FR',
      'nl_NL',
      'de_DE',
    ]);
    expect(sdkLoader.mock.calls.every(([options]) => options.dataNamespace === 'plenty_paypal')).toBe(true);
  });

  it('skips intermediate options queued during an active load', async () => {
    const pending = deferred();
    sdkLoader.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(namespace());
    const paypal = usePayPal();
    const first = paypal.getScript('GBP');
    await vi.waitFor(() => expect(sdkLoader).toHaveBeenCalledTimes(1));
    useNuxtApp().$i18n.locale.value = 'en';
    const skipped = paypal.getScript('USD');
    useNuxtApp().$i18n.locale.value = 'nl';
    const latest = paypal.getScript('EUR');
    pending.resolve(namespace());
    expect(await first).toBeNull();
    expect(await skipped).toBeNull();
    expect(await latest).not.toBeNull();
    expect(sdkLoader.mock.calls.map(([options]) => options.currency)).toEqual(['GBP', 'EUR']);
    expect(paypal.state.value.paypalScript?.locale).toBe('nl_NL');
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
