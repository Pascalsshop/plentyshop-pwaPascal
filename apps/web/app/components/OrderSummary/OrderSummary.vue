<template>
  <div class="shadow-lg @md:rounded-md @md:border @md:border-neutral-100" data-testid="order-summary">
    <div class="flex justify-between items-end py-2 px-4 @md:px-6 @md:pt-6 @md:pb-4">
      <h2 class="typography-headline-4 font-bold @md:typography-headline-3">{{ t('common.labels.orderSummary') }}</h2>
      <p class="typography-text-base font-medium" data-testid="total-in-cart">
        {{ t('cart.itemCount', { count: cartItemsCount }) }}
      </p>
    </div>

    <div class="px-4 pb-4 mt-3 @md:px-6 @md:pb-6 @md:mt-0">
      <div v-if="orderPropertiesWithVatAdditionalCosts.length > 0" class="mb-4">
        <div
          v-for="property in orderPropertiesWithVatAdditionalCosts"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="min-w-0 grow pr-2 break-words">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="shrink-0 whitespace-nowrap text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>

        <UiDivider class="mt-4 w-auto" />
      </div>

      <div class="flex flex-col gap-1 typography-text-base mb-4" data-testid="order-summary-breakdown">
        <div class="flex items-start justify-between gap-2">
          <p class="min-w-0 break-words" data-testid="subtotal-label">
            {{ t('common.labels.itemsSubtotal') }} <span v-if="showNetPrices">({{ t('common.labels.netPrice') }})</span>
          </p>
          <p class="shrink-0 whitespace-nowrap text-right font-medium" data-testid="subtotal">
            {{ format(showNetPrices ? cartGetters.getItemSumNet(props.cart) : totals.subTotal) }}
          </p>
        </div>
        <div class="flex items-start justify-between gap-2">
          <p class="min-w-0 break-words" data-testid="shipping-label">
            {{ t('common.labels.delivery') }} <span v-if="showNetPrices">({{ t('common.labels.netPrice') }})</span>
          </p>
          <p class="shrink-0 whitespace-nowrap text-right font-medium" data-testid="shipping">
            {{
              getShippingAmount(
                showNetPrices ? cartGetters.getShippingAmountNet(props.cart) : cartGetters.getShippingPrice(props.cart),
              )
            }}
          </p>
        </div>
        <div v-if="cartGetters.getCouponDiscount(props.cart)" class="flex items-start justify-between gap-2">
          <p class="min-w-0 break-words" data-testid="coupon-label">{{ t('coupon.name') }}</p>
          <p class="shrink-0 whitespace-nowrap text-right font-medium" data-testid="coupon-value">
            {{ format(cartGetters.getCouponDiscount(props.cart)) }}
          </p>
        </div>
        <div v-for="(vat, index) in totals.vats" :key="index" class="flex items-start justify-between gap-2">
          <p class="min-w-0 break-words" data-testid="vat-label">
            {{ showNetPrices ? t('common.labels.excludedTax') : t('common.labels.includedTax') }} ({{
              cartGetters.getTotalVatValue(vat)
            }}%)
          </p>
          <p class="shrink-0 whitespace-nowrap text-right" data-testid="vat">
            {{ format(cartGetters.getTotalVatAmount(vat)) }}
          </p>
        </div>
      </div>

      <div v-if="orderPropertiesWithoutVat.length > 0" class="mb-4">
        <UiDivider class="mb-4" />
        <div
          v-for="property in orderPropertiesWithoutVat"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="min-w-0 grow pr-2 break-words">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="shrink-0 whitespace-nowrap text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>
        <UiDivider class="mt-4 w-auto" />
      </div>

      <div v-if="showNetPrices" class="flex justify-between gap-2 typography-text-base mb-1">
        <h2 class="min-w-0 break-words" data-testid="total-net-label">
          {{ t('common.labels.total') }} ({{ t('common.labels.netPrice') }})
        </h2>
        <h2 class="shrink-0 whitespace-nowrap text-right" data-testid="total-net">
          {{ format(cartGetters.getBasketAmountNet(cart)) }}
        </h2>
      </div>
      <div class="flex justify-between gap-2 typography-text-base font-bold pb-4 mb-4">
        <h2 class="min-w-0 break-words" data-testid="total-label">
          {{ t('common.labels.total') }} <span v-if="showNetPrices">({{ t('common.labels.grossPrice') }})</span>
        </h2>
        <h2 class="shrink-0 whitespace-nowrap text-right" data-testid="total">{{ format(totals.total) }}</h2>
      </div>
      <UiDivider class="w-auto mb-4" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type { OrderSummaryPropsType } from '~/components/OrderSummary/types';

const props = defineProps<OrderSummaryPropsType>();
const { showNetPrices } = useCart();
const { format } = usePriceFormatter();

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(props.cart);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shipping.method.free') : format(Number(amount));
};

const cartItemsCount = computed(() => props.cart?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const orderPropertiesWithoutVat = computed(() => cartGetters.getOrderPropertiesWithoutVat(props.cart));
const orderPropertiesWithVatAdditionalCosts = computed(() =>
  cartGetters.getOrderPropertiesAdditionalCostsWithVat(props.cart),
);
</script>
