import type { InjectionKey, Ref } from 'vue';
import type { PriceCardFieldKey, PriceCardOrderItem } from '~/components/ui/PurchaseCard/types';

export const amikonProductLayoutKey: InjectionKey<Ref<boolean>> = Symbol('amikon-product-layout');

const purchaseFieldOrder: PriceCardFieldKey[] = [
  'itemName',
  'variationNumber',
  'tags',
  'previewText',
  'variationProperties',
  'attributes',
  'orderProperties',
  'itemBundle',
  'graduatedPrices',
  'price',
  'availability',
  'quantityAndAddToCart',
  'addToWishlist',
  'guaranteeLabel',
  'starRating',
  'itemText',
  'technicalData',
];

/** Arrange existing fields only; keep custom rich-text blocks at their configured anchors. */
export function arrangeAmikonPurchaseFields(fields: PriceCardOrderItem[]): PriceCardOrderItem[] {
  const result: PriceCardOrderItem[] = [];
  let group: PriceCardFieldKey[] = [];
  const appendGroup = () => {
    result.push(...group.sort((a, b) => purchaseFieldOrder.indexOf(a) - purchaseFieldOrder.indexOf(b)));
    group = [];
  };

  for (const field of fields) {
    if (typeof field === 'string') {
      group.push(field);
    } else {
      appendGroup();
      result.push(field);
    }
  }
  appendGroup();
  return result;
}
