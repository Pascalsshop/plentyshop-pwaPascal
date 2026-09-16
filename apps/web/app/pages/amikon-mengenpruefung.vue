<template>
  <main class="p-6">
    <h1 class="mb-4 text-2xl">Lokaler Funktionstest: Mengenfeld</h1>
    <p class="mb-4">Original-Shopkomponente mit Testgrenzen 1–5. Keine Backend-Anfragen oder Bestellungen.</p>
    <UiQuantitySelector :value="2" :min-value="1" :max-value="5" @change-quantity="recordQuantity" />
    <p role="status" data-testid="quantity-events">{{ quantities.join(',') }}</p>
  </main>
</template>

<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ skipBlocksFetch: true });
const quantities = ref<number[]>([]);
const recordQuantity = (quantity: number) => quantities.value.push(quantity);
</script>
