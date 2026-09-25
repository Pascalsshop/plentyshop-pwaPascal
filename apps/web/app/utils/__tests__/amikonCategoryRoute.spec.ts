import { AMIKON_CLIMATE_CATEGORY_ID, isFrenchClimateCategoryPath } from '../amikonCategoryRoute';

describe('French Amikon climate category fallback', () => {
  it('uses the known climate category only for the French route', () => {
    expect(AMIKON_CLIMATE_CATEGORY_ID).toBe('48');
    expect(isFrenchClimateCategoryPath('/waerme-klimaschraenke', 'fr')).toBe(true);
    expect(isFrenchClimateCategoryPath('/waerme-klimaschraenke/', 'fr-FR')).toBe(true);
    expect(isFrenchClimateCategoryPath('/waerme-klimaschraenke', 'de')).toBe(false);
    expect(isFrenchClimateCategoryPath('/klimaatkamers', 'fr')).toBe(false);
  });
});
