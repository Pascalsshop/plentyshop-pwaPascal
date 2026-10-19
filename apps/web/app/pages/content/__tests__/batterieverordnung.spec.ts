import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import BatteryInformation from '../batterieverordnung.vue';
import ProtectedContact from '~/components/Amikon/ProtectedContact.vue';

const { language, fetchContact } = vi.hoisted(() => ({
  language: { value: 'de' },
  fetchContact: vi.fn(),
}));
vi.mock('ofetch', () => ({ $fetch: fetchContact }));
mockNuxtImport('useI18n', () => () => ({ locale: language }));
mockNuxtImport('useHead', () => vi.fn());

describe('Battery disposal contacts', () => {
  it.each([
    ['de', 'Hinweise zur Batterieentsorgung', 'E-Mail anzeigen', 'Telefonnummer anzeigen'],
    ['en', 'Battery disposal information', 'Show email', 'Show phone number'],
    ['fr', 'Hinweise zur Batterieentsorgung', 'Afficher l’adresse e-mail', 'Afficher le numéro de téléphone'],
    ['nl', 'Hinweise zur Batterieentsorgung', 'E-mailadres tonen', 'Telefoonnummer tonen'],
  ])('should protect contacts without changing the legal language in %s', (locale, heading, email, phone) => {
    language.value = locale;
    const wrapper = mount(BatteryInformation, {
      global: {
        stubs: { AmikonInformationAppearance: { template: '<section><slot /></section>' } },
        components: { AmikonProtectedContact: ProtectedContact },
      },
    });

    expect(wrapper.get('h1').text()).toBe(heading);
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([email, phone]);
    expect(wrapper.html()).not.toMatch(/info@amikon\.de|mailto:|tel:|492861/);
    expect(fetchContact).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Amikon GmbH');
    expect(wrapper.get('img').attributes('src')).toContain('/Grafiken/batterieverordnung.jpg');
    wrapper.unmount();
  });
});
