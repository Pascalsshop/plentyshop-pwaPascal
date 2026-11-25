import type { RouteParams } from 'vue-router';
import type { Breadcrumb, Product, ProductParams } from '@plentymarkets/shop-api';
import { productGetters, breadcrumbGetters } from '@plentymarkets/shop-api';

export const getProductItemParameter = (params: RouteParams, path: string) =>
  /\/a-(\d+(?:_\d+)?)\/?$/.exec(path)?.[1] ?? params.itemId;

export const validateProductParams = (params: RouteParams, path: string): boolean => {
  const itemId = getProductItemParameter(params, path);
  if (typeof itemId !== 'string' || !itemId) return false;

  const pieces = itemId.split('_');
  if (pieces.length === 0 || pieces.length > 2) return false;
  if (!pieces[0] || isNaN(Number(pieces[0]))) return false;
  if (pieces.length === 2 && (!pieces[1] || isNaN(Number(pieces[1])))) return false;

  return true;
};

export const createProductParams = (params: RouteParams, path: string) => {
  const itemParameter = getProductItemParameter(params, path);
  const productPieces = typeof itemParameter === 'string' ? itemParameter.split('_') : [];

  const productParams: ProductParams = {
    id: productPieces[0] ?? '',
  };

  if (productPieces[1]) {
    productParams.variationId = productPieces[1];
  }

  return { productParams, productId: productParams.id.toString() };
};

export const updateProductURLPathForVariation = (
  currentPath: string,
  itemParameter: string,
  variationId: string | number,
) => {
  const trailingSlash = currentPath.endsWith('/') ? '/' : '';
  const normalizedPath = trailingSlash ? currentPath.slice(0, -1) : currentPath;
  if (!normalizedPath.endsWith('_' + itemParameter) && !normalizedPath.endsWith('/a-' + itemParameter)) {
    return currentPath;
  }

  const [itemId] = itemParameter.split('_', 1);
  return normalizedPath.slice(0, -itemParameter.length) + itemId + '_' + variationId + trailingSlash;
};

export const generateBreadcrumbs = (product: Product, home: string): Breadcrumb[] => {
  const breadcrumbs = breadcrumbGetters.mapFromCategoryBreadcrumbs(product.breadcrumbs ?? []);
  const productName = productGetters.getName(product);

  breadcrumbs.unshift({ name: home, link: '/' });
  breadcrumbs.push({ name: productName, link: `#` });

  return breadcrumbs;
};
