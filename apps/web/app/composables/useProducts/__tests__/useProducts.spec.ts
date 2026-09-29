import { useProducts } from '../useProducts';

describe('useProducts', () => {
  it('should return products', async () => {
    const { fetchProducts, data } = useProducts();

    await fetchProducts({
      page: 1,
    });

    expect(data.value).not.toBeUndefined();
  });

  it('fetches the same category again after a language change', async () => {
    const { locale } = useNuxtApp().$i18n;
    const originalLocale = locale.value;
    const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
    const { fetchProducts, data, loading } = useProducts();
    const params = { categoryId: '48', type: 'category' as const, page: 1 };

    try {
      locale.value = 'de';
      getFacet.mockResolvedValueOnce({
        data: { category: { type: 'item' }, products: [{}], pagination: {} },
      } as never);
      await fetchProducts(params);
      expect(data.value.products).toHaveLength(1);

      locale.value = 'fr';
      getFacet.mockResolvedValueOnce({
        data: { category: { type: 'item' }, products: [{}, {}], pagination: {} },
      } as never);
      await fetchProducts(params);

      expect(getFacet).toHaveBeenCalledTimes(2);
      expect(data.value.products).toHaveLength(2);
      expect(loading.value).toBe(false);

      getFacet.mockResolvedValueOnce({ data: undefined } as never);
      await fetchProducts({ ...params, page: 2 });
      expect(data.value.products).toBeUndefined();
      expect(loading.value).toBe(false);
    } finally {
      locale.value = originalLocale;
    }
  });
});
