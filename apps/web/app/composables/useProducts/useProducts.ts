import type { FacetSearchCriteria, Product, Facet } from '@plentymarkets/shop-api';
/**
 * @description Composable for managing products.
 * @returns UseProductsReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, selectedVariation, fetchProducts, selectVariation } = useProducts();
 * ```
 */
export const useProducts: UseProductsReturn = (category = '') => {
  const state = useState<UseProductsState>(`useProducts${category}`, () => ({
    data: {} as Facet,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
    currentProduct: {} as Product,
  }));

  /**
   * @description Function for fetching products.
   * @param params { FacetSearchCriteria }
   * @return FetchProducts
   * @example
   * ``` ts
   * const { fetchProducts: fetchProducts1, data: productsCatalog1 } = useProducts('/living-room');
   * const { fetchProducts: fetchProducts2, data: productsCatalog2 } = useProducts('49');
   * const { fetchProducts: fetchProducts3, data: productsCatalog3 } = useProducts('19');
   *
   * fetchProducts1({ categoryUrlPath: '/living-room', page: 1 });
   * fetchProducts2({ categoryId: '49', page: 1 });
   * fetchProducts3({ categoryId: '19', page: 1 });
   * ```
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    const { $i18n } = useNuxtApp();

    if (params.categoryUrlPath?.endsWith('.js')) return state.value.data;

    state.value.loading = true;
    const locale = $i18n.locale.value;
    const identifier = category || params.categoryUrlPath || params.categoryId;
    try {
      // The same category ID can return different names and products per language.
      const { data } = await useAsyncData(`useProducts-${locale}-${identifier}-${JSON.stringify(params)}`, () =>
        useSdk().plentysystems.getFacet(params),
      );

      state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

      if (data.value?.data) {
        data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;
        state.value.data = data.value.data;
        handlePreviewProducts(state, locale);
      } else {
        // Never leave products from the previously selected language on screen.
        state.value.data = {} as Facet;
      }

      return state.value.data;
    } finally {
      state.value.loading = false;
    }
  };

  /**
   * @description Function for setting the current product.
   * @param product { Product }
   * @return SetCurrentProduct
   * @example
   * ``` ts
   *  setCurrentProduct({} as Product)
   * ```
   */
  const setCurrentProduct: SetCurrentProduct = async (product: Product) => {
    state.value.loading = true;

    state.value.currentProduct = product;

    state.value.loading = false;
  };

  const loadFakeGlobalCategoryData: LoadFakeGlobalCategoryData = (locale: string) => {
    const fakeFacet = locale === 'en' ? fakeFacetCallEN : fakeFacetCallDE;

    state.value.data = {
      category: fakeFacet['data'].category,
      products: [],
      facets: [],
      languageUrls: {
        'x-default': '',
      },
      pagination: {
        totals: 8,
        perPageOptions: defaults.PER_PAGE_STEPS,
      },
      breadcrumbs: [],
    } as Facet;

    handlePreviewProducts(state, locale);
    state.value.loading = false;
  };

  return {
    fetchProducts,
    setCurrentProduct,
    loadFakeGlobalCategoryData,
    ...toRefs(state.value),
  };
};
