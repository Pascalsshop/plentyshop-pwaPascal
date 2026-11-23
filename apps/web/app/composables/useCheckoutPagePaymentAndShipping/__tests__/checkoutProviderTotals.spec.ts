import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { cartGetters } from '@plentymarkets/shop-api';
import type { Cart, ShippingMethod } from '@plentymarkets/shop-api';

const { sdk } = vi.hoisted(() => ({
  sdk: {
    getBlocksWithGlobalBlocks: vi.fn().mockResolvedValue({ data: { blocks: [] } }),
    setShippingProvider: vi.fn(),
    getShippingProvider: vi.fn(),
    setPaymentProvider: vi.fn(),
    getPaymentProviders: vi.fn(),
    getSession: vi.fn(),
  },
}));

mockNuxtImport('useSdk', () => () => ({ plentysystems: sdk }));

describe('Checkout provider totals with simulated PlentyONE replies', () => {
  const basket = (paymentId: number, shippingId: number, total: number, shippingAmount: number) => {
    const fields: Partial<Cart> = {
      methodOfPaymentId: paymentId,
      shippingProfileId: shippingId,
      basketAmount: total,
      shippingAmount,
      items: [],
    };
    return fields as Cart;
  };

  it('should show the confirmed basket and payment after a shipping method requires a payment fallback', async () => {
    const shippingMethods = [{ parcelServicePresetId: 20, excludedPaymentMethodIds: [1] }] as ShippingMethod[];
    const pendingBasket = Promise.withResolvers<{ data: { basket: Cart } }>();
    sdk.setShippingProvider.mockResolvedValue({ data: { list: shippingMethods } });
    sdk.getShippingProvider.mockResolvedValue({ data: { list: shippingMethods } });
    sdk.getPaymentProviders.mockResolvedValue({ data: { list: [{ id: 1 }, { id: 2 }, { id: 3 }], selected: 1 } });
    sdk.setPaymentProvider.mockResolvedValue({ data: { selected: 3 } });
    sdk.getSession
      .mockResolvedValueOnce({ data: { basket: basket(1, 20, 110, 10) } })
      .mockReturnValueOnce(pendingBasket.promise);

    const { setCart, data } = useCart();
    setCart(basket(1, 10, 100, 0));
    const checkout = useCheckoutPagePaymentAndShipping();
    const change = checkout.handleShippingMethodUpdate('20');
    await vi.waitFor(() => expect(sdk.getSession).toHaveBeenCalledTimes(2));

    expect(checkout.disableShippingPayment.value).toBe(true);
    expect(useCheckoutPagePaymentAndShipping().disableShippingPayment.value).toBe(true);
    await checkout.handlePaymentMethodUpdate(1);
    expect(sdk.setPaymentProvider).toHaveBeenCalledExactlyOnceWith({ paymentId: 2 });
    expect(checkout.selectedPaymentId.value).toBe(3);
    expect(checkout.paymentMethods.value.selected).toBe(3);

    pendingBasket.resolve({ data: { basket: basket(3, 20, 115, 10) } });
    await change;

    expect(data.value).toMatchObject({ methodOfPaymentId: 3, shippingProfileId: 20 });
    expect(cartGetters.getTotals(data.value)).toMatchObject({ total: 115, shippingAmount: 10 });
    expect(checkout.disableShippingPayment.value).toBe(false);
  });
});
