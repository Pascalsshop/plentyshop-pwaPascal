<template>
  <section class="border-y border-neutral-200 bg-white">
    <div class="mx-auto grid max-w-screen-2xl gap-px bg-neutral-200 @md:grid-cols-2 @lg:grid-cols-4">
      <article v-for="item in items" :key="item.title" class="bg-white px-6 py-8 text-center @lg:min-h-44">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-amikon-600">{{ item.kicker }}</p>
        <h3 class="mt-2 font-semibold text-neutral-950">{{ item.title }}</h3>
        <p class="mt-3 text-sm leading-6 text-neutral-600">{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const items = computed(() =>
  locale.value === 'de'
    ? [
        {
          kicker: 'Versand',
          title: 'Gratisversand (DE)¹',
          text: 'UPS-Paketversand ab 100 € Bestellwert. Zustellung am Samstag möglich.',
        },
        {
          kicker: 'Service',
          title: 'Persönlicher Kundenservice',
          text: 'Mo.–Do. 07:30–16:00 Uhr, Fr. 07:30–15:00 Uhr. Tel. 02861 6853 00.',
        },
        {
          kicker: 'Sortiment',
          title: 'Einzigartige Produkte',
          text: 'Viele exklusive und außergewöhnliche Industrieprodukte aus zweiter Hand.',
        },
        {
          kicker: 'Sicherheit',
          title: 'Sicher einkaufen',
          text: 'Verschlüsselte Übertragung und ein Bestellprozess für gewerbliche Kunden.',
        },
      ]
    : [
        {
          kicker: 'Shipping',
          title: 'Free shipping (DE)¹',
          text: 'UPS parcel shipping from €100 order value. Saturday delivery is available.',
        },
        {
          kicker: 'Service',
          title: 'Personal customer service',
          text: 'Mon–Thu 07:30–16:00, Fri 07:30–15:00. Phone +49 2861 6853 00.',
        },
        {
          kicker: 'Range',
          title: 'Unique products',
          text: 'Many exclusive and unusual second-hand industrial products.',
        },
        {
          kicker: 'Security',
          title: 'Shop securely',
          text: 'Encrypted transmission and an ordering process designed for business customers.',
        },
      ],
);
</script>
