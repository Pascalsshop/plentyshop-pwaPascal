<template>
  <span
    v-if="availabilityName"
    data-testid="product-availability"
    class="amikon-product-availability"
    :class="[productGetters.getAgenciesAvailabilityCLass(product), { 'font-semibold': availabilityId === 5 }]"
    :style="availabilityStyles"
  >
    {{ availabilityName }}
  </span>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';

const { product } = defineProps<{ product: Product }>();
const availabilityId = computed(() => product.variation?.availability?.id);
const availabilityName = computed(() =>
  product.variation?.availability?.names ? productGetters.getAvailabilityName(product) || '' : '',
);
const availabilityStyles = computed(() => {
  if (!availabilityName.value) return {};

  // Match CeresCoconut's availability_1 / availability_5 colours without changing stock data.
  if (availabilityId.value === 1) return { backgroundColor: '#28a745', color: '#fff' };
  if (availabilityId.value === 5) return { backgroundColor: '#dc3545', color: '#fff' };

  return {
    backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
    color: productGetters.getAvailabilityTextColor(product),
  };
});
</script>

<style scoped>
.amikon-product-availability {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 0.25em 0.4em;
  border-radius: 0.1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
}
.amikon-product-availability.font-semibold {
  font-weight: 600;
}
</style>
