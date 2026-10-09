import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import middleware from '../amikon-german-terms.global';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));
mockNuxtImport('navigateTo', () => navigate);
mockNuxtImport('useUrlTrailingSlash', () => () => ({ resolvePathTrailingSlash: (path: string) => `${path}/` }));

describe('German terms middleware', () => {
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

  it.each(['/de/terms-and-conditions/', '/fr/privacy-policy'])(
    'should not redirect German terms or unrelated routes at %s',
    async (path) => {
      await middleware({ path, query: {}, hash: '' } as never, {} as never);
      expect(navigate).not.toHaveBeenCalled();
    },
  );
});
