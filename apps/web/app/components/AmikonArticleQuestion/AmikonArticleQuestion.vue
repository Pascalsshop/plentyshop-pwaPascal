<template>
  <NuxtLink class="amikon-article-contact" :to="localePath(paths.contact)">
    <SfIconEmail size="sm" aria-hidden="true" />
    {{ t('product.articleContact') }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { SfIconEmail } from '@storefront-ui/vue';

const { t } = useI18n();
const localePath = useLocalizedPath();
</script>
