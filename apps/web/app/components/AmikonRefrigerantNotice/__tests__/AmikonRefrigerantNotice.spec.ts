import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import AmikonRefrigerantNotice from '../AmikonRefrigerantNotice.vue';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';
import { amikonProductLayoutKey } from '~/utils/amikonProductLayout';
import de from '~/lang/de.json?raw';
import en from '~/lang/en.json?raw';
import fr from '~/lang/fr.json?raw';
import nl from '~/lang/nl.json?raw';

const { language } = vi.hoisted(() => ({ language: { value: 'de' } }));
// Read original strings; Nuxt's normal locale imports are compiled message ASTs.
const copies = {
  de: JSON.parse(de),
  en: JSON.parse(en),
  fr: JSON.parse(fr),
  nl: JSON.parse(nl),
} as Record<'de' | 'en' | 'fr' | 'nl', { amikonRefrigerant: Record<string, string> }>;
mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => copies[language.value as keyof typeof copies].amikonRefrigerant[key.split('.')[1]!],
}));
mockNuxtImport('useLocalePath', () => () => (path: string) => `/${language.value}${path}`);
mockNuxtImport('useCategoryTree', () => () => ({ data: ref([]) }));

describe('Amikon refrigerant notice', () => {
  const createProduct = () => {
    const product = structuredClone(ProductMock);
    product.defaultCategories[0]!.id = 48;
    return product;
  };
  const render = (product = createProduct(), arranged = true) =>
    mount(AmikonRefrigerantNotice, {
      props: { product },
      global: {
        provide: { [amikonProductLayoutKey as symbol]: ref(arranged) },
        stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
      },
    });

  it.each(['de', 'en', 'fr', 'nl'] as const)('renders all six steps and the localized contact link in %s', (locale) => {
    language.value = locale;
    const wrapper = render();
    const copy = copies[locale].amikonRefrigerant;
    expect(wrapper.get('h2').text()).toBe(copy.title);
    expect(wrapper.get('p').text()).toBe(copy.intro);
    expect(wrapper.findAll('li').map((li) => li.text())).toEqual([
      copy.recovery,
      copy.components,
      copy.refilling,
      copy.adjustment,
      copy.leakTest,
      copy.testRun,
    ]);
    expect(wrapper.get('a').attributes('href')).toBe(`/${locale}/contact`);
  });

  it('does not add the notice to unrelated articles', () => {
    expect(render(ProductMock).find('[data-testid="refrigerant-notice"]').exists()).toBe(false);
  });

  it('leaves Builder editing unchanged', () => {
    expect(render(createProduct(), false).find('[data-testid="refrigerant-notice"]').exists()).toBe(false);
  });

  it('also retains the informational notice for sold climate equipment', () => {
    const product = createProduct();
    product.variation.availability.id = 5;
    expect(render(product).find('[data-testid="refrigerant-notice"]').exists()).toBe(true);
  });
});
