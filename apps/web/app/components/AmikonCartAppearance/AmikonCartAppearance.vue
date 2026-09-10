<template>
  <div class="amikon-cart"><slot /></div>
</template>

<style scoped>
.amikon-cart {
  background: #f7f7f9;
  color: #282d2f;
  padding: 1px 15px 32px;
}
.amikon-cart :deep([data-testid='narrow-container']) {
  max-width: 1600px;
  padding-left: 0;
  padding-right: 0;
}
.amikon-cart :deep(h1) {
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  padding-left: 0;
}
.amikon-cart :deep([data-testid='cart-page-content']) {
  column-gap: 30px;
  row-gap: 24px;
}
.amikon-cart :deep([data-testid='cart-product-card']) {
  min-width: 0;
  padding: 20px;
  background: white;
  border: 0;
  border-bottom: 1px solid #e4e4e4;
}
.amikon-cart :deep([data-testid='cart-product-card'] > div:nth-child(2)) {
  min-width: 0;
}
.amikon-cart :deep([data-testid='cart-product-card'] > div:first-child) {
  flex-shrink: 0;
  width: 120px;
}
.amikon-cart :deep([data-testid='cart-product-card'] img) {
  aspect-ratio: 1;
  object-fit: contain;
  border: 0;
}
.amikon-cart :deep([data-testid='cart-product-card'] a) {
  color: #282d2f;
  overflow-wrap: anywhere;
}
.amikon-cart :deep([data-testid='order-summary']) {
  background: white;
  box-shadow: none;
  border: 0;
  border-radius: 0;
}
.amikon-cart :deep([data-testid='order-summary'] > div:first-child) {
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}
.amikon-cart :deep([data-testid='order-summary'] > div:first-child h2) {
  font-size: 22px;
  font-weight: 400;
  line-height: 1.3;
}
.amikon-cart :deep([data-testid='total']),
.amikon-cart :deep([data-testid='total-label']) {
  font-size: 20px;
}
.amikon-cart :deep([data-testid='checkout-button']) {
  background: #392f6e;
  color: white;
  border-radius: 4px;
}
.amikon-cart :deep([data-testid='checkout-button']:hover) {
  background: #2c2455;
}
.amikon-cart :deep(a:focus-visible),
.amikon-cart :deep(button:focus-visible),
.amikon-cart :deep(input:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .amikon-cart :deep(h1) {
    font-size: 24px;
  }
  .amikon-cart :deep([data-testid='cart-product-card']) {
    padding: 12px;
  }
  .amikon-cart :deep([data-testid='cart-product-card'] > div:first-child) {
    width: 72px;
  }
}
</style>
