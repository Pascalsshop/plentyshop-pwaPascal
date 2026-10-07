<template>
  <div class="amikon-product" :class="{ 'amikon-product--arranged': !shouldEnableEditorFeatures }"><slot /></div>
</template>

<script setup lang="ts">
import { amikonProductLayoutKey } from '~/utils/amikonProductLayout';

const { shouldEnableEditorFeatures } = useEditorState();
// Presentation only: never rewrite the stored Builder blocks or their field visibility.
provide(
  amikonProductLayoutKey,
  computed(() => !shouldEnableEditorFeatures.value),
);
</script>

<style scoped>
.amikon-product {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 15px 48px;
  background: #f7f7f9;
  color: #282d2f;
}
.amikon-product :deep([data-testid='product-name']) {
  border-left: 4px solid #392f6e;
  padding-left: 8px;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.amikon-product :deep([data-testid='purchase-card']) {
  box-shadow: none;
  border: 0;
}
.amikon-product--arranged :deep([data-testid='product-name']:has(+ [data-testid='product-item-id'])) {
  margin-bottom: 8px;
}
.amikon-product--arranged :deep([data-testid='product-item-id']) {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #62686a;
}
.amikon-product--arranged :deep([data-testid='purchase-card-fields']) {
  padding: 0;
}
.amikon-product--arranged :deep([data-testid='purchase-card']) {
  background: transparent;
  border-radius: 0;
}
.amikon-product--arranged :deep([data-testid='product-description']) {
  margin: 16px 0;
  line-height: 1.6;
}
.amikon-product--arranged :deep([data-testid='product-price-row']) {
  align-items: baseline;
  margin-top: 20px;
}
.amikon-product--arranged :deep([data-testid='price']) {
  color: #392f6e;
  font-size: 28px;
  line-height: 1.3;
}
.amikon-product--arranged :deep([data-testid='product-availability']) {
  margin: 16px 0 0;
  padding: 10px 12px;
  line-height: 1.4;
  text-align: left;
}
.amikon-product--arranged :deep([data-testid='product-quantity-cart-row']) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 16px;
}
.amikon-product--arranged :deep([data-testid='product-quantity-cart-row'] > *) {
  min-width: 0;
}
.amikon-product--arranged :deep([data-testid='product-quantity-cart-row'] > :first-child:not(:last-child)) {
  flex: 0 0 145px;
}
.amikon-product--arranged :deep([data-testid='add-to-cart']) {
  min-height: 48px;
  white-space: normal;
}
.amikon-product :deep([data-testid='product-variation-number']) {
  padding-top: 16px;
  border-top: 1px solid #ddd;
  color: #62686a;
}
.amikon-product :deep([data-testid='add-to-cart']:not(:disabled)) {
  background: #392f6e;
  color: white;
}
.amikon-product :deep([data-testid='add-to-cart']:not(:disabled):hover) {
  background: #2c2455;
}
.amikon-product :deep([data-testid='gallery-images']) {
  border-radius: 4px;
}
.amikon-product :deep([data-testid='item-text-block']),
.amikon-product :deep([data-testid='item-data-block']),
.amikon-product :deep([data-testid='technical-data-block']) {
  margin-top: 24px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.amikon-product--arranged :deep([data-testid='item-text-block']),
.amikon-product--arranged :deep([data-testid='item-data-block']),
.amikon-product--arranged :deep([data-testid='technical-data-block']) {
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
}
.amikon-product--arranged :deep(.item-info-table__cell) {
  padding: 10px 16px;
  vertical-align: top;
  overflow-wrap: anywhere;
}
.amikon-product--arranged :deep([data-testid='block-wrapper']:has(> .block-wrapper > [data-testid='item-text-block'])),
.amikon-product--arranged
  :deep([data-testid='block-wrapper']:has(> .block-wrapper > [data-testid='technical-data-block'])),
.amikon-product--arranged :deep([data-testid='block-wrapper']:has(> .block-wrapper > [data-testid='item-data-block'])) {
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}
.amikon-product--arranged :deep([data-testid='item-text-block'] .no-preflight),
.amikon-product--arranged :deep([data-testid='technical-data-block'] .no-preflight) {
  padding: 0 16px 16px;
}
.amikon-product--arranged :deep([data-testid='item-text-block'] h2),
.amikon-product--arranged :deep([data-testid='technical-data-block'] h2) {
  padding: 8px 16px 0;
}
.amikon-product :deep([data-testid='item-text-block'] h2),
.amikon-product :deep([data-testid='item-data-block'] h2),
.amikon-product :deep([data-testid='technical-data-block'] h2) {
  font-size: 22px;
  font-weight: 400;
  color: #392f6e;
  margin-bottom: 16px;
}
/* Only the ordinary two-column gallery/purchase pair, not other Builder grids. */
.amikon-product--arranged
  :deep(
    [data-testid='multi-grid-structure']:has(> [data-testid='multi-grid-column']:first-child:nth-last-child(2)):has(
        > [data-testid='multi-grid-column'] [data-testid='gallery']
      ):has(> [data-testid='multi-grid-column'] [data-testid='purchase-card'])
  ),
.amikon-product--arranged :deep(.amikon-product-overview) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 24px;
  padding: 0;
}
.amikon-product--arranged
  :deep(
    [data-testid='multi-grid-structure']:has(> [data-testid='multi-grid-column']:first-child:nth-last-child(2)):has(
        > [data-testid='multi-grid-column'] [data-testid='gallery']
      ):has(> [data-testid='multi-grid-column'] [data-testid='purchase-card'])
      > [data-testid='multi-grid-column']
  ),
.amikon-product--arranged :deep(.amikon-product-overview > *) {
  min-width: 0;
  grid-column: auto;
  position: relative;
  top: auto;
}
@media (min-width: 1024px) {
  .amikon-product--arranged
    :deep(
      [data-testid='multi-grid-structure']:has(> [data-testid='multi-grid-column']:first-child:nth-last-child(2)):has(
          > [data-testid='multi-grid-column'] [data-testid='gallery']
        ):has(> [data-testid='multi-grid-column'] [data-testid='purchase-card'])
    ),
  .amikon-product--arranged :deep(.amikon-product-overview) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 40px;
  }
}
.amikon-product :deep(button:focus-visible),
.amikon-product :deep(a:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .amikon-product {
    padding-top: 12px;
  }
  .amikon-product :deep([data-testid='product-name']) {
    font-size: 23px;
  }
  .amikon-product--arranged :deep([data-testid='product-quantity-cart-row']) {
    flex-wrap: wrap;
    gap: 12px;
  }
  .amikon-product--arranged
    :deep(
      [data-testid='block-wrapper']:has(
          > .block-wrapper > [data-testid='multi-grid-structure'] [data-testid='gallery']
        ):has([data-testid='purchase-card'])
    ) {
    padding-top: 0;
    padding-bottom: 16px;
    margin-bottom: 0;
  }
  .amikon-product--arranged :deep([data-testid='gallery-images']) {
    aspect-ratio: 4 / 3;
  }
  .amikon-product--arranged :deep([data-testid='gallery-images']::after) {
    padding-top: 0;
  }
  .amikon-product--arranged :deep([data-testid='product-price-row']) {
    margin-top: 12px;
  }
}
</style>
