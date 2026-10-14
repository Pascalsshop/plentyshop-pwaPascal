import { mount } from '@vue/test-utils';
import FrenchLegalDisclosure from '../FrenchLegalDisclosure.vue';
import FrenchCancellationRights from '../FrenchCancellationRights.vue';

describe('Approved French legal texts', () => {
  const render = (component: typeof FrenchLegalDisclosure) =>
    mount(component, {
      global: {
        stubs: {
          AmikonProtectedContact: {
            props: ['kind'],
            template: '<button :data-kind="kind">Afficher les coordonnées</button>',
          },
        },
      },
    });

  it('should preserve the approved company identifiers and the French language', () => {
    const wrapper = render(FrenchLegalDisclosure);
    expect(wrapper.get('article').attributes('lang')).toBe('fr');
    expect(wrapper.get('h1').text()).toBe('Mentions légales');
    for (const identifier of [
      'Amikon GmbH',
      'Einsteinstraße 8a',
      '46325 Borken',
      'AG Coesfeld',
      'HRB 10083',
      'Dirk Kleinfeld',
      'DE814645334',
    ]) {
      expect(wrapper.text()).toContain(identifier);
    }
    expect(wrapper.text()).toContain('Nous ne sommes ni tenus ni disposés');
    wrapper.unmount();
  });

  it('should retain the withdrawal terms and every printable form field', () => {
    const wrapper = render(FrenchCancellationRights);
    expect(wrapper.get('article').attributes('lang')).toBe('fr');
    expect(wrapper.text()).toContain('B. Formulaire de rétractation');
    expect(wrapper.text()).toContain('Nous prenons en charge les frais de retour des biens.');
    expect(wrapper.text()).toContain('quatorze jours');
    const fields = wrapper.get('[data-testid="withdrawal-form-print-fields"]').findAll('div');
    expect(fields.map((field) => field.text())).toEqual([
      'Biens / services',
      'Commandé le (*) / reçu le (*)',
      'Nom du/des consommateur(s)',
      'Adresse du/des consommateur(s)',
      'Signature du/des consommateur(s) (uniquement en cas de notification sur papier)',
      'Date',
    ]);
    expect(wrapper.text()).toContain('Rayez la mention inutile');
    wrapper.unmount();
  });

  it.each([FrenchLegalDisclosure, FrenchCancellationRights])(
    'should protect contacts and remove draft warnings from the published text',
    (component) => {
      const wrapper = render(component);
      expect(wrapper.html()).not.toMatch(/info@amikon|\+49|mailto:|tel:|fax:/);
      expect(wrapper.text()).not.toContain('Projet de traduction');
      expect(wrapper.find('[data-kind="email"]').exists()).toBe(true);
      expect(wrapper.find('[data-kind="phone"]').exists()).toBe(true);
      wrapper.unmount();
    },
  );

  it('should retain both fax contact locations in the withdrawal text', () => {
    const wrapper = render(FrenchCancellationRights);
    expect(wrapper.findAll('[data-kind="fax"]')).toHaveLength(2);
    wrapper.unmount();
  });
});
