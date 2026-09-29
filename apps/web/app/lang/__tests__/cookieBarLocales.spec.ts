import de from '../de.json';
import en from '../en.json';
import fr from '../fr.json';
import nl from '../nl.json';

const keys = (value: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === 'object' ? keys(child as Record<string, unknown>, path) : [path];
  });

const get = (value: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((current, key) => (current as Record<string, unknown> | undefined)?.[key], value);

describe.each([
  ['nl', nl.CookieBar],
  ['fr', fr.CookieBar],
])('CookieBar %s', (_locale, translations) => {
  it('has a translation for every cookie-bar message', () => {
    expect(keys(translations).sort()).toEqual(keys(en.CookieBar).sort());
  });

  it('keeps the German explanatory wording unchanged', () => {
    for (const path of [
      'about.description',
      'essentials.description',
      'externalMedia.description',
      'functional.description',
      'marketing.description',
      'essentials.cookies.cloudflareTurnstile.status',
      'essentials.cookies.consentCookie.status',
      'essentials.cookies.payPal.status',
      'essentials.cookies.plentyId.status',
    ]) {
      expect(get(translations, path)).toStrictEqual(get(de.CookieBar, path));
    }
  });

  it('localizes the consent controls', () => {
    for (const path of ['Accept All', 'Reject All', 'Accept Selection', 'Further Settings']) {
      expect(get(translations, path)).not.toStrictEqual(get(en.CookieBar, path));
    }
  });
});
