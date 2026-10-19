import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useLocalizedPath } from '../useLocalizedPath';

const { language, resolvePath } = vi.hoisted(() => {
  const language = { value: 'fr' };
  return {
    language,
    resolvePath: vi.fn((path: string, locale?: string) => `/${locale ?? language.value}${path}`),
  };
});
mockNuxtImport('useI18n', () => () => ({ locale: language }));
mockNuxtImport('useLocalePath', () => () => resolvePath);
mockNuxtImport('useUrlTrailingSlash', () => () => ({
  resolvePathTrailingSlash: (path: string) => `${path.replace(/\/$/, '')}/`,
}));

describe('Localized shop path', () => {
  beforeEach(() => {
    language.value = 'fr';
  });
  it('should preserve current-language links when no language is specified', () => {
    expect(useLocalizedPath()('/contact')).toBe('/fr/contact/');
    expect(resolvePath).toHaveBeenLastCalledWith('/contact', undefined);
  });

  it('should support an explicit German fallback without skipping trailing-slash normalization', () => {
    expect(useLocalizedPath()('/privacy-policy', 'de')).toBe('/de/privacy-policy/');
    expect(resolvePath).toHaveBeenLastCalledWith('/privacy-policy', 'de');
  });

  it.each(['fr', 'nl'] as const)('should route current and explicit %s privacy links to German', (locale) => {
    language.value = locale;
    expect(useLocalizedPath()('/privacy-policy')).toBe('/de/privacy-policy/');
    expect(useLocalizedPath()('/privacy-policy', locale)).toBe('/de/privacy-policy/');
    expect(useLocalizedPath()('/privacy-policy/')).toBe('/de/privacy-policy/');
    expect(useLocalizedPath()('/contact')).toBe(`/${locale}/contact/`);
  });

  it.each(['de', 'en'] as const)('should retain an explicit %s privacy language', (locale) => {
    expect(useLocalizedPath()('/privacy-policy', locale)).toBe(`/${locale}/privacy-policy/`);
  });
});
