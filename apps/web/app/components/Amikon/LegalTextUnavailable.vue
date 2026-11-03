<template>
  <section
    role="status"
    :aria-busy="loading"
    class="rounded border p-5"
    :class="loading ? 'border-neutral-200 bg-neutral-50' : 'border-amber-300 bg-amber-50'"
  >
    <p v-if="loading" data-testid="legal-loading">{{ t('amikonLegalUnavailable.loading') }}</p>
    <template v-else>
      <h1>{{ t('amikonLegalUnavailable.title') }}</h1>
      <p>{{ t('amikonLegalUnavailable.description') }}</p>
      <p v-if="germanPath" class="mt-4">
        <NuxtLink :to="germanPath" class="underline" data-testid="legal-german-version">
          {{ t('amikonLegalUnavailable.germanVersion') }}
        </NuxtLink>
      </p>
      <p class="mt-4"><AmikonProtectedContact kind="email" /> · <AmikonProtectedContact kind="phone" /></p>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { LegalTextUnavailableProps } from './Amikon.types';

const props = defineProps<LegalTextUnavailableProps>();
const { locale, t } = useI18n();
const { loading } = useLegalInformation();
const localePath = useLocalizedPath();
const germanPath = computed(() =>
  props.fallbackPath && locale.value.split('-')[0] !== 'de' ? localePath(props.fallbackPath, 'de') : undefined,
);
</script>
