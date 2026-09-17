import { describe, expect, it } from 'vitest';
import { AMIKON_FALLBACK_CATEGORIES, isAmikonCategoryMenuLabelVisible, splitIntoBalancedColumns } from '../navigation';

describe('Amikon navigation', () => {
  it('hides the requested CMS entries including German fallbacks in other languages', () => {
    for (const label of ['Startseite', 'AMIKON', ' Zur   Kasse ', 'Zur\u00a0Kasse']) {
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
  });

  it('should return no columns for invalid input', () => {
    expect(splitIntoBalancedColumns([], 3)).toEqual([]);
    expect(splitIntoBalancedColumns([1], 0)).toEqual([]);
  });
});
