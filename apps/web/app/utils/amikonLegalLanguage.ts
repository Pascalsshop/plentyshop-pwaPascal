export const AMIKON_TERMS_LOCALE = 'de';

/** Resolve non-German terms URLs to the German page without changing legal content or other pages. */
export const getAmikonGermanTermsRedirect = (
  path: string,
  defaultLocale: string,
  availableLocales: readonly string[],
) => {
  const segments = path.split('/').filter(Boolean);
  const language = availableLocales.includes(segments[0] ?? '') ? segments.shift() : defaultLocale;

  if (`/${segments.join('/')}` !== paths.termsAndConditions || language === AMIKON_TERMS_LOCALE) {
    return undefined;
  }

  return `/${AMIKON_TERMS_LOCALE}${paths.termsAndConditions}`;
};
