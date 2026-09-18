<template>
  <AmikonInformationAppearance>
    <p class="rounded border border-amber-300 bg-amber-50 p-4">
      {{
        previewCopy?.notice ??
        (english
          ? 'Local form preview: no data will be sent. Please use test data only.'
          : 'Lokale Formularvorschau: Es werden keine Daten versendet. Bitte nur Testdaten verwenden.')
      }}
    </p>
    <h1>{{ translation?.title ?? (english ? 'Offer equipment for purchase' : 'Ankaufformular') }}</h1>
    <p>
      {{
        translation?.intro ??
        (english
          ? 'Offer us equipment, spare parts or complete systems.'
          : 'Biete uns Geräte, Ersatzteile oder komplette Anlagen zum Ankauf an.')
      }}
    </p>
    <p v-if="checked" role="status">
      {{
        previewCopy?.success ??
        (english
          ? 'Required fields are complete. Preview check passed – nothing was sent.'
          : 'Die Pflichtfelder sind vollständig. Vorschauprüfung erfolgreich – nichts versendet.')
      }}
    </p>
    <AmikonPurchaseInquiry
      :submit-label="previewCopy?.submit ?? (english ? 'Test form (no sending)' : 'Formular testen (kein Versand)')"
      @submit="checked = true"
      @input="checked = false"
    />
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
import { purchaseTranslations } from '~/components/Amikon/purchaseTranslations';
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ skipBlocksFetch: true });
const checked = ref(false);
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
const language = computed(() => locale.value.toLowerCase().split('-')[0] ?? 'de');
const translation = computed(() => purchaseTranslations[language.value]);
const previewTranslations: Record<string, { notice: string; success: string; submit: string }> = {
  fr: {
    notice: 'Aperçu local du formulaire : aucune donnée ne sera envoyée. Utilisez uniquement des données de test.',
    success: 'Les champs obligatoires sont complets. Test réussi : rien n’a été envoyé.',
    submit: 'Tester le formulaire (sans envoi)',
  },
  nl: {
    notice: 'Lokaal formuliervoorbeeld: er worden geen gegevens verstuurd. Gebruik alleen testgegevens.',
    success: 'De verplichte velden zijn ingevuld. Test geslaagd: er is niets verstuurd.',
    submit: 'Formulier testen (niet versturen)',
  },
};
const previewCopy = computed(() => previewTranslations[language.value]);
</script>
