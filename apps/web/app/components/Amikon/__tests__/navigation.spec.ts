import { describe, expect, it } from 'vitest';
import { AMIKON_FALLBACK_CATEGORIES, isAmikonCategoryMenuLabelVisible, splitIntoBalancedColumns } from '../navigation';

describe('Amikon navigation', () => {
  it('hides the requested CMS entries including German fallbacks in other languages', () => {
    for (const label of [
      'Startseite',
      'Startseite_Amikon',
      'Startseite-Amikon',
      'AMIKON',
      ' Zur   Kasse ',
      'Zur\u00a0Kasse',
    ]) {
      expect(isAmikonCategoryMenuLabelVisible(label)).toBe(false);
    }
    for (const label of ['Roboter', 'Maschinen', 'Amikon Ersatzteile']) {
      expect(isAmikonCategoryMenuLabelVisible(label, ['Home', 'Checkout'])).toBe(true);
    }
  });
  it('uses translated labels without matching parts of actual category names', () => {
    for (const label of ['Home', 'Checkout', 'Go to checkout']) {
      expect(isAmikonCategoryMenuLabelVisible(label)).toBe(false);
    }
    expect(isAmikonCategoryMenuLabelVisible(' Accueil ', ['Accueil', 'Paiement'])).toBe(false);
    expect(isAmikonCategoryMenuLabelVisible('Paiement', ['Accueil', 'Paiement'])).toBe(false);
    expect(isAmikonCategoryMenuLabelVisible('Home automation', ['Home', 'Checkout'])).toBe(true);
  });
  it('filters CMS routes in every locale but keeps product categories with similar names', () => {
    for (const path of ['/nl/home', '/fr/checkout/', '/en/content/hilfe', '/privacy-policy?source=menu']) {
      expect(isAmikonCategoryMenuLabelVisible('Unbekannte Bezeichnung', [], path)).toBe(false);
    }
    expect(isAmikonCategoryMenuLabelVisible('Home automation', [], '/nl/home-automation')).toBe(true);
    expect(isAmikonCategoryMenuLabelVisible('Roboter', [], '/nl/robotica')).toBe(true);
  });
  it('hides Kategorien, Über Amikon and Zu Amikon by exact label or CMS route', () => {
    for (const label of [
      'Kategorien',
      ' Über   Amikon ',
      'Über_Amikon',
      'Ueber-Amikon',
      ' Zu   Amikon ',
      'Zu_Amikon',
    ]) {
      expect(isAmikonCategoryMenuLabelVisible(label)).toBe(false);
    }
    for (const prefix of ['', '/de', '/en', '/nl', '/fr']) {
      for (const path of ['/kategorien', '/ueber-amikon', '/zu-amikon']) {
        expect(isAmikonCategoryMenuLabelVisible('CMS-Seite', [], `${prefix}${path}/?source=menu#top`)).toBe(false);
      }
    }
    expect(isAmikonCategoryMenuLabelVisible('Kategorien Zubehör', [], '/kategorien-zubehoer')).toBe(true);
    expect(isAmikonCategoryMenuLabelVisible('Über Amikon Ersatzteile', [], '/ueber-amikon-ersatzteile')).toBe(true);
    expect(isAmikonCategoryMenuLabelVisible('Zu Amikon Ersatzteile', [], '/zu-amikon-ersatzteile')).toBe(true);
  });
  it('hides the translated category overview but retains actual categories in every language', () => {
    for (const label of ['Kategorien', 'Categories', 'Catégories', 'Categorieën']) {
      expect(isAmikonCategoryMenuLabelVisible(` ${label} `, [label], '/cms-overview')).toBe(false);
      expect(isAmikonCategoryMenuLabelVisible(`${label} Zubehör`, [label], '/product-category')).toBe(true);
    }
  });
  it('should preserve menu order across balanced columns', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];

    const columns = splitIntoBalancedColumns(items, 3);

    expect(columns).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8],
    ]);
    expect(columns.flat()).toEqual(items);
  });

  it('should retain all categories from the legacy Amikon menu', () => {
    expect(AMIKON_FALLBACK_CATEGORIES).toHaveLength(22);
    for (const { slug } of AMIKON_FALLBACK_CATEGORIES) {
      expect(isAmikonCategoryMenuLabelVisible('Produktkategorie', [], slug)).toBe(true);
    }
  });

  it('should return no columns for invalid input', () => {
    expect(splitIntoBalancedColumns([], 3)).toEqual([]);
    expect(splitIntoBalancedColumns([1], 0)).toEqual([]);
  });
});
