// Preserve bookmarked and indexed informational URLs from the Ceres shop.
const legacyPages: Record<string, string> = {
  '/content/ankaufform': '/ankaufformular',
  '/content/kontakt': '/contact',
  '/content/versand-zahlung': '/shipping',
  '/content/datenschutzerklaerung': '/privacy-policy',
  '/content/impressum': '/legal-disclosure',
  '/content/agb': '/terms-and-conditions',
  '/gtc': '/terms-and-conditions',
  '/content/widerrufsrecht': '/cancellation-rights',
  '/wish-list': '/wishlist',
  '/content/warenkorb': '/cart',
  '/zur-kasse': '/checkout',
};

export default defineNuxtRouteMiddleware((to) => {
  const locales = unref(useNuxtApp().$i18n.locales);
  const codes: string[] = locales.map((locale) => (typeof locale === 'string' ? locale : locale.code));
  const segments = to.path.split('/').filter(Boolean);
  const prefix = segments[0] && codes.includes(segments[0]) ? `/${segments.shift()}` : '';
  const target = legacyPages[`/${segments.join('/')}`];
  if (!target) return;
  return navigateTo({ path: `${prefix}${target}`, query: to.query, hash: to.hash }, { redirectCode: 301 });
});
