<template>
  <div :class="enabled ? 'amikon-category' : 'contents'">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ enabled?: boolean }>(), { enabled: true });
</script>

<style scoped>
.amikon-category {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 15px 48px;
  color: #282d2f;
  background: #f7f7f9;
}
.amikon-category :deep(h1),
.amikon-category :deep(#category-headline) {
  font-size: 26px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 12px;
}
.amikon-category :deep([data-testid='category-grid']) {
  gap: 30px;
  align-items: stretch;
}
.amikon-category :deep([data-testid='product-card']) {
  min-width: 0;
  background: #fff;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
}
.amikon-category :deep([data-testid='product-card'] > div:last-child) {
  padding: 16px;
  border-top: 0;
}
.amikon-category :deep([data-testid='productcard-name']) {
  min-height: 5.4em;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.35;
  color: #212529;
  overflow-wrap: anywhere;
}
.amikon-category :deep([data-testid='category-tree']) {
  background: #eee;
  color: #282d2f;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
  padding: 16px 20px;
  border-radius: 6px 6px 0 0;
  margin-bottom: 0;
}
.amikon-category :deep(.category-tree) {
  background: white;
  border-radius: 6px;
  overflow: hidden;
}
.amikon-category :deep(select) {
  background: white;
  color: #282d2f;
  border-radius: 2px;
  font-size: 14px;
}
.amikon-category :deep([data-testid='category-sorting'] > div:first-child),
.amikon-category :deep([data-testid='category-items-per-page'] > div:first-child) {
  background: #eee;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
}
.amikon-category :deep(a:focus-visible),
.amikon-category :deep(button:focus-visible),
.amikon-category :deep(select:focus-visible) {
  outline-color: #392f6e;
}
@media (max-width: 767px) {
  .amikon-category {
    padding-top: 16px;
  }
  .amikon-category :deep([data-testid='category-grid']) {
    gap: 16px;
  }
  .amikon-category :deep([data-testid='productcard-name']) {
    font-size: 16px;
  }
  .amikon-category :deep(h1) {
    font-size: 23px;
  }
}
</style>
