<template>
  <div>
    <UiSimplifiedHeader />
    <main>
      <slot />
    </main>
    <AmikonShopTools>
      <Cookiebar />
      <PreviewMode />
    </AmikonShopTools>
    <UiFooterBlocks />
  </div>
</template>

<script setup lang="ts">
usePageTitle();
useStructuredData().setLogoMeta();
</script>
