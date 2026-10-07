<template>
  <div :style="inlineStyle" data-testid="item-text-block">
    <div v-if="displayAsCollapsable">
      <UiAccordionItem
        v-if="text"
        v-model="initiallyCollapsed"
        summary-class="@md:rounded-md w-full hover:bg-neutral-100 py-2 flex justify-between items-center select-none"
        content-padding-class=""
        data-testid="item-text"
      >
        <template #summary>
          <h2 class="font-bold text-lg leading-6 @md:text-2xl">
            {{ title }}
          </h2>
        </template>
        <div
          v-if="text"
          data-testid="item-text-innertext"
          class="no-preflight [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
          v-html="text"
        />
      </UiAccordionItem>
      <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
    </div>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 @md:text-2xl">
        {{ title }}
      </h2>
      <div v-if="text" class="no-preflight [&>p:first-child]:mt-0 [&>p:last-child]:mb-0" v-html="text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ItemTextProps } from './types';
import { amikonProductLayoutKey } from '~/utils/amikonProductLayout';

const props = defineProps<ItemTextProps>();
const initiallyCollapsed = computed(() => !props.content?.layout.initiallyCollapsed);
const displayAsCollapsable = computed(() => props.content?.layout.displayAsCollapsable);
const { currentProduct } = useProducts();
const content = computed(() => props.content);
const { t } = useI18n();
const amikonLayout = inject(amikonProductLayoutKey, ref(false));
// Localize inherited standard headings, but preserve custom copy and Builder editing.
const title = computed(() => {
  const configured = content.value.text.title;
  const standardTitles = [
    'Item details',
    'Artikeldetails',
    'Détails de l’article',
    'Artikelgegevens',
    'defaultTemplate.product.itemText.title',
  ];
  return amikonLayout.value && standardTitles.includes(configured.trim()) ? t('product.details') : configured;
});
const text = computed(() => productGetters.getDescription(currentProduct.value));
const inlineStyle = computed(() => {
  const layout = props.content?.layout || {};
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});

const { registerBlockVisibility } = useBlocksVisibility();

watch(
  text,
  (newText) => {
    registerBlockVisibility(props.meta.uuid, newText?.length > 0);
  },
  { immediate: true },
);
</script>
