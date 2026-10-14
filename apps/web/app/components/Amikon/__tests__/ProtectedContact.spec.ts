import { mount, flushPromises } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import ProtectedContact from '../ProtectedContact.vue';

const { fetchContact } = vi.hoisted(() => ({ fetchContact: vi.fn() }));
vi.mock('ofetch', () => ({ $fetch: fetchContact }));
mockNuxtImport('useI18n', () => () => ({ locale: { value: 'fr' } }));

describe('Protected French contacts', () => {
  beforeEach(() => fetchContact.mockReset());

  it.each([
    ['email', 'Afficher l’adresse e-mail', 'mailto:info@amikon.de', 'info@amikon.de'],
    ['phone', 'Afficher le numéro de téléphone', 'tel:+492861685300', '+49 2861 68 53 00'],
    ['fax', 'Afficher le numéro de fax', 'fax:+4928616853090', '+49 2861 68 53 090'],
  ] as const)('should reveal %s only on user interaction', async (kind, label, href, contactLabel) => {
    const wrapper = mount(ProtectedContact, { props: { kind } });
    expect(wrapper.get('button').text()).toBe(label);
    expect(wrapper.html()).not.toContain(href);
    expect(fetchContact).not.toHaveBeenCalled();

    fetchContact.mockResolvedValue({ href, label: contactLabel });
    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(fetchContact).toHaveBeenCalledExactlyOnceWith('/api/amikon/contact-details', {
      method: 'POST',
      headers: { 'X-Amikon-Contact': 'reveal' },
      body: { kind },
      retry: 0,
    });
    expect(wrapper.get('a').attributes('href')).toBe(href);
    expect(wrapper.get('a').text()).toBe(contactLabel);
    wrapper.unmount();
  });

  it('should retain the retry button when revealing a fax fails', async () => {
    fetchContact.mockRejectedValueOnce(new Error('Unavailable'));
    const wrapper = mount(ProtectedContact, { props: { kind: 'fax' } });
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toBe('Échec du chargement. Cliquez à nouveau.');
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('a').exists()).toBe(false);
    wrapper.unmount();
  });
});
