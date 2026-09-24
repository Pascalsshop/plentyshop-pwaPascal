import type { AmikonFallbackCategory } from './Amikon.types';

export const AMIKON_PURCHASE_FORM_PATH = '/ankaufformular';
export const AMIKON_NEWSLETTER_URL = 'https://www.amikon.de/newsletter/';
export const AMIKON_LOGO_PATH = '/_nuxt-plenty/images/amikon/logo.gif';
const NON_PRODUCT_CATEGORY_ROUTES = new Set([
  '/home',
  '/startseite',
  '/checkout',
  '/cart',
  '/warenkorb',
  '/login',
  '/register',
  '/contact',
  '/ankaufformular',
  '/shipping',
  '/privacy-policy',
  '/terms-and-conditions',
  '/legal-disclosure',
  '/cancellation-rights',
  '/content/hilfe',
  '/content/batterieverordnung',
]);

/** Hide CMS pages that PlentyONE also returns in the category tree. */
export const isAmikonCategoryMenuLabelVisible = (
  label: string,
  translatedLabels: readonly string[] = [],
  path = '',
): boolean => {
  const normalize = (value: string) => value.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const excluded = [
    'startseite',
    'startseite amikon',
    'amikon startseite',
    'amikon',
    'zur kasse',
    'home',
    'homepage',
    'checkout',
    'go to checkout',
    ...translatedLabels,
  ];
  if (excluded.some((value) => normalize(value) === normalize(label))) return false;

  // Only exact non-product routes are excluded; similarly named product categories stay visible.
  const segments = path.split(/[?#]/, 1)[0]?.split('/').filter(Boolean) ?? [];
  if (['de', 'en', 'fr', 'nl'].includes(segments[0]?.toLowerCase() ?? '')) segments.shift();
  const route = `/${segments.join('/').toLowerCase()}`.replace(/\/$/, '') || '/';
  return !NON_PRODUCT_CATEGORY_ROUTES.has(route);
};

export const AMIKON_FALLBACK_CATEGORIES = [
  { slug: '/3d-druck', translationKey: 'amikonHeader.categories.threeDPrinting' },
  { slug: '/maschinen', translationKey: 'amikonHeader.categories.machines' },
  { slug: '/rasterelektronenmikroskope', translationKey: 'amikonHeader.categories.electronMicroscopes' },
  { slug: '/roboter', translationKey: 'amikonHeader.categories.robots' },
  { slug: '/shaker-schwingpruefanlagen', translationKey: 'amikonHeader.categories.shakers' },
  { slug: '/waerme-klimaschraenke', translationKey: 'amikonHeader.categories.climateChambers' },
  { slug: '/begehbare-klimakammern', translationKey: 'amikonHeader.categories.walkInChambers' },
  { slug: '/salzspruehkammern', translationKey: 'amikonHeader.categories.saltSprayChambers' },
  { slug: '/bewitterungstechnik', translationKey: 'amikonHeader.categories.weatheringTechnology' },
  { slug: '/elektronik', translationKey: 'amikonHeader.categories.electronics' },
  { slug: '/frequenzumrichter', translationKey: 'amikonHeader.categories.frequencyConverters' },
  { slug: '/laborartikel', translationKey: 'amikonHeader.categories.laboratoryEquipment' },
  { slug: '/lasertechnik', translationKey: 'amikonHeader.categories.laserTechnology' },
  { slug: '/materialpruefmaschinen', translationKey: 'amikonHeader.categories.materialTesting' },
  { slug: '/mess-prueftechnik', translationKey: 'amikonHeader.categories.measurementTesting' },
  { slug: '/monitore-bedieneinheiten', translationKey: 'amikonHeader.categories.monitors' },
  { slug: '/motoren-und-antriebe', translationKey: 'amikonHeader.categories.motorsDrives' },
  { slug: '/pneumatik', translationKey: 'amikonHeader.categories.pneumatics' },
  { slug: '/pumpen', translationKey: 'amikonHeader.categories.pumps' },
  { slug: '/sonstige-artikel', translationKey: 'amikonHeader.categories.otherItems' },
  { slug: '/thermisches-zubehoer', translationKey: 'amikonHeader.categories.thermalAccessories' },
  { slug: '/vakuum-technik', translationKey: 'amikonHeader.categories.vacuumTechnology' },
] satisfies readonly AmikonFallbackCategory[];

/**
 * Splits a list into balanced, order-preserving columns.
 */
export const splitIntoBalancedColumns = <T>(items: T[], columnCount: number): T[][] => {
  if (columnCount < 1 || items.length === 0) {
    return [];
  }

  const baseSize = Math.floor(items.length / columnCount);
  const remainder = items.length % columnCount;
  const columns: T[][] = [];
  let startIndex = 0;

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const columnSize = baseSize + (columnIndex < remainder ? 1 : 0);

    if (columnSize > 0) {
      columns.push(items.slice(startIndex, startIndex + columnSize));
      startIndex += columnSize;
    }
  }

  return columns;
};
