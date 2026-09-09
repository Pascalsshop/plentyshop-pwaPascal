<template>
  <section class="bg-white">
    <div class="amikon-trust-grid">
      <article v-for="item in items" :key="item.title" class="text-center">
        <h3 class="text-sm font-semibold">
          <span aria-hidden="true" class="text-amikon-600">✓</span> {{ item.title }}
        </h3>
        <p class="mt-1 text-sm leading-6 text-neutral-700">{{ item.text }}</p>
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

<style scoped>
.amikon-trust-grid {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
  padding: 28px 15px;
}
@media (max-width: 991px) {
  .amikon-trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .amikon-trust-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
</style>
