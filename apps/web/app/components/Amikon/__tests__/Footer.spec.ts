import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import Footer from '../Footer.vue';

const { language } = vi.hoisted(() => ({ language: { value: 'de' } }));
mockNuxtImport('useI18n', () => () => ({ locale: language }));
mockNuxtImport(
  'useLocalizedPath',
  () => () => (path: string, locale?: string) => `/${locale ?? language.value}${path}`,
);

describe('Amikon footer destinations', () => {
  it.each(['de', 'en', 'fr', 'nl'])('should link to the verified Amikon dealer profile in %s', (locale) => {
    language.value = locale;
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
          AmikonProtectedContact: true,
        },
      },
    });

    const dealer = wrapper.get('a[href*="maschinensucher.de"]');
    expect(dealer.attributes('href')).toBe('https://www.maschinensucher.de/Haendler/47177/amikon-gmbh-borken');
    expect(dealer.text()).toContain('Maschinensucher');
    expect(wrapper.find('a[href*="trustseal"]').exists()).toBe(false);
    expect(wrapper.get('a[href$="/terms-and-conditions"]').attributes('href')).toBe('/de/terms-and-conditions');
    wrapper.unmount();
  });
});
