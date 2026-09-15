<template>
  <section class="mb-8 rounded-lg border border-neutral-200 bg-[#f7f7f9] p-5" data-testid="amikon-contact-details">
    <h2 class="mb-3 text-xl font-semibold text-[#392f6e]">Amikon GmbH</h2>
    <address class="not-italic leading-7">
      Einsteinstr. 8a<br />46325 Borken<br />{{ english ? 'Germany' : 'Deutschland' }}
      <div class="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <a href="tel:+492861685300" class="underline">+49 2861 68 53 00</a>
        <a href="mailto:info@amikon.de" class="break-all underline">info@amikon.de</a>
      </div>
    </address>
    <p class="mt-4 leading-7">
      {{ english ? 'Monday–Thursday' : 'Montag–Donnerstag' }}: 07:30–16:00<br />
      {{ english ? 'Friday' : 'Freitag' }}: 07:30–15:00
    </p>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
</script>
