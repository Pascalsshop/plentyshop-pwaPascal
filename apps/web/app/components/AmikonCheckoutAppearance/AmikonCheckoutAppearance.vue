<template>
  <div class="amikon-checkout"><slot /></div>
</template>

<style scoped>
.amikon-checkout {
  background: #f7f7f9;
  color: #282d2f;
  padding: 1px 15px 32px;
}
.amikon-checkout :deep([data-testid='narrow-container']) {
  max-width: 1600px;
  padding-left: 0;
  padding-right: 0;
}
.amikon-checkout :deep(h1) {
  font-size: 28px;
  font-weight: 400;
  line-height: 1.3;
  padding-left: 0;
}
.amikon-checkout :deep([data-testid='contact-information']),
.amikon-checkout :deep([data-testid='checkout-address']),
.amikon-checkout :deep([data-testid='shipping-method']),
.amikon-checkout :deep([data-testid='checkout-payment']) {
  background: white;
  padding: 24px;
  margin: 0 0 20px;
  min-width: 0;
}
.amikon-checkout :deep([data-testid='contact-information'] h2),
.amikon-checkout :deep([data-testid='checkout-address'] h2),
.amikon-checkout :deep([data-testid='shipping-method'] h3),
.amikon-checkout :deep([data-testid='checkout-payment'] legend) {
  font-size: 21px;
  font-weight: 400;
  line-height: 1.3;
  color: #392f6e;
}
.amikon-checkout :deep([data-testid='checkout-payment'] legend) {
  float: left;
  width: 100%;
}
.amikon-checkout :deep([data-testid='checkout-payment'] legend + *) {
  clear: both;
}
.amikon-checkout :deep(input),
.amikon-checkout :deep(select) {
  accent-color: #392f6e;
}
.amikon-checkout :deep([data-testid='checkout-payment'] input:checked + span) {
  outline-color: #392f6e;
}
.amikon-checkout :deep([data-testid='shipping-method'] label:has(input:checked:not(:disabled))),
.amikon-checkout :deep([data-testid='checkout-payment'] label:has(> input:checked:not(:disabled))) {
  border-color: #392f6e;
  background: #f2effa;
}
.amikon-checkout :deep([data-testid='checkout-payment'] input:checked:not(:disabled) + span) {
  background: #f2effa;
  border-color: #392f6e;
}
.amikon-checkout :deep([data-testid='save-address']:not(:disabled)) {
  background: #392f6e;
  color: white;
}
.amikon-checkout :deep([data-testid='order-summary']) {
  background: white;
  box-shadow: none;
  border: 0;
}
.amikon-checkout :deep([data-testid='order-summary'] > div:first-child) {
  flex-wrap: wrap;
  gap: 8px;
}
.amikon-checkout :deep([data-testid='order-summary'] > div:first-child h2) {
  font-size: 22px;
  font-weight: 400;
}
.amikon-checkout :deep([data-testid='cart-product-card']) {
  min-width: 0;
  background: white;
}
.amikon-checkout :deep([data-testid='cart-product-card'] > div:nth-child(2)) {
  min-width: 0;
}
.amikon-checkout :deep([data-testid='cart-product-card'] a) {
  overflow-wrap: anywhere;
}
.amikon-checkout :deep(input:focus-visible),
.amikon-checkout :deep(select:focus-visible),
.amikon-checkout :deep(button:focus-visible),
.amikon-checkout :deep(a:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .amikon-checkout :deep(h1) {
    font-size: 24px;
  }
  .amikon-checkout :deep([data-testid='contact-information']),
  .amikon-checkout :deep([data-testid='checkout-address']),
  .amikon-checkout :deep([data-testid='shipping-method']),
  .amikon-checkout :deep([data-testid='checkout-payment']) {
    padding: 16px;
  }
}
</style>
