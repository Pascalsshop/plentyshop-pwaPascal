export const AMIKON_CLIMATE_CATEGORY_ID = '48';

// PlentyONE has no French URL for this category yet. Keep the existing
// navigation path usable by requesting the category by its stable ID.
export const isFrenchClimateCategoryPath = (path: string, locale: string): boolean =>
  locale.toLowerCase().split('-')[0] === 'fr' && path.replace(/\/+$/, '') === '/waerme-klimaschraenke';
