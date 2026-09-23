// Click-to-reveal deters simple HTML scrapers, not determined automated clients.
// Keep these values server-only; do not import this module into the storefront.
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store');
  setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  if (getHeader(event, 'x-amikon-contact') !== 'reveal' || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
  const body = await readBody<{ kind?: string } | null>(event);
  if (body?.kind === 'email') return { href: 'mailto:info@amikon.de', label: 'info@amikon.de' };
  if (body?.kind === 'phone') return { href: 'tel:+492861685300', label: '+49 2861 68 53 00' };
  throw createError({ statusCode: 400, statusMessage: 'Invalid contact type' });
});
