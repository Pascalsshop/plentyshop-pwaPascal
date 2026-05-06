<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
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

    <nav class="border-t border-slate-100 bg-slate-50">
      <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm font-bold text-slate-700">
        <NuxtLink
          v-for="item in navigation"
          :key="item.term"
          class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600"
          :to="localePath({ path: paths.search, query: { term: item.term } })"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { locale } = useI18n();
const searchTerm = ref('');

const de = {
  topline: 'Gebrauchte Industrieelektronik, Maschinen und Automatisierungstechnik',
  service: 'Service Mo–Fr',
  shipping: 'Internationaler Versand',
  b2b: 'Nur für Gewerbekunden',
  searchPlaceholder: 'Artikelnummer, Hersteller oder Produkt suchen',
  search: 'Suchen',
  account: 'Konto',
  cart: 'Warenkorb',
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
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const navigation = computed(() =>
  locale.value === 'de'
    ? [
        { label: 'Elektronik', term: 'Elektronik' },
        { label: 'Maschinen', term: 'Maschinen' },
        { label: 'Robotik', term: 'Robotik' },
        { label: 'Antriebe & Motoren', term: 'Antrieb Motor' },
        { label: 'Displays & Bedienpanels', term: 'Display Bedienpanel' },
        { label: 'Labor & Prüftechnik', term: 'Labor Prüftechnik' },
      ]
    : [
        { label: 'Electronics', term: 'Electronics' },
        { label: 'Machinery', term: 'Machinery' },
        { label: 'Robotics', term: 'Robotics' },
        { label: 'Drives & motors', term: 'Drive Motor' },
        { label: 'Displays & panels', term: 'Display Panel' },
        { label: 'Lab & testing', term: 'Laboratory testing' },
      ],
);

const submitSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) return;
  navigateTo(localePath({ path: paths.search, query: { term } }));
};
</script>
