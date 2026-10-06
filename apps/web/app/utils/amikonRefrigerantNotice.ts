import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/^\/(de|en|fr|nl)\//, '/')
    .replace(/^\/+|\/+$/g, '');
const climateCategories = new Set([
  'wärme-klimaschränke',
  'waerme-klimaschraenke',
  'waerme-klimaschrank',
  'climate test cabinets',
  'climate-test-cabinets',
  'climate chambers',
  'begehbare klimakammern',
  'begehbare-klimakammern',
  'walk-in climate test cabinets',
  'walk-in-climate-test-cabinets',
  'walk-in climate chambers',
  'warmte- en klimaatkasten',
  'klimaatkamers',
  'inloopklimaatkamers',
  'enceintes thermiques et climatiques',
  'chambres climatiques accessibles',
]);

/** Use category metadata, never product names or refrigerant mentions, to select the legacy service notice. */
export function hasAmikonRefrigerantService(product: Product, tree: CategoryTreeItem[] = []): boolean {
  const categoryIds = new Set<number>();
  const isClimateCategory = (value: string) => climateCategories.has(normalize(value));
  for (const category of product.defaultCategories ?? []) {
    categoryIds.add(category.id);
    if (category.id === 48 || category.parentCategoryId === 48 || isClimateCategory(category.name ?? '')) return true;
  }
  for (const breadcrumb of product.breadcrumbs ?? []) {
    categoryIds.add(breadcrumb.id);
    if (breadcrumb.id === 48 || isClimateCategory(breadcrumb.name) || isClimateCategory(breadcrumb.url)) return true;
  }
  const visit = (items: CategoryTreeItem[], inClimateBranch = false): boolean =>
    items.some((category) => {
      const climate =
        inClimateBranch ||
        category.id === 48 ||
        category.details.some((detail) => isClimateCategory(detail.name) || isClimateCategory(detail.nameUrl));
      return (climate && categoryIds.has(category.id)) || visit(category.children ?? [], climate);
    });
  return visit(tree);
}
