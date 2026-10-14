import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount, flushPromises } from '@vue/test-utils';
import LegalDisclosure from '../legal-disclosure.vue';
import CancellationRights from '../cancellation-rights.vue';

const { language, legalData, getLegalTexts } = vi.hoisted(() => ({
  language: { value: 'fr' },
  legalData: { value: { htmlText: '' } },
  getLegalTexts: vi.fn(),
}));
mockNuxtImport('useI18n', () => () => ({ locale: language }));
mockNuxtImport('useLegalInformation', () => () => ({ data: legalData, getLegalTexts }));
mockNuxtImport('useRobots', () => () => ({ getRobots: vi.fn(), setRobotForStaticPage: vi.fn() }));
mockNuxtImport('usePageMeta', () => () => ({ setPageMeta: vi.fn() }));
mockNuxtImport('t', () => (key: string) => key);

describe('Approved French legal pages', () => {
  beforeEach(() => {
    getLegalTexts.mockReset();
    legalData.value.htmlText = '<p>Configured backend legal text</p>';
  });

  const pages = [
    [LegalDisclosure, 'LegalDisclosure', 'french-imprint'],
    [CancellationRights, 'CancellationRights', 'french-withdrawal'],
  ] as const;
  const render = async (page: typeof LegalDisclosure) => {
    const wrapper = mount(
      {
        components: { LegalPage: page },
        template: '<Suspense><LegalPage /></Suspense>',
      },
      {
        global: {
          stubs: {
            AmikonInformationAppearance: { template: '<section><slot /></section>' },
            AmikonProtectedContact: { template: '<button>Afficher les coordonnées</button>' },
            AmikonLegalTextUnavailable: { template: '<p data-testid="legal-unavailable">Unavailable</p>' },
          },
        },
      },
    );
    await flushPromises();
    return wrapper;
  };

  it.each(pages)(
    'should serve the approved French component without fetching an empty backend text (%s)',
    async (page, _type, testId) => {
      language.value = 'fr';
      const wrapper = await render(page);
      expect(wrapper.get(`[data-testid="${testId}"]`).attributes('lang')).toBe('fr');
      expect(wrapper.text()).not.toContain('Configured backend legal text');
      expect(wrapper.find('[data-testid="legal-unavailable"]').exists()).toBe(false);
      expect(getLegalTexts).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );

  it.each(pages)(
    'should retain configured legal texts in German, English and Dutch (%s)',
    async (page, type, testId) => {
      for (const locale of ['de', 'en', 'nl']) {
        getLegalTexts.mockClear();
        language.value = locale;
        const wrapper = await render(page);
        expect(getLegalTexts).toHaveBeenCalledExactlyOnceWith({ type });
        expect(wrapper.text()).toContain('Configured backend legal text');
        expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(false);
        wrapper.unmount();
      }
    },
  );

  it.each(pages)('should retain the unavailable fallback for other languages (%s)', async (page) => {
    language.value = 'nl';
    legalData.value.htmlText = '';
    const wrapper = await render(page);
    expect(wrapper.find('[data-testid="legal-unavailable"]').exists()).toBe(true);
    wrapper.unmount();
  });
});
