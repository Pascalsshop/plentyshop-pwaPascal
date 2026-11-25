<template>
  <dl v-if="specs.length" class="product-specs" aria-label="Technische Eckdaten" data-testid="amikon-product-specs">
    <div v-for="{ label, value } in specs" :key="label">
      <dt>{{ label }}</dt>
      <dd>{{ value }}</dd>
    </div>
  </dl>
  <nav v-if="detailLinks.length" class="product-detail-links" :aria-label="t('product.details')">
    <a v-for="{ label, href } in detailLinks" :key="href" :href="href">{{ t(label) }}</a>
  </nav>
</template>

<script setup lang="ts">
import { productGetters, type Block, type Product } from '@plentymarkets/shop-api';
import { getAmikonProductSpecs } from '~/utils/amikonProductSpecs';
import { hasAmikonRefrigerantService } from '~/utils/amikonRefrigerantNotice';
import { amikonProductSectionIdPrefix } from '~/utils/amikonProductLayout';

const props = defineProps<{ product: Product; blocks: Block[] }>();
const { data: categoryTree } = useCategoryTree();
const { locale, t } = useI18n();
const { itemId, variationId } = useProductAttributes();
const variationPending = computed(
  () =>
    itemId.value === props.product.item.id && variationId.value > 0 && variationId.value !== props.product.variation.id,
);
const specs = computed(() =>
  locale.value === 'de' && !variationPending.value ? getAmikonProductSpecs(props.product, categoryTree.value) : [],
);
const detailLinks = computed(() => {
  const { blocks, product } = props;
  const description = blocks.findIndex(({ name }) => name === 'ItemText');
  const data = blocks.findIndex(
    ({ name }) => name === 'ItemData' || (name === 'TechnicalData' && productGetters.getTechnicalData(product)),
  );
  const links = [];
  if (description >= 0 && productGetters.getDescription(product)) {
    links.push({ label: 'product.descriptionNav', href: '#' + amikonProductSectionIdPrefix + description });
  }
  if (data >= 0) links.push({ label: 'product.dataNav', href: '#' + amikonProductSectionIdPrefix + data });
  if (hasAmikonRefrigerantService(product, categoryTree.value)) {
    links.push({ label: 'amikonRefrigerant.title', href: '#amikon-refrigerant-notice' });
  }
  return links;
});
</script>

<style scoped>
.product-specs {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 16px;
  margin: 26px 0 0;
  border-block: 1px solid #e1e1e9;
  padding: 19px 0;
}

.product-specs div {
  min-width: 0;
  overflow-wrap: anywhere;
}

.product-specs div + div {
  border-inline-start: 1px solid #e1e1e9;
  padding-inline-start: clamp(8px, 3vw, 38px);
}

.product-specs dt {
  color: #555866;
  font-size: 14px;
}

.product-specs dd {
  margin: 3px 0 0;
  font-size: clamp(15px, 1.65vw, 22px);
  font-weight: 700;
}

.product-detail-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 clamp(14px, 3vw, 34px);
  margin-top: 12px;
  border-bottom: 1px solid #e1e1e9;
}

.product-detail-links a {
  padding: 10px 0;
  overflow-wrap: anywhere;
}

.product-detail-links a:hover {
  color: #392f6e;
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 420px) {
  .product-specs {
    gap: 7px;
  }
}
</style>
