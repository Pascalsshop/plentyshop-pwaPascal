import { mount } from '@vue/test-utils';
import { UiQuantitySelector } from '#components';

const value = 1;

describe('<QuantitySelector />', () => {
  it('should render component', () => {
    const wrapper = mount(UiQuantitySelector, {
      props: {
        value,
      },
    });
    expect(wrapper.getByTestId('quantity-selector'));
  });

  it('keeps an empty input finite', async () => {
    const wrapper = mount(UiQuantitySelector, { props: { value: 2, minValue: 1, maxValue: 5 } });
    await wrapper.find('input').setValue('');
    await nextTick();
    expect(Number((wrapper.find('input').element as HTMLInputElement).value)).toBe(2);
    for (const [quantity] of wrapper.emitted('changeQuantity') ?? []) {
      expect(Number.isFinite(quantity)).toBe(true);
    }
  });

  it('emits only quantities within the configured bounds', async () => {
    const wrapper = mount(UiQuantitySelector, { props: { value: 2, minValue: 1, maxValue: 5 } });
    await wrapper.find('input').setValue('999');
    await nextTick();
    await wrapper.find('input').setValue('-2');
    await nextTick();
    expect(Number((wrapper.find('input').element as HTMLInputElement).value)).toBe(1);
    for (const [quantity] of wrapper.emitted('changeQuantity') ?? []) {
      expect(quantity).toBeGreaterThanOrEqual(1);
      expect(quantity).toBeLessThanOrEqual(5);
    }
  });
});
