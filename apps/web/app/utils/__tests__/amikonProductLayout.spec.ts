import { arrangeAmikonPurchaseFields } from '../amikonProductLayout';
import type { PriceCardOrderItem, PriceCardTextBlockItem } from '~/components/ui/PurchaseCard/types';

describe('Amikon product layout', () => {
  it('arranges existing purchase fields without changing the Builder configuration', () => {
    const fields: PriceCardOrderItem[] = ['price', 'availability', 'itemName', 'quantityAndAddToCart', 'previewText'];
    const original = [...fields];
    expect(arrangeAmikonPurchaseFields(fields)).toEqual([
      'itemName',
      'previewText',
      'price',
      'availability',
      'quantityAndAddToCart',
    ]);
    expect(fields).toEqual(original);
  });

  it('does not insert missing or disabled fields', () => {
    expect(arrangeAmikonPurchaseFields(['price', 'itemName'])).toEqual(['itemName', 'price']);
    expect(arrangeAmikonPurchaseFields([])).toEqual([]);
  });

  it('preserves custom rich-text anchors and all configured fields', () => {
    const custom: PriceCardTextBlockItem = {
      type: 'textBlock',
      uuid: 'custom',
      content: '<p>Custom information</p>',
      visible: true,
    };
    const fields: PriceCardOrderItem[] = ['price', 'itemName', custom, 'quantityAndAddToCart', 'availability'];
    const result = arrangeAmikonPurchaseFields(fields);
    expect(result).toEqual(['itemName', 'price', custom, 'availability', 'quantityAndAddToCart']);
    expect(result[2]).toBe(custom);
    expect(result).toHaveLength(fields.length);
  });
});
