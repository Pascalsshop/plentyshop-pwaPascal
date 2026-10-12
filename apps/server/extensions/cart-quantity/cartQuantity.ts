import { ApiError } from '@plentymarkets/shop-api';
import type { Cart, CartItemError, Data, SetCartItemQuantityParams } from '@plentymarkets/shop-api';
import type { CartQuantityContext, CartQuantityResponse } from './types';

/** Preserve the SDK quantity update, but recognize numeric stock zero as a stock limit. */
export async function setCartItemQuantity(
  context: CartQuantityContext,
  params: SetCartItemQuantityParams,
): Promise<Data<Cart | CartItemError>> {
  const url = new URL(`/rest/storefront/cart/items/${params.cartItemId}`, context.config.api.url);
  const { data } = await context.client.put<CartQuantityResponse>(url.href, {
    variationId: params.productId,
    quantity: params.quantity ?? 1,
    id: params.cartItemId,
  });

  // Match shop-api 0.181.1's successful basket mapping; never replace the server's quantity.
  const basketChanged = data.events?.AfterBasketChanged;
  if (basketChanged) {
    return {
      data: {
        ...basketChanged.basket,
        basketRebateType: String(basketChanged.basket.basketRebateType ?? '0'),
        items: basketChanged.basketItems,
      },
    };
  }

  const stock = data.data?.placeholder?.stock;
  if (typeof stock === 'number' && Number.isFinite(stock) && stock >= 0) {
    return { data: { availableStock: stock } };
  }

  // Keep the SDK's unknown-response behavior; HTTP failures propagate without a retry.
  throw new ApiError({ key: 'unknownError', code: '503', message: '', cause: '' });
}

export const cartQuantityExtension = {
  name: 'amikon-cart-quantity',
  extendApiMethods: { setCartItemQuantity },
};
