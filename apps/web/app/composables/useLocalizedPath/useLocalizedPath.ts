import type { Locale } from '#i18n';

/** Resolve a shop path, optionally in another language, retaining the shop's URL normalization. */
export const useLocalizedPath = () => {
  const rawLocalePath = useLocalePath();
  const { resolvePathTrailingSlash } = useUrlTrailingSlash();

  return (path: string, locale?: Locale) =>
    resolvePathTrailingSlash(decodeLocalizedPathSlashes(rawLocalePath(path, locale), path));
};
