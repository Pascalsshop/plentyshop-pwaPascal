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
});
