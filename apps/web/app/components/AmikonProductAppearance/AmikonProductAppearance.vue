<template>
  <div class="amikon-product"><slot /></div>
</template>

<style scoped>
.amikon-product {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 15px 48px;
  background: #f7f7f9;
  color: #282d2f;
}
.amikon-product :deep([data-testid='product-name']) {
  border-left: 4px solid #392f6e;
  padding-left: 8px;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.amikon-product :deep([data-testid='purchase-card']) {
  box-shadow: none;
  border: 0;
}
.amikon-product :deep([data-testid='product-variation-number']) {
  padding-top: 16px;
  border-top: 1px solid #ddd;
  color: #62686a;
}
.amikon-product :deep([data-testid='add-to-cart']:not(:disabled)) {
  background: #392f6e;
  color: white;
}
.amikon-product :deep([data-testid='add-to-cart']:not(:disabled):hover) {
  background: #2c2455;
}
.amikon-product :deep([data-testid='gallery-images']) {
  border-radius: 4px;
}
.amikon-product :deep([data-testid='item-text-block']),
.amikon-product :deep([data-testid='item-data-block']) {
  margin-top: 24px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.amikon-product :deep([data-testid='item-text-block'] h2),
.amikon-product :deep([data-testid='item-data-block'] h2) {
  font-size: 22px;
  font-weight: 400;
  color: #392f6e;
  margin-bottom: 16px;
}
.amikon-product :deep(button:focus-visible),
.amikon-product :deep(a:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .amikon-product {
    padding-top: 16px;
  }
  .amikon-product :deep([data-testid='product-name']) {
    font-size: 23px;
  }
}
</style>
