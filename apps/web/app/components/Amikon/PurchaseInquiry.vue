<template>
  <form class="purchase-inquiry" @submit.prevent="submit" @input="validationMessage = ''">
    <fieldset :disabled="busy">
      <legend>{{ translation?.legend ?? (english ? 'Contact details and offer' : 'Kontakt und Angebot') }}</legend>
      <div class="fields">
        <label v-for="field in definitions" :key="field.key" :class="{ wide: field.multiline }">
          {{ labelFor(field) }}{{ field.required ? ' *' : '' }}
          <textarea
            v-if="field.multiline"
            v-model="values[field.key]"
            :name="field.key"
            :maxlength="field.max"
            rows="3"
          />
          <input
            v-else
            v-model="values[field.key]"
            :name="field.key"
            :type="field.type || 'text'"
            :required="field.required"
            :minlength="field.key === 'name' ? 3 : 1"
            :maxlength="field.max"
            :autocomplete="field.autocomplete"
          />
        </label>
      </div>
      <label class="privacy"
        ><input v-model="privacy" type="checkbox" name="privacy" required /><span
          >{{ translation?.privacyBefore ?? (english ? 'I have read the' : 'Ich habe die') }}
          <NuxtLink :to="localePath('/privacy-policy')" target="_blank" rel="noopener">{{
            translation?.privacyLink ?? (english ? 'privacy policy' : 'Datenschutzerklärung')
          }}</NuxtLink>
          {{ translation?.privacyAfter ?? (english ? '.' : 'gelesen.') }} *</span
        ></label
      >
      <p>
        {{
          translation?.photosBefore ??
          (english
            ? '* Required fields. You can email photos separately to'
            : '* Pflichtfelder. Fotos kannst du separat an')
        }}
        <a href="mailto:info@amikon.de">info@amikon.de</a> {{ translation?.photosAfter ?? (english ? '.' : 'senden.') }}
      </p>
      <slot />
      <p v-if="validationMessage" role="alert" class="validation-message">{{ validationMessage }}</p>
      <button type="submit" :disabled="!available || busy">
        {{
          busy
            ? (translation?.sending ?? (english ? 'Sending …' : 'Wird gesendet …'))
            : submitLabel || translation?.send || (english ? 'Send inquiry' : 'Anfrage senden')
        }}
      </button>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import type { PurchaseInquiry } from './purchase.types';
import { purchaseTranslations } from './purchaseTranslations';
const props = withDefaults(defineProps<{ busy?: boolean; available?: boolean; submitLabel?: string }>(), {
  busy: false,
  available: true,
  submitLabel: '',
});
const emit = defineEmits<{ submit: [inquiry: PurchaseInquiry] }>();
const localePath = useLocalizedPath();
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
const translation = computed(() => purchaseTranslations[locale.value.toLowerCase().split('-')[0] ?? 'de']);
const englishLabels: Record<string, string> = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company, department',
  address: 'Address',
  device: 'Equipment / system',
  price: 'Asking price (including currency)',
  condition: 'Condition / known defects',
  details: 'Details (manufacturer, model, quantity)',
  services: 'Other services, e.g. dismantling or transport',
};
const labelFor = (field: { key: string; label: string }) =>
  translation.value?.[field.key] ?? (english.value ? englishLabels[field.key] || field.label : field.label);
const definitions: {
  key: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  autocomplete?: string;
  max: number;
}[] = [
  { key: 'name', label: 'Name, Vorname', required: true, autocomplete: 'name', max: 120 },
  { key: 'email', label: 'E-Mail', required: true, type: 'email', autocomplete: 'email', max: 254 },
  { key: 'phone', label: 'Telefon', type: 'tel', autocomplete: 'tel', max: 60 },
  { key: 'company', label: 'Firma, Abteilung', autocomplete: 'organization', max: 160 },
  { key: 'address', label: 'Adresse', multiline: true, max: 500 },
  { key: 'device', label: 'Gerät / Anlage', required: true, max: 200 },
  { key: 'price', label: 'Preisvorstellung (mit Währung)', required: true, max: 100 },
  { key: 'condition', label: 'Zustand / bekannte Mängel', required: true, max: 200 },
  { key: 'details', label: 'Details (Hersteller, Typ, Stückzahl)', multiline: true, max: 4000 },
  { key: 'services', label: 'Sonstige Leistungen, z. B. Demontage oder Transport', multiline: true, max: 1000 },
];
const values = reactive<Record<string, string>>(Object.fromEntries(definitions.map(({ key }) => [key, ''])));
const privacy = ref(false);
const validationMessage = ref('');
const submit = () => {
  if (props.busy || !props.available) return;
  const invalidField = definitions.find((field) => {
    const value = values[field.key]?.trim() || '';
    return (field.required && value.length < (field.key === 'name' ? 3 : 1)) || value.length > field.max;
  });
  if (invalidField) {
    const value = values[invalidField.key]?.trim() || '';
    const reason =
      value.length > invalidField.max
        ? (translation.value?.max?.replace('{max}', String(invalidField.max)) ??
          (english.value
            ? `Use no more than ${invalidField.max} characters.`
            : `Höchstens ${invalidField.max} Zeichen sind erlaubt.`))
        : invalidField.key === 'name'
          ? (translation.value?.minName ??
            (english.value ? 'Please enter at least three characters.' : 'Bitte gib mindestens drei Zeichen ein.'))
          : (translation.value?.blank ??
            (english.value
              ? 'Please enter a value, not just spaces.'
              : 'Bitte gib einen Wert ein, nicht nur Leerzeichen.'));
    validationMessage.value = `${labelFor(invalidField)}: ${reason}`;
    return;
  }
  if (!privacy.value) {
    validationMessage.value =
      translation.value?.privacyRequired ??
      (english.value
        ? 'Please confirm that you have read the privacy policy.'
        : 'Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.');
    return;
  }
  validationMessage.value = '';
  emit('submit', {
    name: values.name!.trim(),
    email: values.email!.trim(),
    message: [
      'Ankaufanfrage über den Shop',
      ...definitions
        .filter(({ key }) => key !== 'name' && key !== 'email')
        .map(({ key, label }) => `${label}: ${values[key]?.trim() || '–'}`),
    ].join('\n\n'),
  });
};
defineExpose({
  reset: () => {
    for (const { key } of definitions) values[key] = '';
    privacy.value = false;
    validationMessage.value = '';
  },
});
</script>

<style scoped>
fieldset {
  min-width: 0;
  margin: 28px 0;
  padding: 0;
  border: 0;
}
legend {
  margin-bottom: 18px;
  font-size: 21px;
  font-weight: 600;
  color: #392f6e;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.fields label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 500;
}
.wide {
  grid-column: 1 / -1;
}
.fields input,
.fields textarea {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #b8bbc4;
  border-radius: 4px;
  background: white;
  color: #282d2f;
  font: inherit;
  font-weight: 400;
}
.fields textarea {
  resize: vertical;
}
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #392f6e;
  outline-offset: 2px;
}
.privacy {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 26px 0 16px;
}
.privacy input {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 4px;
  accent-color: #392f6e;
}
button {
  padding: 12px 24px;
  border-radius: 4px;
  background: #392f6e;
  color: white;
  font-weight: 600;
}
button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.validation-message {
  color: #a02020;
  padding: 12px;
  border: 1px solid currentColor;
  border-radius: 4px;
}
@media (max-width: 639px) {
  .fields {
    grid-template-columns: minmax(0, 1fr);
  }
  button {
    width: 100%;
  }
}
</style>
