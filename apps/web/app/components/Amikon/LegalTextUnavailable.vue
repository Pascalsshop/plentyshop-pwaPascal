<template>
  <section role="status" class="rounded border border-amber-300 bg-amber-50 p-5">
    <h1>{{ english ? 'Information currently unavailable' : 'Information derzeit nicht verfügbar' }}</h1>
    <p>
      {{
        english
          ? 'The requested legal information could not be loaded. Please try again later or contact us.'
          : 'Der angeforderte Rechtstext konnte nicht geladen werden. Bitte versuche es später erneut oder kontaktiere uns.'
      }}
    </p>
    <p><a href="mailto:info@amikon.de">info@amikon.de</a> · <a href="tel:+492861685300">+49 2861 6853 00</a></p>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
</script>
