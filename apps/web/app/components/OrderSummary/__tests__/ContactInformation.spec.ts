import { mount } from '@vue/test-utils';
import { OrderSummary } from '#components';
import type { Cart } from '@plentymarkets/shop-api';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { cartState } = vi.hoisted(() => ({ cartState: vi.fn() }));
mockNuxtImport('useCart', () => cartState);

const cart: Cart = {
  id: 1,
  sessionId: '1',
  orderId: null,
  customerId: null,
  customerShippingAddressId: null,
  currency: '1',
  referrerId: 1,
  shippingCountryId: 12,
  methodOfPaymentId: 6000,
  shippingProviderId: 101,
  shippingProfileId: 6,
  itemSum: 1,
  itemSumNet: 1,
  basketAmount: 1,
  basketAmountNet: 1,
  shippingAmount: 1,
  shippingAmountNet: 1,
  paymentAmount: 0,
  couponCode: '',
  couponDiscount: 0,
  shippingDeleteByCoupon: false,
  basketRebate: 0,
  maxFsk: 0,
  orderTimestamp: null,
  createdAt: '1',
  updatedAt: '1',
  basketRebateType: '0',
  customerInvoiceAddressId: null,
  itemQuantity: 1,
  totalVats: [
    {
      vatAmount: 1,
      vatValue: 19,
    },
  ],
  subAmount: 1,
  isExportDelivery: true,
  shopCountryId: 1,
  itemWishListIds: {},
  items: [
    {
      id: 1,
      quantity: 1,
      price: 180,
      itemId: 157,
      variation: null,
      variationId: 1100,
      basketItemOrderParams: [],
      inputLength: 0,
      inputWidth: 0,
      setComponents: [],
      itemType: 1,
    },
  ],
  maxDeliveryDays: [],
};

describe('<OrderSummary />', () => {
  beforeEach(() => {
    cartState.mockReturnValue({ showNetPrices: ref(false) });
  });

  it('should render component', () => {
    const wrapper = mount(OrderSummary, {
      props: {
        cart,
      },
    });

    expect(wrapper.getByTestId('order-summary'));
  });

  it.each([false, true])('should pair each label with its own non-wrapping amount (net=%s)', (net) => {
    cartState.mockReturnValue({ showNetPrices: ref(net) });
    const wrapper = mount(OrderSummary, {
      props: { cart: { ...cart, couponDiscount: 5, totalVats: [{ vatAmount: 7, vatValue: 19 }] } },
    });

    for (const [label, amount] of [
      ['subtotal-label', 'subtotal'],
      ['shipping-label', 'shipping'],
      ['coupon-label', 'coupon-value'],
      ['vat-label', 'vat'],
      ['total-label', 'total'],
      ...(net ? [['total-net-label', 'total-net']] : []),
    ]) {
      const value = wrapper.get(`[data-testid="${amount}"]`);
      expect(value.element.parentElement).toBe(wrapper.get(`[data-testid="${label}"]`).element.parentElement);
      expect(value.classes()).toContain('whitespace-nowrap');
      expect(value.classes()).toContain('shrink-0');
    }
    wrapper.unmount();
  });

  it('should retain the backend net, shipping, VAT and total amounts without recalculating them', () => {
    cartState.mockReturnValue({ showNetPrices: ref(true) });
    const { format } = usePriceFormatter();
    const wrapper = mount(OrderSummary, {
      props: {
        cart: {
          ...cart,
          itemSumNet: 5000,
          shippingAmountNet: 378.15,
          basketAmountNet: 5378.15,
          basketAmount: 6400,
          totalVats: [{ vatAmount: 1021.85, vatValue: 19 }],
        },
      },
    });

    for (const [testId, value] of [
      ['subtotal', 5000],
      ['shipping', 378.15],
      ['vat', 1021.85],
      ['total-net', 5378.15],
      ['total', 6400],
    ] as const) {
      expect(wrapper.get(`[data-testid="${testId}"]`).text()).toBe(format(value));
    }
    wrapper.unmount();
  });

  it('should retain the free-shipping label and omit absent discounts', () => {
    const wrapper = mount(OrderSummary, { props: { cart: { ...cart, shippingAmount: 0 } } });
    expect(wrapper.get('[data-testid="shipping"]').text()).toBe(t('shipping.method.free'));
    expect(wrapper.find('[data-testid="coupon-value"]').exists()).toBe(false);
    wrapper.unmount();
  });
});
