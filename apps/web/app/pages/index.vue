<template>
<section class="bg-slate-950 text-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p class="text-sm font-black uppercase tracking-[0.28em] text-orange-400">{{ copy.kicker }}</p>
          <h1 class="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {{ copy.title }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {{ copy.intro }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              :to="localePath({ path: paths.search, query: { term: copy.primaryTerm } })"
              class="rounded bg-orange-500 px-6 py-3 text-center font-bold text-white hover:bg-orange-600"
            >
              {{ copy.primaryCta }}
            </NuxtLink>
            <NuxtLink
              :to="localePath(paths.contact)"
              class="rounded border border-white/30 px-6 py-3 text-center font-bold text-white hover:bg-white hover:text-slate-950"
            >
              {{ copy.secondaryCta }}
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <h2 class="text-xl font-black">{{ copy.procurementTitle }}</h2>
          <ul class="mt-5 space-y-4">
            <li v-for="item in copy.procurement" :key="item" class="flex gap-3 text-slate-200">
              <span class="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <AmikonTrustBar />

    <section class="mx-auto max-w-7xl px-4 py-14">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-black uppercase tracking-[0.22em] text-orange-600">{{ copy.categoriesKicker }}</p>
          <h2 class="mt-2 text-3xl font-black text-slate-950">{{ copy.categoriesTitle }}</h2>
        </div>
        <NuxtLink :to="localePath(paths.search)" class="font-bold text-orange-600 hover:text-orange-700">
          {{ copy.allProducts }}
        </NuxtLink>
      </div>

      <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="category in categories"
          :key="category.term"
          :to="localePath({ path: paths.search, query: { term: category.term } })"
          class="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-orange-300 hover:shadow-md"
        >
          <p class="text-sm font-black uppercase tracking-wide text-orange-600">{{ category.kicker }}</p>
          <h3 class="mt-2 text-xl font-black text-slate-950 group-hover:text-orange-600">{{ category.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ category.text }}</p>
        </NuxtLink>
      </div>
    </section>

    <section class="bg-slate-100">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2">
        <div class="rounded-2xl bg-white p-8 shadow-sm">
          <h2 class="text-2xl font-black text-slate-950">{{ copy.b2bTitle }}</h2>
          <p class="mt-4 leading-7 text-slate-600">{{ copy.b2bText }}</p>
        </div>
        <div class="rounded-2xl bg-white p-8 shadow-sm">
          <h2 class="text-2xl font-black text-slate-950">{{ copy.sellTitle }}</h2>
          <p class="mt-4 leading-7 text-slate-600">{{ copy.sellText }}</p>
          <NuxtLink :to="localePath(paths.contact)" class="mt-6 inline-flex font-bold text-orange-600 hover:text-orange-700">
            {{ copy.sellCta }}
          </NuxtLink>
        </div>
      </div>
    </section>
</template>

<script lang="ts" setup>
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
});

const localePath = useLocalePath();
const { locale } = useI18n();
const { setPageMeta } = usePageMeta();

const de = {
  kicker: 'Industriebedarf aus zweiter Hand',
  title: 'Gebrauchte Automatisierungstechnik schnell und sicher beschaffen.',
  intro:
    'Amikon bündelt Industrieelektronik, Maschinenkomponenten, Robotik, Antriebe und Ersatzteile für gewerbliche Einkäufer mit internationalem Versand.',
  primaryCta: 'Produkte suchen',
  secondaryCta: 'Anfrage stellen',
  primaryTerm: 'Siemens',
  procurementTitle: 'Ausgerichtet auf industrielle Beschaffung',
  procurement: ['Hersteller, Modell und Artikelnummer im Fokus', 'B2B-Bestellprozess mit Konto, Warenkorb und Checkout', 'Klare Informationen zu Verfügbarkeit, Versand und Zahlung'],
  categoriesKicker: 'Sortiment',
  categoriesTitle: 'Kategorien für Instandhaltung, Einkauf und Produktion',
  allProducts: 'Alle Produkte anzeigen',
  b2bTitle: 'B2B-Positionierung klar sichtbar',
  b2bText:
    'Der neue Store kommuniziert konsequent, dass der Verkauf an Unternehmer, Gewerbetreibende, Freiberufler und öffentliche Institutionen gerichtet ist.',
  sellTitle: 'Ankauf und Wiedervermarktung',
  sellText:
    'Neben dem Verkauf kann der Store auch Anfragen für gebrauchte Industriekomponenten und Maschinen aufnehmen und zur internen Bearbeitung weiterleiten.',
  sellCta: 'Kontakt aufnehmen',
};

const en = {
  kicker: 'Second-hand industrial supply',
  title: 'Source used automation technology quickly and safely.',
  intro:
    'Amikon brings together industrial electronics, machinery components, robotics, drives and spare parts for professional buyers with international shipping.',
  primaryCta: 'Search products',
  secondaryCta: 'Send inquiry',
  primaryTerm: 'Siemens',
  procurementTitle: 'Designed for industrial procurement',
  procurement: ['Manufacturer, model and item number in focus', 'B2B buying flow with account, cart and checkout', 'Clear availability, shipping and payment information'],
  categoriesKicker: 'Catalog',
  categoriesTitle: 'Categories for maintenance, purchasing and production',
  allProducts: 'View all products',
  b2bTitle: 'Clear B2B positioning',
  b2bText:
    'The new storefront consistently communicates that sales are directed to companies, traders, freelancers and public institutions.',
  sellTitle: 'Purchasing and remarketing',
  sellText:
    'In addition to sales, the storefront can capture inquiries for used industrial components and machinery and route them for internal processing.',
  sellCta: 'Contact us',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const categories = computed(() =>
  locale.value === 'de'
    ? [
        { kicker: 'Automation', title: 'SPS & Industrieelektronik', term: 'SPS Industrieelektronik', text: 'Steuerungen, Module, Netzteile, Frequenzumrichter und Ersatzteile.' },
        { kicker: 'Mechanik', title: 'Maschinen & Anlagen', term: 'Maschinen Anlagen', text: 'Gebrauchte Maschinenkomponenten für Produktion und Instandhaltung.' },
        { kicker: 'Robotik', title: 'Roboter & Zubehör', term: 'Robotik Roboter', text: 'Robotersysteme, Controller, Teach Panels und Peripherie.' },
        { kicker: 'Antrieb', title: 'Motoren & Drives', term: 'Motor Antrieb', text: 'Servomotoren, Getriebe, Umrichter und Antriebstechnik.' },
        { kicker: 'Bedienung', title: 'Displays & Panels', term: 'Display Panel', text: 'HMI, Bedienpanels, Monitore und Anzeigeeinheiten.' },
        { kicker: 'Prüfung', title: 'Labor & Messtechnik', term: 'Labor Messtechnik', text: 'Prüfgeräte, Messsysteme und technische Laborausstattung.' },
      ]
    : [
        { kicker: 'Automation', title: 'PLC & industrial electronics', term: 'PLC industrial electronics', text: 'Controllers, modules, power supplies, inverters and spare parts.' },
        { kicker: 'Mechanics', title: 'Machinery & equipment', term: 'Machinery equipment', text: 'Used machinery components for production and maintenance.' },
        { kicker: 'Robotics', title: 'Robots & accessories', term: 'Robotics robot', text: 'Robot systems, controllers, teach panels and peripherals.' },
        { kicker: 'Drive', title: 'Motors & drives', term: 'Motor drive', text: 'Servo motors, gearboxes, inverters and drive technology.' },
        { kicker: 'Operation', title: 'Displays & panels', term: 'Display panel', text: 'HMI, operator panels, monitors and display units.' },
        { kicker: 'Testing', title: 'Lab & measurement', term: 'Lab measurement', text: 'Testing devices, measuring systems and technical lab equipment.' },
      ],
);

setPageMeta(locale.value === 'de' ? 'Amikon Industriebedarf' : 'Amikon industrial supply', 'home');

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');
</script>
