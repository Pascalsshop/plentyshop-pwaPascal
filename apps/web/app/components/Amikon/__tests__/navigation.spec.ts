import { describe, expect, it } from 'vitest';
import { AMIKON_FALLBACK_CATEGORIES, splitIntoBalancedColumns } from '../navigation';

describe('Amikon navigation', () => {
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
