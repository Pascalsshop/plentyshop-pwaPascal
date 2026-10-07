<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <aside class="mobile-preview-note">
      <strong>Lokale Mobilvorschau – Beispieldaten</strong>
      <p>Die echten Kategoriebausteine und Produktkarten. Artikelaktionen sind gesperrt.</p>
      <NuxtLink :to="localePath('/amikon-artikelvorschau')">Zur Artikelvorschau</NuxtLink>
    </aside>
    <AmikonCategoryAppearance>
      <div @click.capture="preventPurchase" @submit.capture.stop.prevent>
        <EditableBlocks :blocks="blocks" read-only :has-enabled-actions="false" prevent-blocks-request />
      </div>
    </AmikonCategoryAppearance>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ProductMock } from '../../__tests__/__mocks__/product.mock';
import { CategoryMock } from '../../__tests__/__mocks__/category.mock';
import { createCategory } from '~/utils/blockTemplates/category';
import type { UseProductsState } from '~/composables/useProducts/types';
import type { Facet } from '@plentymarkets/shop-api';

if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ layout: false, skipBlocksFetch: true });
const localePath = useLocalePath();
const breadcrumbs = [
  { name: 'Startseite', link: '/' },
  { name: 'Wärme-Klimaschränke (Test)', link: '/amikon-mobilvorschau' },
];
useProducts();
const catalog = useState<UseProductsState>('useProducts');
const previousData = catalog.value.data;
const category = deepClone(CategoryMock);
category.details[0]!.name = 'Wärme-Klimaschränke';
const products = [false, true, false].map((sold, index) => {
  const product = deepClone(ProductMock);
  product.item.id = 960000 + index;
  product.variation.id = 960000 + index;
  product.texts.name1 = sold
    ? 'Testartikel: Verkaufte Klimakammer'
    : 'Testartikel: Klimaprüfschrank mit Feuchteregelung';
  product.filter.isSalable = !sold;
  product.filter.isSalableAndActive = !sold;
  product.variation.availability.id = sold ? 5 : 1;
  product.variation.availabilityId = product.variation.availability.id;
  product.variation.availability.names.name = sold
    ? 'Der Artikel ist schon verkauft'
    : 'Der Artikel ist sofort verfügbar';
  product.variationAttributeMap.variations[0]!.variationId = product.variation.id;
  product.variationAttributeMap.variations[0]!.isSalable = !sold;
  const image = product.images.all[0]!;
  image.url = '/_nuxt-plenty/images/amikon/home/category-climate.jpg';
  image.urlMiddle = image.url;
  image.urlPreview = image.url;
  image.urlSecondPreview = image.url;
  return product;
});
catalog.value.data = {
  category,
  products,
  facets: [],
  pagination: { totals: products.length, perPageOptions: [20, 50] },
  breadcrumbs: [],
  languageUrls: { 'x-default': '' },
} as Facet;
onBeforeUnmount(() => {
  catalog.value.data = previousData;
});
const blocks = createCategory();
blocks.forEach((block, index) => {
  block.meta.uuid = `mobile-preview-${index}`;
  if (Array.isArray(block.content)) {
    block.content.forEach((child, childIndex) => {
      child.meta.uuid = `mobile-preview-${index}-${childIndex}`;
    });
  }
});
function preventPurchase(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('[data-testid="product-card"]')) {
    event.preventDefault();
    event.stopPropagation();
  }
}
</script>

<style scoped>
.mobile-preview-note {
  margin: 12px 15px;
  padding: 12px;
  background: #fffbed;
  border: 1px solid #e0c364;
  font-size: 14px;
  line-height: 1.5;
}
.mobile-preview-note a {
  color: #392f6e;
  text-decoration: underline;
}
</style>
