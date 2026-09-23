<template>
  <main>
    <p class="mx-auto max-w-5xl rounded border border-amber-400 bg-amber-50 p-4">
      Lokale Formatvorschau mit Beispieltext, keine gültigen Rechtstexte. Die echten Seiten verwenden weiterhin die
      Inhalte aus PlentyONE.
    </p>
    <nav aria-label="Weitere Vorschauseiten" class="mx-auto my-4 flex max-w-5xl flex-wrap gap-4 px-4">
      <NuxtLink to="/amikon-ankaufvorschau" class="underline">Ankaufformular testen (kein Versand)</NuxtLink>
      <NuxtLink to="/contact" class="underline">Kontaktseite ansehen</NuxtLink>
      <NuxtLink to="/content/batterieverordnung" class="underline">Batterieverordnung</NuxtLink>
      <NuxtLink to="/content/hilfe" class="underline">Hilfe zum Bestellvorgang</NuxtLink>
      <NuxtLink to="/shipping" class="underline">Versand und Zahlungsarten</NuxtLink>
    </nav>
    <AmikonInformationAppearance>
      <div class="no-preflight" data-testid="information-fixture" v-html="sample" />
    </AmikonInformationAppearance>
  </main>
</template>

<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ skipBlocksFetch: true });
const sample =
  '<h1>Unternehmensinformationen – Formatvorschau</h1><p>Hier prüfen wir die Lesbarkeit der Unternehmensseiten. Dieser Beispieltext dient ausschließlich der Gestaltung und enthält keine rechtlichen Regelungen.</p><h2>1. Überschriften und Absätze</h2><p>Längere Inhalte erhalten eine begrenzte Zeilenbreite und deutliche Abstände. Die Texte aus dem Backend werden dabei nicht umgeschrieben oder gekürzt.</p><h4>Unterabschnitt wie in den ursprünglichen AGB</h4><ul><li>Gut erkennbare Aufzählungen</li><li>Lesbare Links: <a href="/contact">Kontaktformular</a></li></ul><h2>2. Kontaktinformationen</h2><address>Amikon GmbH<br>Einsteinstr. 8a<br>46325 Borken</address><h2>3. Tabellen und lange Zeichenfolgen</h2><table><tr><th>Beispiel</th><th>Hinweis</th></tr><tr><td>Mobile Darstellung</td><td>Tabellen bleiben innerhalb der Inhaltsfläche scrollbar.</td></tr></table><p>Beispielreferenz: ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</p>';
</script>
