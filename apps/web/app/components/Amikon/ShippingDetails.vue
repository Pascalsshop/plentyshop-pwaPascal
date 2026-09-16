<template>
  <AmikonInformationAppearance>
    <template v-if="english">
      <h2>Detailed shipping information</h2>
      <h3>Packaging and your own carrier</h3>
      <p>
        We package items carefully. You may arrange your own carrier or shipping account. We do not charge materials or
        handling fees for collection by your carrier. Please notify us in advance so we can prepare the shipment.
      </p>
      <h3>UPS Standard within Germany</h3>
      <p>
        We ship suitable items up to 50 kg and 120 × 60 × 60 cm by UPS Standard, unless they are too delicate. Small
        items normally ship by UPS unless otherwise requested. Current UPS parcel prices and standard delivery times
        apply.
      </p>
      <h3>UPS Express Saver</h3>
      <p>
        Express Saver is available on our UPS account at a higher delivery cost. Our previous shipping information
        specifies next-working-day delivery within Germany; international times may differ. Please confirm time-critical
        deliveries with us in advance. We charge no additional packaging or labour fees for this method and pass on
        available discounts.
      </p>
      <h3>Freight forwarding</h3>
      <p>
        Our carriers include Häberle, Nosta and Schrudde. Our previous shipping information gives an indicative domestic
        cost of EUR 250–350 for a Euro pallet and a usual transit time of two to five days. This is not a binding quote.
        Please request the actual cost for your shipment and destination. We charge the carrier's freight costs.
      </p>
      <h3>Shipping within Germany</h3>
      <p>
        Shipping costs depend on weight. Our previous information specifies a EUR 2 surcharge for German islands. Free
        shipping applies to orders of at least EUR 100 AND parcels weighing no more than 10 kg. Bulky goods, freight
        forwarding and international shipping are excluded. Items over 50 kg require an individual freight quote.
      </p>
      <h3>International shipping</h3>
      <p>
        We ship worldwide. International parcels normally use UPS Express Saver up to 50 kg; heavier shipments need
        another carrier. Please ask for prices and transit times. For destinations outside the EU, the recipient may
        incur additional bank transfer fees, currency conversion charges, customs duties and import taxes.
      </p>
      <h3>Collection</h3>
      <p>
        Collection is free of charge and requires an appointment by phone or email, where necessary before purchase.
        Please observe our limited public opening hours.
      </p>
      <h2>Payment information</h2>
      <h3>Domestic and international orders</h3>
      <p>
        For German deliveries we offer bank transfer, payment on invoice, cash on collection and PayPal unless the
        product description states otherwise. Invoice payment is available only to companies based in Germany.
        International options are bank transfer, cash on collection and PayPal.
      </p>
      <h3>Bank transfer</h3>
      <p>
        Transfer the invoice amount using the specified payment reference. Bank details and the reference are provided
        on the invoice or separately by email during order processing.
      </p>
      <h3>Payment on invoice</h3>
      <p>After receiving your invoice, transfer the amount within the payment period stated on it.</p>
      <h3>Cash on collection</h3>
      <p>
        We notify you by email when the goods are ready. Arrange a collection appointment and pay on site. No shipping
        costs apply.
      </p>
      <address>Amikon GmbH<br />Einsteinstr. 8a<br />46325 Borken, Germany</address>
      <h3>PayPal</h3>
      <p>Pay through PayPal using the payment information stored in your PayPal account.</p>
      <p><NuxtLink :to="localePath('/contact')">Request shipping costs or a collection appointment</NuxtLink></p>
    </template>
    <template v-else>
      <h2>Versandinformationen im Detail</h2>
      <h3>Verpackung und eigener Transportdienst</h3>
      <p>
        Wir verpacken unsere Artikel sorgfältig. Du kannst einen eigenen Paketdienst oder eine Spedition beauftragen und
        den Versand auf deinen Account bestellen. Bei Abholung durch deinen Transportdienst berechnen wir keine
        Material- oder Aufwandskosten. Informiere uns vorher, damit wir die Abholung vorbereiten können.
      </p>
      <h3>Deutschland – UPS Standard</h3>
      <p>
        Bis 50 kg und zu einem Maximalmaß von 120 × 60 × 60 cm versenden wir innerhalb Deutschlands mit UPS Standard,
        sofern die Ware dafür nicht zu empfindlich ist. Kleinteile werden, sofern nicht anders gewünscht, mit UPS
        verschickt. Es gelten die aktuellen UPS-Paketpreise und die normalen Standardlaufzeiten.
      </p>
      <h3>UPS Express Saver</h3>
      <p>
        Als Alternative bieten wir Express Saver auf unserem UPS-Account an. Die Zustellkosten sind höher; laut
        bisheriger Versandinformation erfolgt die Zustellung in Deutschland am nächsten Werktag. Für andere Länder
        können die Laufzeiten abweichen. Bitte stimme zeitkritische Lieferungen vorab mit uns ab. Zusätzliche
        Verpackungs- oder Arbeitskosten werden hierbei nicht berechnet; mögliche Rabatte geben wir weiter.
      </p>
      <h3>Spedition</h3>
      <p>
        Wir arbeiten unter anderem mit Häberle, Nosta und Schrudde. Als unverbindlichen Erfahrungswert nennt unsere
        bisherige Versandinformation für eine Europalette innerhalb Deutschlands 250 bis 350 EUR und meist zwei bis fünf
        Tage Laufzeit. Die konkreten Kosten hängen von Sendung und Ziel ab: Bitte frage diese vorab an. Wir berechnen
        die reinen Speditionskosten.
      </p>
      <h3>Versand innerhalb Deutschlands</h3>
      <p>
        Die Versandkosten richten sich nach dem Gewicht. Für deutsche Inseln nennt die bisherige Versandinformation
        einen Zuschlag von 2 EUR. Gratisversand gilt ab 100 € Bestellwert und gleichzeitig bis 10 kg Paketgewicht.
        Ausgenommen sind Sperrgut, Spedition und Versand ins Ausland. Für Artikel über 50 kg erfolgt der Versand per
        Spedition; die Kosten sind individuell anzufragen.
      </p>
      <h3>Auslandsversand</h3>
      <p>
        Wir liefern weltweit. Auslands-Paketsendungen erfolgen in der Regel mit UPS Express Saver, maximal bis 50 kg;
        schwerere Sendungen benötigen einen anderen Transportdienst. Preise und Laufzeiten sind individuell zu erfragen.
        Außerhalb der EU können zusätzliche Überweisungs- und Wechselkursgebühren, Zölle sowie Einfuhrsteuern entstehen,
        die der Empfänger trägt.
      </p>
      <h3>Selbstabholung</h3>
      <p>
        Die Abholung ist gebührenfrei und nur nach vorheriger Terminabsprache per Telefon oder E-Mail möglich,
        gegebenenfalls bereits vor dem Kauf. Bitte beachte unsere begrenzten Zeiten für den Publikumsverkehr.
      </p>
      <h2>Zahlungsinformationen</h2>
      <h3>Inland und Ausland</h3>
      <p>
        Für Lieferungen innerhalb Deutschlands bieten wir Banküberweisung, Rechnung, Barzahlung bei Abholung und PayPal
        an, soweit die Produktbeschreibung nichts anderes bestimmt. Rechnungskauf ist nur für Firmen mit Sitz in
        Deutschland vorgesehen. Für internationale Lieferungen stehen Banküberweisung, Barzahlung bei Abholung und
        PayPal zur Verfügung.
      </p>
      <h3>Banküberweisung</h3>
      <p>
        Überweise den Rechnungsbetrag mit dem angegebenen Verwendungszweck. Bankverbindung und Verwendungszweck stehen
        auf der Rechnung oder werden dir während der Bestellabwicklung gesondert per E-Mail mitgeteilt.
      </p>
      <h3>Rechnung</h3>
      <p>Überweise nach Rechnungserhalt den Betrag innerhalb der auf der Rechnung angegebenen Zahlungsfrist.</p>
      <h3>Barzahlung bei Abholung</h3>
      <p>
        Wir informieren dich per E-Mail, sobald die Ware zur Abholung bereitsteht. Vereinbare anschließend einen Termin.
        Du bezahlst vor Ort; Versandkosten fallen dabei nicht an.
      </p>
      <address>Amikon GmbH<br />Einsteinstr. 8a<br />46325 Borken</address>
      <h3>PayPal</h3>
      <p>Die Zahlung erfolgt über PayPal mit den in deinem PayPal-Konto hinterlegten Zahlungsinformationen.</p>
      <p><NuxtLink :to="localePath('/contact')">Versandkosten oder Abholtermin anfragen</NuxtLink></p>
    </template>
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
// Source: owner's /content/versand-zahlung, 2026-09-16.
// Merchant confirmed 2026-09-16: minimum 100 EUR order value AND maximum 10 kg parcel weight.
const localePath = useLocalizedPath();
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
</script>
