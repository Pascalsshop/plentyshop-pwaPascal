<template>
  <div class="amikon-confirmation"><slot /></div>
</template>

<style scoped>
.amikon-confirmation {
  background: #f7f7f9;
  color: #282d2f;
  padding: 24px 15px 32px;
}
.amikon-confirmation :deep([data-testid='order-success-page']) {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0;
}
.amikon-confirmation :deep(.confirmation-intro) {
  max-width: 800px;
  padding: 16px 0 28px;
  overflow-wrap: anywhere;
}
.amikon-confirmation :deep([data-testid='success-header']) {
  color: #392f6e;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 16px;
}
.amikon-confirmation :deep(.confirmation-columns) {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  width: 100%;
  gap: 24px;
}
.amikon-confirmation :deep(.confirmation-columns > div) {
  min-width: 0;
}
.amikon-confirmation :deep(.confirmation-panel) {
  border: 0;
  border-radius: 0;
  background: white;
  padding: 24px;
  margin: 0 0 24px;
  overflow-wrap: anywhere;
}
.amikon-confirmation :deep(.text-primary-500),
.amikon-confirmation :deep(.text-primary-700) {
  color: #392f6e;
}
.amikon-confirmation :deep(#order-items) {
  background: white;
  margin: 0 0 24px;
  overflow-wrap: anywhere;
}
.amikon-confirmation :deep([data-testid='cart-product-card'] > div) {
  min-width: 0;
}
.amikon-confirmation :deep([data-testid='cart-product-card'] > a) {
  flex-shrink: 0;
  width: 100px;
}
.amikon-confirmation :deep(.confirmation-panel .grid),
.amikon-confirmation :deep([data-testid='cart-product-card'] .grid) {
  column-gap: 12px;
}
.amikon-confirmation :deep(.confirmation-panel .grid > *),
.amikon-confirmation :deep([data-testid='cart-product-card'] .grid > *) {
  min-width: 0;
}
.amikon-confirmation :deep(a:focus-visible),
.amikon-confirmation :deep(button:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .amikon-confirmation :deep([data-testid='success-header']) {
    font-size: 24px;
  }
  .amikon-confirmation :deep(.confirmation-columns) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .amikon-confirmation :deep(.confirmation-panel) {
    padding: 16px;
    margin-bottom: 16px;
  }
}
@media (max-width: 479px) {
  .amikon-confirmation :deep([data-testid='cart-product-card']) {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
