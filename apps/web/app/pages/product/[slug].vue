<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <AmikonProductAppearance modern>
      <EditableBlocks
        :identifier="'0'"
        :type="'product'"
        :block-id-prefix="amikonProductSectionIdPrefix"
        prevent-blocks-request
      >
        <template #after-block="{ block, blocks }">
          <template v-if="!shouldEnableEditorFeatures">
            <AmikonProductSpecs v-if="block === getOverviewBlock(blocks)" :product="product" :blocks="blocks" />
            <AmikonRefrigerantNotice v-if="block === getDetailsEndBlock(blocks)" :product="product" collapsible />
          </template>
        </template>
      </EditableBlocks>
    </AmikonProductAppearance>
    <UiReviewModal />
    <ProductLegalDetailsDrawer v-if="open" :product="product" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Product, ApiError, Block } from '@plentymarkets/shop-api';
import type { WatchStopHandle } from 'vue';
import { productGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import { amikonProductSectionIdPrefix } from '~/utils/amikonProductLayout';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const route = useRoute();
const { setCurrentProduct } = useProducts();
const { setBlocksListContext } = useBlocksList();
const { setProductMetaData, setProductRobotsMetaData, setProductCanonicalMetaData } = useStructuredData();
const localePath = useLocalizedPath();
const { productParams, productId } = createProductParams(route.params, route.path);
const { productForEditor, fetchProduct, setProductMeta, setBreadcrumbs, breadcrumbs } = useProduct(productId);
const product = productForEditor;
const { disableActions } = useEditor();
const { shouldEnableEditorFeatures } = useEditorState();
const { fetchProductReviews, fetchProductAuthenticatedReviews } = useProductReviews(Number(productId));
const { open } = useProductLegalDetailsDrawer();
const { setPageMeta } = usePageMeta();
const { resetNotification } = useEditModeNotification(disableActions);
const { isAuthorized } = useCustomer();
const { variationId } = useProductAttributes();
const { addLastSeen } = useLastSeen();
let variationWatchHandler: WatchStopHandle | undefined;

const getOverviewBlock = (blocks: Block[]) =>
  blocks.find(
    (block) =>
      block.name === 'PriceCard' ||
      (block.name === 'MultiGrid' &&
        Array.isArray(block.content) &&
        block.content.some(({ name }) => name === 'PriceCard')),
  );
const getDetailsEndBlock = (blocks: Block[]) =>
  blocks.findLast(({ name }) => ['ItemText', 'ItemData', 'TechnicalData', 'ProductLegalInformation'].includes(name)) ??
  getOverviewBlock(blocks);

definePageMeta({
  layout: false,
  path: '/:slug*:sep(/a-|_):itemId',
  validate: async (route) => {
    return validateProductParams(route.params, route.path);
  },
  type: 'product',
  isBlockified: true,
  identifier: 0,
  cacheControl: getCacheControl(),
});

const showRecommended = ref(false);
const recommendedSection = ref<HTMLElement | null>(null);
const productName = computed(() => productGetters.getName(product.value));
const icon = 'sell';
setPageMeta(productName.value, icon);

await fetchProduct(productParams).then(() => {
  usePlentyEvent().emit('frontend:productLoaded', {
    product: product.value,
  });
});

if (Object.keys(product.value).length === 0) {
  if (import.meta.client) showError({ statusCode: 404, statusMessage: 'Product not found' });

  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

setCurrentProduct(productForEditor.value || ({} as Product));
setProductMeta();
setBlocksListContext('product');
setBreadcrumbs();
addLastSeen(product.value);

async function fetchReviews() {
  const productVariationId = productGetters.getVariationId(product.value);
  await fetchProductReviews(Number(productId), productVariationId);
  if (isAuthorized.value) {
    await fetchProductAuthenticatedReviews(Number(productId), productVariationId);
  }
}
await fetchReviews();

watch(
  disableActions,
  () => {
    setCurrentProduct(productForEditor.value || ({} as Product));
  },
  { immediate: true },
);

/* TODO: This should only be temporary.
 *  It changes the url of the product page while on the page and switching the locale.
 *  Should be removed when the item search is refactored.
 */
watch(
  () => product.value.texts.urlPath,
  (value, oldValue) => {
    if (value !== oldValue) {
      navigateTo({
        path: localePath(`/${productGetters.getUrlPath(product.value)}_${productGetters.getItemId(product.value)}`),
        query: route.query,
        replace: true,
      });
    }
  },
);

watch(
  () => product.value,
  () => {
    setProductCanonicalMetaData(product.value);
    setProductMetaData(product.value);
    setProductRobotsMetaData(product.value);
  },
  { immediate: true },
);

watch(
  () => route.params,
  () => {
    const productName = computed(() => productGetters.getName(product.value));
    const icon = 'sell';
    setPageMeta(productName.value, icon);
  },
  { immediate: true },
);

const observeRecommendedSection = () => {
  if (import.meta.client && recommendedSection.value) {
    const observer = new globalThis.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          showRecommended.value = true;
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 250px 0px',
      },
    );
    observer.observe(recommendedSection.value);
  }
};

async function handleVariationChange() {
  if (Number(productParams.variationId) !== variationId.value && variationId.value > 0) {
    try {
      productParams.variationId = variationId.value;
      await fetchProduct(productParams);
      setCurrentProduct(productForEditor.value || ({} as Product));
      await fetchReviews();
      setProductMetaData(product.value);
    } catch (error) {
      useHandleError(error as ApiError);
    }
  }
}

onBeforeRouteLeave(() => {
  resetNotification();
  if (variationWatchHandler) {
    variationWatchHandler();
  }
});

onNuxtReady(() => {
  observeRecommendedSection();

  if (useCallisto().isEnabled) {
    variationWatchHandler = watch(variationId, handleVariationChange);
  }
});
</script>
