<template>
  <AmikonInformationAppearance>
    <p class="rounded border border-amber-300 bg-amber-50 p-4">
      {{
        english
          ? 'Local form preview: no data will be sent. Please use test data only.'
          : 'Lokale Formularvorschau: Es werden keine Daten versendet. Bitte nur Testdaten verwenden.'
      }}
    </p>
    <h1>{{ english ? 'Offer equipment for purchase' : 'Ankaufformular' }}</h1>
    <p>
      {{
        english
          ? 'Offer us equipment, spare parts or complete systems.'
          : 'Biete uns Geräte, Ersatzteile oder komplette Anlagen zum Ankauf an.'
      }}
    </p>
    <p v-if="checked" role="status">
      {{
        english
          ? 'Required fields are complete. Preview check passed – nothing was sent.'
          : 'Die Pflichtfelder sind vollständig. Vorschauprüfung erfolgreich – nichts versendet.'
      }}
    </p>
    <AmikonPurchaseInquiry
      :submit-label="english ? 'Test form (no sending)' : 'Formular testen (kein Versand)'"
      @submit="checked = true"
    />
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ skipBlocksFetch: true });
const checked = ref(false);
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
</script>
