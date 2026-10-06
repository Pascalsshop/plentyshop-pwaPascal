import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UiBadges, UiProductCard } from '#components';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

const { useLazyProductImageMock } = vi.hoisted(() => ({
  useLazyProductImageMock: vi.fn(),
}));

mockNuxtImport('useLazyProductImage', () => {
  return useLazyProductImageMock;
});

describe('<ProductCard />', () => {
  beforeEach(() => {
    useLazyProductImageMock.mockReset();
    useLazyProductImageMock.mockReturnValue({
      imageContainerRef: ref(null),
      shouldLoadMainImage: ref(true),
      shouldLoadHoverImage: ref(false),
      mainImageLoaded: ref(true),
      hoverImageLoaded: ref(false),
      onMainImageLoad: vi.fn(),
      onMainImageError: vi.fn(),
      onHoverImageLoad: vi.fn(),
      onHoverImageError: vi.fn(),
    });
  });

  it('should render component', () => {
    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
      },
    });

    expect(wrapper.find('[data-testid="product-card"]').exists()).toBe(true);
  });

  it.each([
    { view: 'category and search results', props: {} },
    { view: 'homepage product sliders', props: { isFromSlider: true } },
    { view: 'wishlist', props: { isFromWishlist: true } },
  ])('shows availability once below the title, not over the image, in $view', ({ props }) => {
    const wrapper = mount(UiProductCard, {
      props: { product: ProductMock, ...props },
    });

    expect(wrapper.findComponent(UiBadges).props('useAvailability')).toBe(false);
    expect(wrapper.findAll('[data-testid="product-availability"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="product-availability"]').text()).toBe('Sofort versandfertig, Lieferzeit 48h');
    expect(
      wrapper.find('[data-testid="productcard-name"]').element.nextElementSibling?.getAttribute('data-testid'),
    ).toBe('product-availability');
  });

  it('keeps availability visible when the title is disabled in the builder', () => {
    const wrapper = mount(UiProductCard, { props: { product: ProductMock } });
    const configuration = wrapper.props('configuration')!;
    const withoutTitle = mount(UiProductCard, {
      props: {
        product: ProductMock,
        configuration: { ...configuration, fields: { ...configuration.fields, title: false } },
      },
    });
    expect(withoutTitle.find('[data-testid="productcard-name"]').exists()).toBe(false);
    expect(withoutTitle.findAll('[data-testid="product-availability"]')).toHaveLength(1);
  });

  it('should not render image initially for non-priority items', () => {
    useLazyProductImageMock.mockReturnValue({
      imageContainerRef: ref(null),
      shouldLoadMainImage: ref(false),
      shouldLoadHoverImage: ref(false),
      mainImageLoaded: ref(false),
      hoverImageLoaded: ref(false),
      onMainImageLoad: vi.fn(),
      onMainImageError: vi.fn(),
      onHoverImageLoad: vi.fn(),
      onHoverImageError: vi.fn(),
    });

    const wrapper = mount(UiProductCard, {
      props: {
        product: ProductMock,
        index: 10,
      },
    });

    expect(wrapper.find('[data-testid="image-slot"]').exists()).toBe(false);
  });

  it('places price and add button in the same row without duplicating either', () => {
    const wrapper = mount(UiProductCard, { props: { product: ProductMock } });
    const row = wrapper.get('[data-testid="product-card-purchase-row"]');
    expect(row.find('[data-testid="product-card-vertical-price"]').exists()).toBe(true);
    expect(row.find('[data-testid="add-to-basket-short"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid="add-to-basket-short"]')).toHaveLength(1);
    expect(wrapper.findAll('[data-testid="product-card-vertical-price"]')).toHaveLength(1);
  });

  it('keeps price and button together even when the builder orders the button first', () => {
    const defaults = mount(UiProductCard, { props: { product: ProductMock } }).props('configuration')!;
    const wrapper = mount(UiProductCard, {
      props: { product: ProductMock, configuration: { ...defaults, fieldsOrder: ['addToCart', 'title', 'price'] } },
    });
    expect(wrapper.findAll('[data-testid="product-card-purchase-row"]')).toHaveLength(1);
    const row = wrapper.get('[data-testid="product-card-purchase-row"]');
    expect(row.find('[data-testid="product-card-vertical-price"]').exists()).toBe(true);
    expect(row.find('[data-testid="add-to-basket-short"]').exists()).toBe(true);
  });

  it('keeps the options link next to the price when direct adding is not allowed', () => {
    const product = structuredClone(ProductMock);
    product.filter.isSalable = false;
    const wrapper = mount(UiProductCard, { props: { product } });
    const row = wrapper.get('[data-testid="product-card-purchase-row"]');
    expect(row.find('[data-testid="product-card-vertical-price"]').exists()).toBe(true);
    expect(row.find('[data-testid="product-card-options"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(false);
  });

  it.each([
    { price: false, addToCart: true },
    { price: true, addToCart: false },
    { price: false, addToCart: false },
  ])('respects builder visibility settings: %j', ({ price, addToCart }) => {
    const defaults = mount(UiProductCard, { props: { product: ProductMock } }).props('configuration')!;
    const wrapper = mount(UiProductCard, {
      props: { product: ProductMock, configuration: { ...defaults, fields: { ...defaults.fields, price, addToCart } } },
    });
    expect(wrapper.find('[data-testid="product-card-vertical-price"]').exists()).toBe(price);
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(addToCart);
    expect(wrapper.find('[data-testid="product-card-purchase-row"]').exists()).toBe(price || addToCart);
  });

  it.each([
    { view: 'category and search', props: {}, isSalable: false },
    { view: 'category and search with stale salability', props: {}, isSalable: true },
    { view: 'homepage slider', props: { isFromSlider: true }, isSalable: false },
    { view: 'homepage slider with stale salability', props: { isFromSlider: true }, isSalable: true },
    { view: 'wishlist', props: { isFromWishlist: true }, isSalable: false },
    { view: 'wishlist with stale salability', props: { isFromWishlist: true }, isSalable: true },
  ])('shows no purchase button for sold items in $view', ({ props, isSalable }) => {
    const product = structuredClone(ProductMock);
    product.variation.availability.id = 5;
    product.variation.availability.names.name = 'Der Artikel ist leider nicht mehr verfügbar';
    product.filter.isSalable = isSalable;
    const wrapper = mount(UiProductCard, { props: { product, ...props } });
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="product-card-options"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="product-card-vertical-price"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="productcard-name"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="product-availability"]').text()).toBe(product.variation.availability.names.name);
  });

  it('does not leave an empty action row when a sold item also hides the price', () => {
    const product = structuredClone(ProductMock);
    product.variation.availability.id = 5;
    const defaults = mount(UiProductCard, { props: { product } }).props('configuration')!;
    const wrapper = mount(UiProductCard, {
      props: { product, configuration: { ...defaults, fields: { ...defaults.fields, price: false } } },
    });
    expect(wrapper.find('[data-testid="product-card-purchase-row"]').exists()).toBe(false);
  });

  it('updates purchase buttons when the availability changes', async () => {
    const wrapper = mount(UiProductCard, { props: { product: ProductMock } });
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(true);
    const sold = structuredClone(ProductMock);
    sold.variation.availability.id = 5;
    await wrapper.setProps({ product: sold });
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="product-card-options"]').exists()).toBe(false);
    await wrapper.setProps({ product: ProductMock });
    expect(wrapper.find('[data-testid="add-to-basket-short"]').exists()).toBe(true);
  });
});
