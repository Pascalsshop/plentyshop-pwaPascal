<template>
  <footer id="amikon-footer" class="amikon-footer">
    <div class="footer-columns">
      <nav :aria-label="copy.shopping">
        <h2>{{ copy.shopping }}</h2>
        <ul>
          <li>
            <NuxtLink :to="localePath(paths.shipping)">{{ copy.payments }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.shipping)">{{ copy.shipping }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.cart)">{{ copy.cart }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.checkout)">{{ copy.checkout }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/content/hilfe')">{{ copy.help }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <nav :aria-label="copy.company">
        <h2>{{ copy.company }}</h2>
        <ul>
          <li>
            <NuxtLink :to="localePath('/ankaufformular')">{{ copy.purchase }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.contact)">{{ copy.contact }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.privacyPolicy)">{{ copy.privacy }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/content/batterieverordnung')">{{ copy.batteries }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.termsAndConditions)">{{ copy.terms }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.legalDisclosure)">{{ copy.imprint }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(paths.cancellationRights)">{{ copy.cancellation }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <section :aria-label="copy.about">
        <h2>{{ copy.about }}</h2>
        <address>
          AMIKON GMBH<br />
          Einsteinstr. 8a<br />
          46325 Borken<br />
          {{ copy.country }}<br />
          <AmikonProtectedContact kind="phone" />
        </address>
        <p class="opening-hours">{{ copy.weekdays }}<br />07:30 – 16:00 {{ copy.clock }}</p>
        <p class="opening-hours">{{ copy.friday }}<br />07:30 – 15:00 {{ copy.clock }}</p>
      </section>
      <section :aria-label="copy.payments">
        <h2>{{ copy.payments }}</h2>
        <div class="payment-logos">
          <NuxtLink :to="localePath(paths.shipping)" :aria-label="copy.prepayment"
            ><img :src="paymentBase + '/prepayment/images/icon.png'" :alt="copy.prepayment" loading="lazy"
          /></NuxtLink>
          <NuxtLink :to="localePath(paths.shipping)" :aria-label="copy.pickup"
            ><img :src="paymentBase + '/payuponpickup/images/icon.png'" :alt="copy.pickup" loading="lazy"
          /></NuxtLink>
          <NuxtLink :to="localePath(paths.shipping)" :aria-label="copy.invoice + ' – ' + copy.invoiceNote"
            ><img :src="paymentBase + '/invoice/images/icon.png'" :alt="copy.invoice" loading="lazy" /><sup
              >²</sup
            ></NuxtLink
          >
          <NuxtLink :to="localePath(paths.shipping)" aria-label="PayPal" class="paypal"
            ><img :src="paymentBase + '/paypal/images/logos/de-pp-logo.png'" alt="PayPal" loading="lazy"
          /></NuxtLink>
        </div>
        <a class="dealer-link" href="https://www.maschinensucher.de/main/trustseal?customer-number=47177">{{
          copy.dealer
        }}</a>
      </section>
    </div>
    <div class="footer-notes">
      <p>{{ copy.notice }} | ¹ {{ copy.shippingNote }}</p>
      <p>² {{ copy.invoiceNote }}</p>
      <p>© Copyright {{ year }} Amikon GmbH | {{ copy.rights }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalizedPath();
const { locale } = useI18n();
const year = useState('amikon-footer-year', () => new Date().getFullYear());
const paymentBase = 'https://cdn02.plentymarkets.com/7ukspn3affoc/plugin/15';
const copy = computed(() =>
  locale.value.toLowerCase().startsWith('fr')
    ? {
        shopping: 'Achats',
        company: 'Entreprise',
        about: 'À propos de nous',
        payments: 'Modes de paiement',
        shipping: 'Modes et frais de livraison',
        cart: 'Panier',
        checkout: 'Passer commande',
        help: 'Aide',
        purchase: 'Proposer du matériel',
        contact: 'Contact',
        privacy: 'Politique de confidentialité',
        batteries: 'Informations sur les piles',
        terms: 'Conditions générales de vente',
        imprint: 'Mentions légales',
        cancellation: 'Rétractation',
        country: 'Allemagne',
        weekdays: 'Horaires du lundi au jeudi',
        friday: 'Horaires du vendredi',
        clock: '',
        prepayment: 'Paiement anticipé',
        pickup: 'Espèces au retrait',
        invoice: 'Sur facture',
        dealer: 'Notre profil sur Maschinensucher',
        notice: 'Vente exclusivement aux professionnels.',
        shippingNote: 'Hors marchandises encombrantes, transport de fret et livraison internationale',
        invoiceNote: 'Uniquement pour les entreprises établies en Allemagne',
        rights: 'Tous droits réservés.',
      }
    : locale.value.toLowerCase().startsWith('nl')
      ? {
          shopping: 'Winkelen',
          company: 'Bedrijf',
          about: 'Over ons',
          payments: 'Betaalmethoden',
          shipping: 'Verzendmethoden en kosten',
          cart: 'Winkelwagen',
          checkout: 'Afrekenen',
          help: 'Hulp',
          purchase: 'Inkoopformulier',
          contact: 'Contact',
          privacy: 'Privacybeleid',
          batteries: 'Batterij-informatie',
          terms: 'Algemene voorwaarden',
          imprint: 'Colofon',
          cancellation: 'Herroeping',
          country: 'Duitsland',
          weekdays: 'Openingstijden maandag–donderdag',
          friday: 'Openingstijden vrijdag',
          clock: '',
          prepayment: 'Vooruitbetaling',
          pickup: 'Contant bij afhalen',
          invoice: 'Op rekening',
          dealer: 'Ons bedrijfsprofiel op Maschinensucher',
          notice: 'Verkoop uitsluitend aan zakelijke klanten.',
          shippingNote: 'Uitgezonderd omvangrijke goederen, vrachtvervoer en internationale verzending',
          invoiceNote: 'Alleen voor bedrijven gevestigd in Duitsland',
          rights: 'Alle rechten voorbehouden.',
        }
      : locale.value.toLowerCase().startsWith('de')
        ? {
            shopping: 'Einkaufen',
            company: 'Unternehmen',
            about: 'Über uns',
            payments: 'Zahlungsarten',
            shipping: 'Versandarten & Kosten',
            cart: 'Warenkorb',
            checkout: 'Zur Kasse',
            help: 'Hilfe',
            purchase: 'Ankaufformular',
            contact: 'Kontakt',
            privacy: 'Datenschutzerklärung',
            batteries: 'Batterieverordnung',
            terms: 'AGB',
            imprint: 'Impressum',
            cancellation: 'Widerruf',
            country: 'Deutschland',
            weekdays: 'Öffnungszeiten Montag – Donnerstag',
            friday: 'Öffnungszeiten Freitag',
            clock: 'Uhr',
            prepayment: 'Vorkasse',
            pickup: 'Bar bei Abholung',
            invoice: 'Rechnung',
            dealer: 'Unser Händlerprofil bei Maschinensucher',
            notice: 'Der Verkauf richtet sich ausschließlich an Gewerbetreibende!',
            shippingNote: 'Ausgenommen Sperrgut, Spedition und Versand ins Ausland',
            invoiceNote: 'Nur für Firmen mit Sitz in Deutschland',
            rights: 'Alle Rechte vorbehalten.',
          }
        : {
            shopping: 'Shopping',
            company: 'Company',
            about: 'About us',
            payments: 'Payment methods',
            shipping: 'Shipping methods & costs',
            cart: 'Shopping cart',
            checkout: 'Checkout',
            help: 'Help',
            purchase: 'Purchase form',
            contact: 'Contact',
            privacy: 'Privacy policy',
            batteries: 'Battery information',
            terms: 'Terms and conditions',
            imprint: 'Legal disclosure',
            cancellation: 'Cancellation rights',
            country: 'Germany',
            weekdays: 'Opening hours Monday – Thursday',
            friday: 'Opening hours Friday',
            clock: '',
            prepayment: 'Prepayment',
            pickup: 'Cash on collection',
            invoice: 'Invoice',
            dealer: 'Our dealer profile on Maschinensucher',
            notice: 'Sales exclusively to business customers.',
            shippingNote: 'Excludes bulky goods, freight forwarding and international shipping',
            invoiceNote: 'Only for companies based in Germany',
            rights: 'All rights reserved.',
          },
);
</script>

<style scoped>
.amikon-footer {
  background: #fff;
  color: #282d2f;
  padding: 0 15px;
  scroll-margin-top: 185px;
}
.footer-columns {
  max-width: 1570px;
  margin: 0 auto;
  padding: 28px 0 40px;
  border-top: 1px solid #ddd;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
  font-size: 14px;
  line-height: 1.75;
}
.footer-columns h2 {
  text-transform: uppercase;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 8px;
}
.footer-columns ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-columns address {
  font-style: normal;
}
.opening-hours {
  margin-top: 16px;
}
.amikon-footer a {
  color: inherit;
  text-decoration: none;
}
.amikon-footer a:hover {
  color: #392f6e;
  text-decoration: underline;
}
.amikon-footer a:focus-visible {
  outline: 2px solid #392f6e;
  outline-offset: 3px;
}
.payment-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  max-width: 290px;
}
.payment-logos a {
  display: inline-flex;
  align-items: center;
}
.payment-logos img {
  display: block;
  width: 72px;
  height: 54px;
  object-fit: contain;
}
.payment-logos .paypal {
  flex-basis: 100%;
}
.payment-logos .paypal img {
  width: 64px;
  height: 54px;
  object-position: left;
}
.dealer-link {
  display: inline-block;
  margin-top: 26px;
  max-width: 230px;
}
.footer-notes {
  max-width: 1570px;
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  line-height: 1.8;
  padding: 16px 0 24px;
}
@media (max-width: 991px) {
  .footer-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px;
  }
}
@media (max-width: 479px) {
  .footer-columns {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .footer-notes {
    text-align: left;
  }
}
</style>
