<template>
  <AmikonInformationAppearance>
    <div v-if="getHTMLTexts().trim()" class="no-preflight" v-html="getHTMLTexts()" />
    <AmikonLegalTextUnavailable v-else />
  </AmikonInformationAppearance>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { data, getLegalTexts } = useLegalInformation();
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'CancellationRights',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

const icon = 'page';
setPageMeta(t('legal.cancellationRights'), icon);

await getRobots();
setRobotForStaticPage('CancellationRights');
</script>
