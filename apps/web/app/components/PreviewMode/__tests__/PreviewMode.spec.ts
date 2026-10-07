import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PreviewMode from '../PreviewMode.vue';

const { mode } = vi.hoisted(() => ({ mode: { preview: true, editor: false } }));
mockNuxtImport('useEditorState', () => () => ({
  isPreviewMode: computed(() => mode.preview),
  isInEditor: computed(() => mode.editor),
}));

describe('preview control launcher', () => {
  beforeEach(() => {
    mode.preview = true;
    mode.editor = false;
  });
  const render = () => mount(PreviewMode, { global: { stubs: { ClientOnly: { template: '<slot />' } } } });
  it('still opens and closes the preview panel after moving the launcher', async () => {
    const wrapper = render();
    const launcher = wrapper.find('[data-testid="preview-controls-toggle"]');
    expect(launcher.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('[data-testid="preview-controls-panel"]').exists()).toBe(false);
    await launcher.trigger('click');
    expect(wrapper.find('[data-testid="preview-controls-panel"]').exists()).toBe(true);
    expect(launcher.attributes('aria-expanded')).toBe('true');
    await launcher.trigger('click');
    expect(wrapper.find('[data-testid="preview-controls-panel"]').exists()).toBe(false);
  });
  it('never exposes preview controls in a normal customer session', () => {
    mode.preview = false;
    expect(render().find('[data-testid="preview-controls-toggle"]').exists()).toBe(false);
  });
});
