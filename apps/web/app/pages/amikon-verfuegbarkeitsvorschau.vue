<template>
  <AmikonCategoryAppearance>
    <h1>Artikelkästen: Verfügbarkeit, Preis und Hinzufügen</h1>
    <p class="mb-6">
      Lokale Darstellung mit Testartikeln und Beispielpreisen. Alle Artikel-Aktionen sind in dieser Vorschau gesperrt.
    </p>
    <div
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      data-testid="availability-preview"
      @click.capture.stop.prevent
    >
      <UiProductCard
        v-for="product in products"
        :key="product.variation.id"
        :product="product"
        :configuration="configuration"
      />
    </div>
  </AmikonCategoryAppearance>
</template>

<script setup lang="ts">
import { ProductMock } from '../../__tests__/__mocks__/product.mock';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';

if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
const configuration: ItemGridContent = {
  cardBorders: true,
  contentAlignment: 'left',
  fields: { title: true, rating: false, previewText: false, price: true, addToCart: true, manufacturer: false },
  fieldsOrder: ['title', 'price', 'addToCart'],
  fieldsDisabled: [],
  showWishlistButton: false,
  showSecondImageOnHover: false,
  addToCartStyle: 'primary',
  itemsPerRowDesktop: 4,
  itemsPerRowTablet: 2,
  itemsPerRowMobile: 1,
  showItemCount: false,
  itemCountPosition: 'center',
  paginationPosition: 'bottom',
  layout: { fullWidth: false },
};
const products = [
  {
    title: 'Testartikel: Klimaprüfschrank mit Temperatur- und Feuchteregelung',
    id: 1,
    name: 'Der Artikel ist sofort verfügbar',
  },
  {
    title: 'Testartikel: Industrie-Roboter mit Steuereinheit',
    id: 5,
    name: 'Der Artikel ist leider nicht mehr verfügbar',
  },
  {
    title: 'Testartikel: Klimakammer mit längerem Verfügbarkeitstext',
    id: 1,
    name: 'Sofort verfügbar – Versand nach Terminabsprache',
  },
  { title: 'Testartikel ohne Verfügbarkeitsangabe', id: 1, name: '' },
].map((example, index) => {
  const product = deepClone(ProductMock);
  product.item.id = 940000 + index;
  product.variation.id = 940000 + index;
  product.texts.name1 = example.title;
  product.variation.availability.id = example.id;
  product.variation.availability.names.name = example.name;
  product.filter.isSalable = example.id !== 5;
  product.filter.isSalableAndActive = example.id !== 5;
  const image = product.images.all[0]!;
  image.url = '/_nuxt-plenty/images/amikon/home/category-climate.jpg';
  image.urlMiddle = image.url;
  image.urlPreview = image.url;
  image.urlSecondPreview = image.url;
  return product;
});
</script>
