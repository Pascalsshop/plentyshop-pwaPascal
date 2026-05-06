<template>
  <footer class="mt-16 bg-slate-950 text-white">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
      <div class="md:col-span-2">
        <p class="text-2xl font-black">AMIKON</p>
        <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">{{ copy.about }}</p>
      </div>
      <div>
        <h3 class="font-bold">{{ copy.service }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-slate-300">
          <li><NuxtLink :to="localePath(paths.shipping)" class="hover:text-white">{{ copy.shipping }}</NuxtLink></li>
          <li><NuxtLink :to="localePath(paths.contact)" class="hover:text-white">{{ copy.contact }}</NuxtLink></li>
          <li><NuxtLink :to="localePath(paths.authLogin)" class="hover:text-white">{{ copy.login }}</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h3 class="font-bold">{{ copy.legal }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-slate-300">
          <li><NuxtLink :to="localePath(paths.termsAndConditions)" class="hover:text-white">{{ copy.terms }}</NuxtLink></li>
          <li><NuxtLink :to="localePath(paths.privacyPolicy)" class="hover:text-white">{{ copy.privacy }}</NuxtLink></li>
          <li><NuxtLink :to="localePath(paths.legalDisclosure)" class="hover:text-white">{{ copy.imprint }}</NuxtLink></li>
          <li><NuxtLink :to="localePath(paths.cancellationRights)" class="hover:text-white">{{ copy.cancellation }}</NuxtLink></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">
      {{ copy.notice }}
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { locale } = useI18n();

const de = {
  about: 'Amikon ist auf gebrauchte Industrieelektronik, Automatisierungstechnik, Maschinenkomponenten und Ersatzteile für gewerbliche Kunden ausgerichtet.',
  service: 'Service',
  shipping: 'Versand & Zahlung',
  contact: 'Kontakt',
  login: 'Login / Registrierung',
  legal: 'Rechtliches',
  terms: 'AGB',
  privacy: 'Datenschutz',
  imprint: 'Impressum',
  cancellation: 'Widerruf',
  notice: 'Verkauf ausschließlich an Unternehmer, Gewerbetreibende, Freiberufler und öffentliche Institutionen.',
};

const en = {
  about: 'Amikon focuses on used industrial electronics, automation technology, machinery components and spare parts for business customers.',
  service: 'Service',
  shipping: 'Shipping & payment',
  contact: 'Contact',
  login: 'Login / registration',
  legal: 'Legal',
  terms: 'Terms and conditions',
  privacy: 'Privacy policy',
  imprint: 'Legal disclosure',
  cancellation: 'Cancellation rights',
  notice: 'Sales exclusively to companies, traders, freelancers and public institutions.',
};

const copy = computed(() => (locale.value === 'de' ? de : en));
</script>
