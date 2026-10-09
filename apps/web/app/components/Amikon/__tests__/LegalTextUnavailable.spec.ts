import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import LegalTextUnavailable from '../LegalTextUnavailable.vue';
import de from '~/lang/de.json?raw';
import en from '~/lang/en.json?raw';
import fr from '~/lang/fr.json?raw';
import nl from '~/lang/nl.json?raw';

const { language } = vi.hoisted(() => ({ language: { value: 'de' } }));
const copies = { de: JSON.parse(de), en: JSON.parse(en), fr: JSON.parse(fr), nl: JSON.parse(nl) } as Record<
  'de' | 'en' | 'fr' | 'nl',
  { amikonLegalUnavailable: Record<string, string>; lang: Record<string, string> }
>;
mockNuxtImport('useI18n', () => () => ({
  locale: language,
  t: (key: string) => copies[language.value as keyof typeof copies].amikonLegalUnavailable[key.split('.')[1]!],
}));
mockNuxtImport('useLocalizedPath', () => () => (path: string, locale: string) => `/${locale}${path}`);

describe('Unavailable Amikon legal information', () => {
  const render = (fallbackPath?: string) =>
    mount(LegalTextUnavailable, {
      props: { fallbackPath },
      global: {
        stubs: {
          NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
          AmikonProtectedContact: { props: ['kind'], template: '<button :data-kind="kind">Reveal contact</button>' },
        },
      },
    });

  it.each(['de', 'en', 'fr', 'nl'] as const)(
    'should localize the status without inserting a legal text in %s',
    (locale) => {
      language.value = locale;
      const wrapper = render('/privacy-policy');
      expect(wrapper.get('h1').text()).toBe(copies[locale].amikonLegalUnavailable.title);
      expect(wrapper.get('p').text()).toBe(copies[locale].amikonLegalUnavailable.description);
      expect(wrapper.find('[v-html]').exists()).toBe(false);
      expect(wrapper.findAll('button').map((button) => button.attributes('data-kind'))).toEqual(['email', 'phone']);
      expect(wrapper.html()).not.toMatch(/mailto:|tel:|info@amikon/);
      wrapper.unmount();
    },
  );

  it.each(['/privacy-policy', '/terms-and-conditions', '/legal-disclosure', '/cancellation-rights'])(
    'should link explicitly to the German version of %s instead of the missing French page',
    (path) => {
      language.value = 'fr';
      const wrapper = render(path);
      expect(wrapper.get('[data-testid="legal-german-version"]').attributes('href')).toBe(`/de${path}`);
      expect(wrapper.get('a').text()).toBe(copies.fr.amikonLegalUnavailable.germanVersion);
      wrapper.unmount();
    },
  );

  it('should not loop back to the same German page', () => {
    language.value = 'de';
    const wrapper = render('/privacy-policy');
    expect(wrapper.find('a').exists()).toBe(false);
    wrapper.unmount();
  });

  it('should not guess a fallback when no canonical page is provided', () => {
    language.value = 'fr';
    const wrapper = render();
    expect(wrapper.find('a').exists()).toBe(false);
    wrapper.unmount();
  });

  it('should include native language names for both French and Dutch selectors', () => {
    expect(copies.fr.lang).toMatchObject({ de: 'Allemand', en: 'Anglais', fr: 'Français', nl: 'Néerlandais' });
    expect(copies.nl.lang).toMatchObject({ de: 'Duits', en: 'Engels', fr: 'Frans', nl: 'Nederlands' });
  });
});
