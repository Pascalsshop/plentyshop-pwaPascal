<template>
  <AmikonCartAppearance>
    <main class="@container py-8" data-testid="checkout-layout">
      <NarrowContainer>
        <p class="mb-6 rounded border border-amber-400 bg-amber-50 p-4">
          Interaktive Simulation mit Testartikeln: Mengen und Summen werden nur lokal berechnet. Beispielpreis 180 €,
          Beispielversand 9,90 €, enthaltene Beispiel-MwSt. 19 %. Keine echten Shopkonditionen oder Backend-Prüfung. Die
          zusätzlichen Demo-Regler steuern die Vorschau; die echten Warenkorb-Aktionen und Bestellungen bleiben
          gesperrt.
        </p>
        <div class="mb-6 flex flex-wrap gap-3">
          <UiButton variant="secondary" :aria-pressed="!empty" @click="resetPreview">Gefüllter Testwarenkorb</UiButton>
          <UiButton variant="secondary" :aria-pressed="empty" @click="clearPreview">Leerer Testwarenkorb</UiButton>
        </div>
        <h1 class="mb-8">Warenkorb</h1>
        <div v-if="!empty" class="@md:grid @md:grid-cols-12" data-testid="cart-page-content">
          <div class="col-span-7 mb-6 @md:mb-0">
            <div v-for="item in cart.items" :key="item.id">
              <UiCartProductCard :cart-item="item" disabled />
              <div class="mb-4 flex flex-wrap items-center gap-3 bg-white p-3">
                <label :for="`demo-quantity-${item.id}`">Demo-Menge Artikel {{ item.id }}</label>
                <input
                  :id="`demo-quantity-${item.id}`"
                  :value="item.quantity"
                  type="number"
                  min="1"
                  max="99"
                  step="1"
                  class="w-20 rounded border p-2"
                  @change="changeDemoQuantity(item, $event)"
                />
                <UiButton variant="secondary" @click="removeDemoItem(item.id)"
                  >Demo-Artikel {{ item.id }} entfernen</UiButton
                >
              </div>
            </div>
          </div>
          <div class="col-span-5 min-w-0">
            <OrderSummary :cart="cart">
              <UiButton disabled data-testid="checkout-button" class="w-full">Zur Kasse – nur Vorschau</UiButton>
            </OrderSummary>
          </div>
        </div>
        <div v-else class="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
          <h2 class="mt-8 typography-headline-3 font-bold">{{ t('cart.empty') }}</h2>
        </div>
      </NarrowContainer>
    </main>
  </AmikonCartAppearance>
</template>

<script setup lang="ts">
import type { Cart, CartItem, Product } from '@plentymarkets/shop-api';
import { ProductMock } from '../../__tests__/__mocks__/product.mock';

if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
const empty = ref(false);
const items: CartItem[] = [1, 2].map((quantity, index) => {
  const product = deepClone(ProductMock);
  product.item.id = 930000 + index;
  product.variation.id = 930000 + index;
  product.texts.name1 = `Testartikel ${index + 1}: Klimaprüfschrank mit Temperatur- und Feuchteregelung`;
  product.filter.isSalable = false;
  product.filter.isSalableAndActive = false;
  const image = product.images.all[0]!;
  image.url = '/_nuxt-plenty/images/amikon/home/category-climate.jpg';
  image.urlMiddle = image.url;
  image.urlPreview = image.url;
  image.urlSecondPreview = image.url;
  image.names = [];
  return {
    id: index + 1,
    quantity,
    price: 180,
    itemId: product.item.id,
    variationId: product.variation.id,
    variation: product as unknown as Product,
    basketItemOrderParams: [],
    inputLength: 0,
    inputWidth: 0,
    setComponents: [],
    itemType: 1,
  };
});
const cart = reactive<Cart & { items: CartItem[] }>({
  sessionId: 'local-preview-only',
  orderId: null,
  customerId: null,
  customerShippingAddressId: null,
  currency: 'EUR',
  referrerId: 1,
  shippingCountryId: 1,
  methodOfPaymentId: 0,
  shippingProviderId: 0,
  shippingProfileId: 0,
  itemSum: 540,
  itemSumNet: 453.78,
  basketAmount: 549.9,
  basketAmountNet: 462.1,
  shippingAmount: 9.9,
  shippingAmountNet: 8.32,
  paymentAmount: 0,
  couponCode: '',
  couponDiscount: 0,
  shippingDeleteByCoupon: false,
  basketRebate: 0,
  basketRebateType: 0,
  maxDeliveryDays: {},
  totalVats: [{ vatAmount: 87.8, vatValue: 19 }],
  itemQuantity: 3,
  items,
});

const recalculate = () => {
  const cents = cart.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  cart.itemQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.itemSum = cents / 100;
  cart.shippingAmount = cart.items.length ? 9.9 : 0;
  cart.basketAmount = (cents + Math.round(cart.shippingAmount * 100)) / 100;
  cart.itemSumNet = Math.round((cart.itemSum / 1.19) * 100) / 100;
  cart.shippingAmountNet = Math.round((cart.shippingAmount / 1.19) * 100) / 100;
  cart.basketAmountNet = Math.round((cart.basketAmount / 1.19) * 100) / 100;
  cart.totalVats = [{ vatAmount: Math.round((cart.basketAmount - cart.basketAmountNet) * 100) / 100, vatValue: 19 }];
  empty.value = cart.items.length === 0;
};
const changeDemoQuantity = (item: CartItem, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    input.value = String(item.quantity);
    return;
  }
  item.quantity = value;
  recalculate();
};
const removeDemoItem = (id: number) => {
  cart.items = cart.items.filter((item) => item.id !== id);
  recalculate();
};
const initialItems = deepClone(items);
const resetPreview = () => {
  cart.items = deepClone(initialItems);
  recalculate();
};
const clearPreview = () => {
  cart.items = [];
  recalculate();
};
recalculate();
</script>
