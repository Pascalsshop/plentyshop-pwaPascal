import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import initializeClientData from '../00.init-initial-data.client';

const { sessionMock, readyMock, routeMock, cloudfront } = vi.hoisted(() => ({
  sessionMock: vi.fn().mockResolvedValue(undefined),
  readyMock: vi.fn(),
  routeMock: { meta: { cacheControl: 'public' as string | undefined } },
  cloudfront: { value: true },
}));

mockNuxtImport('useRoute', () => () => routeMock);
mockNuxtImport('useFeatureFlag', () => () => cloudfront);
mockNuxtImport('useFetchSession', () => () => ({ fetchSession: sessionMock }));
mockNuxtImport('onNuxtReady', () => readyMock);

describe('cached-page client session initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeMock.meta.cacheControl = 'public';
    cloudfront.value = true;
  });

  it('does not change the SSR cart/net-price state before hydration completes', async () => {
    await initializeClientData(useNuxtApp());

    expect(sessionMock).not.toHaveBeenCalled();
    expect(readyMock).toHaveBeenCalledTimes(1);
  });

  it('refreshes the private session once Nuxt is ready', async () => {
    await initializeClientData(useNuxtApp());
    const refreshWhenReady = readyMock.mock.calls[0]![0] as () => Promise<void>;

    await refreshWhenReady();

    expect(sessionMock).toHaveBeenCalledTimes(1);
  });

  it('hydrates the SSR VAT note unchanged before updating to the real net-price session', async () => {
    const { data, setCart, showNetPrices } = useCart();
    const originalCart = data.value;
    const container = document.createElement('div');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vatNote = () => h('span', showNetPrices.value ? 'zzgl. ges. MwSt' : 'inkl. ges. MwSt');
    const clientApp = createSSRApp(vatNote);

    try {
      setCart({ ...originalCart, showNetPrices: false });
      container.innerHTML = await renderToString(createSSRApp(vatNote));
      sessionMock.mockImplementationOnce(async () => {
        setCart({ ...originalCart, showNetPrices: true });
      });

      await initializeClientData(useNuxtApp());
      clientApp.mount(container);
      expect(container.textContent).toBe('inkl. ges. MwSt');
      expect(warning).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();

      await (readyMock.mock.calls[0]![0] as () => Promise<void>)();
      await nextTick();
      expect(container.textContent).toBe('zzgl. ges. MwSt');
      expect(warning).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    } finally {
      clientApp.unmount();
      setCart(originalCart);
      warning.mockRestore();
      error.mockRestore();
    }
  });

  it('leaves uncached pages using their server-initialized session', async () => {
    routeMock.meta.cacheControl = undefined;
    await initializeClientData(useNuxtApp());

    expect(readyMock).not.toHaveBeenCalled();
    expect(sessionMock).not.toHaveBeenCalled();
  });

  it('leaves the non-CloudFront initialization unchanged', async () => {
    cloudfront.value = false;
    await initializeClientData(useNuxtApp());

    expect(readyMock).not.toHaveBeenCalled();
    expect(sessionMock).not.toHaveBeenCalled();
  });
});
