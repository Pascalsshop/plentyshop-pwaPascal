<template>
  <article class="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900" data-testid="amikon-shipping-information">
    <h1 class="mb-6 text-3xl font-semibold text-[#392f6e]">
      {{ english ? 'Shipping and collection' : 'Versand und Abholung' }}
    </h1>
    <div class="grid gap-5 @md:grid-cols-2">
      <section
        v-for="section in sections"
        :key="section.title"
        class="rounded-lg border border-neutral-200 bg-[#f7f7f9] p-5"
      >
        <h2 class="mb-3 text-xl font-semibold">{{ section.title }}</h2>
        <p class="leading-7">{{ section.text }}</p>
      </section>
    </div>
    <section class="mt-6 rounded-lg border border-neutral-200 p-5">
      <h2 class="mb-3 text-xl font-semibold">{{ english ? 'Payment methods' : 'Zahlungsarten' }}</h2>
      <p class="leading-7">
        {{
          english
            ? 'Bank transfer, PayPal and cash on collection. Payment on invoice is available for companies based in Germany, subject to the offer.'
            : 'Banküberweisung, PayPal und Barzahlung bei Abholung. Rechnungskauf für Firmen mit Sitz in Deutschland, gemäß dem jeweiligen Angebot.'
        }}
      </p>
    </section>
    <div class="mt-6 rounded-lg border border-[#392f6e] p-5">
      <h2 class="mb-3 text-xl font-semibold">
        {{ english ? 'Questions about shipping costs?' : 'Fragen zu den Versandkosten?' }}
      </h2>
      <p class="mb-4 leading-7">
        {{
          english
            ? 'Please contact us for a shipping quote for your item and destination.'
            : 'Bitte fragt die Versandkosten für euren Artikel und den gewünschten Lieferort bei uns an.'
        }}
      </p>
      <NuxtLink
        :to="localePath(paths.contact)"
        class="inline-flex rounded bg-[#392f6e] px-5 py-3 font-semibold text-white"
      >
        {{ english ? 'Contact us' : 'Kontakt aufnehmen' }}
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
// Source: https://www.amikon-shop.de/content/versand-zahlung
// Conflicting free-shipping thresholds are deliberately not copied without confirmation.
const { locale } = useI18n();
const localePath = useLocalizedPath();
const english = computed(() => locale.value.startsWith('en'));
const sections = computed(() =>
  english.value
    ? [
        {
          title: 'Packaging and transport',
          text: 'We carefully package our items. Our logistics partners include UPS, Häberle, Nosta and Schrudde. You may also arrange your own carrier; please coordinate collection with us in advance.',
        },
        {
          title: 'Parcels and express delivery',
          text: 'Parcel shipping is available via UPS Standard or UPS Express Saver. The appropriate service depends on the size, weight and sensitivity of the item.',
        },
        {
          title: 'Freight and international shipping',
          text: 'We ship worldwide. Freight costs depend on the shipment and destination and must be quoted individually. International deliveries may incur additional import duties and fees.',
        },
        {
          title: 'Collection in Borken',
          text: 'Collection is free of charge and requires an appointment by phone or email. Our address is Einsteinstr. 8a, 46325 Borken, Germany.',
        },
      ]
    : [
        {
          title: 'Verpackung und Transport',
          text: 'Wir verpacken unsere Artikel sorgfältig. Zu unseren Logistikpartnern gehören UPS, Häberle, Nosta und Schrudde. Ihr könnt auch einen eigenen Transportdienst beauftragen. Bitte stimmt die Abholung vorher mit uns ab.',
        },
        {
          title: 'Paket- und Expressversand',
          text: 'Der Paketversand erfolgt mit UPS Standard oder UPS Express Saver. Welche Versandart geeignet ist, hängt von Größe, Gewicht und Empfindlichkeit des Artikels ab.',
        },
        {
          title: 'Spedition und Ausland',
          text: 'Wir versenden weltweit. Speditionskosten hängen von Sendung und Lieferort ab und werden individuell angefragt. Bei Auslandslieferungen können zusätzliche Einfuhrabgaben und Gebühren anfallen.',
        },
        {
          title: 'Selbstabholung in Borken',
          text: 'Die Abholung ist gebührenfrei und nur nach vorheriger Terminabsprache per Telefon oder E-Mail möglich. Unsere Adresse: Einsteinstr. 8a, 46325 Borken, Deutschland.',
        },
      ],
);
</script>
