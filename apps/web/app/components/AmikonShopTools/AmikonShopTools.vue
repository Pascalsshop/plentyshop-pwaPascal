<template>
  <div class="amikon-shop-tools" data-testid="shop-tools"><slot /></div>
</template>

<style scoped>
.amikon-shop-tools {
  display: contents;
}
@media (max-width: 767px) {
  /* Launchers live in the document flow, never on top of prices, text or the mobile menu. */
  .amikon-shop-tools:has([data-testid='cookie-bar-launcher'], [data-testid='preview-controls-toggle']) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 12px 16px;
    border-top: 1px solid #e5e7eb;
    background: #fff;
  }
  .amikon-shop-tools :deep([data-testid='cookie-bar-launcher']),
  .amikon-shop-tools :deep([data-testid='preview-controls-toggle']) {
    position: static;
    inset: auto;
    flex: 0 0 auto;
  }
  .amikon-shop-tools :deep([data-testid='cookie-bar-open-btn']),
  .amikon-shop-tools :deep([data-testid='preview-controls-toggle']) {
    min-width: 48px;
    min-height: 44px;
  }
  /* Only opened panels overlay the page, with bounded sizing on small screens. */
  .amikon-shop-tools :deep([data-testid='cookie-bar-panel']),
  .amikon-shop-tools :deep([data-testid='preview-controls-panel']) {
    left: 12px;
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    width: auto;
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 24px);
    box-sizing: border-box;
    overflow: auto;
  }
}
</style>
