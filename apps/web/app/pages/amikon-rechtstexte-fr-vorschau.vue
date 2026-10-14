<template>
  <main>
    <aside class="mx-auto my-6 max-w-5xl rounded border border-neutral-300 p-5" data-testid="legal-preview-notice">
      <h1 class="mb-2 text-xl font-semibold">Französische Rechtstexte – freigegebene Fassung</h1>
      <p>
        Die am 14.10.2026 freigegebenen Übersetzungen für Impressum und Widerruf. Die AGB bleiben ausschließlich auf
        Deutsch. Diese Übersetzungen wurden nicht rechtlich geprüft.
      </p>
      <nav aria-label="Rechtstexte auswählen" class="mt-4 flex flex-wrap gap-4">
        <a href="#mentions-legales" class="underline">Impressum / Mentions légales</a>
        <a href="#retractation" class="underline">Widerruf / Rétractation</a>
      </nav>
    </aside>
    <AmikonInformationAppearance>
      <AmikonFrenchLegalDisclosure />
    </AmikonInformationAppearance>
    <AmikonInformationAppearance>
      <AmikonFrenchCancellationRights />
    </AmikonInformationAppearance>
  </main>
</template>

<script setup lang="ts">
// The preview route stays development-only; approved texts are served by the regular French legal pages.
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' });
}

definePageMeta({ skipBlocksFetch: true });
useHead({
  title: 'Französische Rechtstexte – freigegebene Fassung',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>
