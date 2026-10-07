<template>
  <NuxtLayout name="default" :breadcrumbs="previewBreadcrumbs">
    <AmikonProductAppearance>
      <aside class="preview-note">
        <strong>Lokale Artikelvorschau – nur Beispieldaten.</strong>
        Die Galerie und die Artikelbausteine sind die echten Shop-Komponenten. Es werden keine Bestellungen ausgeführt.
        <div class="mt-2 flex gap-4 flex-wrap">
          <NuxtLink :to="localePath('/amikon-artikelvorschau')">Verfügbarer Testartikel</NuxtLink>
          <NuxtLink :to="localePath('/amikon-artikelvorschau') + '?sold=1'">Verkaufter Testartikel</NuxtLink>
        </div>
      </aside>
      <div @click.capture="preventPurchase" @submit.capture.stop.prevent>
        <EditableBlocks :blocks="blocks" read-only :has-enabled-actions="false" prevent-blocks-request />
      </div>
    </AmikonProductAppearance>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ProductMock } from '../../__tests__/__mocks__/product.mock';
import { createProduct } from '~/utils/blockTemplates/product/factory';
import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';

if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
// Use the same nested layout and breadcrumb component as the real product page.
definePageMeta({ layout: false, skipBlocksFetch: true });
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const previewBreadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: '/' },
  { name: 'Testartikel: Klimaprüfschrank', link: '/amikon-artikelvorschau' },
]);
const { currentProduct, setCurrentProduct } = useProducts();
const previousProduct = currentProduct.value;
const example = deepClone(ProductMock);
example.defaultCategories[0]!.id = 48;
example.defaultCategories[0]!.name = 'Wärme-Klimaschränke';
example.item.id = 950000;
example.variation.id = 950000;
example.variation.number = 'TEST-A-12345';
example.variationAttributeMap.variations[0]!.variationId = example.variation.id;
example.unit.unitOfMeasurement = 'C62';
example.unit.content = 1;
example.item.condition.names.name = 'Gebraucht';
example.texts.name1 = 'Testartikel: Klimaprüfschrank';
example.texts.shortDescription =
  'Beispielartikel aus der gebrauchten Industrietechnik. Preis und Angaben sind Testdaten.';
example.texts.description =
  '<p>Diese Beschreibung dient nur der Layoutprüfung. Im Shop erscheint hier die hinterlegte Artikelbeschreibung.</p>';
example.texts.technicalData =
  route.query.full === '1'
    ? ''
    : '<p>Ausstattung und Lieferumfang werden im Shop aus den Artikeldaten übernommen. Hier werden keine technischen Eigenschaften zugesichert.</p>';
example.variation.mayShowUnitPrice = false;
const previewImage = example.images.all[0]!;
previewImage.url = '/_nuxt-plenty/images/amikon/home/category-climate.jpg';
previewImage.urlMiddle = previewImage.url;
previewImage.urlPreview = previewImage.url;
previewImage.urlSecondPreview = previewImage.url;
previewImage.cleanImageName = 'Testbild Klimaprüfschrank (Vorschau)';
// Repeat the existing example image to exercise the real thumbnail rail, without inventing product photos.
example.images.all = [0, 1, 2].map((position) => ({ ...deepClone(previewImage), position }));
// Public photos from the deployed Weiss article help test cached images and the seven-image gallery.
// Only photos are reused; this page still contains clearly marked sample product data.
if (route.query.gallery === 'weiss') {
  example.images.all = ['DSC06081', 'DSC06084', 'DSC06082', 'DSC06085', 'DSC06086', 'DSC06087', 'DSC06088'].map(
    (filename, position) => {
      const baseUrl = 'https://cdn02.plentyone.com/7ukspn3affoc/item/images/25667';
      return {
        ...deepClone(previewImage),
        position,
        width: 1600,
        height: 1200,
        url: `${baseUrl}/full/${filename}.jpg`,
        urlMiddle: `${baseUrl}/middle/${filename}.jpg`,
        urlPreview: `${baseUrl}/preview/${filename}.jpg`,
        urlSecondPreview: `${baseUrl}/secondPreview/${filename}.jpg`,
        cleanImageName: `${filename}.jpg`,
      };
    },
  );
}

watch(
  () => route.query.sold,
  (sold) => {
    const product = deepClone(example);
    product.variation.availability.id = sold === '1' ? 5 : 1;
    product.variation.availabilityId = product.variation.availability.id;
    product.variation.availability.names.name =
      sold === '1' ? 'Der Artikel ist leider nicht mehr verfügbar' : 'Der Artikel ist sofort verfügbar';
    product.filter.isSalable = sold !== '1';
    product.filter.isSalableAndActive = sold !== '1';
    product.variationAttributeMap.variations[0]!.isSalable = sold !== '1';
    setCurrentProduct(product);
  },
  { immediate: true },
);
onBeforeUnmount(() => setCurrentProduct(previousProduct));

// Optional full template reproduces asynchronous blocks and empty technical data on real item pages.
const blocks = createProduct().filter(
  (block) => route.query.full === '1' || ['MultiGrid', 'ItemText', 'TechnicalData'].includes(block.name),
);
// Stable preview IDs on server and client; the factory's random IDs must not cause hydration mismatches.
blocks.forEach((block, index) => {
  block.meta.uuid = `amikon-product-preview-${index}`;
  if (Array.isArray(block.content)) {
    block.content.forEach((child, childIndex) => {
      child.meta.uuid = `amikon-product-preview-${index}-${childIndex}`;
    });
  }
});
const overview = blocks[0]!;
if (Array.isArray(overview.content)) {
  const priceCard = overview.content.find((block) => block.name === 'PriceCard');
  if (priceCard) {
    const config = priceCard.content as PriceCardContent;
    Object.keys(config.fields).forEach((field) => {
      config.fields[field as keyof typeof config.fields] = false;
    });
    Object.assign(config.fields, {
      itemName: true,
      variationNumber: true,
      previewText: true,
      price: true,
      availability: true,
      quantityAndAddToCart: true,
      addToWishlist: true,
    });
    config.fieldsOrder = [
      'itemName',
      'variationNumber',
      'price',
      'availability',
      'previewText',
      'quantityAndAddToCart',
      'addToWishlist',
    ];
  }
}

function preventPurchase(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('[data-testid="purchase-card"]')) {
    event.preventDefault();
    event.stopPropagation();
  }
}
</script>

<style scoped>
.preview-note {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e0c364;
  background: #fffbed;
  line-height: 1.5;
}
.preview-note a {
  color: #392f6e;
  text-decoration: underline;
}
</style>
