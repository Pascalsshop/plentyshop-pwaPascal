<template>
  <section id="amikon-business" class="amikon-business" :aria-label="copy.section">
    <div class="business-grid">
      <NuxtLink :to="localePath('/ankaufformular')" class="business-card">
        <img :src="`${cdn}/zum_ankaufformular.webp`" :alt="copy.purchaseAlt" width="1200" height="630" loading="lazy" />
        <div class="business-caption">
          <h2>{{ copy.purchase }}</h2>
          <p>{{ copy.purchaseText }}</p>
        </div>
      </NuxtLink>

      <div class="business-carousel" role="region" :aria-label="copy.companySection">
        <a :href="activeSlide.href" class="business-card">
          <img :src="activeSlide.image" :alt="activeSlide.alt" width="1200" height="630" loading="lazy" />
          <div class="business-caption" aria-live="polite">
            <h2>{{ activeSlide.title }}</h2>
            <p>{{ activeSlide.text }}</p>
          </div>
        </a>
        <div class="business-controls" :aria-label="copy.chooseSlide">
          <button
            v-for="(slide, index) in slides"
            :key="slide.href"
            type="button"
            :aria-label="slide.title"
            :aria-pressed="activeIndex === index"
            @click="activeIndex = index"
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div class="business-brands">
      <h2>{{ copy.brands }}</h2>
      <div class="brand-grid">
        <NuxtLink
          v-for="brand in brands"
          :key="brand.file"
          :to="{ path: localePath(paths.search), query: { term: brand.name } }"
          :aria-label="`${copy.searchBrand} ${brand.name}`"
          class="brand-card"
        >
          <img
            :src="`${cdn}/brands/brand-${brand.file}.webp`"
            :alt="brand.name"
            width="270"
            height="159"
            loading="lazy"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalizedPath();
const { locale } = useI18n();
// Original shop artwork, served from the existing Amikon CDN.
const cdn = 'https://cdn02.plentymarkets.com/7ukspn3affoc/frontend/Grafiken';
const activeIndex = ref(0);
const copy = computed(() =>
  locale.value === 'de'
    ? {
        section: 'Ankauf, Unternehmen und Marken',
        purchase: 'Ankaufformular',
        purchaseText: 'Wir kaufen Ihre gebrauchten Maschinen und Ersatzteile.',
        purchaseAlt: 'Gebrauchte Industrieanlagen im Amikon-Lager',
        companySection: 'Mehr über Amikon',
        companyText: 'Link zu unserer Ankaufseite. Hier erfahren Sie in welchen Bereichen Amikon tätig ist.',
        companyAlt: 'Die Amikon-Unternehmensseite auf einem Bildschirm',
        marketing: 'Vermarktung',
        marketingText: 'Wir beraten Sie zur Vermarktung Ihrer Maschine.',
        marketingAlt: 'Vermarktung von Industriemaschinen durch Amikon',
        chooseSlide: 'Unternehmensansicht auswählen',
        brands: 'Auszug von TOP-Marken unserer angebotenen Produkte',
        searchBrand: 'Produkte suchen von',
      }
    : {
        section: 'Purchasing, company and brands',
        purchase: 'Purchase form',
        purchaseText: 'We buy your used machinery and spare parts.',
        purchaseAlt: 'Used industrial equipment in the Amikon warehouse',
        companySection: 'More about Amikon',
        companyText: 'Visit our purchasing website to learn more about the areas in which Amikon operates.',
        companyAlt: 'The Amikon company website on a screen',
        marketing: 'Machine marketing',
        marketingText: 'We advise you on marketing your machinery.',
        marketingAlt: 'Industrial machinery marketing by Amikon',
        chooseSlide: 'Choose company information',
        brands: 'A selection of top brands in our product range',
        searchBrand: 'Search products by',
      },
);
const slides = computed(() => [
  {
    title: 'AMIKON.DE',
    text: copy.value.companyText,
    alt: copy.value.companyAlt,
    href: 'https://www.amikon.de/',
    image: `${cdn}/Startseite/website_Amikon.webp`,
  },
  {
    title: copy.value.marketing,
    text: copy.value.marketingText,
    alt: copy.value.marketingAlt,
    href: 'https://www.amikon.de/vermarktung',
    image: `${cdn}/Startseite/vermarktung.webp`,
  },
]);
const activeSlide = computed(() => slides.value[activeIndex.value] ?? slides.value[0]!);
const brands = [
  { name: 'Vötsch', file: 'voetsch' },
  { name: 'Weiss', file: 'weiss' },
  { name: 'CTS', file: 'cts' },
  { name: 'Memmert', file: 'memmert' },
  { name: 'Espec', file: 'espec' },
  { name: 'Nabertherm', file: 'nabertherm' },
  { name: 'Thermotron', file: 'thermotron' },
  { name: 'Binder', file: 'binder' },
  { name: 'Siemens', file: 'siemens' },
  { name: 'KUKA', file: 'kuka' },
  { name: 'Stäubli', file: 'staubli' },
  { name: 'ABB', file: 'abb' },
];
</script>

<style scoped>
.amikon-business {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 15px 40px;
  scroll-margin-top: 190px;
}
.business-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;
  border-top: 1px solid #ddd;
  padding-top: 30px;
}
.business-card {
  display: block;
  position: relative;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-radius: 8px;
  background: #5b5961;
  color: white;
  text-decoration: none;
}
.business-card > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.business-caption {
  position: absolute;
  inset: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgb(80 75 95 / 48%);
  padding: 14px;
}
.business-caption h2 {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.5;
}
.business-caption p {
  font-size: 18px;
  line-height: 1.6;
  margin-top: 2px;
}
.business-carousel {
  position: relative;
  min-width: 0;
}
.business-controls {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}
.business-controls button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
}
.business-controls span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff8;
  border: 1px solid white;
}
.business-controls [aria-pressed='true'] span {
  background: white;
}
.business-card:focus-visible,
.brand-card:focus-visible,
.business-controls button:focus-visible {
  outline: 3px solid #392f6e;
  outline-offset: 3px;
}
.business-brands {
  margin-top: 60px;
  padding: 0 15px;
}
.business-brands h2 {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 32px;
}
.brand-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 24px 30px;
}
.brand-card {
  display: block;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 1px 5px #0000000d;
}
.brand-card img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 270 / 159;
  object-fit: contain;
  filter: grayscale(1);
  transition: filter 0.2s;
}
.brand-card:hover img,
.brand-card:focus-visible img {
  filter: grayscale(0);
}
@media (max-width: 991px) {
  .business-caption {
    inset: 12px;
    padding: 12px;
  }
  .business-caption h2,
  .business-caption p {
    font-size: 15px;
  }
  .brand-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
}
@media (max-width: 767px) {
  .business-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  .business-brands {
    padding: 0;
    margin-top: 36px;
  }
  .brand-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}
@media (max-width: 479px) {
  .business-card {
    aspect-ratio: 1.6;
  }
  .business-caption p {
    font-size: 14px;
  }
  .brand-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
