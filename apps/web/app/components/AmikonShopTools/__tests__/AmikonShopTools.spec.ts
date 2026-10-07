import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import AmikonShopTools from '../AmikonShopTools.vue';

describe('mobile shop tools', () => {
  it('keeps its content in the document rather than duplicating or removing controls', async () => {
    const openCookies = vi.fn();
    const togglePreview = vi.fn();
    const wrapper = mount(AmikonShopTools, {
      slots: {
        default: () => [
          h('div', { 'data-testid': 'cookie-bar-launcher' }, [h('button', { onClick: openCookies }, 'Cookies')]),
          h('button', { 'data-testid': 'preview-controls-toggle', onClick: togglePreview }, 'Preview'),
        ],
      },
    });
    expect(wrapper.findAll('button')).toHaveLength(2);
    await wrapper.find('button').trigger('click');
    await wrapper.find('[data-testid="preview-controls-toggle"]').trigger('click');
    expect(openCookies).toHaveBeenCalledOnce();
    expect(togglePreview).toHaveBeenCalledOnce();
  });
});
