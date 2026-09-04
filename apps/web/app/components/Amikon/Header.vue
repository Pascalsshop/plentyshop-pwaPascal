<template>
  <header
    ref="headerRoot"
    class="@container relative w-full bg-white text-neutral-900 shadow-sm z-sticky"
    data-testid="amikon-header"
    @keydown.esc="closeMenus"
  >
    <div class="hidden bg-amikon-600 text-white @lg:block">
      <div class="mx-auto flex max-w-screen-2xl items-center justify-center gap-12 px-6 py-2 text-sm font-semibold">
        <a :href="AMIKON_PHONE_HREF" class="flex items-center gap-2 text-white hover:underline">
          <SfIconCheck class="h-4 w-4" aria-hidden="true" />
          <span>{{ t('amikonHeader.service.questions') }} {{ AMIKON_PHONE_LABEL }}</span>
        </a>
        <span class="flex items-center gap-2">
          <SfIconCheck class="h-4 w-4" aria-hidden="true" />
          {{ t('amikonHeader.service.internationalShipping') }}
        </span>
        <span class="flex items-center gap-2">
          <SfIconCheck class="h-4 w-4" aria-hidden="true" />
          {{ t('amikonHeader.service.noHiddenCosts') }}
        </span>
      </div>
    </div>

    <div class="border-b border-neutral-200">
      <div class="mx-auto max-w-screen-2xl px-2 @lg:px-6">
        <nav
          class="flex min-h-10 items-center justify-end gap-1 @lg:hidden"
          :aria-label="t('amikonHeader.aria.customerNavigation')"
        >
          <NuxtLink
            :to="localePath(isAuthorized ? paths.account : paths.authLogin)"
            class="flex h-10 items-center justify-center rounded px-2 hover:bg-neutral-100"
            :class="{ 'mr-auto': isAuthorized }"
            :aria-label="accountLabel"
          >
            <SfIconPerson class="h-5 w-5" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink
            v-if="!isAuthorized"
            :to="localePath(paths.register)"
            class="mr-auto flex h-10 items-center justify-center rounded px-2 hover:bg-neutral-100"
            :aria-label="t('amikonHeader.actions.register')"
          >
            <span class="relative" aria-hidden="true">
              <SfIconPerson class="h-5 w-5" />
              <span class="absolute -right-1 -top-1 text-xs font-black">+</span>
            </span>
          </NuxtLink>
          <button
            type="button"
            class="flex h-10 items-center gap-1 rounded px-2 hover:bg-neutral-100"
            :aria-label="t('common.navigation.languageSelector')"
            @click="toggleLanguageSelect"
          >
            <span class="w-5" aria-hidden="true" v-html="currentLanguageFlag" />
            <span class="text-xs font-semibold">{{ currentLanguageLabel }}</span>
          </button>
          <NuxtLink
            :to="localePath(paths.wishlist)"
            class="flex h-10 items-center gap-1 rounded px-2 hover:bg-neutral-100"
            :aria-label="t('cart.numberInWishlist', { count: wishlistItemIds.length })"
          >
            <SfIconFavorite class="h-5 w-5" aria-hidden="true" />
            <span class="text-xs">{{ wishlistItemIds.length }}</span>
          </NuxtLink>
          <NuxtLink
            :to="localePath(paths.cart)"
            class="flex h-10 items-center gap-1 rounded px-2 font-bold hover:bg-neutral-100"
            :aria-label="t('cart.numberInCart', { count: cartItemsCount })"
          >
            <SfIconShoppingCart class="h-5 w-5" aria-hidden="true" />
            <span class="whitespace-nowrap text-sm">{{ cartTotal }}</span>
          </NuxtLink>
        </nav>

        <div class="py-1 @lg:flex @lg:min-h-14 @lg:items-center @lg:gap-7 @lg:py-2">
          <form class="flex min-w-0 flex-1" role="search" @submit.prevent="submitSearch">
            <label for="amikon-search" class="sr-only">{{ t('common.actions.search') }}</label>
            <input
              id="amikon-search"
              v-model="searchTerm"
              type="search"
              maxlength="80"
              :placeholder="t('amikonHeader.searchPlaceholder')"
              class="h-10 min-w-0 flex-1 rounded-l-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-amikon-600 focus:ring-1 focus:ring-amikon-600"
              data-testid="amikon-search-input"
            />
            <button
              type="submit"
              class="flex h-10 w-14 items-center justify-center rounded-r-lg border border-l-0 border-neutral-300 bg-neutral-100 text-amikon-600 hover:bg-neutral-200"
              :aria-label="t('common.actions.search')"
            >
              <SfIconSearch class="h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          <nav
            class="hidden shrink-0 items-center gap-1 text-sm @lg:flex"
            :aria-label="t('amikonHeader.aria.customerNavigation')"
          >
            <NuxtLink
              :to="localePath(isAuthorized ? paths.account : paths.authLogin)"
              class="flex items-center gap-1.5 rounded px-2 py-2 hover:bg-amikon-700 hover:text-white"
            >
              <SfIconPerson class="h-4 w-4" aria-hidden="true" />
              <span>{{ accountLabel }}</span>
            </NuxtLink>
            <NuxtLink
              v-if="!isAuthorized"
              :to="localePath(paths.register)"
              class="flex items-center gap-1.5 rounded px-2 py-2 hover:bg-amikon-700 hover:text-white"
            >
              <span class="relative" aria-hidden="true">
                <SfIconPerson class="h-4 w-4" />
                <span class="absolute -right-1.5 -top-2 text-xs font-black">+</span>
              </span>
              <span>{{ t('amikonHeader.actions.register') }}</span>
            </NuxtLink>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded px-2 py-2 hover:bg-amikon-700 hover:text-white"
              :aria-label="t('common.navigation.languageSelector')"
              @click="toggleLanguageSelect"
            >
              <span class="w-5" aria-hidden="true" v-html="currentLanguageFlag" />
              <span>{{ currentLanguageLabel }}</span>
            </button>
            <NuxtLink
              :to="localePath(paths.wishlist)"
              class="flex items-center gap-1 rounded px-2 py-2 hover:bg-amikon-700 hover:text-white"
              :aria-label="t('cart.numberInWishlist', { count: wishlistItemIds.length })"
            >
              <span>{{ wishlistItemIds.length }}</span>
              <SfIconFavorite class="h-5 w-5" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              :to="localePath(paths.cart)"
              class="flex items-center gap-2 rounded px-2 py-2 font-bold hover:bg-amikon-700 hover:text-white"
              :aria-label="t('cart.numberInCart', { count: cartItemsCount })"
            >
              <SfIconShoppingCart class="h-5 w-5" aria-hidden="true" />
              <span class="whitespace-nowrap">{{ cartTotal }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <div class="relative" @mouseleave="closeDesktopMenu">
      <div class="mx-auto flex min-h-20 max-w-screen-2xl items-center justify-between gap-5 px-4 @lg:px-6">
        <NuxtLink :to="localePath(paths.home)" class="shrink-0" :aria-label="t('amikonHeader.logoAlt')">
          <img
            :src="AMIKON_LOGO_PATH"
            :alt="t('amikonHeader.logoAlt')"
            class="h-20 w-28 object-contain"
            width="132"
            height="96"
          />
        </NuxtLink>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded hover:bg-neutral-100 @lg:hidden"
          :aria-label="t('common.navigation.openMenu')"
          :aria-expanded="mobileMenuOpen"
          aria-controls="amikon-mobile-menu"
          @click="openMobileMenu"
        >
          <SfIconMenu class="h-6 w-6" aria-hidden="true" />
        </button>

        <nav
          class="hidden self-stretch items-stretch text-sm font-bold uppercase @lg:flex @xl:text-base"
          :aria-label="t('amikonHeader.aria.mainNavigation')"
        >
          <NuxtLink :to="localePath(paths.home)" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.home') }}
          </NuxtLink>
          <div class="flex">
            <button
              type="button"
              class="flex items-center gap-1 px-4 hover:bg-amikon-600 hover:text-white"
              :class="{ 'bg-amikon-600 text-white': desktopMenuOpen }"
              :aria-expanded="desktopMenuOpen"
              aria-controls="amikon-desktop-menu"
              @click="toggleDesktopMenu"
            >
              {{ t('amikonHeader.navigation.categories') }}
              <SfIconExpandMore class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <NuxtLink :to="localePath(paths.shipping)" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.shipping') }}
          </NuxtLink>
          <NuxtLink :to="localePath(paths.privacyPolicy)" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.privacy') }}
          </NuxtLink>
          <NuxtLink :to="localePath(paths.contact)" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.contact') }}
          </NuxtLink>
          <NuxtLink :to="localePath(AMIKON_PURCHASE_FORM_PATH)" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.purchaseForm') }}
          </NuxtLink>
          <a :href="AMIKON_NEWSLETTER_URL" class="flex items-center px-4 hover:bg-neutral-100">
            {{ t('amikonHeader.navigation.newsletter') }}
          </a>
        </nav>
      </div>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="desktopMenuOpen"
          id="amikon-desktop-menu"
          class="absolute left-0 right-0 top-full hidden border-t border-neutral-200 bg-white shadow-lg z-dropdown @lg:block"
          data-testid="amikon-desktop-menu"
        >
          <div class="mx-auto grid max-w-screen-2xl grid-cols-3">
            <ul
              v-for="(column, columnIndex) in desktopMenuColumns"
              :key="columnIndex"
              class="border-r border-neutral-200 px-6 py-3 last:border-r-0"
            >
              <li v-for="item in column" :key="item.id">
                <NuxtLink
                  :to="item.link"
                  class="block rounded px-5 py-2.5 text-sm font-bold uppercase no-underline hover:bg-amikon-600 hover:text-white"
                  @click="closeMenus"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-neutral-900/50 z-drawer-backdrop @lg:hidden"
        data-testid="amikon-mobile-menu-backdrop"
        @click.self="closeMenus"
      >
        <aside
          id="amikon-mobile-menu"
          class="h-full w-11/12 max-w-sm overflow-y-auto bg-white shadow-xl z-drawer"
          role="dialog"
          aria-modal="true"
          :aria-label="t('amikonHeader.aria.mobileMenu')"
        >
          <div class="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <NuxtLink :to="localePath(paths.home)" class="font-bold uppercase" @click="closeMenus">
              {{ t('amikonHeader.navigation.home') }}
            </NuxtLink>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded hover:bg-neutral-100"
              :aria-label="t('common.navigation.closeMenu')"
              @click="closeMenus"
            >
              <SfIconClose class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav :aria-label="t('amikonHeader.aria.categoryNavigation')">
            <p class="bg-neutral-100 px-4 py-3 text-sm font-bold uppercase text-amikon-600">
              {{ t('amikonHeader.navigation.categories') }}
            </p>
            <ul class="py-2">
              <li v-for="item in categoryMenuItems" :key="item.id">
                <NuxtLink
                  :to="item.link"
                  class="block border-b border-neutral-100 px-5 py-3 text-sm font-semibold uppercase no-underline hover:bg-amikon-600 hover:text-white"
                  @click="closeMenus"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>

            <ul class="border-t border-neutral-200 py-2 font-bold uppercase">
              <li>
                <NuxtLink
                  :to="localePath(paths.shipping)"
                  class="block px-5 py-3 hover:bg-neutral-100"
                  @click="closeMenus"
                >
                  {{ t('amikonHeader.navigation.shipping') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="localePath(paths.privacyPolicy)"
                  class="block px-5 py-3 hover:bg-neutral-100"
                  @click="closeMenus"
                >
                  {{ t('amikonHeader.navigation.privacy') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="localePath(paths.contact)"
                  class="block px-5 py-3 hover:bg-neutral-100"
                  @click="closeMenus"
                >
                  {{ t('amikonHeader.navigation.contact') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="localePath(AMIKON_PURCHASE_FORM_PATH)"
                  class="block px-5 py-3 hover:bg-neutral-100"
                  @click="closeMenus"
                >
                  {{ t('amikonHeader.navigation.purchaseForm') }}
                </NuxtLink>
              </li>
              <li>
                <a :href="AMIKON_NEWSLETTER_URL" class="block px-5 py-3 hover:bg-neutral-100">
                  {{ t('amikonHeader.navigation.newsletter') }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </Transition>
  </header>

  <LanguageSelector />
</template>

<script setup lang="ts">
import {
  SfIconCheck,
  SfIconClose,
  SfIconExpandMore,
  SfIconFavorite,
  SfIconMenu,
  SfIconPerson,
  SfIconSearch,
  SfIconShoppingCart,
} from '@storefront-ui/vue';
import { cartGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
import { onClickOutside } from '@vueuse/core';
import { flagImports } from '~/components/LanguageSelector/flags';
import type { AmikonNavigationItem } from './Amikon.types';
import {
  AMIKON_FALLBACK_CATEGORIES,
  AMIKON_LOGO_PATH,
  AMIKON_NEWSLETTER_URL,
  AMIKON_PHONE_HREF,
  AMIKON_PHONE_LABEL,
  AMIKON_PURCHASE_FORM_PATH,
  splitIntoBalancedColumns,
} from './navigation';

const { t, locale } = useI18n();
const localePath = useLocalizedPath();
const router = useRouter();
const route = useRoute();
const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink, toggle: toggleLanguageSelect } = useLocalization();
const { data: cart } = useCart();
const { wishlistItemIds } = useWishlist();
const { user, isAuthorized } = useCustomer();
const { updateSearchTerm } = useCategoryFilter();
const { emit } = usePlentyEvent();
const { format } = usePriceFormatter();

const headerRoot = ref<HTMLElement | null>(null);
const desktopMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
const searchTerm = ref('');

const currentLanguageLabel = computed(() => locale.value.toUpperCase());
const currentLanguageFlag = computed(() => flagImports[locale.value] || '');
const accountLabel = computed(
  () => user.value?.firstName || t(isAuthorized.value ? 'account.heading' : 'amikonHeader.actions.login'),
);
const cartItemsCount = computed(() => cart.value?.items?.reduce((count, { quantity }) => count + quantity, 0) ?? 0);
const cartTotal = computed(() => format(cartGetters.getTotals(cart.value).total ?? 0));

const categoryMenuItems = computed<AmikonNavigationItem[]>(() => {
  const liveItems: AmikonNavigationItem[] = [];

  for (const category of categoryTree.value) {
    const label = categoryTreeGetters.getName(category);

    if (label) {
      liveItems.push({
        id: category.id,
        label,
        link: localePath(buildCategoryMenuLink(category, categoryTree.value)),
      });
    }
  }

  if (liveItems.length > 0) {
    return liveItems;
  }

  return AMIKON_FALLBACK_CATEGORIES.map(({ slug, translationKey }) => ({
    id: slug,
    label: t(translationKey),
    link: localePath(slug),
  }));
});

const desktopMenuColumns = computed(() => splitIntoBalancedColumns(categoryMenuItems.value, 3));

const toggleDesktopMenu = () => {
  desktopMenuOpen.value = !desktopMenuOpen.value;
};

const openMobileMenu = () => {
  desktopMenuOpen.value = false;
  mobileMenuOpen.value = true;
};

const closeDesktopMenu = () => {
  desktopMenuOpen.value = false;
};

const closeMenus = () => {
  desktopMenuOpen.value = false;
  mobileMenuOpen.value = false;
};

const submitSearch = () => {
  const term = searchTerm.value.trim();

  if (!term) {
    return;
  }

  updateSearchTerm(term);
  emit('frontend:searchProduct', term);
  closeMenus();
  void router.push({ path: localePath(paths.search), query: { term } });
};

onClickOutside(headerRoot, closeDesktopMenu);

watch(
  () => route.fullPath,
  () => {
    closeMenus();
    searchTerm.value = '';
  },
);
</script>
