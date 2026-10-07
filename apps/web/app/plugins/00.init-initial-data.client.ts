export default defineNuxtPlugin({
  name: 'init-initial-data-client',
  parallel: true,
  setup() {
    const route = useRoute();
    const isCloudfrontEnabled = useFeatureFlag('shopPwaEnableCloudfront', false);

    if (route.meta.cacheControl && isCloudfrontEnabled.value) {
      const { fetchSession } = useFetchSession();
      // Cached SSR pages deliberately omit private session data. Preserve that
      // initial state until hydration finishes, then apply the customer's cart,
      // currency and net/gross setting without a server/client markup mismatch.
      onNuxtReady(() => fetchSession());
    }
  },
});
