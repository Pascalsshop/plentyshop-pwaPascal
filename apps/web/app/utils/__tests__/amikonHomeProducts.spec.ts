import { isAmikonNewProductEligible } from '../amikonHomeProducts';
import { fakeProductDE } from '../facets/fakeProductDE';
import type { Default } from '@plentymarkets/shop-api';

const priceWithNet = (netPrice: number) => ({
  ...fakeProductDE.prices.default,
  data: { ...fakeProductDE.prices.default.data, unitPriceNet: netPrice },
});

const productWithNet = (netPrice: number) => ({
  ...fakeProductDE,
  prices: {
    ...fakeProductDE.prices,
    default: priceWithNet(netPrice),
    specialOffer: null as Default | null,
    graduatedPrices: [] as Default[],
  },
});

describe('Amikon new-arrivals net price threshold', () => {
  it.each([
    [999.99, false],
    [1000, true],
    [1000.01, true],
    [5000, true],
    [0, false],
    [-1000, false],
    [Number.NaN, false],
    [Number.POSITIVE_INFINITY, false],
  ])('should accept net unit price %s only when it reaches EUR 1000', (netPrice, expected) => {
    expect(isAmikonNewProductEligible(productWithNet(netPrice))).toBe(expected);
  });

  it('should reject a gross price above the threshold if the net price is below it', () => {
    const product = productWithNet(900);
    product.prices.default.unitPrice = { value: 1071, formatted: '1.071,00 EUR' };
    expect(isAmikonNewProductEligible(product)).toBe(false);
  });

  it('should use the unit price rather than the package price', () => {
    const product = productWithNet(500);
    product.prices.default.data.priceNet = 2000;
    expect(isAmikonNewProductEligible(product)).toBe(false);
  });

  it('should reject a product whose discounted net price is below the threshold', () => {
    const product = productWithNet(1500);
    product.prices.specialOffer = priceWithNet(999);
    expect(isAmikonNewProductEligible(product)).toBe(false);
  });

  it('should accept a discounted net price of exactly EUR 1000', () => {
    const product = productWithNet(1500);
    product.prices.specialOffer = priceWithNet(1000);
    expect(isAmikonNewProductEligible(product)).toBe(true);
  });

  it('should reject a displayed from-price below the threshold', () => {
    const product = productWithNet(1500);
    product.prices.graduatedPrices = [priceWithNet(1200), priceWithNet(999)];
    expect(isAmikonNewProductEligible(product)).toBe(false);
  });

  it('should retain quantity tiers whose cheapest net price is exactly EUR 1000', () => {
    const product = productWithNet(1500);
    product.prices.graduatedPrices = [priceWithNet(1200), priceWithNet(1000)];
    expect(isAmikonNewProductEligible(product)).toBe(true);
  });
});
