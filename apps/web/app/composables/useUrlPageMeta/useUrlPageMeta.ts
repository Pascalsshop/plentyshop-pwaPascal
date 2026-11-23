import type {
  UseUrlPageMetaReturn,
  StaticPageMeta,
  CategoriesPageMeta,
  GetCategoryRobotsContent,
  PageLink,
} from './types';
import { categoryGetters, type Facet, type FacetSearchCriteria } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';

const getPaginationLinks = (
  productsCatalog: Facet,
  facetsFromUrl: FacetSearchCriteria,
  canonicalLink: string,
): PageLink[] => {
  if (!facetsFromUrl?.itemsPerPage || !facetsFromUrl?.page) {
    return [];
  }

  const domain = useRuntimeConfig().public.domain as string;
  const url = new URL(canonicalLink, domain);
  const baseUrl = `${url.origin}${url.pathname}`;
  const links: PageLink[] = [];

  if (facetsFromUrl.page >= 2) {
    const prevParams = new URLSearchParams(url.search);
    if (facetsFromUrl.page === 2) {
      prevParams.delete('page');
    } else {
      prevParams.set('page', String(facetsFromUrl.page - 1));
    }
    const prevSearch = prevParams.toString();
    links.push({ rel: 'prev', href: prevSearch ? `${baseUrl}?${prevSearch}` : baseUrl });
  }
  if (
    productsCatalog.pagination?.totals &&
    facetsFromUrl.page < productsCatalog.pagination.totals / facetsFromUrl.itemsPerPage
  ) {
    const nextParams = new URLSearchParams(url.search);
    nextParams.set('page', String(facetsFromUrl.page + 1));
    links.push({ rel: 'next', href: `${baseUrl}?${nextParams.toString()}` });
  }
  return links;
};

/**
 * @description Composable managing canonical data, og:url and href alernates
 * @returns UseUrlPageMetaReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useUrlPageMeta();
 * ```
 */
export const useUrlPageMeta: UseUrlPageMetaReturn = () => {
  const state = useState(`useUrlPageMeta`, () => ({
    loading: false,
  }));
  const { applyToUrl: applyTrailingSlashToUrl } = useUrlTrailingSlash();
  const { $i18n } = useNuxtApp();
  const links = shallowRef<PageLink[]>([]);
  const ogUrl = ref<string>();
  useHead({ link: links });
  useSeoMeta({ ogUrl });

  const clearPageMeta = () => {
    links.value = [];
    ogUrl.value = undefined;
  };

  /**
   * @description Function for setting static page metas.
   * @returns StaticPageMeta
   * @example
   * ``` ts
   * setStaticPageMeta()
   * ```
   */
  const setStaticPageMeta: StaticPageMeta = () => {
    state.value.loading = true;

    const route = useRouter().currentRoute.value;
    const runtimeConfig = useRuntimeConfig();
    const localePath = useLocalePath();
    const { defaultLocale } = $i18n;
    const { getAvailableLocales } = useLocalization();

    const canonicalUrl = applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localePath(route.fullPath)}`);

    const locales = getAvailableLocales();
    const getLegalRedirect = (path: string) =>
      getAmikonGermanLegalRedirect(path.replace(/[?#].*$/, ''), defaultLocale, locales);
    const defaultPath = localePath(route.fullPath, defaultLocale);
    const alternateLocales = locales
      .map((locale: Locale) => ({ locale, path: localePath(route.fullPath, locale) }))
      .filter(({ path }) => !getLegalRedirect(path))
      .map(({ locale, path }) => ({
        rel: 'alternate' as const,
        hreflang: locale,
        href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${path}`),
      }));

    links.value = [
      { rel: 'canonical', href: canonicalUrl },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${getLegalRedirect(defaultPath) ?? defaultPath}`),
      },
      ...alternateLocales,
    ];
    ogUrl.value = canonicalUrl;
    state.value.loading = false;
  };

  /**
   * @description Function for setting categories page metas.
   * @returns CategoriesPageMeta
   * @example
   * ``` ts
   * setCategoriesPageMeta()
   * ```
   */
  const setCategoriesPageMeta: CategoriesPageMeta = (
    productsCatalog: Facet,
    facetsFromUrl: FacetSearchCriteria,
    canonicalOverride?: string,
  ) => {
    state.value.loading = true;
    const route = useRouter().currentRoute.value;
    const localePath = useLocalePath();
    const runtimeConfig = useRuntimeConfig();

    const queryString = new URLSearchParams(route.query as Record<string, string>).toString();
    const querySuffix = queryString ? `?${queryString}` : '';

    const canonicalLink =
      canonicalOverride && canonicalOverride.trim() !== ''
        ? applyTrailingSlashToUrl(canonicalOverride)
        : applyTrailingSlashToUrl(
            `${runtimeConfig.public.domain}${localePath(route.path, $i18n.locale.value)}${querySuffix}`,
          );

    let alternateLocales: PageLink[] = [];
    if (productsCatalog.languageUrls) {
      alternateLocales = Object.keys(productsCatalog.languageUrls).map((key) => {
        const i18nKey = hreflangLocaleMapperToI18n(key);
        const localizedPath =
          key === `x-default`
            ? localePath(
                productsCatalog.languageUrls[key] || '/',
                hreflangLocaleMapperToI18n($i18n.defaultLocale) as Locale,
              )
            : localePath(productsCatalog.languageUrls[key] || '/', i18nKey as Locale);

        return {
          rel: 'alternate' as const,
          hreflang: key,
          href: applyTrailingSlashToUrl(`${runtimeConfig.public.domain}${localizedPath}${querySuffix}`),
        };
      });
    }

    links.value = [
      { rel: 'canonical', href: canonicalLink },
      ...alternateLocales,
      ...getPaginationLinks(productsCatalog, facetsFromUrl, canonicalLink),
    ];
    ogUrl.value = canonicalLink;
    state.value.loading = false;
  };

  /**
   * @description Computed robots meta content for category pages. Returns `noindex, follow`
   * when the current page number exceeds the configured max indexed page; otherwise falls back
   * to the category's own robots setting.
   * @returns ComputedRef<string>
   * @example
   * ``` ts
   * const robotsContent = getCategoryRobotsContent(productsCatalog);
   * ```
   */
  const getCategoryRobotsContent: GetCategoryRobotsContent = (productsCatalog) => {
    const route = useRoute();
    const { getNumberSetting: getSeoCategoryRobotsNoIndex } = useSiteSettings('seoCategoryRobotsNoIndex');
    const currentPage = computed(() => Number(route.query.page as string) || 1);
    const maxIndexedPage = computed(() => {
      const value = getSeoCategoryRobotsNoIndex(1);
      return value > 0 ? value : 1;
    });

    return computed((): string => {
      if (!productsCatalog.value?.category) {
        return '';
      }

      if (currentPage.value >= maxIndexedPage.value + 1) {
        return 'noindex, follow';
      }
      return categoryGetters.getCategoryRobots(productsCatalog.value.category);
    });
  };

  return {
    clearPageMeta,
    setStaticPageMeta,
    setCategoriesPageMeta,
    getCategoryRobotsContent,
    ...toRefs(state.value),
  };
};
