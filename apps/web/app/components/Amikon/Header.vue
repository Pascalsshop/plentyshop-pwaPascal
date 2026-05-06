<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <!-- Top info bar -->
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
          class="min-w-0 flex-1 rounded-l border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          :placeholder="copy.searchPlaceholder"
          type="search"
          autocomplete="off"
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

    <!-- Category navigation -->
    <div class="border-t border-slate-100 bg-slate-50">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div class="relative">
          <button
            class="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            type="button"
            :aria-expanded="isMenuOpen ? 'true' : 'false'"
            @click="toggleMenu"
          >
            <span>{{ copy.categories }}</span>
            <span class="text-slate-400">▾</span>
          </button>

          <div v-if="isMenuOpen" class="fixed inset-0 z-40" @click="closeMenu" aria-hidden="true" />
          <!-- Dropdown -->
          <div
            v-if="isMenuOpen"
            class="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(56rem,90vw)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            @mouseleave="activeId = null"
          >
            <div class="grid grid-cols-1 gap-0 lg:grid-cols-[18rem_1fr]">
              <!-- Level 1 -->
              <div class="max-h-[70vh] overflow-auto border-b border-slate-100 lg:border-b-0 lg:border-r">
                <NuxtLink
                  v-for="cat in topCategories"
                  :key="categoryTreeGetters.getId(cat)"
                  class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
                  :class="activeId === categoryTreeGetters.getId(cat) ? 'bg-slate-50' : ''"
                  :to="localePath(buildCategoryMenuLink(cat, categoryTree))"
                  @mouseenter="activeId = categoryTreeGetters.getId(cat)"
                  @click="closeMenu"
                >
                  <span class="truncate">{{ categoryTreeGetters.getName(cat) }}</span>
                  <span v-if="categoryTreeGetters.getItems(cat)?.length" class="text-slate-300">›</span>
                </NuxtLink>
              </div>

              <!-- Level 2 -->
              <div class="hidden max-h-[70vh] overflow-auto p-4 lg:block">
                <div v-if="activeCategory" class="grid grid-cols-2 gap-2">
                  <NuxtLink
                    v-for="child in children"
                    :key="categoryTreeGetters.getId(child)"
                    class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                    :to="localePath(buildCategoryMenuLink(child, categoryTree))"
                    @click="closeMenu"
                  >
                    {{ categoryTreeGetters.getName(child) }}
                  </NuxtLink>
                </div>

                <div v-else class="text-sm text-slate-500">
                  {{ copy.categoriesHint }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick links (optional) -->
        <div class="hidden items-center gap-2 text-sm font-bold text-slate-700 md:flex">
          <NuxtLink class="rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath(paths.shipping)">
            {{ copy.shippingLink }}
          </NuxtLink>
          <NuxtLink class="rounded px-3 py-2 hover:bg-white hover:text-orange-600" :to="localePath(paths.contact)">
            {{ copy.contactLink }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

const localePath = useLocalePath();
const { locale } = useI18n();
const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();

const searchTerm = ref('');
const isMenuOpen = ref(false);
const activeId = ref<number | null>(null);

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
  categoriesHint: 'Kategorie auswählen …',
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
  categoriesHint: 'Select a category …',
  shippingLink: 'Shipping',
  contactLink: 'Contact',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const topCategories = computed<CategoryTreeItem[]>(() => {
  const tree = categoryTree.value;
  if (!tree) return [];
  return categoryTreeGetters.getItems(tree) ?? [];
});

const activeCategory = computed<CategoryTreeItem | null>(() => {
  const id = activeId.value;
  if (!id) return null;
  return topCategories.value.find((c) => categoryTreeGetters.getId(c) === id) ?? null;
});

const children = computed<CategoryTreeItem[]>(() => {
  const cat = activeCategory.value;
  if (!cat) return [];
  return categoryTreeGetters.getItems(cat) ?? [];
});

watchEffect(() => {
  // Set initial hover selection when opening
  if (isMenuOpen.value && !activeId.value && topCategories.value.length) {
    activeId.value = categoryTreeGetters.getId(topCategories.value[0]);
  }
});

const submitSearch = () => {
  const term = searchTerm.value.trim();
  if (!term) return;
  closeMenu();
  navigateTo(localePath({ path: paths.search, query: { term } }));
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

onClickOutside(
  computed(() => document.querySelector('header')),
  () => {
    isMenuOpen.value = false;
  },
);
</script>