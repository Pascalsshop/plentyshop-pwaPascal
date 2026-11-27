import { mount } from '@vue/test-utils';
import ProductLegalInformation from '../ProductLegalInformation.vue';
import { productLegalInformationBlock } from './ProductLegalInformation.mock';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';
import { amikonModernProductLayoutKey } from '~/utils/amikonProductLayout';

describe('ProductLegalInformation', () => {
  it('should render the block component', () => {
    const wrapper = mount(ProductLegalInformation, {
      props: productLegalInformationBlock,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should render linkText from props', () => {
    const wrapper = mount(ProductLegalInformation, {
      props: productLegalInformationBlock,
    });
    expect(wrapper.text()).toContain(productLegalInformationBlock.content.text.linkText);
  });

  it('should apply new linkText corectly', () => {
    const wrapper = mount(ProductLegalInformation, {
      props: {
        ...productLegalInformationBlock,
        content: {
          ...productLegalInformationBlock.content,
          text: {
            ...productLegalInformationBlock.content.text,
            linkText: 'New Link Text',
          },
          layout: {
            ...productLegalInformationBlock.content.layout,
          },
        },
      },
    });
    const linkText = wrapper.find('[data-testid="link-text"]');
    expect(linkText.exists()).toBe(true);
    expect(linkText.text()).toBe('New Link Text');
  });

  it('should apply inline styles based on layout padding', () => {
    const wrapper = mount(ProductLegalInformation, {
      props: {
        ...productLegalInformationBlock,
        content: {
          ...productLegalInformationBlock.content,
          layout: {
            ...productLegalInformationBlock.content.layout,
            paddingTop: 10,
            paddingBottom: 20,
            paddingLeft: 30,
            paddingRight: 40,
          },
        },
      },
    });
    const mainDiv = wrapper.find('[data-testid="legal-information"]');
    expect(mainDiv.exists()).toBe(true);
    expect(mainDiv.attributes('style')).toContain('padding: 10px 40px 20px 30px;');
  });

  it('opens the existing manufacturer and EU information inline without pre-rendering contact details', async () => {
    useProducts().setCurrentProduct({
      ...ProductMock,
      item: {
        ...ProductMock.item,
        manufacturer: {
          externalName: 'Test-Hersteller',
          responsibleName: 'Test-EU-Stelle',
          responsibleEmail: 'eu@example.invalid',
        },
      },
    });
    const wrapper = mount(ProductLegalInformation, {
      props: productLegalInformationBlock,
      global: { provide: { [amikonModernProductLayoutKey]: ref(true) } },
    });
    const details = wrapper.get('details');
    expect(details.text()).not.toContain('eu@example.invalid');
    details.element.open = true;
    await details.trigger('toggle');
    expect(details.text()).toContain('Test-Hersteller');
    expect(details.text()).toContain('Test-EU-Stelle');
    expect(details.text()).toContain('eu@example.invalid');
    expect(wrapper.find('[data-testid="open-manufacturer-drawer"]').exists()).toBe(false);
  });
});
