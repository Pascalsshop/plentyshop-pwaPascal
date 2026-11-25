import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useProduct } from '../useProduct';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

const productId = ProductMock.item.id.toString();

const { mockUseHead } = vi.hoisted(() => ({ mockUseHead: vi.fn() }));
mockNuxtImport('useHead', () => mockUseHead);
const { mockUseAsyncData } = vi.hoisted(() => ({ mockUseAsyncData: vi.fn() }));
mockNuxtImport('useAsyncData', () => mockUseAsyncData);

const siteSettingsValue = ref('');
const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(() => ({
    getSetting: () => siteSettingsValue.value,
  })),
}));
mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);

const runtimeConfigRef = { app: { baseURL: '/' }, public: { ogTitle: '' } };
const { useRuntimeConfigMock } = vi.hoisted(() => ({
  useRuntimeConfigMock: vi.fn(() => runtimeConfigRef),
}));
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfigMock);

describe('useProduct', () => {
  it('should return Product', async () => {
    const { data: product } = useProduct(productId);

    expect(product.value).not.toBeUndefined();
  });

  it.each([false, true])(
    'keeps the latest variant when an earlier request completes late (with data: %s)',
    async (withData) => {
      const response = (data?: typeof ProductMock) => ({
        data: { value: data ? { data } : null },
        error: { value: null },
      });
      const olderResponse = Promise.withResolvers<ReturnType<typeof response>>();
      const newerProduct = { ...ProductMock, variation: { ...ProductMock.variation, id: 1101 } };
      mockUseAsyncData.mockReturnValueOnce(olderResponse.promise).mockResolvedValueOnce(response(newerProduct));
      const earlier = useProduct('variant-switch-' + withData);
      const later = useProduct('variant-switch-' + withData);

      const firstRequest = earlier.fetchProduct({ id: productId, variationId: 1100 });
      await later.fetchProduct({ id: productId, variationId: 1101 });
      olderResponse.resolve(response(withData ? ProductMock : undefined));
      await firstRequest;

      expect(earlier.data.value.variation.id).toBe(1101);
      expect(later.loading.value).toBe(false);
    },
  );
});

describe('useProduct setProductMeta title suffix fallback', () => {
  beforeEach(() => {
    mockUseHead.mockClear();
    siteSettingsValue.value = '';
    runtimeConfigRef.public.ogTitle = '';
  });

  it('should use useSiteSettings ogTitle as first priority', () => {
    siteSettingsValue.value = 'Site Setting Shop Name';
    runtimeConfigRef.public.ogTitle = 'Runtime Config Title';

    const { setProductMeta } = useProduct(productId);
    setProductMeta();

    expect(mockUseHead).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Site Setting Shop Name'),
      }),
    );
  });

  it('should fall back to runtimeConfig.ogTitle when site setting is empty', () => {
    siteSettingsValue.value = '';
    runtimeConfigRef.public.ogTitle = 'Runtime Config Title';

    const { setProductMeta } = useProduct(productId);
    setProductMeta();

    expect(mockUseHead).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Runtime Config Title'),
      }),
    );
  });
});
