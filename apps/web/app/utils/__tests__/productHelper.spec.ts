import {
  createProductParams,
  generateBreadcrumbs,
  updateProductURLPathForVariation,
  validateProductParams,
} from '../productHelper';
import ProductFixture from './__fixtures__/Product';

describe('product helper', () => {
  it('should generate breadcrumbs', () => {
    const breadcrumbs = generateBreadcrumbs(ProductFixture, 'home');

    expect(breadcrumbs).toStrictEqual([
      { name: 'home', link: '/' },
      { name: 'Gear', link: '/gear' },
      { name: 'Headphones Capybara', link: '#' },
    ]);
  });

  it.each([
    ['/de/maschine_42_42', '42_42', '/de/maschine_42_99'],
    ['/de/serie_2026_42', '42', '/de/serie_2026_42_99'],
    ['/en/machine/a-42', '42', '/en/machine/a-42_99'],
    ['/nl/machine/a-42_55/', '42_55', '/nl/machine/a-42_99/'],
    ['/artikelvorschau', '42', '/artikelvorschau'],
  ])('changes the variation in %s', (path, itemParameter, expected) => {
    expect(updateProductURLPathForVariation(path, itemParameter, 99)).toBe(expected);
  });

  it('reads the article and variation IDs from the legacy path when the router only returns the variation', () => {
    const path = '/de/maschine/a-42_99/';
    const params = { itemId: '99' };
    expect(validateProductParams(params, path)).toBe(true);
    expect(createProductParams(params, path)).toEqual({
      productId: '42',
      productParams: { id: '42', variationId: '99' },
    });
  });
});
