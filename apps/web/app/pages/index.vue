<template>
  <main class="bg-neutral-50 text-neutral-900" data-testid="amikon-homepage">
    <section class="border-b border-neutral-200 bg-[#f5f5f7]" :aria-label="copy.categoryNavigationLabel">
      <div
        class="mx-auto grid max-w-screen-2xl grid-cols-2 gap-3 px-4 py-6 @md:grid-cols-3 @lg:grid-cols-5 @lg:gap-6 @lg:py-10"
      >
        <NuxtLink
          v-for="category in featuredCategories"
          :key="category.slug"
          :to="localePath(category.slug)"
          class="group relative overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amikon-600"
        >
          <img
            :src="category.image"
            :alt="category.imageAlt"
            class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            width="520"
            height="390"
          />
          <span
            class="absolute bottom-3 left-1/2 max-w-[calc(100%-1rem)] -translate-x-1/2 whitespace-nowrap bg-white/95 px-3 py-2 text-center text-xs font-semibold uppercase shadow-sm @md:text-sm @lg:text-base"
          >
            {{ category.label }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="mx-auto max-w-screen-2xl px-4 py-6 @lg:py-10">
      <div
        class="relative min-h-[320px] overflow-hidden rounded-md bg-neutral-900 shadow-sm @md:min-h-[440px] @xl:min-h-[540px]"
      >
        <img
          :src="homeImages.company"
          :alt="copy.companyImageAlt"
          class="absolute inset-0 h-full w-full object-cover"
          width="2560"
          height="984"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        <div
          class="relative flex min-h-[320px] max-w-4xl flex-col justify-center px-6 py-12 text-white @md:min-h-[440px] @md:px-10 @xl:min-h-[540px] @xl:px-14"
        >
          <p class="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-white/80">{{ copy.heroKicker }}</p>
          <h1 class="max-w-3xl text-4xl font-light uppercase leading-tight tracking-tight @md:text-6xl @xl:text-7xl">
            {{ copy.heroTitle }}
          </h1>
          <NuxtLink
            :to="localePath(paths.search)"
            class="mt-8 inline-flex w-fit items-center bg-amikon-600 px-6 py-3 text-sm font-bold uppercase text-white no-underline transition hover:bg-amikon-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {{ copy.heroCta }}
          </NuxtLink>
        </div>
      </div>

      <div class="mx-auto max-w-screen-xl py-8 @lg:py-10">
        <h2 class="sr-only">{{ copy.welcomeHeading }}</h2>
        <p class="text-base leading-7 text-neutral-700 @lg:text-lg @lg:leading-8">{{ copy.intro }}</p>
      </div>
    </section>

    <section class="border-y border-neutral-200 bg-white">
      <div class="mx-auto max-w-screen-2xl px-4 py-12 @lg:py-16">
        <div
          class="flex flex-col gap-4 border-l-4 border-amikon-600 pl-4 @md:flex-row @md:items-end @md:justify-between"
        >
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-amikon-600">{{ copy.climateKicker }}</p>
            <h2 class="mt-1 text-2xl font-medium uppercase @lg:text-3xl">{{ copy.climateTitle }}</h2>
          </div>
          <NuxtLink :to="localePath('/waerme-klimaschraenke')" class="font-semibold text-amikon-600 hover:underline">
            {{ copy.viewAll }}
          </NuxtLink>
        </div>

        <ProductSlider
          v-if="climateProducts.length"
          :items="climateProducts"
          class="mt-8"
          data-testid="amikon-climate-products"
        />

        <div v-else class="mt-8 grid gap-5 @md:grid-cols-3" data-testid="amikon-climate-fallback">
          <NuxtLink
            v-for="entry in climateEntries"
            :key="entry.slug"
            :to="localePath(entry.slug)"
            class="group flex min-h-48 flex-col justify-end overflow-hidden border border-neutral-200 bg-neutral-50 p-6 no-underline transition hover:border-amikon-600 hover:shadow-md"
          >
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-amikon-600">{{ entry.kicker }}</p>
            <h3 class="mt-2 text-xl font-semibold group-hover:text-amikon-600">{{ entry.title }}</h3>
            <p class="mt-3 max-w-md text-sm leading-6 text-neutral-600">{{ entry.text }}</p>
            <span class="mt-5 text-sm font-bold text-amikon-600">{{ copy.openCategory }} →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-neutral-100">
      <div class="mx-auto max-w-screen-2xl px-4 py-12 @lg:py-16">
        <div class="border-l-4 border-amikon-600 pl-4">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amikon-600">{{ copy.newKicker }}</p>
          <h2 class="mt-1 text-2xl font-medium uppercase @lg:text-3xl">{{ copy.newTitle }}</h2>
        </div>

        <ProductSlider v-if="newProducts.length" :items="newProducts" class="mt-8" data-testid="amikon-new-products" />

        <div v-else class="mt-8 grid grid-cols-2 gap-3 @md:grid-cols-4 @lg:gap-5" data-testid="amikon-new-fallback">
          <NuxtLink
            v-for="entry in newEntries"
            :key="entry.term"
            :to="{ path: localePath(paths.search), query: { term: entry.term } }"
            class="group flex min-h-36 flex-col justify-between bg-white p-5 no-underline shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-1 hover:shadow-md @lg:min-h-44 @lg:p-6"
          >
            <span class="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{{ copy.quickSearch }}</span>
            <span class="mt-6 text-lg font-semibold group-hover:text-amikon-600 @lg:text-xl">{{ entry.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto grid max-w-screen-2xl gap-5 px-4 py-12 @lg:grid-cols-2 @lg:py-16">
        <NuxtLink
          :to="localePath('/ankaufformular')"
          class="group relative overflow-hidden bg-amikon-600 px-7 py-10 text-white no-underline shadow-sm @md:px-10"
        >
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{{ copy.purchaseKicker }}</p>
          <h2 class="mt-3 text-3xl font-semibold">{{ copy.purchaseTitle }}</h2>
          <p class="mt-4 max-w-xl leading-7 text-white/80">{{ copy.purchaseText }}</p>
          <span class="mt-7 inline-flex border-b border-white pb-1 font-bold">{{ copy.purchaseCta }} →</span>
        </NuxtLink>

        <a
          href="https://www.amikon.de/"
          class="group border border-neutral-200 bg-neutral-100 px-7 py-10 text-neutral-900 no-underline shadow-sm transition hover:border-amikon-600 @md:px-10"
        >
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amikon-600">AMIKON.DE</p>
          <h2 class="mt-3 text-3xl font-semibold">{{ copy.companyTitle }}</h2>
          <p class="mt-4 max-w-xl leading-7 text-neutral-600">{{ copy.companyText }}</p>
          <span class="mt-7 inline-flex border-b border-amikon-600 pb-1 font-bold text-amikon-600"
            >{{ copy.companyCta }} →</span
          >
        </a>
      </div>
    </section>

    <section class="border-t border-neutral-200 bg-neutral-50">
      <div class="mx-auto max-w-screen-2xl px-4 py-10 text-center">
        <h2 class="text-lg font-semibold">{{ copy.brandsTitle }}</h2>
        <div
          class="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-wide text-neutral-500 @lg:text-base"
        >
          <NuxtLink
            v-for="brand in brands"
            :key="brand"
            :to="{ path: localePath(paths.search), query: { term: brand } }"
            class="hover:text-amikon-600"
          >
            {{ brand }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <AmikonTrustBar />
  </main>
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

const localePath = useLocalizedPath();
const { locale } = useI18n();
const { setPageMeta } = usePageMeta();

const homeImages = {
  company: '/_nuxt-plenty/images/amikon/home/company-building.jpg',
  climate: '/_nuxt-plenty/images/amikon/home/category-climate.jpg',
  robotics: '/_nuxt-plenty/images/amikon/home/category-robotics.jpg',
  materialTesting: '/_nuxt-plenty/images/amikon/home/category-material-testing.jpg',
  threeDPrinting: '/_nuxt-plenty/images/amikon/home/category-3d-printing.jpg',
  shaker: '/_nuxt-plenty/images/amikon/home/category-shaker.jpg',
};

const de = {
  categoryNavigationLabel: 'Ausgewählte Produktkategorien',
  companyImageAlt: 'Firmengebäude der Amikon GmbH in Borken',
  heroKicker: 'An- und Verkauf von Industrieequipment',
  heroTitle: 'Willkommen bei Amikon GmbH',
  heroCta: 'Sortiment entdecken',
  welcomeHeading: 'Über Amikon',
  intro:
    'Viele Unternehmen veräußern ihre Geräte nach Beendigung ihrer Projekte oder nachdem Investitionen vollständig abgeschrieben sind. Das bedeutet keinesfalls, dass diese Geräte nicht noch viele Jahre einwandfrei betrieben werden können. Die Amikon GmbH hat sich auf den An- und Verkauf von gebrauchtem Industrieequipment spezialisiert. Mit unserem Unternehmenskonzept geben wir Geräten einen zweiten Nutzungszyklus – Qualität und Nachhaltigkeit stehen dabei im Vordergrund.',
  climateKicker: 'Gefragtes Sortiment',
  climateTitle: 'Aktuelle Klimakammern',
  viewAll: 'Alle ansehen',
  openCategory: 'Kategorie öffnen',
  newKicker: 'Frisch im Sortiment',
  newTitle: 'Neuheiten',
  quickSearch: 'Direkt suchen',
  purchaseKicker: 'Maschinen und Ersatzteile verkaufen',
  purchaseTitle: 'Ankaufformular',
  purchaseText: 'Bieten Sie uns gebrauchte Maschinen, Industrieelektronik oder Ersatzteile direkt zur Prüfung an.',
  purchaseCta: 'Anfrage starten',
  companyTitle: 'Mehr über Amikon',
  companyText:
    'Erfahren Sie mehr über unsere Tätigkeitsbereiche, Leistungen und den nachhaltigen zweiten Lebenszyklus für Industrieequipment.',
  companyCta: 'Zur Unternehmensseite',
  brandsTitle: 'Auszug von TOP-Marken unserer angebotenen Produkte',
};

const en = {
  categoryNavigationLabel: 'Selected product categories',
  companyImageAlt: 'Amikon GmbH company building in Borken',
  heroKicker: 'Buying and selling industrial equipment',
  heroTitle: 'Welcome to Amikon GmbH',
  heroCta: 'Explore our range',
  welcomeHeading: 'About Amikon',
  intro:
    'Many companies sell their equipment after projects have ended or investments have been fully depreciated. This does not mean that the equipment cannot continue to operate reliably for many years. Amikon GmbH specializes in buying and selling used industrial equipment. Our business model gives equipment a second life, with quality and sustainability at its core.',
  climateKicker: 'Popular range',
  climateTitle: 'Current climate chambers',
  viewAll: 'View all',
  openCategory: 'Open category',
  newKicker: 'Fresh stock',
  newTitle: 'New arrivals',
  quickSearch: 'Quick search',
  purchaseKicker: 'Sell machinery and spare parts',
  purchaseTitle: 'Purchase form',
  purchaseText: 'Offer us your used machinery, industrial electronics or spare parts directly for review.',
  purchaseCta: 'Start inquiry',
  companyTitle: 'More about Amikon',
  companyText:
    'Learn more about our fields of activity, services and the sustainable second life cycle for industrial equipment.',
  companyCta: 'Visit company website',
  brandsTitle: 'A selection of top brands in our product range',
};

const copy = computed(() => (locale.value === 'de' ? de : en));

const { data: climateProductsCatalog, fetchProducts: fetchClimateProducts } = useProducts(
  `amikon-home-climate-${locale.value}`,
);
const { data: newProductsCatalog, fetchProducts: fetchNewProducts } = useProducts(`amikon-home-new-${locale.value}`);

onMounted(() => {
  void Promise.allSettled([
    fetchClimateProducts({
      categoryUrlPath: '/waerme-klimaschraenke',
      itemsPerPage: 12,
      page: 1,
      sort: 'variation.createdAt_desc',
    }),
    fetchNewProducts({
      type: 'all',
      itemsPerPage: 12,
      page: 1,
      sort: 'variation.createdAt_desc',
    }),
  ]);
});

const climateProducts = computed(() => climateProductsCatalog.value.products?.slice(0, 12) ?? []);
const newProducts = computed(() => newProductsCatalog.value.products?.slice(0, 12) ?? []);

const featuredCategories = computed(() =>
  locale.value === 'de'
    ? [
        {
          label: 'Klimakammern',
          imageAlt: 'Wärme- und Klimaschränke',
          image: homeImages.climate,
          slug: '/waerme-klimaschraenke',
        },
        { label: 'Roboter', imageAlt: 'Industrieroboter', image: homeImages.robotics, slug: '/roboter' },
        {
          label: 'Materialprüfung',
          imageAlt: 'Materialprüfmaschine',
          image: homeImages.materialTesting,
          slug: '/materialpruefmaschinen',
        },
        {
          label: '3D-Druck',
          imageAlt: 'Industrieller 3D-Drucker',
          image: homeImages.threeDPrinting,
          slug: '/3d-druck',
        },
        {
          label: 'Shaker',
          imageAlt: 'Schwingprüfanlage',
          image: homeImages.shaker,
          slug: '/shaker-schwingpruefanlagen',
        },
      ]
    : [
        {
          label: 'Climate chambers',
          imageAlt: 'Temperature and climate chambers',
          image: homeImages.climate,
          slug: '/waerme-klimaschraenke',
        },
        { label: 'Robots', imageAlt: 'Industrial robot', image: homeImages.robotics, slug: '/roboter' },
        {
          label: 'Material testing',
          imageAlt: 'Material testing machine',
          image: homeImages.materialTesting,
          slug: '/materialpruefmaschinen',
        },
        {
          label: '3D printing',
          imageAlt: 'Industrial 3D printer',
          image: homeImages.threeDPrinting,
          slug: '/3d-druck',
        },
        {
          label: 'Shakers',
          imageAlt: 'Vibration test system',
          image: homeImages.shaker,
          slug: '/shaker-schwingpruefanlagen',
        },
      ],
);

const climateEntries = computed(() =>
  locale.value === 'de'
    ? [
        {
          kicker: 'Temperatur & Feuchte',
          title: 'Wärme- und Klimaschränke',
          text: 'Prüfschränke und Klimakammern für reproduzierbare Umweltbedingungen.',
          slug: '/waerme-klimaschraenke',
        },
        {
          kicker: 'Große Prüfvolumen',
          title: 'Begehbare Klimakammern',
          text: 'Klimaprüfräume für Bauteile, Baugruppen und komplette Systeme.',
          slug: '/begehbare-klimakammern',
        },
        {
          kicker: 'Korrosionsprüfung',
          title: 'Salzsprühkammern',
          text: 'Prüftechnik für Salzsprüh- und Korrosionsbeständigkeitstests.',
          slug: '/salzspruehkammern',
        },
      ]
    : [
        {
          kicker: 'Temperature & humidity',
          title: 'Climate chambers',
          text: 'Test chambers for reproducible environmental conditions.',
          slug: '/waerme-klimaschraenke',
        },
        {
          kicker: 'Large test volumes',
          title: 'Walk-in chambers',
          text: 'Climate test rooms for components, assemblies and complete systems.',
          slug: '/begehbare-klimakammern',
        },
        {
          kicker: 'Corrosion testing',
          title: 'Salt spray chambers',
          text: 'Test equipment for salt spray and corrosion resistance tests.',
          slug: '/salzspruehkammern',
        },
      ],
);

const newEntries = computed(() =>
  locale.value === 'de'
    ? [
        { label: 'Siemens SIMATIC', term: 'Siemens SIMATIC' },
        { label: 'Festo Pneumatik', term: 'Festo' },
        { label: 'Bedienpanels & HMI', term: 'HMI Panel' },
        { label: 'Mess- und Prüftechnik', term: 'Messtechnik' },
      ]
    : [
        { label: 'Siemens SIMATIC', term: 'Siemens SIMATIC' },
        { label: 'Festo pneumatics', term: 'Festo' },
        { label: 'Operator panels & HMI', term: 'HMI Panel' },
        { label: 'Measurement & testing', term: 'Measurement technology' },
      ],
);

const brands = [
  'Vötsch',
  'Weiss',
  'CTS',
  'Memmert',
  'Espec',
  'Nabertherm',
  'Binder',
  'Siemens',
  'KUKA',
  'Stäubli',
  'ABB',
];

setPageMeta(locale.value === 'de' ? 'Amikon Industriebedarf' : 'Amikon industrial supply', 'home');

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');
</script>
