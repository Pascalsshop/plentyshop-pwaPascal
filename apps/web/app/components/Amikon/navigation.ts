import type { AmikonFallbackCategory } from './Amikon.types';

export const AMIKON_PURCHASE_FORM_PATH = '/ankaufformular';
export const AMIKON_NEWSLETTER_URL = 'https://www.amikon.de/newsletter/';
export const AMIKON_PHONE_HREF = 'tel:+492861685300';
export const AMIKON_PHONE_LABEL = '+49 2861 – 68 53 00';
export const AMIKON_LOGO_PATH = '/_nuxt-plenty/images/amikon/logo.gif';

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
