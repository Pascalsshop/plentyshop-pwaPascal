export const AMIKON_TERMS_LOCALE = 'de';
export const AMIKON_FRENCH_LEGAL_LOCALE = 'fr';
export const AMIKON_PRIVACY_FALLBACK_LOCALE = 'de';

/** Use the existing German privacy policy for French and Dutch without translating legal text. */
export const usesAmikonGermanPrivacy = (locale: string) => ['fr', 'nl'].includes(locale.split('-')[0] ?? '');

/** Resolve German-only legal pages without changing their content or unrelated language routes. */
export const getAmikonGermanLegalRedirect = (
  path: string,
  defaultLocale: string,
  availableLocales: readonly string[],
) => {
  const segments = path.split('/').filter(Boolean);
  const language = availableLocales.includes(segments[0] ?? '') ? (segments.shift() ?? defaultLocale) : defaultLocale;
  const pagePath = `/${segments.join('/')}`;
  if (pagePath === paths.termsAndConditions && language !== AMIKON_TERMS_LOCALE) {
    return `/${AMIKON_TERMS_LOCALE}${pagePath}`;
  }
  if (pagePath === paths.privacyPolicy && usesAmikonGermanPrivacy(language)) {
    return `/${AMIKON_PRIVACY_FALLBACK_LOCALE}${pagePath}`;
  }
  return undefined;
};
