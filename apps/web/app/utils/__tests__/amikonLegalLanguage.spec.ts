import { AMIKON_TERMS_LOCALE, getAmikonGermanTermsRedirect } from '../amikonLegalLanguage';
import footer from '../../components/Amikon/Footer.vue?raw';
import checkout from '../../components/CheckoutGeneralTerms/CheckoutGeneralTerms.vue?raw';
import offer from '../../components/OfferPageContent/OfferPageContent.vue?raw';
import help from '../../pages/content/hilfe.vue?raw';

describe('German-only Amikon terms', () => {
  const locales = ['de', 'en', 'fr', 'nl'];

  it.each(['en', 'fr', 'nl'])('should redirect direct %s terms requests to the German page', (language) => {
    expect(getAmikonGermanTermsRedirect(`/${language}/terms-and-conditions`, 'de', locales)).toBe(
      '/de/terms-and-conditions',
    );
    expect(getAmikonGermanTermsRedirect(`/${language}/terms-and-conditions/`, 'de', locales)).toBe(
      '/de/terms-and-conditions',
    );
  });

  it('should leave both German URL variants in place without a redirect loop', () => {
    expect(getAmikonGermanTermsRedirect('/de/terms-and-conditions', 'de', locales)).toBeUndefined();
    expect(getAmikonGermanTermsRedirect('/terms-and-conditions/', 'de', locales)).toBeUndefined();
  });

  it('should redirect an unprefixed terms URL when the shop default language is not German', () => {
    expect(getAmikonGermanTermsRedirect('/terms-and-conditions', 'en', locales)).toBe('/de/terms-and-conditions');
    expect(getAmikonGermanTermsRedirect('/de/terms-and-conditions', 'en', locales)).toBeUndefined();
  });

  it.each(['/nl/privacy-policy', '/fr/cancellation-rights', '/en/legal-disclosure', '/fr/waerme-klimaschraenke', '/'])(
    'should leave other pages unchanged at %s',
    (path) => {
      expect(getAmikonGermanTermsRedirect(path, 'de', locales)).toBeUndefined();
    },
  );

  it('should keep the dedicated target language German', () => {
    expect(AMIKON_TERMS_LOCALE).toBe('de');
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
