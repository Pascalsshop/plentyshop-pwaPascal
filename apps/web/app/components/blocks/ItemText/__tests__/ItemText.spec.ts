import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ItemTextMock } from './ItemText.mock';
import ItemText from '../ItemText.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { amikonProductLayoutKey } from '~/utils/amikonProductLayout';
import de from '~/lang/de.json?raw';
import en from '~/lang/en.json?raw';
import fr from '~/lang/fr.json?raw';
import nl from '~/lang/nl.json?raw';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

const { language } = vi.hoisted(() => ({ language: { value: 'de' } }));
const translations = { de: JSON.parse(de), en: JSON.parse(en), fr: JSON.parse(fr), nl: JSON.parse(nl) };
mockNuxtImport('useI18n', () => () => ({
  t: () => translations[language.value as keyof typeof translations].product.details,
}));

describe('ItemText.vue', () => {
  const renderTitle = (title = 'Item details', arranged = true, collapsible = false) =>
    mount(ItemText, {
      props: {
        ...ItemTextMock,
        content: {
          ...ItemTextMock.content,
          text: { title },
          layout: { ...ItemTextMock.content.layout, displayAsCollapsable: collapsible },
        },
      },
      global: { provide: { [amikonProductLayoutKey as symbol]: ref(arranged) } },
    });

  it.each(['de', 'en', 'fr', 'nl'] as const)('localizes inherited headings in %s', (locale) => {
    language.value = locale;
    expect(renderTitle().get('h2').text()).toBe(translations[locale].product.details);
  });

  it('retains individually configured headings', () => {
    language.value = 'nl';
    expect(renderTitle('Ausstattung und Lieferumfang').get('h2').text()).toBe('Ausstattung und Lieferumfang');
  });

  it('localizes the default-template key when the fallback locale has not loaded', () => {
    language.value = 'fr';
    expect(renderTitle('defaultTemplate.product.itemText.title').get('h2').text()).toBe('Détails de l’article');
  });

  it.each(['fr', 'nl'] as const)('supplies translated product template headings in %s', (locale) => {
    const defaults = translations[locale].defaultTemplate.product;
    expect(defaults.itemText.title).toBe(translations[locale].product.details);
    expect(defaults.technicalData.title).not.toContain('defaultTemplate.');
    expect(defaults.productLegalInformation.linkText).not.toContain('defaultTemplate.');
  });

  it('leaves stored headings unchanged outside the Amikon layout and in Builder editing', () => {
    language.value = 'fr';
    expect(renderTitle('Item details', false).get('h2').text()).toBe('Item details');
  });

  it('also localizes the collapsible panel heading', () => {
    language.value = 'nl';
    const { setCurrentProduct } = useProducts();
    const product = structuredClone(ProductMock);
    product.texts.description = 'Test description';
    setCurrentProduct(product);
    expect(renderTitle('Item details', true, true).get('h2').text()).toBe('Artikelgegevens');
  });

  it('should render item text accordeon open if displayAsCollapsable and initallyCollapsed is true', async () => {
    const wrapper = mount(ItemText, {
      props: { ...ItemTextMock },
    });
    const isOpen = ItemTextMock.content.layout.displayAsCollapsable && ItemTextMock.content.layout.initiallyCollapsed;
    const itemText = wrapper.find('[data-testid="item-text-innertext"]');

    expect(itemText.exists()).toBe(isOpen);
  });
  it('should render element with correct padding', () => {
    const wrapper = mount(ItemText, {
      props: { ...ItemTextMock },
    });
    const paddingTop = ItemTextMock.content?.layout.paddingTop;
    const itemText = wrapper.find('[data-testid="item-text-block"]');

    expect((itemText.element as HTMLElement).style.paddingTop).toBe(`${paddingTop}px`);
  });
});
