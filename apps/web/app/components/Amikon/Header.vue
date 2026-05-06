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

        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath(paths.search)">
          {{ copy.searchLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/shipping')">
          {{ copy.shippingLink }}
        </NuxtLink>
        <NuxtLink class="whitespace-nowrap rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath('/contact')">
          {{ copy.contactLink }}
        </NuxtLink>
      </div>

      <!-- Dropdown -->
      <div v-if="isMenuOpen" ref="menuPanelEl" class="border-t border-slate-200 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-4">
          <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="cat in topLevelCategories" :key="cat.id" class="min-w-0">
              <NuxtLink
                class="block rounded px-3 py-2 font-bold text-slate-900 hover:bg-slate-50"
                :to="localePath(buildCategoryMenuLink(cat, categoryTree))"
              >
                {{ categoryTreeGetters.getName(cat) }}
              </NuxtLink>

              <ul v-if="categoryTreeGetters.getItems(cat)?.length" class="mt-1 space-y-1 pl-2">
                <li v-for="child in categoryTreeGetters.getItems(cat)" :key="child.id">
                  <NuxtLink
                    class="block truncate rounded px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                    :to="localePath(buildCategoryMenuLink(child, categoryTree))"
                  >
                    {{ categoryTreeGetters.getName(child) }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { onClickOutside } from '@vueuse/core';

const localePath = useLocalePath();
const { locale } = useI18n();
const searchTerm = ref('');

const { data: categoryTreeData, getCategoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();

const categoryTree = computed<CategoryTreeItem[]>(() => categoryTreeData.value ?? []);
await getCategoryTree().catch(() => undefined);

const isMenuOpen = ref(false);
const menuPanelEl = ref<HTMLElement | null>(null);
const menuButtonEl = ref<HTMLElement | null>(null);

onClickOutside(menuPanelEl, (e) => {
  // allow click on the button
  if (menuButtonEl.value && (e.target instanceof Node) && menuButtonEl.value.contains(e.target)) return;
  isMenuOpen.value = false;
});

const topLevelCategories = computed(() => categoryTree.value);

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
  searchLink: 'Suche',
  shippingLink: 'Versand',
  contactLink: 'Kontakt',
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
  searchLink: 'Search',
  shippingLink: 'Shipping',
  contactLink: 'Contact',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const submitSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) return;
  navigateTo(localePath({ path: paths.search, query: { term } }));
};
</script>
