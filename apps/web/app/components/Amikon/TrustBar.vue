<template>
  <section class="border-y border-slate-200 bg-white">
    <div class="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-4">
      <article v-for="item in items" :key="item.title" class="rounded-lg border border-slate-200 p-4">
        <p class="text-sm font-black uppercase tracking-wide text-orange-600">{{ item.kicker }}</p>
        <h3 class="mt-1 font-bold text-slate-950">{{ item.title }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const items = computed(() =>
  locale.value === 'de'
    ? [
        { kicker: 'B2B', title: 'Für Gewerbekunden', text: 'Sortiment und Bestellprozess sind auf industrielle Beschaffung ausgelegt.' },
        { kicker: 'Lagerware', title: 'Schnelle Verfügbarkeit', text: 'Gebrauchte Komponenten, Maschinen und Ersatzteile aus dem Lagerbestand.' },
        { kicker: 'Export', title: 'Weltweiter Versand', text: 'Internationale Lieferung mit klaren Versand- und Zahlungsinformationen.' },
        { kicker: 'Service', title: 'Persönliche Unterstützung', text: 'Hilfe bei Hersteller, Modell, Artikelnummer und passenden Alternativen.' },
      ]
    : [
        { kicker: 'B2B', title: 'For business customers', text: 'Catalog and checkout are designed for industrial procurement.' },
        { kicker: 'Stock', title: 'Fast availability', text: 'Used components, machinery and spare parts from existing stock.' },
        { kicker: 'Export', title: 'Worldwide shipping', text: 'International delivery with clear shipping and payment information.' },
        { kicker: 'Service', title: 'Personal support', text: 'Support for manufacturer, model, item number and suitable alternatives.' },
      ],
);
</script>
