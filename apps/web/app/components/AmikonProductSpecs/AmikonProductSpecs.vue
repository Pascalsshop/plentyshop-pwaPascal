<template>
  <dl v-if="specs.length" class="product-specs" aria-label="Technische Eckdaten" data-testid="amikon-product-specs">
    <div v-for="{ label, value } in specs" :key="label">
      <dt>{{ label }}</dt>
      <dd>{{ value }}</dd>
    </div>
  </dl>
  <nav v-if="detailLinks.length" class="product-detail-links" :aria-label="t('product.details')">
    <a
      v-for="{ label, href } in detailLinks"
      :key="href"
      :href="href"
      :aria-current="href === activeLink ? 'location' : undefined"
    >
      {{ t(label) }}
    </a>
  </nav>
</template>

<script setup lang="ts">
import { productGetters, type Block, type Product } from '@plentymarkets/shop-api';
import { useEventListener } from '@vueuse/core';
import { getAmikonProductSpecs } from '~/utils/amikonProductSpecs';
import { hasAmikonRefrigerantService } from '~/utils/amikonRefrigerantNotice';
import { amikonProductSectionIdPrefix } from '~/utils/amikonProductLayout';
import { hasInlineTechnicalData, inlineTechnicalDataId } from '~/utils/amikonProductPresentation';

const props = defineProps<{ product: Product; blocks: Block[] }>();
const { data: categoryTree } = useCategoryTree();
const { locale, t } = useI18n();
const { itemId, variationId } = useProductAttributes();
const route = useRoute();
const currentAnchor = ref('');
onMounted(() => {
  currentAnchor.value = window.location.hash;
});
useEventListener('hashchange', () => {
  currentAnchor.value = window.location.hash;
});
watch(
  () => route.path,
  () => {
    currentAnchor.value = route.hash;
  },
);
const variationPending = computed(
  () =>
    itemId.value === props.product.item.id && variationId.value > 0 && variationId.value !== props.product.variation.id,
);
const specs = computed(() =>
  locale.value === 'de' && !variationPending.value ? getAmikonProductSpecs(props.product, categoryTree.value) : [],
);
const description = computed(() => productGetters.getDescription(props.product));
const descriptionIndex = computed(() => props.blocks.findIndex(({ name }) => name === 'ItemText'));
const detailLinks = computed(() => {
  const { blocks, product } = props;
  const data = blocks.findIndex(({ name }) => name === 'TechnicalData' && productGetters.getTechnicalData(product));
  const itemData = blocks.findIndex(({ name }) => name === 'ItemData');
  const legalInfo = blocks.findIndex(({ name }) => name === 'ProductLegalInformation');
  const links = [];
  if (descriptionIndex.value >= 0 && description.value) {
    links.push({
      label: 'product.descriptionNav',
      href: '#' + amikonProductSectionIdPrefix + descriptionIndex.value,
    });
  }
  if (data >= 0) {
    links.push({ label: 'product.dataNav', href: '#' + amikonProductSectionIdPrefix + data });
  } else if (descriptionIndex.value >= 0 && hasInlineTechnicalData(description.value)) {
    links.push({ label: 'product.dataNav', href: '#' + inlineTechnicalDataId });
  } else if (itemData >= 0) {
    links.push({ label: 'product.dataNav', href: '#' + amikonProductSectionIdPrefix + itemData });
  }
  if (hasAmikonRefrigerantService(product, categoryTree.value)) {
    links.push({ label: 'amikonRefrigerant.title', href: '#amikon-refrigerant-notice' });
  }
  if (legalInfo >= 0) {
    links.push({ label: 'product.legalDetails', href: '#' + amikonProductSectionIdPrefix + legalInfo });
  }
  return links;
});
const activeLink = computed(
  () => detailLinks.value.find(({ href }) => href === currentAnchor.value)?.href ?? detailLinks.value[0]?.href,
);
</script>

<style scoped>
.product-specs {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 16px;
  margin: 22px 0 0;
  border-block: 1px solid #e1e1e9;
  padding: 18px clamp(0px, 1.2vw, 18px);
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
  font-size: clamp(13px, 1.2vw, 17px);
}

.product-specs dd {
  margin: 3px 0 0;
  font-size: clamp(15px, 1.7vw, 24px);
  font-weight: 700;
}

.product-detail-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 clamp(4px, 1.8vw, 24px);
  margin-top: 15px;
  border-bottom: 1px solid #e1e1e9;
}

.product-detail-links a {
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  padding: 12px clamp(6px, 1.3vw, 20px);
  font-size: clamp(14px, 1.35vw, 19px);
  overflow-wrap: anywhere;
}

.product-detail-links a[aria-current='location'] {
  border-color: #392f6e;
  color: #392f6e;
  font-weight: 700;
}

.product-detail-links a:hover {
  color: #392f6e;
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 420px) {
  .product-specs {
    gap: 7px;
    padding-inline: 0;
  }
}
</style>
