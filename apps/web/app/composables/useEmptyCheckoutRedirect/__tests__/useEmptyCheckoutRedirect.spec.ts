import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';

const { cartMock, paymentMock, navigate, send, localize } = vi.hoisted(() => ({
  cartMock: vi.fn(),
  paymentMock: vi.fn(),
  navigate: vi.fn(),
  send: vi.fn(),
  localize: vi.fn(),
}));

mockNuxtImport('useCart', () => cartMock);
mockNuxtImport('useDynamicPaymentButtons', () => paymentMock);
mockNuxtImport('useNotification', () => () => ({ send }));
mockNuxtImport('useLocalizedPath', () => () => localize);
mockNuxtImport('navigateTo', () => navigate);

const items = ref([{ id: 1 }]);
const processingOrder = ref(false);
const cartIsEmpty = computed(() => items.value.length === 0);
const Checkout = defineComponent({
  setup() {
    useEmptyCheckoutRedirect();
    return () =>
      h(
        'main',
        items.value.map((item) => h('article', { key: item.id }, String(item.id))),
      );
  },
});

enableAutoUnmount(afterEach);

describe('useEmptyCheckoutRedirect', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    items.value = [{ id: 1 }];
    processingOrder.value = false;
    cartMock.mockReturnValue({ cartIsEmpty });
    paymentMock.mockReturnValue({ createOrderLoading: processingOrder });
    localize.mockImplementation((path: string) => path);
    navigate.mockResolvedValue(undefined);
  });

  it('should navigate only after Vue has rendered a successful last-item removal', async () => {
    const wrapper = mount(Checkout);
    let articlesAtNavigation = -1;
    navigate.mockImplementation(async () => {
      articlesAtNavigation = wrapper.findAll('article').length;
    });

    // Simulated successful delete response; no shop API is called.
    await Promise.resolve();
    items.value = [];
    expect(navigate).not.toHaveBeenCalled();
    await nextTick();

    expect(navigate).toHaveBeenCalledExactlyOnceWith('/cart');
    expect(articlesAtNavigation).toBe(0);
    expect(send).toHaveBeenCalledExactlyOnceWith({ type: 'neutral', message: expect.any(String) });
  });

  it('should remain in checkout when another cart item remains', async () => {
    items.value = [{ id: 1 }, { id: 2 }];
    mount(Checkout);
    items.value = [{ id: 2 }];
    await nextTick();
    expect(navigate).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('should render the empty cart after navigating away from checkout without a reload', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/checkout', component: Checkout },
        {
          path: '/cart',
          component: async () => ({ render: () => h('h2', { 'data-testid': 'empty-cart' }, 'Empty cart') }),
        },
      ],
    });
    navigate.mockImplementation((path: string) => router.push(path));
    await router.push('/checkout');
    const wrapper = mount({ render: () => h(RouterView) }, { global: { plugins: [router] } });

    items.value = [];
    await flushPromises();

    expect(router.currentRoute.value.path).toBe('/cart');
    expect(wrapper.get('[data-testid="empty-cart"]').text()).toBe('Empty cart');
    expect(wrapper.find('article').exists()).toBe(false);
  });

  it('should not redirect when an empty cart becomes populated', async () => {
    items.value = [];
    mount(Checkout);
    items.value = [{ id: 2 }];
    await nextTick();
    expect(navigate).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('should leave order-confirmation navigation in control while an order is processing', async () => {
    mount(Checkout);
    processingOrder.value = true;
    items.value = [];
    await nextTick();
    expect(navigate).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('should preserve the current language in the cart destination', async () => {
    localize.mockImplementation((path: string) => `/fr${path}`);
    mount(Checkout);
    items.value = [];
    await nextTick();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/fr/cart');
  });

  it('should not navigate after the checkout has unmounted', async () => {
    const wrapper = mount(Checkout);
    wrapper.unmount();
    items.value = [];
    await nextTick();
    expect(navigate).not.toHaveBeenCalled();
  });
});
