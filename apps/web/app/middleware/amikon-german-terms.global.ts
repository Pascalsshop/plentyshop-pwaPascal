export default defineNuxtRouteMiddleware((to) => {
  const { defaultLocale, availableLocales } = useNuxtApp().$i18n;
  const target = getAmikonGermanTermsRedirect(to.path, defaultLocale, availableLocales);

  if (!target) {
    return;
  }

  const { resolvePathTrailingSlash } = useUrlTrailingSlash();
  return navigateTo({ path: resolvePathTrailingSlash(target), query: to.query, hash: to.hash }, { redirectCode: 302 });
});
