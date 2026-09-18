<template>
  <AmikonInformationAppearance>
    <h1 class="text-3xl font-black tracking-tight text-slate-950">
      {{ translation?.title ?? (english ? 'Offer equipment for purchase' : 'Ankaufformular') }}
    </h1>
    <p class="mt-3 max-w-2xl text-slate-700">
      {{
        translation?.intro ??
        (english
          ? 'Offer us equipment, spare parts or complete systems. Please provide the key details: manufacturer, model, quantity, condition and photos. We will get back to you.'
          : 'Hier kannst du uns Geräte, Ersatzteile oder komplette Anlagen zum Ankauf anbieten. Bitte sende uns die wichtigsten Informationen (Hersteller, Typ, Stückzahl, Zustand, Fotos) – wir melden uns zeitnah zurück.')
      }}
    </p>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-bold text-slate-950">
        {{ translation?.contact ?? (english ? 'Purchase inquiries' : 'Kontakt für Ankauf') }}
      </h2>
      <ul class="mt-3 space-y-2 text-slate-700">
        <li>
          <span class="font-semibold">{{ translation?.emailLabel ?? (english ? 'Email:' : 'E-Mail:') }}</span>
          <a href="mailto:info@amikon.de">info@amikon.de</a>
        </li>
        <li>{{ translation?.business ?? (english ? 'Business customers only.' : 'Nur für Gewerbekunden.') }}</li>
      </ul>

      <p v-if="!configured" role="status" class="mt-4 text-sm text-slate-600">
        {{
          translation?.unavailable ??
          (english
            ? 'Online submission is currently unavailable. Please send your inquiry by email.'
            : 'Der Online-Versand ist derzeit nicht eingerichtet. Bitte sende deine Anfrage per E-Mail.')
        }}
      </p>
    </div>
    <p v-if="status" role="status" aria-live="polite" class="mt-4 rounded border p-4">{{ status }}</p>
    <AmikonPurchaseInquiry ref="form" :busy="pending" :available="configured" @submit="submit">
      <div v-if="configured" class="overflow-x-auto">
        <NuxtTurnstile ref="challenge" v-model="token" :site-key="siteKey" :options="{ theme: 'light' }" />
      </div>
    </AmikonPurchaseInquiry>
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
import type { PurchaseInquiry } from '~/components/Amikon/purchase.types';
import { purchaseTranslations } from '~/components/Amikon/purchaseTranslations';
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
const translation = computed(() => purchaseTranslations[locale.value.toLowerCase().split('-')[0] ?? 'de']);
useHead(() => ({
  title: `${translation.value?.title ?? (english.value ? 'Offer equipment for purchase' : 'Ankaufformular')} | Amikon`,
}));

const { getSetting: getSiteKey } = useSiteSettings('cloudflareTurnstileApiSiteKey');
const { getSetting: getEmail } = useSiteSettings('contactShopEmail');
const { doCustomerContactMail } = useCustomerContact();
const siteKey = computed(() => getSiteKey() ?? '');
const configured = computed(() => Boolean(siteKey.value && getEmail()));
const token = ref('');
const pending = ref(false);
const status = ref('');
const form = ref<{ reset: () => void }>();
const challenge = ref<{ reset: () => void }>();
const submit = async (inquiry: PurchaseInquiry) => {
  if (pending.value || !configured.value) return;
  if (!token.value) {
    status.value =
      translation.value?.security ??
      (english.value
        ? 'Please complete the security check first.'
        : 'Bitte schließe zuerst die Sicherheitsprüfung ab.');
    return;
  }
  pending.value = true;
  status.value = '';
  try {
    const success = await doCustomerContactMail({
      ...inquiry,
      subject: 'Ankaufanfrage',
      'cf-turnstile-response': token.value,
    });
    if (success) {
      form.value?.reset();
      status.value =
        translation.value?.success ??
        (english.value
          ? 'Thank you. Your purchase inquiry has been sent.'
          : 'Vielen Dank. Deine Ankaufanfrage wurde versendet.');
    } else {
      status.value =
        translation.value?.failure ??
        (english.value
          ? 'Your inquiry could not be sent. Your entries have been kept. Please try again or contact info@amikon.de.'
          : 'Die Anfrage konnte nicht versendet werden. Deine Angaben bleiben erhalten. Bitte versuche es erneut oder kontaktiere info@amikon.de.');
    }
  } catch {
    status.value =
      translation.value?.error ??
      (english.value
        ? 'Sending failed. Your entries have been kept. Please try again.'
        : 'Der Versand ist fehlgeschlagen. Deine Angaben bleiben erhalten. Bitte versuche es erneut.');
  } finally {
    pending.value = false;
    token.value = '';
    challenge.value?.reset();
  }
};
</script>
