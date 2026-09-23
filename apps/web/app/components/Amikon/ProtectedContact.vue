<template>
  <span class="amikon-protected-contact">
    <a v-if="contact" :href="contact.href" class="underline">{{ contact.label }}</a>
    <button
      v-else
      type="button"
      :disabled="pending"
      :aria-busy="pending"
      class="contact-reveal underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      @click="reveal"
    >
      {{ pending ? labels.loading : labels[kind] }}
    </button>
    <span v-if="failed" role="status" class="block text-sm">{{ labels.error }}</span>
    <span class="sr-only" aria-live="polite">{{ contact ? contact.label : '' }}</span>
  </span>
</template>

<script setup lang="ts">
import { $fetch } from 'ofetch';

const props = defineProps<{ kind: 'email' | 'phone' }>();
const { locale } = useI18n();
const contact = ref<{ href: string; label: string }>();
const pending = ref(false);
const failed = ref(false);
const copy = {
  de: {
    email: 'E-Mail anzeigen',
    phone: 'Telefonnummer anzeigen',
    loading: 'Wird geladen …',
    error: 'Laden fehlgeschlagen. Bitte erneut anklicken.',
    contact: 'Kontakt',
  },
  en: {
    email: 'Show email',
    phone: 'Show phone number',
    loading: 'Loading …',
    error: 'Unable to load. Please click again.',
    contact: 'Contact',
  },
  fr: {
    email: 'Afficher l’adresse e-mail',
    phone: 'Afficher le numéro de téléphone',
    loading: 'Chargement …',
    error: 'Échec du chargement. Cliquez à nouveau.',
    contact: 'Contact',
  },
  nl: {
    email: 'E-mailadres tonen',
    phone: 'Telefoonnummer tonen',
    loading: 'Laden …',
    error: 'Laden mislukt. Klik opnieuw.',
    contact: 'Contact',
  },
};
const labels = computed(() => copy[locale.value.split('-')[0] as keyof typeof copy] ?? copy.de);

// Deliberately not useAsyncData/useState: no contact data in SSR HTML or hydration payload.
const reveal = async () => {
  if (pending.value || contact.value) return;
  pending.value = true;
  failed.value = false;
  try {
    contact.value = await $fetch<{ href: string; label: string }>('/api/amikon/contact-details', {
      method: 'POST',
      headers: { 'X-Amikon-Contact': 'reveal' },
      body: { kind: props.kind },
      retry: 0,
    });
  } catch {
    failed.value = true;
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped>
.contact-reveal {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}
.contact-reveal:disabled {
  cursor: wait;
}
</style>
