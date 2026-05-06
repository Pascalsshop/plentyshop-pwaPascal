<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <!-- Topline -->
    <div class="bg-slate-900 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
        <p class="font-medium">{{ copy.topline }}</p>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-slate-200">
          <span>{{ copy.service }}</span>
          <span>{{ copy.shipping }}</span>
          <span>{{ copy.b2b }}</span>
        </div>
      </div>
    </div>

    <!-- Main row -->
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <NuxtLink :to="localePath(paths.home)" class="flex items-center gap-3" aria-label="Amikon Startseite">
        <div class="flex h-11 w-11 items-center justify-center rounded bg-slate-900 text-lg font-black text-white">A</div>
        <div>
          <p class="text-2xl font-black tracking-tight text-slate-950">AMIKON</p>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Industrial Components</p>
        </div>
      </NuxtLink>

      <form class="flex min-w-0 flex-1 lg:max-w-2xl" @submit.prevent="submitSearch">
        <input
          v-model="searchTerm"
          class="min-w-0 flex-1 rounded-l border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          :placeholder="copy.searchPlaceholder"
          type="search"
        />
        <button class="rounded-r bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600" type="submit">
          {{ copy.search }}
        </button>
      </form>

      <nav class="flex items-center gap-2 text-sm font-semibold">
        <NuxtLink class="rounded px-3 py-2 text-slate-700 hover:bg-slate-100" :to="localePath(paths.account)">
          {{ copy.account }}
        </NuxtLink>
        <NuxtLink class="rounded bg-slate-900 px-3 py-2 text-white hover:bg-slate-800" :to="localePath(paths.cart)">
          {{ copy.cart }}
        </NuxtLink>
      </nav>
    </div>

    <!-- Category menu -->
    <nav class="border-t border-slate-100 bg-slate-50">
      <div class="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 text-sm font-bold text-slate-700">
        <button
          ref="menuButtonEl"
          type="button"
          class="whitespace-nowrap rounded bg-white px-3 py-2 ring-1 ring-slate-200 hover:ring-slate-300"
          @click="isMenuOpen = !isMenuOpen"
        >
          {{ copy.categories }}
        </button>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath(paths.home)">
          {{ copy.homeLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/shipping')">
          {{ copy.shippingLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/privacy-policy')">
          {{ copy.privacyLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/contact')">
          {{ copy.contactLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/ankaufformular')">
          {{ copy.purchaseLink }}
        </NuxtLink>
      </div>

      <!-- Dropdown -->
      <div v-if="isMenuOpen" ref="menuPanelEl" class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-4">
          <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="cat in categoryLinks" :key="cat.path">
              <NuxtLink
                class="block rounded px-3 py-2 font-bold text-slate-900 hover:bg-slate-50 hover:text-orange-600"
                :to="localePath(cat.path)"
                @click="isMenuOpen = false"
              >
                {{ cat.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const localePath = useLocalePath();
const { locale } = useI18n();
const searchTerm = ref('');

const categoryLinks = [
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
] as const;


const isMenuOpen = ref(false);
const menuPanelEl = ref<HTMLElement | null>(null);
const menuButtonEl = ref<HTMLElement | null>(null);

onClickOutside(menuPanelEl, (e) => {
  // allow click on the button
  if (menuButtonEl.value && (e.target instanceof Node) && menuButtonEl.value.contains(e.target)) return;
  isMenuOpen.value = false;
});


const de = {
  topline: 'Gebrauchte Industrieelektronik, Maschinen und Automatisierungstechnik',
  service: 'Service Mo–Fr',
  shipping: 'Internationaler Versand',
  b2b: 'Nur für Gewerbekunden',
  searchPlaceholder: 'Artikelnummer, Hersteller oder Produkt suchen',
  search: 'Suchen',
  account: 'Konto',
  cart: 'Warenkorb',
  categories: 'Kategorien',
  homeLink: 'Startseite',
  shippingLink: 'Versand',
  privacyLink: 'Datenschutz',
  contactLink: 'Kontakt',
  purchaseLink: 'Ankaufformular',
};

const en = {
  topline: 'Used industrial electronics, machinery and automation technology',
  service: 'Service Mon–Fri',
  shipping: 'International shipping',
  b2b: 'Business customers only',
  searchPlaceholder: 'Search item number, manufacturer or product',
  search: 'Search',
  account: 'Account',
  cart: 'Cart',
  categories: 'Categories',
  homeLink: 'Home',
  shippingLink: 'Shipping',
  privacyLink: 'Privacy',
  contactLink: 'Contact',
  purchaseLink: 'Purchase form',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const submitSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) return;
  navigateTo(localePath({ path: paths.search, query: { term } }));
};
</script>
