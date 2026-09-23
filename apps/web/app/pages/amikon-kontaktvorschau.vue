<template>
  <main class="mx-auto max-w-4xl px-4 py-10">
    <p class="mb-6 rounded border border-amber-300 bg-amber-50 p-4">
      Lokale Vorschau der Kontaktanzeigen. Klicke auf „E-Mail anzeigen“ oder „Telefonnummer anzeigen“.
      Es wird keine Nachricht versendet.
    </p>
    <h1 class="mb-6 text-3xl font-bold">Kontakt</h1>
    <AmikonContactDetails />
  </main>
</template>

<script setup lang="ts">
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' });
definePageMeta({ skipBlocksFetch: true });
</script>
