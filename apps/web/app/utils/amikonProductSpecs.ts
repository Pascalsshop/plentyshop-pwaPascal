import { productGetters, type CategoryTreeItem, type Product } from '@plentymarkets/shop-api';
import { decode } from 'html-entities';
import {
  formatContent,
  getConditionName,
  getManufacturerName,
} from '../composables/useItemDataTable/helpers/ItemDataHelpers';
import {
  amikonArticleSpecProfiles,
  extractAmikonArticleSpecs,
  getAmikonArticleSpecProfile,
} from './amikonArticleSpecs';

function profileForCategory(name: string, path = '') {
  return (
    amikonArticleSpecProfiles.find((profile) => profile.name.toLowerCase() === name.trim().toLowerCase()) ??
    getAmikonArticleSpecProfile(path)
  );
}

function categoryBranch(tree: CategoryTreeItem[], id: number): CategoryTreeItem[] {
  for (const category of tree) {
    if (category.id === id) return [category];
    const children = categoryBranch(category.children ?? [], id);
    if (children.length) return [category, ...children];
  }
  return [];
}

function productSpecProfile(product: Product, tree: CategoryTreeItem[]) {
  const breadcrumbs = product.breadcrumbs ?? [];
  const defaults = product.defaultCategories ?? [];
  const primary = defaults.find(({ id }) => id === breadcrumbs.at(-1)?.id) ?? defaults[0];
  if (!primary) {
    return breadcrumbs
      .slice()
      .reverse()
      .map(({ name, url }) => profileForCategory(name, url))
      .find(Boolean);
  }

  const breadcrumbIndex = breadcrumbs.findIndex(({ id }) => id === primary.id);
  const direct = profileForCategory(primary.name ?? '');
  if (direct) return direct;

  const branch = categoryBranch(tree, primary.id);
  const ancestors =
    branch.length || primary.parentCategoryId == null ? branch : categoryBranch(tree, primary.parentCategoryId);
  for (const category of ancestors.reverse()) {
    for (const detail of category.details) {
      const profile = profileForCategory(detail.name, detail.nameUrl);
      if (profile) return profile;
    }
  }
  return breadcrumbs
    .slice(0, breadcrumbIndex + 1)
    .reverse()
    .map(({ name, url }) => profileForCategory(name, url))
    .find(Boolean);
}

const lineBreakTags = /^(?:br|div|p|h[1-6]|li|tr|section)$/i;

/** Keep the same line boundaries and entities in the server and browser renders. */
function productTextLines(html: string) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
      .replace(/<\/?([a-z][\w:-]*)(?=[\s/>])(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi, (_tag, name: string) => {
        if (lineBreakTags.test(name)) return '\n';
        return /^t[dh]$/i.test(name) ? ' ' : '';
      }),
  );
}

export function getAmikonProductSpecs(product: Product, tree: CategoryTreeItem[]) {
  const profile = productSpecProfile(product, tree);
  if (!profile) return [];

  const text = [productGetters.getDescription(product), productGetters.getTechnicalData(product)]
    .map((source) => productTextLines(source ?? ''))
    .join('\n');
  const facts = [
    { label: 'Modell', value: product.variation.model ?? '' },
    { label: 'Hersteller', value: getManufacturerName(product) },
    { label: 'Zustand', value: getConditionName(product) },
    { label: 'Inhalt', value: (product.unit?.content ?? 0) > 0 ? formatContent(product) : '' },
  ];
  return extractAmikonArticleSpecs(text, profile.path, facts);
}
