<template>
  <div
    class="amikon-product"
    :class="{ 'amikon-product--arranged': !shouldEnableEditorFeatures, 'amikon-product--modern': modernLayout }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { amikonModernProductLayoutKey, amikonProductLayoutKey } from '~/utils/amikonProductLayout';

const props = defineProps<{ modern?: boolean }>();
const { shouldEnableEditorFeatures } = useEditorState();
const modernLayout = computed(() => !!props.modern && !shouldEnableEditorFeatures.value);
provide(amikonModernProductLayoutKey, modernLayout);
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
  grid-template-columns: var(--pdp-overview-columns, minmax(0, 1fr));
  align-items: start;
  gap: var(--pdp-overview-gap, 24px);
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
  .amikon-product--arranged {
    --pdp-overview-columns: minmax(0, 7fr) minmax(0, 5fr);
    --pdp-overview-gap: 40px;
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

.amikon-product--modern {
  width: min(100%, 1536px);
  padding: 20px clamp(16px, 4.3vw, 66px) 56px;
  background: #fff;
  color: #252632;
}

.amikon-product--modern :deep([data-testid='breadcrumbs']) {
  display: flex;
  margin-bottom: 24px;
  font-size: clamp(14px, 1.15vw, 17px);
}

.amikon-product--modern
  :deep(
    [data-testid='block-wrapper']:has(
        > .block-wrapper > [data-testid='multi-grid-structure'] [data-testid='gallery']
      ):has([data-testid='purchase-card'])
  ) {
  margin-block: 0;
  padding-block: 0;
}

.amikon-product--modern :deep([data-testid='purchase-card'] [data-testid='product-name']) {
  margin: 0;
  border-left: 0;
  padding: 0;
  font-size: clamp(26px, 2.35vw, 36px);
  font-weight: 750;
  line-height: 1.18;
  letter-spacing: -0.018em;
}

.amikon-product--modern :deep([data-testid='product-item-id']) {
  margin: 8px 0 0;
  color: #555866;
  font-size: clamp(14px, 1.2vw, 17px);
}

.amikon-product--modern :deep([data-testid='gallery-images']) {
  height: clamp(280px, 33vw, 500px);
  border-radius: 12px;
  background: #eeeff1;
}

.amikon-product--modern :deep(.gallery-thumbnails--vertical) {
  --thumbnail-width: clamp(80px, 7.3vw, 112px);
  width: var(--thumbnail-width);
}

.amikon-product--modern :deep(.gallery-thumbnails--vertical .swiper-slide) {
  width: var(--thumbnail-width) !important;
  height: calc(var(--thumbnail-width) * 0.94) !important;
}

.amikon-product--modern :deep(.gallery-thumbnails--vertical img) {
  border: 1px solid #d5d5de;
  border-radius: 7px;
  background: #f0f0f2;
}

.amikon-product--modern :deep(.gallery-thumbnails--vertical .swiper-slide-thumb-active img) {
  border: 2px solid #392f6e;
}

.amikon-product--modern :deep(.amikon-article-status) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px clamp(12px, 2.6vw, 40px);
  margin: 24px 0 20px;
}

.amikon-product--modern :deep(.amikon-article-status:empty) {
  display: none;
}

.amikon-product--modern :deep(.amikon-article-condition) {
  padding: 5px 12px;
  border-radius: 8px;
  background: #eeeef2;
  font-size: clamp(14px, 1.2vw, 17px);
  font-weight: 600;
}

.amikon-product--modern :deep(.amikon-article-status [data-testid='product-availability']) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: auto;
  margin: 0;
  font-size: clamp(14px, 1.25vw, 18px);
  font-weight: 650;
}

.amikon-product--modern :deep(.amikon-article-status :is(.availability-1, .availability-5)) {
  padding: 0;
  background: transparent !important;
  color: #252632 !important;
}

.amikon-product--modern :deep(.amikon-article-status :is(.availability-1, .availability-5)::before) {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #45a34d;
  content: '';
}

.amikon-product--modern :deep(.amikon-article-status--sold [data-testid='product-availability']) {
  color: #962e37 !important;
}

.amikon-product--modern :deep(.amikon-article-status--sold [data-testid='product-availability']::before) {
  background: currentColor;
}

.amikon-product--modern :deep([data-testid='product-price-row']) {
  margin-top: 0;
}

.amikon-product--modern :deep([data-testid='price']) {
  overflow-wrap: anywhere;
  font-size: clamp(30px, 3.4vw, 46px);
  line-height: 1.15;
}

.amikon-product--modern :deep([data-testid='add-to-cart']) {
  min-height: 54px;
  font-size: clamp(15px, 1.35vw, 19px);
}

.amikon-product--modern :deep([data-testid='quantity-selector'] > div:first-child) {
  min-height: 54px;
  border-color: #c5c5d1;
  border-radius: 8px;
}

.amikon-product--modern :deep([data-testid='quantity-selector-input']) {
  height: auto;
  min-width: 0;
}

.amikon-product--modern :deep([data-testid='product-purchase-actions']) {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
}

.amikon-product--modern :deep([data-testid='product-price-note']) {
  order: -1;
  margin: 0 0 22px;
  flex-wrap: wrap;
  color: #555866;
  font-size: clamp(13px, 1.2vw, 17px);
}

.amikon-product--modern :deep(.amikon-article-contact) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  color: #392f6e;
  font-size: clamp(15px, 1.3vw, 19px);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}

.amikon-product--modern
  :deep(:is([data-testid='item-text-block'], [data-testid='item-data-block'], [data-testid='technical-data-block'])) {
  margin-top: 18px;
  padding: 0;
  border: 0;
}

.amikon-product--modern
  :deep(:is([data-testid='item-text-block'], [data-testid='technical-data-block']) :is(h2, .no-preflight)) {
  padding: 0;
}

.amikon-product--modern
  :deep(
    :is([data-testid='item-text-block'], [data-testid='item-data-block'], [data-testid='technical-data-block']) h2
  ) {
  margin-bottom: 6px;
  color: #252632;
  font-size: 20px;
  font-weight: 700;
}

@media (min-width: 900px) {
  .amikon-product--modern {
    --pdp-overview-columns: minmax(0, 59fr) minmax(0, 41fr);
    --pdp-overview-gap: clamp(24px, 3vw, 46px);
  }
}

@media (max-width: 767px) {
  .amikon-product--modern {
    padding-top: 13px;
  }

  .amikon-product--modern :deep([data-testid='breadcrumbs']) {
    margin-bottom: 15px;
  }

  .amikon-product--modern :deep([data-testid='gallery-images']) {
    height: auto;
  }

  .amikon-product--modern :deep([data-testid='product-price-note']) {
    margin-bottom: 14px;
  }
}

@media (max-width: 420px) {
  .amikon-product--modern :deep([data-testid='product-quantity-cart-row']) {
    flex-direction: column;
  }

  .amikon-product--modern :deep([data-testid='product-quantity-cart-row'] > :first-child:not(:last-child)) {
    flex: 0 0 auto;
    align-self: flex-start;
  }
}
</style>
