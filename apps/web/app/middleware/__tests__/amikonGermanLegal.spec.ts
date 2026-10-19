import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import middleware from '../amikon-german-legal.global';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
mockNuxtImport('navigateTo', () => navigate);
mockNuxtImport('useUrlTrailingSlash', () => () => ({ resolvePathTrailingSlash: (path: string) => `${path}/` }));

describe('German legal middleware', () => {
  it('should retain query parameters and section anchors when redirecting a French terms request', async () => {
    await middleware(
      { path: '/fr/terms-and-conditions', query: { source: 'checkout' }, hash: '#payment' } as never,
      {} as never,
    );
    expect(navigate).toHaveBeenCalledWith(
      { path: '/de/terms-and-conditions/', query: { source: 'checkout' }, hash: '#payment' },
      { redirectCode: 302 },
    );
  });

  it.each(['/fr/privacy-policy', '/nl/privacy-policy/'])(
    'should retain queries and anchors when redirecting %s to the German privacy policy',
    async (path) => {
      await middleware({ path, query: { source: 'contact' }, hash: '#cookies' } as never, {} as never);
      expect(navigate).toHaveBeenCalledWith(
        { path: '/de/privacy-policy/', query: { source: 'contact' }, hash: '#cookies' },
        { redirectCode: 302 },
      );
    },
  );

  it.each(['/de/terms-and-conditions/', '/de/privacy-policy', '/en/privacy-policy', '/fr/legal-disclosure'])(
    'should not redirect German terms or unrelated routes at %s',
    async (path) => {
      await middleware({ path, query: {}, hash: '' } as never, {} as never);
      expect(navigate).not.toHaveBeenCalled();
    },
  );
});
