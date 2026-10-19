import type { Locale } from '#i18n';

/** Resolve a shop path, optionally in another language, retaining the shop's URL normalization. */
export const useLocalizedPath = () => {
  const rawLocalePath = useLocalePath();
  const { locale: currentLocale } = useI18n();
  const { resolvePathTrailingSlash } = useUrlTrailingSlash();

  return (path: string, locale?: Locale) => {
    const targetLocale =
      path.replace(/\/$/, '') === paths.privacyPolicy && usesAmikonGermanPrivacy(locale ?? currentLocale.value)
        ? AMIKON_PRIVACY_FALLBACK_LOCALE
        : locale;
    return resolvePathTrailingSlash(decodeLocalizedPathSlashes(rawLocalePath(path, targetLocale), path));
  };
};
