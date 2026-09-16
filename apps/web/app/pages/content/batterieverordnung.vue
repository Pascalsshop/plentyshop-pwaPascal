<template>
  <AmikonInformationAppearance>
    <template v-if="english">
      <h1>Battery disposal information</h1>
      <p>
        When selling batteries or supplying equipment containing batteries, the seller provides the following
        information:
      </p>
      <p>
        As an end user, you are legally required to return used batteries. You can return them free of charge to the
        seller or to designated collection points, such as municipal collection facilities or retailers. You can also
        return batteries to the seller by post. The seller reimburses the letter postage for returning your used
        battery.
      </p>
      <h2>Battery symbols</h2>
      <p>The crossed-out wheeled bin means: batteries must not be disposed of with household waste.</p>
      <ul>
        <li>Pb = battery contains more than 0.004 percent lead by mass</li>
        <li>Cd = battery contains more than 0.002 percent cadmium by mass</li>
        <li>Hg = battery contains more than 0.0005 percent mercury by mass</li>
      </ul>
    </template>
    <template v-else>
      <h1>Hinweise zur Batterieentsorgung</h1>
      <p>
        Im Zusammenhang mit dem Vertrieb von Batterien oder mit der Lieferung von Geräten, die Batterien enthalten, ist
        der Verkäufer verpflichtet, Sie auf Folgendes hinzuweisen:
      </p>
      <p>
        Sie sind zur Rückgabe gebrauchter Batterien als Endnutzer gesetzlich verpflichtet. Sie können Batterien nach
        Gebrauch an den Verkäufer oder in den dafür vorgesehenen Rücknahmestellen (z.B. in Kommunalen Sammelstellen oder
        im Handel) unentgeltlich zurückgeben. Sie können die Batterien auch per Post an den Verkäufer zurücksenden. Der
        Verkäufer erstattet Ihnen auf jeden Fall das Briefporto für den Rückversand Ihrer Altbatterie.
      </p>
      <h2>Die auf den Batterien abgebildeten Symbole</h2>
      <p>Eine durchgestrichene Mülltonne bedeutet: Batterie darf nicht in den Hausmüll gegeben werden.</p>
      <ul>
        <li>Pb = Batterie enthält mehr als 0,004 Masseprozent Blei</li>
        <li>Cd = Batterie enthält mehr als 0,002 Masseprozent Cadmium</li>
        <li>Hg = Batterie enthält mehr als 0,0005 Masseprozent Quecksilber.</li>
      </ul>
    </template>
    <img
      src="https://cdn02.plentymarkets.com/7ukspn3affoc/frontend/Grafiken/batterieverordnung.jpg"
      :alt="
        english
          ? 'Crossed-out wheeled bin: do not dispose of batteries with household waste'
          : 'Durchgestrichene Mülltonne: Batterien nicht im Hausmüll entsorgen'
      "
      width="170"
      height="175"
      loading="lazy"
    />
    <h2>{{ english ? 'Contact' : 'Kontakt' }}</h2>
    <address>Amikon GmbH<br />Einsteinstr. 8a<br />46325 Borken</address>
    <p><a href="mailto:info@amikon.de">info@amikon.de</a> · <a href="tel:+492861685300">+49 2861 6853 00</a></p>
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
// Content migrated from the owner's original /content/batterieverordnung page.
// This migration preserves its statements; it is not a legal update.
definePageMeta({ pageType: 'static', skipBlocksFetch: true });
const { locale } = useI18n();
const english = computed(() => locale.value.startsWith('en'));
useHead(() => ({ title: english.value ? 'Battery disposal | Amikon' : 'Batterieverordnung | Amikon' }));
</script>
