<template>
  <main class="amikon-home bg-neutral-50 text-neutral-900" data-testid="amikon-homepage">
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
            class="amikon-category-image aspect-square w-full object-contain transition duration-300"
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
        <div
          class="relative flex min-h-[320px] max-w-4xl flex-col justify-center px-6 py-12 text-white @md:min-h-[440px] @md:px-10 @xl:min-h-[540px] @xl:px-14"
        >
          <h1 class="max-w-3xl text-4xl font-light uppercase leading-tight tracking-tight @md:text-6xl @xl:text-7xl">
            {{ copy.heroTitle }}
          </h1>
        </div>
      </div>

      <div class="mx-auto max-w-screen-xl py-8 @lg:py-10">
        <h2 class="sr-only">{{ copy.welcomeHeading }}</h2>
        <p class="text-base leading-7 text-neutral-700 @lg:text-lg @lg:leading-8">{{ copy.intro }}</p>
      </div>
    </section>

    <AmikonHomeProducts kind="climate" :title="copy.climateTitle" category-path="/waerme-klimaschraenke" />
    <AmikonHomeProducts kind="new" :title="copy.newTitle" />

    <AmikonHomeBusiness />

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

setPageMeta(locale.value === 'de' ? 'Amikon Industriebedarf' : 'Amikon industrial supply', 'home');

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');
</script>

<style scoped>
.amikon-home {
  background: #f7f7f9;
}
.amikon-home > section > .max-w-screen-2xl,
.amikon-home > .max-w-screen-2xl {
  max-width: 1600px;
}
.amikon-home > section:first-child {
  border: 0;
  background: transparent;
}
.amikon-home > section:first-child > div {
  gap: 30px;
  padding: 40px 15px;
}
.amikon-home > section:first-child a {
  background: transparent;
  box-shadow: none;
  transform: none;
}
.amikon-category-image {
  filter: saturate(0.5);
}
a:hover .amikon-category-image {
  filter: saturate(0.8);
}
.amikon-home > section:first-child span {
  bottom: 15px;
  padding: 10px 20px;
  font-weight: 400;
  box-shadow: none;
}
.amikon-home > section:nth-child(2) {
  padding: 0 15px;
}
.amikon-home > section:nth-child(2) > div:first-child {
  min-height: 0;
  aspect-ratio: 3 / 1;
  box-shadow: none;
}
.amikon-home > section:nth-child(2) > div:first-child > div {
  min-height: 0;
  height: 100%;
  max-width: 100%;
  padding: 30px;
}
.amikon-home h1 {
  max-width: 100%;
  font-size: clamp(2.4rem, 6.2vw, 6rem);
  font-weight: 400;
  line-height: 1.2;
}
.amikon-home > section:nth-child(2) > div:last-child {
  max-width: 100%;
  padding: 28px 0;
}
.amikon-home > section:nth-child(2) p {
  font-size: 16px;
  line-height: 1.65;
  text-align: justify;
}
@media (max-width: 767px) {
  .amikon-home > section:first-child > div {
    gap: 16px;
    padding: 24px 15px;
  }
  .amikon-home > section:first-child span {
    white-space: normal;
    padding: 8px;
    font-size: 12px;
  }
  .amikon-home > section:nth-child(2) > div:first-child {
    aspect-ratio: 4 / 3;
  }
  .amikon-home > section:nth-child(2) > div:first-child > div {
    padding: 20px;
  }
}
</style>
