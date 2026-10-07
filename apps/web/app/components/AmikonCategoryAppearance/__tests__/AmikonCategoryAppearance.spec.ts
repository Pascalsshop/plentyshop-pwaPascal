import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AmikonCategoryAppearance from '../AmikonCategoryAppearance.vue';

const { editor } = vi.hoisted(() => ({ editor: { value: false } }));
mockNuxtImport('useEditorState', () => () => ({ shouldEnableEditorFeatures: computed(() => editor.value) }));
describe('Amikon mobile category presentation', () => {
  beforeEach(() => {
    editor.value = false;
  });
  it('enables compact storefront spacing and preserves content', () => {
    const wrapper = mount(AmikonCategoryAppearance, { slots: { default: '<h1>Category</h1><p>Description</p>' } });
    expect(wrapper.classes()).toContain('amikon-category--compact');
    expect(wrapper.text()).toContain('Description');
  });
  it('leaves the Builder presentation unchanged', () => {
    editor.value = true;
    expect(mount(AmikonCategoryAppearance).classes()).not.toContain('amikon-category--compact');
  });
  it('does not apply mobile overrides when the appearance is disabled', () => {
    const wrapper = mount(AmikonCategoryAppearance, { props: { enabled: false } });
    expect(wrapper.classes()).toContain('contents');
    expect(wrapper.classes()).not.toContain('amikon-category--compact');
  });
});
