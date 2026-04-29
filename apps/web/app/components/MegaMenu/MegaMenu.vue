<template>
  <header ref="referenceRef" :class="headerClass" class="relative w-full md:sticky md:shadow-md z-10">
    <div
      class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-2 md:py-5 w-full border-0 border-neutral-200"
      :style="{ backgroundColor: headerBackgroundColor }"
      data-testid="navbar-top"
    >
      <div class="flex items-center">
        <UiButton
          v-if="viewport.isLessThan('lg')"
          variant="tertiary"
          square
          :aria-label="t('common.navigation.openMenu')"
          class="mr-5 hover:!bg-header-400"
          :style="{ color: iconColor }"
          @click="openMenu"
        >
          <SfIconMenu aria-hidden="true" />
        </UiButton>

        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('common.actions.goToHomepage')"
          class="flex shrink-0 w-full lg:w-48 items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiLogo />
        </NuxtLink>
      </div>

      <slot />
    </div>

    <nav v-if="viewport.isGreaterOrEquals('lg')" ref="floatingRef" @mouseleave="isAmikonMegaMenuOpen = false">
      <ul class="flex flex-wrap px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid">
        <li class="relative" @mouseenter="isAmikonMegaMenuOpen = true">
          <NuxtLink
            to="/kategorien/"
            data-testid="category-button"
            :class="categoryButtonClasses"
            tabindex="0"
            aria-haspopup="true"
            :aria-expanded="isAmikonMegaMenuOpen ? 'true' : 'false'"
            @focus="isAmikonMegaMenuOpen = true"
            @keydown.esc="isAmikonMegaMenuOpen = false"
          >
            <span>Kategorien</span>
            <SfIconChevronRight
              aria-hidden="true"
              class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
            />
          </NuxtLink>
        </li>
      </ul>

      <div
        v-if="isAmikonMegaMenuOpen"
        class="absolute left-0 right-0 z-40 bg-white shadow-lg border-b border-b-neutral-200 border-b-solid"
        @mouseenter="isAmikonMegaMenuOpen = true"
        @mouseleave="isAmikonMegaMenuOpen = false"
      >
        <div class="mx-auto grid max-w-screen-xl grid-cols-4 gap-4 p-6">
          <NuxtLink
            v-for="item in amikonCategories"
            :key="item.label"
            :to="item.url"
            class="rounded border border-neutral-200 px-4 py-3 typography-text-sm font-medium text-neutral-900 hover:bg-secondary-100 hover:text-neutral-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:rounded-sm"
            @click="isAmikonMegaMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <template v-else>
      <div v-if="isOpen" class="fixed z-[50] inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerReference"
        v-model="isOpen"
        placement="left"
        class="right-12 max-w-96 bg-white overflow-y-auto z-[1000]"
      >
        <nav>
          <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid">
            <p class="typography-text-base font-medium">{{ t('common.actions.browseProducts') }}</p>
            <UiButton
              variant="tertiary"
              square
              :aria-label="t('common.navigation.closeMenu')"
              class="ml-2"
              @click="close()"
            >
              <SfIconClose aria-hidden="true" class="text-neutral-500" />
            </UiButton>
          </div>
          <ul class="mt-2 mb-6">
            <li v-for="item in amikonCategories" :key="item.label">
              <SfListItem
                size="lg"
                :tag="NuxtLink"
                :to="item.url"
                class="hover:bg-secondary-100"
                @click="close()"
              >
                <p class="text-left">{{ item.label }}</p>
              </SfListItem>
            </li>
          </ul>
        </nav>
      </SfDrawer>
    </template>
  </header>
</template>

<script lang="ts" setup>
import { SfIconClose, SfDrawer, SfListItem, SfIconChevronRight, SfIconMenu, useTrapFocus } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';
import type { MegaMenuProps } from '~/components/MegaMenu/types';

const props = defineProps<MegaMenuProps>();
const NuxtLink = resolveComponent('NuxtLink');

const viewport = useViewport();
const localePath = useLocalePath();
const router = useRouter();
const { close, open, isOpen } = useMegaMenu();
const { setDrawerOpen } = useDrawerState();
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');
const { getSetting: getIconColor } = useSiteSettings('iconColor');

const referenceRef = ref();
const floatingRef = ref();
const drawerReference = ref();
const iconColor = computed(() => props.iconColor || getIconColor());
const headerBackgroundColor = computed(() => props.headerBackgroundColor || getHeaderBackgroundColor());
const headerClass = computed(() => ({ 'z-[10]': isOpen.value }));
const isAmikonMegaMenuOpen = ref(false);
const categoryButtonClasses =
  'inline-flex items-center justify-center gap-2 font-medium text-base rounded-md py-2 px-4 group mr-2 !text-neutral-900 hover:bg-secondary-100 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900';

const amikonCategories = [
  { label: '3D Druck', url: '/kategorien/3d-druck' },
  { label: 'Maschinen', url: '/maschinen' },
  { label: 'Rasterelektronenmikroskope', url: '/kategorien/rasterelektronenmikroskope' },
  { label: 'Roboter', url: '/kategorien/roboter' },
  { label: 'Shaker / Schwingprüfanlagen', url: '/kategorien/shaker-schwingpruefanlagen' },
  { label: 'Wärme-Klimaschränke', url: '/kategorien/waerme-klimaschraenke' },
  { label: 'Begehbare Klimakammern', url: '/kategorien/begehbare-klimakammern' },
  { label: 'Salzsprühkammern', url: '/kategorien/salzspruehkammern' },
  { label: 'Bewitterungstechnik', url: '/kategorien/bewitterungstechnik' },
  { label: 'Elektronik', url: '/elektronik' },
  { label: 'Frequenzumrichter', url: '/kategorien/frequenzumrichter' },
  { label: 'Laborartikel', url: '/kategorien/laborartikel' },
  { label: 'Lasertechnik', url: '/kategorien/lasertechnik' },
  { label: 'Materialprüfmaschinen', url: '/kategorien/materialpruefmaschinen' },
  { label: 'Mess- und Prüftechnik', url: '/kategorien/mess-und-prueftechnik' },
  { label: 'Monitore / Bedieneinheiten', url: '/kategorien/monitore-bedieneinheiten' },
  { label: 'Motoren und Antriebe', url: '/motoren-und-antriebe' },
  { label: 'Pneumatik', url: '/kategorien/pneumatik' },
  { label: 'Pumpen', url: '/kategorien/pumpen' },
  { label: 'Sonstige Artikel', url: '/kategorien/sonstige-artikel' },
  { label: 'Thermisches Zubehör', url: '/kategorien/thermisches-zubehoer' },
  { label: 'Vakuum-Technik', url: '/kategorien/vakuum-technik' },
];

let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: false,
  initialFocus: false,
} as const;

const openMenu = () => {
  open();
  setDrawerOpen(true);
};

onMounted(() => {
  removeHook = router.afterEach(() => {
    close();
    isAmikonMegaMenuOpen.value = false;
  });
});

onBeforeUnmount(() => removeHook?.());

useTrapFocus(drawerReference, trapFocusOptions);
</script>
