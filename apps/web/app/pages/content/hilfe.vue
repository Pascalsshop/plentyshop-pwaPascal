<template>
  <AmikonInformationAppearance>
    <template v-if="english">
      <h1>Help with ordering</h1>
      <p>Follow these steps to place an order in the Amikon shop.</p>
      <h2>Shopping cart</h2>
      <p>
        Add the items you want to your cart. Review quantities, change them or remove items, then proceed to checkout.
      </p>
      <h2>Sign in and registration</h2>
      <p>
        Sign in to your existing account with your email address and password, or register if you do not yet have an
        account. Follow the options offered during checkout.
      </p>
      <h2>Billing address</h2>
      <p>Enter your complete billing details, including company name and address. Complete all required fields.</p>
      <h2>Shipping address</h2>
      <p>Check the delivery address. Enter a different shipping address or select a saved address if needed.</p>
      <h2>Shipping and payment</h2>
      <p>
        Select from the methods offered for your order. Available methods and costs are shown at checkout. If additional
        payment details are needed, enter them only in the payment form provided.
      </p>
      <p>
        See <NuxtLink :to="localePath('/shipping')">shipping and payment information</NuxtLink>. Please contact us in
        advance for freight shipments or special transport requirements.
      </p>
      <h2>Order review</h2>
      <p>
        Check items, quantities, addresses, payment method and the total before submitting. Read the linked conditions
        and confirm the required information. The final order button places an order with an obligation to pay.
      </p>
      <p>
        Contract formation is explained in our
        <NuxtLink :to="localePath('/terms-and-conditions')">terms and conditions</NuxtLink>.
      </p>
      <h2>Need assistance?</h2>
      <p>
        <NuxtLink :to="localePath('/contact')">Contact us</NuxtLink> or call
        <a href="tel:+492861685300">+49 2861 6853 00</a>.
      </p>
    </template>
    <template v-else>
      <h1>Hilfe zum Bestellvorgang</h1>
      <p>Hier findest du die Schritte für deine Bestellung im Amikon-Shop.</p>
      <h2>Warenkorb</h2>
      <p>
        Lege die gewünschten Artikel in den Warenkorb. Dort kannst du die Mengen prüfen, ändern oder Artikel entfernen.
        Über „Zur Kasse“ gelangst du zum Bestellvorgang.
      </p>
      <h2>Anmeldung und Registrierung</h2>
      <p>
        Mit einem bestehenden Kundenkonto meldest du dich mit E-Mail-Adresse und Passwort an. Falls du noch kein Konto
        hast, kannst du dich registrieren. Nutze die im Checkout angebotenen Möglichkeiten, um deine Bestellung
        fortzusetzen.
      </p>
      <h2>Rechnungsanschrift</h2>
      <p>
        Gib deine vollständigen Rechnungsdaten an und kontrolliere insbesondere Firmenname und Anschrift. Beachte die
        Pflichtfelder im Formular.
      </p>
      <h2>Lieferanschrift</h2>
      <p>
        Prüfe die Lieferadresse. Soll die Lieferung an eine andere Adresse gehen, gib eine abweichende Lieferanschrift
        an oder wähle eine hinterlegte Adresse aus.
      </p>
      <h2>Versand und Zahlung</h2>
      <p>
        Wähle aus den für deine Bestellung angebotenen Versand- und Zahlungsarten. Die verfügbaren Möglichkeiten und
        Kosten werden im Checkout angezeigt. Falls eine Zahlungsart zusätzliche Angaben verlangt, trage sie nur im dafür
        vorgesehenen Zahlungsformular ein.
      </p>
      <p>
        Details findest du unter <NuxtLink :to="localePath('/shipping')">Versand und Zahlungsarten</NuxtLink>. Bei
        Speditionsware oder besonderen Transportanforderungen kontaktiere uns bitte vorab.
      </p>
      <h2>Bestellübersicht</h2>
      <p>
        Kontrolliere vor dem Absenden Artikel, Mengen, Rechnungs- und Lieferanschrift, Zahlungsart und Gesamtbetrag.
        Lies die verlinkten Bedingungen und bestätige die erforderlichen Angaben. Der abschließende Bestellbutton löst
        eine zahlungspflichtige Bestellung aus.
      </p>
      <p>
        Die Bedingungen für den Vertragsschluss findest du in unseren
        <NuxtLink :to="localePath('/terms-and-conditions')">AGB</NuxtLink>.
      </p>
      <h2>Du benötigst Unterstützung?</h2>
      <p>
        <NuxtLink :to="localePath('/contact')">Zum Kontaktformular</NuxtLink> oder telefonisch unter
        <a href="tel:+492861685300">+49 2861 6853 00</a>.
      </p>
    </template>
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
// Original help topics retained, wording adapted to the PWA checkout.
// Do not promise the old direct-debit method when the backend does not offer it.
definePageMeta({ pageType: 'static', skipBlocksFetch: true });
const localePath = useLocalizedPath();
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
useHead(() => ({ title: english.value ? 'Help with ordering | Amikon' : 'Hilfe zum Bestellvorgang | Amikon' }));
</script>
