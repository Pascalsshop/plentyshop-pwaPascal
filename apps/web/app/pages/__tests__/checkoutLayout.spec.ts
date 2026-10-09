import { parse, compileTemplate } from '@vue/compiler-sfc';
import { describe, expect, it } from 'vitest';
import source from '../checkout.vue?raw';
import dividerSource from '../../components/ui/Divider/Divider.vue?raw';

const { descriptor } = parse(source);

describe('Mobile checkout layout', () => {
  it('should size all eight dividers to their content container instead of the viewport', () => {
    const dividers = descriptor.template!.content.match(/<UiDivider\b[^>]*\/>/g) ?? [];
    expect(dividers).toHaveLength(8);
    for (const divider of dividers) {
      expect(divider).not.toMatch(/w-screen|-mx-|class-name/);
    }
    expect(dividerSource).toContain('w-full');
  });

  it('should retain all checkout sections and a compilable template', () => {
    for (const component of [
      'ContactInformation',
      'AddressContainer',
      'ShippingMethod',
      'CheckoutPayment',
      'PaymentButtons',
    ]) {
      expect(descriptor.template!.content).toContain(`<${component}`);
    }
    expect(
      compileTemplate({ source: descriptor.template!.content, filename: 'checkout.vue', id: 'checkout-test' }).errors,
    ).toEqual([]);
  });
});
