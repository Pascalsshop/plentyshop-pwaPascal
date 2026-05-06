<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <!-- top line -->
    <div class="bg-slate-900 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
        <p class="font-medium">{{ copy.topline }}</p>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-slate-200">
          <span class="whitespace-nowrap">{{ copy.service }}</span>
          <span class="whitespace-nowrap">{{ copy.shipping }}</span>
          <span class="whitespace-nowrap">{{ copy.b2b }}</span>
        </div>
      </div>
    </div>

    <!-- main nav -->
    <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
      <!-- brand -->
      <NuxtLink :to="localePath(paths.home)" class="flex items-center gap-2">
        <span class="text-lg font-semibold tracking-tight text-slate-900">AMIKON</span>
        <span class="hidden text-xs text-slate-500 md:inline">industrial</span>
      </NuxtLink>

      <!-- categories dropdown -->
      <div class="relative" ref="menuRoot">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          @click="toggleMenu"
          :aria-expanded="menuOpen"
          aria-haspopup="true"
        >
          <span>{{ navLabels.categories }}</span>
          <span class="text-xs opacity-80">▾</span>
        </button>

        <!-- mega menu -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="menuOpen"
            class="absolute left-0 mt-2 w-[min(900px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div class="max-h-[70vh] overflow-auto p-3">
              <ul class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <li v-for="cat in categoryLinks" :key="cat.path">
                  <NuxtLink
                    :to="localePath(cat.path)"
                    class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-700"
                    @click="closeMenu"
                  >
                    {{ cat.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <!-- top links (not inside dropdown) -->
      <nav class="hidden items-center gap-4 md:flex">
        <NuxtLink :to="localePath(paths.home)" class="text-sm font-medium text-slate-700 hover:text-orange-700">
          {{ navLabels.home }}
        </NuxtLink>
        <NuxtLink :to="localePath(paths.shipping)" class="text-sm font-medium text-slate-700 hover:text-orange-700">
          {{ navLabels.shipping }}
        </NuxtLink>
        <NuxtLink :to="localePath(paths.privacy)" class="text-sm font-medium text-slate-700 hover:text-orange-700">
          {{ navLabels.privacy }}
        </NuxtLink>
        <NuxtLink :to="localePath(paths.contact)" class="text-sm font-medium text-slate-700 hover:text-orange-700">
          {{ navLabels.contact }}
        </NuxtLink>
        <NuxtLink :to="localePath(paths.purchase)" class="text-sm font-medium text-slate-700 hover:text-orange-700">
          {{ navLabels.purchase }}
        </NuxtLink>
      </nav>

      <!-- search -->
      <form class="ml-auto hidden w-full max-w-md items-center gap-2 md:flex" @submit.prevent="submitSearch">
        <input
          v-model="searchTerm"
          :placeholder="copy.searchPlaceholder"
          class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <button
          type="submit"
          class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500"
        >
          {{ copy.search }}
        </button>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

type NavLink = { path: string; label: string };

const localePath = useLocalePath();
const { locale } = useI18n();
const searchTerm = ref('');

const menuOpen = ref(false);
const menuRoot = ref<HTMLElement | null>(null);

onClickOutside(menuRoot, () => {
  menuOpen.value = false;
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};

const de = {
  topline: 'Gebrauchte Industrieelektronik, Maschinen und Automatisierungstechnik',
  service: 'Service Mo–Fr',
  shipping: 'Internationaler Versand',
  b2b: 'Nur für Gewerbekunden',
  searchPlaceholder: 'Artikelnummer, Hersteller oder Produkt suchen',
  search: 'Suchen',
};

const en = {
  topline: 'Used industrial electronics, machinery and automation technology',
  service: 'Service Mon–Fri',
  shipping: 'International shipping',
  b2b: 'Business customers only',
  searchPlaceholder: 'Search item number, manufacturer or product',
  search: 'Search',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const navLabels = computed(() =>
  locale.value === 'de'
    ? {
        categories: 'Kategorien',
        home: 'Startseite',
        shipping: 'Versand',
        privacy: 'Datenschutz',
        contact: 'Kontakt',
        purchase: 'Ankaufformular',
      }
    : {
        categories: 'Categories',
        home: 'Home',
        shipping: 'Shipping',
        privacy: 'Privacy',
        contact: 'Contact',
        purchase: 'Purchase form',
      },
);

// IMPORTANT: define as a mutable array (no `as const`) to avoid readonly assignability issues in TS.
const categoryLinks: NavLink[] = [
  { path: '/3d-druck', label: '3D-Druck' },
  { path: '/maschinen', label: 'Maschinen' },
  { path: '/rasterelektronenmikroskope', label: 'Rasterelektronenmikroskope' },
  { path: '/roboter', label: 'Roboter' },
  { path: '/shaker-schwingpruefanlagen', label: 'Shaker / Schwingprüfanlagen' },
  { path: '/waerme-klimaschraenke', label: 'Wärme-Klimaschränke' },
  { path: '/begehbare-klimakammern', label: 'Begehbare Klimakammern' },
  { path: '/salzspruehkammern', label: 'Salzsprühkammern' },
  { path: '/bewitterungstechnik', label: 'Bewitterungstechnik' },
  { path: '/elektronik', label: 'Elektronik' },
  { path: '/frequenzumrichter', label: 'Frequenzumrichter' },
  { path: '/laborartikel', label: 'Laborartikel' },
  { path: '/lasertechnik', label: 'Lasertechnik' },
  { path: '/materialpruefmaschinen', label: 'Materialprüfmaschinen' },
  { path: '/mess-prueftechnik', label: 'Mess- und Prüftechnik' },
  { path: '/monitore-bedieneinheiten', label: 'Monitor / Bedieneinheiten' },
  { path: '/motoren-und-antriebe', label: 'Motoren und Antriebe' },
  { path: '/pneumatik', label: 'Pneumatik' },
  { path: '/pumpen', label: 'Pumpen' },
  { path: '/sonstige-artikel', label: 'Sonstige Artikel' },
  { path: '/thermisches-zubehoer', label: 'Thermisches Zubehör' },
  { path: '/vakuum-technik', label: 'Vakuum-Technik' },
];

const paths = {
  home: '/',
  search: '/search',
  // adjust if your shop uses different slugs
  shipping: '/versand',
  privacy: '/privacy-policy',
  contact: '/contact',
  purchase: '/ankaufformular',
} as const;

const submitSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) return;
  menuOpen.value = false;
  navigateTo(localePath({ path: paths.search, query: { term } }));
};
</script>
