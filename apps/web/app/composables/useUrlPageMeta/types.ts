import type { Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';

export type PageLink = { href: string } & (
  { rel: 'canonical' } | { rel: 'prev' } | { rel: 'next' } | { rel: 'alternate'; hreflang: string }
);

export type StaticPageMeta = () => void;
export type CategoriesPageMeta = (
  productsCatalog: Facet,
  facetsFromUrl: FacetSearchCriteria,
  canonicalOverride?: string,
) => void;
export type GetCategoryRobotsContent = (productsCatalog: Ref<Facet>) => ComputedRef<string>;

export interface UseUrlPageMeta {
  loading: Readonly<Ref<boolean>>;
  clearPageMeta: () => void;
  setStaticPageMeta: StaticPageMeta;
  setCategoriesPageMeta: CategoriesPageMeta;
  getCategoryRobotsContent: GetCategoryRobotsContent;
}

export type UseUrlPageMetaReturn = () => UseUrlPageMeta;
