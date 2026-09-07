import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import AmikonHomeProducts from '../AmikonHomeProducts.vue';

describe('Amikon home products', () => {
  beforeEach(() => {
    clearNuxtData();
  });

  it('requests 16 newest products from the climate category', async () => {
    const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
    getFacet.mockResolvedValueOnce({ data: { products: [] } } as never);
    const wrapper = await mountSuspended(AmikonHomeProducts, {
      props: { kind: 'climate', title: 'Klimakammern', categoryPath: '/waerme-klimaschraenke' },
    });
    await flushPromises();
    expect(getFacet).toHaveBeenCalledWith({
      type: 'category',
      categoryUrlPath: '/waerme-klimaschraenke',
      itemsPerPage: 16,
      page: 1,
      sort: 'variation.createdAt_desc',
    });
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(false);
    expect(wrapper.find('button').exists()).toBe(false);
    wrapper.unmount();
  });

  it('offers retry after a failed request and recovers', async () => {
    const getFacet = vi.mocked(useSdk().plentysystems.getFacet);
    getFacet.mockRejectedValueOnce(new Error('Offline'));
    const wrapper = await mountSuspended(AmikonHomeProducts, { props: { kind: 'new', title: 'Neuheiten' } });
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
    });
    wrapper.unmount();
  });
});
