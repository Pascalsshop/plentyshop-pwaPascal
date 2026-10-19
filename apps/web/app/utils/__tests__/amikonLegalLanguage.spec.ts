import { AMIKON_TERMS_LOCALE, getAmikonGermanLegalRedirect, usesAmikonGermanPrivacy } from '../amikonLegalLanguage';
import footer from '../../components/Amikon/Footer.vue?raw';
import checkout from '../../components/CheckoutGeneralTerms/CheckoutGeneralTerms.vue?raw';
import offer from '../../components/OfferPageContent/OfferPageContent.vue?raw';
import help from '../../pages/content/hilfe.vue?raw';

describe('German-only Amikon terms', () => {
  const locales = ['de', 'en', 'fr', 'nl'];

  it.each(['en', 'fr', 'nl'])('should redirect direct %s terms requests to the German page', (language) => {
    expect(getAmikonGermanLegalRedirect(`/${language}/terms-and-conditions`, 'de', locales)).toBe(
      '/de/terms-and-conditions',
    );
    expect(getAmikonGermanLegalRedirect(`/${language}/terms-and-conditions/`, 'de', locales)).toBe(
      '/de/terms-and-conditions',
    );
  });

  it('should leave both German URL variants in place without a redirect loop', () => {
    expect(getAmikonGermanLegalRedirect('/de/terms-and-conditions', 'de', locales)).toBeUndefined();
    expect(getAmikonGermanLegalRedirect('/terms-and-conditions/', 'de', locales)).toBeUndefined();
  });

  it('should redirect an unprefixed terms URL when the shop default language is not German', () => {
    expect(getAmikonGermanLegalRedirect('/terms-and-conditions', 'en', locales)).toBe('/de/terms-and-conditions');
    expect(getAmikonGermanLegalRedirect('/de/terms-and-conditions', 'en', locales)).toBeUndefined();
  });

  it.each(['/en/privacy-policy', '/fr/cancellation-rights', '/en/legal-disclosure', '/fr/waerme-klimaschraenke', '/'])(
    'should leave other pages unchanged at %s',
    (path) => {
      expect(getAmikonGermanLegalRedirect(path, 'de', locales)).toBeUndefined();
    },
  );

  it('should keep the dedicated target language German', () => {
    expect(AMIKON_TERMS_LOCALE).toBe('de');
  });

  it.each(['fr', 'nl'])('should route %s privacy requests to German without a new translation', (locale) => {
    expect(getAmikonGermanLegalRedirect(`/${locale}/privacy-policy`, 'de', locales)).toBe('/de/privacy-policy');
    expect(getAmikonGermanLegalRedirect(`/${locale}/privacy-policy/`, 'en', locales)).toBe('/de/privacy-policy');
    expect(getAmikonGermanLegalRedirect('/privacy-policy', locale, locales)).toBe('/de/privacy-policy');
    expect(usesAmikonGermanPrivacy(locale)).toBe(true);
  });

  it.each(['de', 'en'])('should preserve %s privacy requests without redirect loops', (locale) => {
    expect(getAmikonGermanLegalRedirect(`/${locale}/privacy-policy`, 'de', locales)).toBeUndefined();
    expect(getAmikonGermanLegalRedirect('/privacy-policy', locale, locales)).toBeUndefined();
    expect(usesAmikonGermanPrivacy(locale)).toBe(false);
  });

  it.each([
    ['footer', footer],
    ['checkout', checkout],
    ['offer', offer],
    ['help', help],
  ])('should route every terms link in %s directly to the German page', (_label, source) => {
    const links = source.match(/localePath\(paths\.termsAndConditions[^)]*\)/g) ?? [];
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toBe('localePath(paths.termsAndConditions, AMIKON_TERMS_LOCALE)');
    }
  });
});
