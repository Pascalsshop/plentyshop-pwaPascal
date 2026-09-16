<template>
  <div :class="enabled ? 'amikon-information' : 'contents'">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ enabled?: boolean }>(), { enabled: true });
</script>

<style scoped>
.amikon-information {
  width: 100%;
  max-width: 1080px;
  margin: 24px auto 48px;
  padding: clamp(20px, 4vw, 48px);
  border: 1px solid #e5e5ec;
  border-top: 3px solid #392f6e;
  border-radius: 6px;
  background: #fff;
  color: #282d2f;
  line-height: 1.75;
  overflow-wrap: anywhere;
  min-width: 0;
}
.amikon-information :deep(h1) {
  margin: 0 0 28px;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.25;
  font-weight: 500;
  color: #392f6e;
}
.amikon-information :deep(h2) {
  margin: 32px 0 14px;
  font-size: 23px;
  line-height: 1.4;
  font-weight: 600;
  color: #392f6e;
}
.amikon-information :deep(h3),
.amikon-information :deep(h4) {
  margin: 26px 0 12px;
  font-size: 19px;
  line-height: 1.4;
  font-weight: 600;
  color: #392f6e;
}
.amikon-information :deep(p) {
  margin: 0 0 18px;
}
.amikon-information :deep(ul),
.amikon-information :deep(ol) {
  margin: 12px 0 22px;
  padding-inline-start: 26px;
}
.amikon-information :deep(ul) {
  list-style: disc;
}
.amikon-information :deep(ol) {
  list-style: decimal;
}
.amikon-information :deep(li) {
  margin-block: 7px;
}
.amikon-information :deep(a:not([role='button'])) {
  color: #392f6e;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.amikon-information :deep(a:focus-visible),
.amikon-information :deep(button:focus-visible) {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
.amikon-information :deep(img) {
  max-width: 100%;
  height: auto;
}
.amikon-information :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
}
.amikon-information :deep(th),
.amikon-information :deep(td) {
  padding: 10px 14px;
  border: 1px solid #e5e5ec;
  text-align: start;
}
.amikon-information :deep(th) {
  background: #f7f7f9;
}
.amikon-information :deep(address) {
  font-style: normal;
}
.amikon-information :deep(textarea) {
  min-height: 160px;
}
@media (max-width: 767px) {
  .amikon-information {
    margin: 16px auto 28px;
    padding: 20px 16px;
  }
  .amikon-information :deep(h2) {
    font-size: 21px;
  }
}
@media print {
  .amikon-information {
    border: 0;
    padding: 0;
    max-width: none;
  }
}
</style>
