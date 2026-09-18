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

definePageMeta({
  pageType: 'static',
});

const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('CookieBar.keys.PrivacyPolicy'), icon);

await getLegalTexts({
  type: 'PrivacyPolicy',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('PrivacyPolicy');
</script>
