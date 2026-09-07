<template>
  <div ref="sliderRootRef" :class="{ 'amikon-product-slider': appearance === 'amikon' }">
    <SfScrollable
      buttons-placement="floating"
      class="pb-4 scrollbar-hidden"
      :wrapper-class="appearance === 'amikon' ? 'amikon-product-track' : wrapperClass"
      data-testid="product-slider"
    >
      <UiProductCard
        v-for="(product, index) in items"
        :key="productGetters.getId(product)"
        :product="product"
        :should-load-image="shouldLoadImage(index)"
        :index="index"
        :configuration="appearance === 'amikon' ? amikonConfiguration : undefined"
        is-from-slider
        class="w-48 max-w-48 shrink-0"
      />
    </SfScrollable>
  </div>
  <div class="mt-4 typography-text-xs flex gap-1">
    <span>{{ t('common.labels.asterisk') }}</span>
    <span v-if="showNetPrices">{{ t('product.priceExclVAT') }}</span>
    <span v-else>{{ t('product.priceInclVAT') }}</span>
    <i18n-t keypath="shipping.excludedLabel" scope="global">
      <template #shipping>
        <UiLink
          :href="localePath(paths.shipping)"
          target="_blank"
          class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
        >
          {{ t('common.labels.delivery') }}
        </UiLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';
const { showNetPrices } = useCart();
const localePath = useLocalizedPath();

defineProps<ProductSliderProps>();

const amikonConfiguration: ItemGridContent = {
  cardBorders: true,
  contentAlignment: 'left',
  fields: { title: true, rating: false, previewText: false, price: true, addToCart: true, manufacturer: false },
  fieldsOrder: ['title', 'price', 'addToCart'],
  fieldsDisabled: [],
  showWishlistButton: false,
  showSecondImageOnHover: false,
  addToCartStyle: 'primary',
  itemsPerRowDesktop: 4,
  itemsPerRowTablet: 3,
  itemsPerRowMobile: 1,
  showItemCount: false,
  itemCountPosition: 'center',
  paginationPosition: 'bottom',
  layout: { fullWidth: false },
};

const { sliderRootRef, shouldLoadImage } = useSliderImagePreload({
  itemWidth: 192,
  itemGap: 16,
  preloadBuffer: 2,
});
</script>

<style scoped>
.amikon-product-slider :deep(.amikon-product-track > .overflow-x-auto) {
  gap: 30px;
  align-items: stretch;
  scroll-snap-type: x mandatory;
}
.amikon-product-slider :deep([data-testid='product-card']) {
  width: calc((100% - 90px) / 4);
  max-width: none;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  scroll-snap-align: start;
}
.amikon-product-slider :deep(.size-48) {
  width: 100%;
  height: auto;
  aspect-ratio: 1;
}
.amikon-product-slider :deep([data-testid='productcard-name']) {
  min-height: 5.4em;
  font-size: 19px;
  line-height: 1.35;
  color: #212529;
  overflow-wrap: anywhere;
}
.amikon-product-slider :deep([data-testid='product-card-vertical-price']) {
  font-size: 20px;
  padding-top: 12px;
}
@media (max-width: 991px) {
  .amikon-product-slider :deep([data-testid='product-card']) {
    width: calc((100% - 60px) / 3);
  }
}
@media (max-width: 767px) {
  .amikon-product-slider :deep(.amikon-product-track > .overflow-x-auto) {
    gap: 16px;
  }
  .amikon-product-slider :deep([data-testid='product-card']) {
    width: calc((100% - 16px) / 2);
  }
  .amikon-product-slider :deep([data-testid='productcard-name']) {
    font-size: 17px;
  }
}
@media (max-width: 479px) {
  .amikon-product-slider :deep([data-testid='product-card']) {
    width: 100%;
  }
}
</style>
