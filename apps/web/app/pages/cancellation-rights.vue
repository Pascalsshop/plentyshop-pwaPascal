<template>
  <AmikonInformationAppearance>
    <AmikonFrenchCancellationRights v-if="isFrench" />
    <div v-else-if="getHTMLTexts().trim()" class="no-preflight" v-html="getHTMLTexts()" />
    <AmikonLegalTextUnavailable v-else :fallback-path="paths.cancellationRights" />
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { data, getLegalTexts } = useLegalInformation();
const { locale } = useI18n();
const isFrench = computed(() => locale.value.split('-')[0] === AMIKON_FRENCH_LEGAL_LOCALE);
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();

definePageMeta({
  pageType: 'static',
  key: (route) => route.fullPath,
});

if (!isFrench.value) {
  await getLegalTexts({ type: 'CancellationRights' });
}

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

const icon = 'page';
setPageMeta(t('legal.cancellationRights'), icon);

await getRobots();
setRobotForStaticPage('CancellationRights');
</script>
