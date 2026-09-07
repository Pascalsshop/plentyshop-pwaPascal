<template>
  <section class="amikon-home-products" :aria-labelledby="`${kind}-heading`">
    <div class="amikon-products-heading">
      <h2 :id="`${kind}-heading`">{{ title }}</h2>
      <NuxtLink v-if="categoryPath" :to="localePath(categoryPath)">{{ labels.viewAll }}</NuxtLink>
    </div>

    <div v-if="status === 'pending' || status === 'idle'" :aria-label="labels.loading" aria-busy="true">
      <span class="sr-only" role="status">{{ labels.loading }}</span>
      <div class="amikon-product-skeletons" aria-hidden="true">
        <div v-for="index in 4" :key="index" class="animate-pulse rounded-lg bg-white p-3">
          <div class="aspect-square bg-neutral-200" />
          <div class="mt-4 h-12 bg-neutral-100" />
          <div class="mt-4 h-6 w-1/2 bg-neutral-200" />
        </div>
      </div>
    </div>
    <ProductSlider v-else-if="products.length" :items="products" appearance="amikon" />
    <div v-else class="amikon-products-message" role="status">
      <p>{{ error ? labels.error : labels.empty }}</p>
      <button v-if="error" type="button" class="mt-3 font-semibold text-amikon-600 underline" @click="refresh()">
        {{ labels.retry }}
      </button>
      <NuxtLink
        v-else
        :to="localePath(categoryPath || paths.search)"
        class="mt-3 inline-block text-amikon-600 underline"
      >
        {{ labels.viewAll }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';

const props = defineProps<{ kind: 'climate' | 'new'; title: string; categoryPath?: string }>();
const { locale } = useI18n();
const localePath = useLocalizedPath();
const sdk = useSdk();
const labels = computed(() =>
  locale.value === 'de'
    ? {
        viewAll: 'Alle ansehen',
        loading: 'Produkte werden geladen',
        error: 'Produkte konnten gerade nicht geladen werden.',
        empty: 'Aktuell sind hier keine Produkte verfügbar.',
        retry: 'Erneut versuchen',
      }
    : {
        viewAll: 'View all',
        loading: 'Loading products',
        error: 'Products could not be loaded right now.',
        empty: 'No products are currently available here.',
        retry: 'Try again',
      },
);

// Each section loads independently; language changes receive their own cache entry.
const {
  data: products,
  status,
  error,
  refresh,
} = await useAsyncData(
  computed(() => `amikon-home-${props.kind}-${locale.value}-${props.categoryPath || 'all'}`),
  async () => {
    const response = await sdk.plentysystems.getFacet({
      ...(props.categoryPath
        ? { type: 'category' as const, categoryUrlPath: props.categoryPath }
        : { type: 'all' as const }),
      itemsPerPage: 16,
      page: 1,
      sort: 'variation.createdAt_desc',
    });
    if (!Array.isArray(response.data?.products)) throw new Error('Invalid product response');
    return response.data.products.slice(0, 16);
  },
  { server: false, lazy: true, default: () => [] as Product[] },
);
</script>

<style scoped>
.amikon-home-products {
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 15px 32px;
}
.amikon-products-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.amikon-products-heading h2 {
  border-left: 4px solid #392f6e;
  padding-left: 8px;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  text-transform: uppercase;
}
.amikon-products-heading a {
  color: #392f6e;
  flex-shrink: 0;
}
.amikon-product-skeletons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
}
.amikon-products-message {
  padding: 32px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
@media (max-width: 991px) {
  .amikon-product-skeletons {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .amikon-product-skeletons > :nth-child(n + 4) {
    display: none;
  }
}
@media (max-width: 767px) {
  .amikon-products-heading h2 {
    font-size: 22px;
  }
  .amikon-product-skeletons {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .amikon-product-skeletons > :nth-child(n + 3) {
    display: none;
  }
}
@media (max-width: 479px) {
  .amikon-products-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .amikon-product-skeletons {
    grid-template-columns: minmax(0, 1fr);
  }
  .amikon-product-skeletons > :nth-child(n + 2) {
    display: none;
  }
}
</style>
