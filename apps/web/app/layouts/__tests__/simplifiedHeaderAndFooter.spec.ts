import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { parse, compileTemplate } from '@vue/compiler-sfc';
import Layout from '../simplifiedHeaderAndFooter.vue';
import AmikonShopTools from '../../components/AmikonShopTools/AmikonShopTools.vue';
import layoutSource from '../simplifiedHeaderAndFooter.vue?raw';

mockNuxtImport('usePageTitle', () => () => {});
mockNuxtImport('useStructuredData', () => () => ({ setLogoMeta: () => {} }));

describe('simplified checkout layout', () => {
  it('should put both launchers in the shared mobile tools area after the page content', () => {
    const wrapper = mount(Layout, {
      slots: { default: '<form data-testid="checkout-form">Checkout</form>' },
      global: {
        stubs: {
          AmikonShopTools,
          UiSimplifiedHeader: true,
          UiFooterBlocks: true,
          Cookiebar: { template: '<button data-testid="cookie-bar-launcher">Cookies</button>' },
          PreviewMode: { template: '<button data-testid="preview-controls-toggle">Preview</button>' },
        },
      },
    });

    const tools = wrapper.get('[data-testid="shop-tools"]');
    expect(tools.findAll('button')).toHaveLength(2);
    expect(wrapper.get('main').find('[data-testid="shop-tools"]').exists()).toBe(false);
    expect(wrapper.get('main').element.nextElementSibling).toBe(tools.element);
    wrapper.unmount();
  });

  it('should use a normal stable tools wrapper rather than delaying its DOM hydration', () => {
    const { descriptor } = parse(layoutSource);
    expect(descriptor.template!.content).not.toContain('NuxtLazyHydrate');
    expect(
      compileTemplate({ source: descriptor.template!.content, filename: 'simplifiedHeaderAndFooter.vue', id: 'tools' })
        .errors,
    ).toEqual([]);
  });
});
