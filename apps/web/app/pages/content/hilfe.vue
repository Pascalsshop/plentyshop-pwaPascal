<template>
  <AmikonInformationAppearance>
    <template v-if="language === 'fr'">
      <h1>Aide à la commande</h1>
      <p>Voici les étapes pour passer une commande dans la boutique Amikon.</p>
      <h2>Panier</h2>
      <p>
        Ajoutez les articles souhaités à votre panier. Vérifiez ou modifiez les quantités, supprimez des articles si
        nécessaire, puis passez à la commande.
      </p>
      <h2>Connexion et inscription</h2>
      <p>
        Connectez-vous à votre compte avec votre adresse e-mail et votre mot de passe, ou inscrivez-vous si vous ne
        possédez pas encore de compte. Suivez les options proposées lors de la commande.
      </p>
      <h2>Adresse de facturation</h2>
      <p>
        Indiquez vos coordonnées de facturation complètes, notamment le nom de votre entreprise et son adresse.
        Remplissez tous les champs obligatoires.
      </p>
      <h2>Adresse de livraison</h2>
      <p>
        Vérifiez l’adresse de livraison. Si nécessaire, saisissez une autre adresse ou sélectionnez une adresse
        enregistrée.
      </p>
      <h2>Livraison et paiement</h2>
      <p>
        Choisissez parmi les modes proposés pour votre commande. Les options disponibles et leurs frais sont affichés
        lors de la commande. Si des informations de paiement supplémentaires sont nécessaires, saisissez-les uniquement
        dans le formulaire de paiement prévu à cet effet.
      </p>
      <p>
        Consultez les <NuxtLink :to="localePath('/shipping')">informations de livraison et de paiement</NuxtLink>. Pour
        un envoi par transporteur ou des besoins de transport particuliers, contactez-nous au préalable.
      </p>
      <h2>Récapitulatif de la commande</h2>
      <p>
        Vérifiez les articles, quantités, adresses, le mode de paiement et le montant total avant l’envoi. Lisez les
        conditions indiquées et confirmez les informations requises. Le bouton final valide une commande avec obligation
        de paiement.
      </p>
      <p>
        Les modalités de conclusion du contrat figurent dans nos
        <NuxtLink :to="localePath('/terms-and-conditions')">conditions générales de vente</NuxtLink>.
      </p>
      <h2>Besoin d’aide ?</h2>
      <p>
        <NuxtLink :to="localePath('/contact')">Contactez-nous</NuxtLink> ou appelez le
        <AmikonProtectedContact kind="phone" />.
      </p>
    </template>
    <template v-else-if="language === 'nl'">
      <h1>Hulp bij het bestellen</h1>
      <p>Volg deze stappen om een bestelling te plaatsen in de Amikon-shop.</p>
      <h2>Winkelwagen</h2>
      <p>
        Voeg de gewenste artikelen toe aan je winkelwagen. Controleer of wijzig de aantallen, verwijder indien nodig
        artikelen en ga vervolgens naar de kassa.
      </p>
      <h2>Inloggen en registreren</h2>
      <p>
        Log in op je bestaande account met je e-mailadres en wachtwoord, of registreer je als je nog geen account hebt.
        Volg de mogelijkheden die tijdens het afrekenen worden aangeboden.
      </p>
      <h2>Factuuradres</h2>
      <p>Vul je volledige factuurgegevens in, waaronder de bedrijfsnaam en het adres. Vul alle verplichte velden in.</p>
      <h2>Bezorgadres</h2>
      <p>Controleer het bezorgadres. Vul indien nodig een afwijkend adres in of selecteer een opgeslagen adres.</p>
      <h2>Verzending en betaling</h2>
      <p>
        Kies uit de methoden die voor je bestelling worden aangeboden. De beschikbare opties en kosten worden bij het
        afrekenen getoond. Vul eventuele aanvullende betaalgegevens alleen in het daarvoor bestemde betaalformulier in.
      </p>
      <p>
        Bekijk de <NuxtLink :to="localePath('/shipping')">informatie over verzending en betaling</NuxtLink>. Neem voor
        vrachtzendingen of bijzondere transportwensen vooraf contact met ons op.
      </p>
      <h2>Besteloverzicht</h2>
      <p>
        Controleer de artikelen, aantallen, adressen, betaalmethode en het totaalbedrag voordat je de bestelling
        verstuurt. Lees de vermelde voorwaarden en bevestig de vereiste gegevens. Met de laatste bestelknop plaats je
        een bestelling met betalingsverplichting.
      </p>
      <p>
        De voorwaarden voor het sluiten van de overeenkomst vind je in onze
        <NuxtLink :to="localePath('/terms-and-conditions')">algemene voorwaarden</NuxtLink>.
      </p>
      <h2>Hulp nodig?</h2>
      <p>
        <NuxtLink :to="localePath('/contact')">Neem contact op</NuxtLink> of bel
        <AmikonProtectedContact kind="phone" />.
      </p>
    </template>
    <template v-else-if="language === 'en'">
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
        <NuxtLink :to="localePath('/contact')">Contact us</NuxtLink> or call <AmikonProtectedContact kind="phone" />.
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
        <AmikonProtectedContact kind="phone" />.
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
const language = computed(() => locale.value.toLowerCase().split('-')[0]);
const titles: Record<string, string> = {
  de: 'Hilfe zum Bestellvorgang',
  en: 'Help with ordering',
  fr: 'Aide à la commande',
  nl: 'Hulp bij het bestellen',
};
useHead(() => ({ title: `${titles[language.value ?? 'de'] ?? titles.de} | Amikon` }));
</script>
