<template>
  <section v-if="modernLayout" class="product-legal" data-testid="legal-information">
    <h2>{{ content.text.title || t('product.legalDetails') }}</h2>
    <details @toggle="legalOpen = ($event.currentTarget as HTMLDetailsElement).open">
      <summary>
        <span>{{ t('manufacturer.manufacturerTabName') }} · {{ t('manufacturer.euResponsibleTabName') }}</span>
        <SfIconExpandMore aria-hidden="true" />
      </summary>
      <div v-if="legalOpen" class="product-legal-cards">
        <div class="product-legal-card">
          <h3>{{ t('manufacturer.manufacturerTabName') }}</h3>
          <ManufacturerInformation :product="currentProduct" compact />
        </div>
        <div class="product-legal-card">
          <h3>{{ t('manufacturer.responsibleHeader') }}</h3>
          <ManufacturerResponsibleInfo :product="currentProduct" compact />
        </div>
      </div>
    </details>
  </section>
  <div v-else class="p-4 flex" :style="productLegalInlineStyle" data-testid="legal-information">
    <button
      type="button"
      class="font-bold leading-6 text-left"
      data-testid="open-manufacturer-drawer"
      @click="openDrawer(meta.uuid)"
    >
      <span data-testid="link-text">{{ props.content.text.linkText }}</span>
      <SfIconChevronRight />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconChevronRight, SfIconExpandMore } from '@storefront-ui/vue';
import type { ProductLegalInformationProps } from './types';
import { amikonModernProductLayoutKey } from '~/utils/amikonProductLayout';
const props = defineProps<ProductLegalInformationProps>();
const { meta } = props;

const { openDrawer } = useProductLegalDetailsDrawer();
const { currentProduct } = useProducts();
const { t } = useI18n();
const modernLayout = inject(amikonModernProductLayoutKey, ref(false));
const legalOpen = ref(false);

const productLegalInlineStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
  };
});
</script>

<style scoped>
.product-legal {
  max-width: 1070px;
  margin-block: 24px;
  margin-inline: auto;
  overflow-wrap: anywhere;
}

.product-legal h2 {
  margin: 0 0 16px;
  color: #252632;
  font-size: clamp(22px, 2.1vw, 30px);
  font-weight: 700;
}

.product-legal details {
  border: 1px solid #e1e1e9;
  border-radius: 10px;
  background: #f7f6fa;
}

.product-legal summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px clamp(16px, 2vw, 24px);
  color: #392f6e;
  font-weight: 600;
  list-style: none;
  cursor: pointer;
}

.product-legal summary::-webkit-details-marker {
  display: none;
}

.product-legal summary:focus-visible {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
  border-radius: 8px;
}

.product-legal summary svg {
  flex: none;
}

.product-legal details[open] summary svg {
  transform: rotate(180deg);
}

.product-legal-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 0 12px 12px;
}

.product-legal-card {
  padding: clamp(16px, 2vw, 24px);
  border: 1px solid #e1e1e9;
  border-radius: 10px;
  background: white;
  color: #353543;
}

.product-legal-card h3 {
  margin: 0 0 10px;
  color: #392f6e;
  font-size: 1.05rem;
  font-weight: 700;
}

.product-legal-card :deep(.manufacturer-address) {
  display: grid;
  gap: 4px;
  line-height: 1.5;
}

.product-legal-card :deep(.manufacturer-address img) {
  max-width: 130px;
  max-height: 56px;
  object-fit: contain;
}

.product-legal-card :deep(.manufacturer-company) {
  font-weight: 600;
}

.product-legal-card :deep(.manufacturer-missing-info) {
  color: #555866;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .product-legal-cards {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
