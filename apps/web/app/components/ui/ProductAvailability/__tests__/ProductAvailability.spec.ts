import { mount } from '@vue/test-utils';
import { UiProductAvailability } from '#components';
import type { Product } from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

describe('<ProductAvailability />', () => {
  it.each([
    { id: 1, name: 'Der Artikel ist sofort verfügbar', color: '#28a745' },
    { id: 5, name: 'Der Artikel ist leider nicht mehr verfügbar', color: '#dc3545' },
  ])('matches the old shop colour for availability $id', ({ id, name, color }) => {
    const product = structuredClone(ProductMock);
    product.variation.availability.id = id;
    product.variation.availability.names.name = name;
    const wrapper = mount(UiProductAvailability, { props: { product } });
    const bar = wrapper.get('[data-testid="product-availability"]');
    expect(bar.text()).toBe(name);
    expect((bar.element as HTMLElement).style.backgroundColor).toBe(color);
    expect((bar.element as HTMLElement).style.color).toBe('#fff');
    expect(bar.classes('font-semibold')).toBe(id === 5);
  });

  it.each([
    { lang: 'de', name: 'Der Artikel ist sofort verfügbar' },
    { lang: 'en', name: 'The item is immediately available' },
    { lang: 'fr', name: 'L’article est disponible immédiatement' },
    { lang: 'nl', name: 'Het artikel is direct beschikbaar' },
  ])('preserves the backend availability text in $lang', ({ lang, name }) => {
    const product = structuredClone(ProductMock);
    product.variation.availability.names = { ...product.variation.availability.names, lang, name };
    const wrapper = mount(UiProductAvailability, { props: { product } });
    expect(wrapper.get('[data-testid="product-availability"]').text()).toBe(name);
  });

  it.each([{}, { variation: {} }, { variation: { availability: {} } }, { variation: { availability: { names: {} } } }])(
    'does not invent availability for incomplete data: %j',
    (product) => {
      const wrapper = mount(UiProductAvailability, { props: { product: product as Product } });
      expect(wrapper.find('[data-testid="product-availability"]').exists()).toBe(false);
    },
  );
});
