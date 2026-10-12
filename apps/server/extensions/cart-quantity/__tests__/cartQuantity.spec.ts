import axios from 'axios';
import { ApiError } from '@plentymarkets/shop-api';
import { createApiClient } from '@plentymarkets/shop-api/server';
import { LoggerFactory, LoggerType } from '@vue-storefront/logger';
import type { AxiosInstance } from 'axios';
import type { MiddlewareConfig } from '@plentymarkets/shop-api/server/types/config';
import { describe, expect, it, vi } from 'vitest';
import config from '../../../middleware.config';
import { cartQuantityExtension, setCartItemQuantity } from '../cartQuantity';
import type { CartQuantityContext, CartQuantityResponse } from '../types';

const params = { productId: 26689, cartItemId: 123, quantity: 2 };

function createContext() {
  const context: CartQuantityContext = {
    client: axios.create(),
    config: { api: { url: 'https://backend.example.test', securityToken: undefined } },
  };
  const put = vi.spyOn(context.client, 'put');
  return { context, put };
}

describe('cart quantity middleware', () => {
  it.each([0, 1, 4])('should return stock %s as a stock limit without retrying', async (stock) => {
    const { context, put } = createContext();
    put.mockResolvedValue({ data: { data: { placeholder: { stock } } } });

    await expect(setCartItemQuantity(context, params)).resolves.toEqual({ data: { availableStock: stock } });
    expect(put).toHaveBeenCalledExactlyOnceWith('https://backend.example.test/rest/storefront/cart/items/123', {
      variationId: 26689,
      quantity: 2,
      id: 123,
    });
  });

  it.each([undefined, null, -1, NaN, Infinity, '0', false])(
    'should preserve unknown errors for invalid stock %s',
    async (stock) => {
      const { context, put } = createContext();
      put.mockResolvedValue({ data: { data: { placeholder: { stock } } } });

      await expect(setCartItemQuantity(context, params)).rejects.toBeInstanceOf(ApiError);
      expect(put).toHaveBeenCalledTimes(1);
    },
  );

  it('should preserve the SDK error for an unrelated response', async () => {
    const { context, put } = createContext();
    put.mockResolvedValue({ data: {} });

    await expect(setCartItemQuantity(context, params)).rejects.toMatchObject({
      key: 'unknownError',
      code: '503',
      message: '',
      cause: '',
    });
  });

  it('should propagate HTTP errors unchanged without retrying', async () => {
    const { context, put } = createContext();
    const error = new Error('Backend rejected the request');
    put.mockRejectedValue(error);

    await expect(setCartItemQuantity(context, params)).rejects.toBe(error);
    expect(put).toHaveBeenCalledTimes(1);
  });

  it.each([2, '2', null, undefined])(
    'should preserve successful basket mapping for rebate type %s',
    async (rebateType) => {
      const { context, put } = createContext();
      const response: CartQuantityResponse = {
        events: {
          AfterBasketChanged: {
            basket: {
              sessionId: 'test-session',
              orderId: null,
              customerId: null,
              customerShippingAddressId: null,
              currency: 'EUR',
              referrerId: 1,
              shippingCountryId: 1,
              methodOfPaymentId: 0,
              shippingProviderId: 0,
              shippingProfileId: 0,
              itemSum: 260,
              itemSumNet: 260,
              basketAmount: 260,
              basketAmountNet: 260,
              shippingAmount: 0,
              shippingAmountNet: 0,
              paymentAmount: 0,
              couponCode: '',
              couponDiscount: 0,
              shippingDeleteByCoupon: false,
              basketRebate: 0,
              maxDeliveryDays: {},
              basketRebateType: rebateType,
              itemQuantity: 2,
            },
            basketItems: [
              {
                id: 123,
                quantity: 2,
                price: 130,
                itemId: 25719,
                variation: null,
                variationId: 26689,
                basketItemOrderParams: [],
                inputLength: 0,
                inputWidth: 0,
                setComponents: [],
                itemType: 1,
              },
            ],
          },
        },
        data: { placeholder: { stock: 0 } },
      };
      put.mockResolvedValue({ data: response });

      await expect(setCartItemQuantity(context, params)).resolves.toEqual({
        data: {
          ...response.events!.AfterBasketChanged!.basket,
          basketRebateType: String(rebateType ?? '0'),
          items: response.events!.AfterBasketChanged!.basketItems,
        },
      });
      expect(response.events!.AfterBasketChanged!.basket.basketRebateType).toBe(rebateType);
    },
  );

  it('should preserve existing extensions and override only quantity updates', () => {
    const existing = { name: 'existing-extension' };
    expect(config.integrations.plentysystems.extensions([existing])).toEqual([existing, cartQuantityExtension]);
    expect(Object.keys(cartQuantityExtension.extendApiMethods)).toEqual(['setCartItemQuantity']);
  });

  it('should apply the override through the SDK while preserving session and security headers', async () => {
    const create = createApiClient<MiddlewareConfig, AxiosInstance>;
    const instance = await create.call(
      {
        middleware: {
          extensions: config.integrations.plentysystems.extensions([]),
          res: { locals: { alokai: { logger: LoggerFactory.create(LoggerType.ConsolaGcp) } } },
        },
      },
      {
        api: { url: 'https://backend.example.test', securityToken: 'test-token' },
        _middlewareRequestHeaders: { cookie: 'pwa-session-id=test-session' },
      },
    );
    const adapter = vi.fn(async (request) => ({
      data: { data: { placeholder: { stock: 0 } } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: request,
    }));
    instance.client.defaults.adapter = adapter;

    await expect(instance.api.setCartItemQuantity(params)).resolves.toEqual({ data: { availableStock: 0 } });
    const request = adapter.mock.calls[0]![0];
    expect(request.headers.cookie).toContain('plentyID=test-session');
    expect(request.headers['x-security-token']).toBe('test-token');
    expect(adapter).toHaveBeenCalledTimes(1);
  });
});
