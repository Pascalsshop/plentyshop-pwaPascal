import { mount } from '@vue/test-utils';
import { UiBadges } from '#components';
import type { Product } from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

describe('<Badges />', () => {
  it('should render component', () => {
    const wrapper = mount(UiBadges, {
      props: {
        product: {
          tags: [{ id: 1, names: { name: 'Tag', lang: 'en' } }],
        } as Product,
      },
    });

    expect(wrapper.getByTestId('badges'));
  });

  it.each([
    { lang: 'de', name: 'Sofort versandfertig, Lieferzeit 48h' },
    { lang: 'en', name: 'Ready to ship, delivery within 48 hours' },
    { lang: 'fr', name: 'Prêt à expédier, livraison sous 48 heures' },
    { lang: 'nl', name: 'Direct leverbaar, levertijd 48 uur' },
  ])('shows the actual backend availability in $lang even without product tags', ({ lang, name }) => {
    const product = {
      ...ProductMock,
      variation: {
        ...ProductMock.variation,
        availability: {
          ...ProductMock.variation.availability,
          names: { ...ProductMock.variation.availability.names, lang, name },
        },
      },
    } as Product;
    const wrapper = mount(UiBadges, { props: { product, useTags: false, useAvailability: true } });

    expect(wrapper.find('[data-testid="product-availability"]').text()).toBe(name);
  });

  it.each([{}, { variation: {} }, { variation: { availability: {} } }, { variation: { availability: { names: {} } } }])(
    'does not invent an availability when backend data is incomplete: %j',
    (product) => {
      const wrapper = mount(UiBadges, {
        props: { product: product as unknown as Product, useTags: false, useAvailability: true },
      });
      expect(wrapper.find('[data-testid="product-availability"]').exists()).toBe(false);
    },
  );
});
