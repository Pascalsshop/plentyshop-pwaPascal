import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useLocalizedPath } from '../useLocalizedPath';

const { resolvePath } = vi.hoisted(() => ({
  resolvePath: vi.fn((path: string, locale?: string) => `/${locale ?? 'fr'}${path}`),
}));
mockNuxtImport('useLocalePath', () => () => resolvePath);
mockNuxtImport('useUrlTrailingSlash', () => () => ({ resolvePathTrailingSlash: (path: string) => `${path}/` }));

describe('Localized shop path', () => {
  it('should preserve current-language links when no language is specified', () => {
    expect(useLocalizedPath()('/contact')).toBe('/fr/contact/');
    expect(resolvePath).toHaveBeenLastCalledWith('/contact', undefined);
  });

  it('should support an explicit German fallback without skipping trailing-slash normalization', () => {
    expect(useLocalizedPath()('/privacy-policy', 'de')).toBe('/de/privacy-policy/');
    expect(resolvePath).toHaveBeenLastCalledWith('/privacy-policy', 'de');
  });
});
