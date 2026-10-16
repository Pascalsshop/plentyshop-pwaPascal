import { flushPromises, mount } from '@vue/test-utils';
import AmikonHomeProducts from '../AmikonHomeProducts.vue';
import { ProductSlider } from '#components';
import { fakeProductDE } from '~/utils/facets/fakeProductDE';

const TestHomeProducts = defineComponent({
  components: { AmikonHomeProducts },
  props: ['kind', 'title', 'categoryPath', 'categoryId', 'language'],
  setup(props) {
    if (props.language) {
      useI18n().locale.value = props.language;
    }
  },
  template:
    '<Suspense><AmikonHomeProducts :kind="kind" :title="title" :category-path="categoryPath" :category-id="categoryId" /></Suspense>',
});

describe('Amikon home products', () => {
  beforeEach(() => {
    clearNuxtData();
  });

  it('should request 16 newest climate products without a minimum price', async () => {
    const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
    getFacet.mockResolvedValueOnce({ data: { products: [fakeProductDE] } } as never);
    const wrapper = mount(TestHomeProducts, {
      props: { kind: 'climate', title: 'Klimakammern', categoryPath: '/waerme-klimaschraenke', categoryId: '48' },
      global: { stubs: { ProductSlider: true } },
    });
    await flushPromises();
    expect(getFacet).toHaveBeenCalledWith({
      type: 'category',
      categoryId: '48',
      itemsPerPage: 16,
      page: 1,
      sort: 'variation.createdAt_desc',
    });
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(false);
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.findComponent(ProductSlider).props('items')).toEqual([fakeProductDE]);
    wrapper.unmount();
  });

  it('should preserve the new-arrivals price threshold when retrying a failed request', async () => {
    const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
    getFacet.mockRejectedValueOnce(new Error('Offline'));
    const wrapper = mount(TestHomeProducts, { props: { kind: 'new', title: 'Neuheiten' } });
    await flushPromises();
    expect(wrapper.find('button').exists()).toBe(true);
    getFacet.mockResolvedValueOnce({ data: { products: [] } } as never);
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('button').exists()).toBe(false);
    expect(getFacet).toHaveBeenLastCalledWith({
      type: 'all',
      itemsPerPage: 16,
      page: 1,
      sort: 'variation.createdAt_desc',
      priceMin: '1000',
    });
    wrapper.unmount();
  });

  it.each(['de', 'en', 'fr', 'nl'] as const)(
    'should filter new arrivals by net price in %s and preserve their order',
    async (locale) => {
      const makeProduct = (id: number, netPrice: number) => ({
        ...fakeProductDE,
        id,
        prices: {
          ...fakeProductDE.prices,
          default: {
            ...fakeProductDE.prices.default,
            data: { ...fakeProductDE.prices.default.data, unitPriceNet: netPrice },
          },
          graduatedPrices: [],
        },
      });
      const products = [makeProduct(1, 999.99), makeProduct(2, 1000), makeProduct(3, 1500)];
      const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
      getFacet.mockResolvedValueOnce({ data: { products } } as never);
      const wrapper = mount(TestHomeProducts, {
        props: { kind: 'new', title: 'Neuheiten', language: locale },
        global: { stubs: { ProductSlider: true } },
      });
      await flushPromises();

      expect(getFacet).toHaveBeenLastCalledWith({
        type: 'all',
        itemsPerPage: 16,
        page: 1,
        sort: 'variation.createdAt_desc',
        priceMin: '1000',
      });
      expect(wrapper.findComponent(ProductSlider).props('items')).toEqual(products.slice(1));
      expect(useNuxtData(`amikon-home-new-${locale}-all`).data.value).toEqual(products.slice(1));
      wrapper.unmount();
    },
  );

  it('should show the empty state when no new arrivals meet the threshold', async () => {
    vi.mocked(useSdk().plentysystems.getFacet).mockResolvedValueOnce({ data: { products: [fakeProductDE] } } as never);
    const wrapper = mount(TestHomeProducts, {
      props: { kind: 'new', title: 'Neuheiten', language: 'de' },
      global: { stubs: { ProductSlider: true } },
    });
    await flushPromises();

    expect(wrapper.findComponent(ProductSlider).exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toContain('Aktuell sind hier keine Produkte verfügbar.');
    wrapper.unmount();
  });
});
