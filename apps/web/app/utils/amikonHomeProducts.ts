import type { Product } from '@plentymarkets/shop-api';

export const AMIKON_NEW_PRODUCTS_MIN_NET_PRICE = 1000;

/** Applies the new-arrivals threshold to the net unit price, including offers and quantity tiers. */
export const isAmikonNewProductEligible = (product: Product): boolean => {
  const prices = product.prices;
  const tiers = prices?.graduatedPrices;
  const basePrices = tiers?.length ? tiers : [prices?.default];
  const basePrice = Math.min(...basePrices.map((price) => price?.data?.unitPriceNet ?? Number.NaN));
  const offerPrice = prices?.specialOffer?.data?.unitPriceNet;
  const netPrice = offerPrice && offerPrice < basePrice ? offerPrice : basePrice;

  return Number.isFinite(netPrice) && netPrice >= AMIKON_NEW_PRODUCTS_MIN_NET_PRICE;
};
