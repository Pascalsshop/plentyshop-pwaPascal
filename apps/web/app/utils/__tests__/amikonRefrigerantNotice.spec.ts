import { hasAmikonRefrigerantService } from '../amikonRefrigerantNotice';
import { ProductMock } from '../../../__tests__/__mocks__/product.mock';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

describe('Amikon refrigerant service categories', () => {
  it('recognizes the real climate category independently of language', () => {
    const product = structuredClone(ProductMock);
    product.defaultCategories[0]!.id = 48;
    product.defaultCategories[0]!.name = 'Translated category';
    expect(hasAmikonRefrigerantService(product)).toBe(true);
  });

  it('recognizes nested climate categories from the tree without mutating data', () => {
    const product = structuredClone(ProductMock);
    product.defaultCategories[0]!.id = 73;
    const category = (id: number, children: CategoryTreeItem[] = []): CategoryTreeItem => ({
      id,
      type: 'item',
      details: [],
      itemCount: [],
      childCount: children.length,
      children,
      right: 'all',
    });
    const tree = [category(48, [category(61, [category(73)])])];
    const before = JSON.stringify({ product, tree });
    expect(hasAmikonRefrigerantService(product, tree)).toBe(true);
    expect(JSON.stringify({ product, tree })).toBe(before);
  });

  it.each([
    'Begehbare Klimakammern',
    'Walk-in climate test cabinets',
    'Inloopklimaatkamers',
    'Chambres climatiques accessibles',
  ])('recognizes the walk-in category %s without relying on product titles', (name) => {
    const product = structuredClone(ProductMock);
    product.defaultCategories[0]!.name = name;
    expect(hasAmikonRefrigerantService(product)).toBe(true);
  });

  it('recognizes a translated climate breadcrumb URL', () => {
    const product = {
      ...structuredClone(ProductMock),
      defaultCategories: [],
      breadcrumbs: [{ id: 73, level: 1, name: 'Category', url: '/nl/klimaatkamers/' }],
    };
    expect(hasAmikonRefrigerantService(product)).toBe(true);
  });

  it('does not show the service on unrelated products with climate words in their descriptions', () => {
    const product = structuredClone(ProductMock);
    product.texts.name1 = 'Klimaprüfschrank Ersatzteil';
    product.texts.description = 'Umstellung auf umweltfreundliches Kältemittel';
    expect(hasAmikonRefrigerantService(product)).toBe(false);
  });

  it('does not assume missing category metadata means climate equipment', () => {
    expect(hasAmikonRefrigerantService({ ...structuredClone(ProductMock), defaultCategories: [] })).toBe(false);
  });
});
