import type { Cart, CartItem } from '@plentymarkets/shop-api';
import type { PlentysystemsIntegrationContext } from '@plentymarkets/shop-api/server/types/context';

export type CartQuantityContext = Pick<PlentysystemsIntegrationContext, 'client' | 'config'>;

export interface CartQuantityResponse {
  events?: {
    AfterBasketChanged?: {
      basket: Omit<Cart, 'basketRebateType'> & { basketRebateType?: string | number | null };
      basketItems: CartItem[];
    };
  };
  data?: {
    placeholder?: {
      stock?: unknown;
    };
  };
}
