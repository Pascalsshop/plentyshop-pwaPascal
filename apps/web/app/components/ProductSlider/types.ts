import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  appearance?: 'default' | 'amikon';
  wrapperClass?: string | Record<string, unknown> | unknown[];
};
