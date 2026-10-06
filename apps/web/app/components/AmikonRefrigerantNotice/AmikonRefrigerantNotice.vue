<template>
  <section v-if="visible" id="amikon-refrigerant-notice" class="refrigerant-notice" data-testid="refrigerant-notice">
    <h2>{{ t('amikonRefrigerant.title') }}</h2>
    <div class="notice-content">
      <p>{{ t('amikonRefrigerant.intro') }}</p>
      <ul>
        <li v-for="step in steps" :key="step">{{ t(`amikonRefrigerant.${step}`) }}</li>
      </ul>
      <NuxtLink :to="localePath('/contact')" class="contact-link">{{ t('amikonRefrigerant.contact') }}</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import { hasAmikonRefrigerantService } from '~/utils/amikonRefrigerantNotice';
import { amikonProductLayoutKey } from '~/utils/amikonProductLayout';

const props = defineProps<{ product: Product }>();
const { t } = useI18n();
const localePath = useLocalePath();
const { data: categoryTree } = useCategoryTree();
const amikonLayout = inject(amikonProductLayoutKey, ref(false));
const visible = computed(() => amikonLayout.value && hasAmikonRefrigerantService(props.product, categoryTree.value));
const steps = ['recovery', 'components', 'refilling', 'adjustment', 'leakTest', 'testRun'] as const;
</script>

<style scoped>
.refrigerant-notice {
  margin: 32px 0 0;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
h2 {
  margin: 0;
  padding: 10px 7px;
  background: #28a745;
  color: #fff;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
}
.notice-content {
  padding-top: 14px;
}
ul {
  list-style: disc;
  padding-left: 24px;
  margin: 28px 0 16px;
}
li + li {
  margin-top: 4px;
}
.contact-link {
  display: inline-block;
  padding: 4px 0;
  color: #392f6e;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.contact-link:focus-visible {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  h2 {
    font-size: 20px;
  }
}
</style>
