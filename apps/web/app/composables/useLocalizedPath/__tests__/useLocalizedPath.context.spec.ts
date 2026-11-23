import { useLocalizedPath } from '../useLocalizedPath';

describe('Localized paths outside component setup', () => {
  it('should resolve category links from a Nuxt plugin or route middleware', () => {
    const app = useNuxtApp();

    expect(getCurrentInstance()).toBeNull();
    const path = app.runWithContext(() => useLocalizedPath()('/roboter'));

    expect(path).toMatch(/\/roboter\/?$/);
  });
});
