<template>
  <div v-if="paypalUuid" :id="'paypal-' + paypalUuid" ref="paypalButton" class="z-base relative paypal-button" />
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type {
  PayPalNamespace,
  PayPalButtonsComponent,
  FUNDING_SOURCE,
  OnApproveData,
  OnInitActions,
} from '@paypal/paypal-js';
import type { PayPalAddToCartCallback, PaypalButtonPropsType } from '../types';
import { usePayPal } from '../composables/usePayPal';

const paypalButton = ref<HTMLElement | null>(null);
const paypalUuid = ref(useId());
const paypalScript = ref<PayPalNamespace | null>(null);
const renderedButtons = new Set<PayPalButtonsComponent>();
let isMounted = false;
let isDisposed = false;
let renderVersion = 0;
const closeButtons = async () => {
  const buttons = [...renderedButtons];
  renderedButtons.clear();
  await Promise.all(
    buttons.map((button) =>
      button.close().catch((error) => {
        // eslint-disable-next-line no-console -- Keep SDK cleanup failures diagnosable.
        console.warn('[PayPal] Could not close an express button.', error);
      }),
    ),
  );
};

const {
  order: paypalOrder,
  isAvailable,
  getScript,
  loadConfig,
  createTransaction,
  captureOrder,
  createPlentyOrder,
  createPlentyPaymentFromPayPalOrder,
  resetAPMs,
  config,
  payPalVisibility,
  payLaterVisibility,
} = usePayPal();
const { data: cart, clearCartItems } = useCart();
const { fetchSession } = useFetchSession();
const { emit } = usePlentyEvent();

const currency = computed(
  () => props.currency || cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string),
);
const localePath = useLocalizedPath();
const { locale } = useI18n();

const emits = defineEmits<{
  (event: 'validation-callback', callback: PayPalAddToCartCallback): Promise<void>;
  (event: 'on-approved' | 'on-payed'): void;
}>();

const props = defineProps<PaypalButtonPropsType>();
const currentInstance = getCurrentInstance();

const TypeCartPreview = 'CartPreview';
const TypeSingleItem = 'SingleItem';
const TypeCheckout = 'Checkout';
const TypeOrderAlreadyExisting = 'OrderAlreadyExisting';

const isCommit = props.type === TypeCheckout || props.type === TypeOrderAlreadyExisting;
const loadScript = computed(
  () => payPalVisibility.getVisibility(props.location) || payLaterVisibility.getVisibility(props.location),
);

const checkonValidationCallbackEvent = (): boolean => {
  const props = currentInstance?.vnode.props;

  return !!(props && props['onValidationCallback']);
};

const onInit = (actions: OnInitActions) => {
  if (props.type === TypeCheckout) {
    props.disabled ? actions.disable() : actions.enable();
    watch(props, (propertyValues) => {
      if (propertyValues.disabled) {
        actions.disable();
      } else {
        actions.enable();
      }
    });
  } else {
    actions.enable();
  }
};

const onValidationCallback = async () => {
  return await new Promise<boolean>((resolve) => {
    if (!checkonValidationCallbackEvent()) {
      resolve(true);
    }
    emits('validation-callback', async (successfully) => {
      resolve(successfully);
    });
  });
};

const onApprove = async (data: OnApproveData) => {
  emits('on-approved');
  resetAPMs();

  if (props.type === TypeCartPreview || props.type === TypeSingleItem) {
    await fetchSession();
    navigateTo(localePath(paths.readonlyCheckout + `/?payerId=${data.payerID}&orderId=${data.orderID}`));
  }

  if (props.type === TypeCheckout) {
    useDynamicPaymentButtons().createOrderLoading.value = true;
    const order = await createPlentyOrder();

    if (order) {
      if (!paypalOrder.value?.isAutocaptured) {
        await captureOrder(data.orderID);
      }
      await createPlentyPaymentFromPayPalOrder(data.orderID, order.order.id);
    }

    emit('module:clearCart', null);
    clearCartItems();

    if (order?.order?.id) {
      emit('frontend:orderCreated', order);
      navigateTo(localePath(paths.confirmation + '/' + order.order.id + '/' + order.order.accessKey));
    }
  } else if (props.type === TypeOrderAlreadyExisting && props.plentyOrderId) {
    if (!paypalOrder.value?.isAutocaptured) {
      await captureOrder(data.orderID);
    }
    await createPlentyPaymentFromPayPalOrder(data.orderID, props.plentyOrderId);
    emits('on-payed');
  }
};

const getLabel = (type: string) => {
  switch (type) {
    case TypeCartPreview:
    case TypeSingleItem:
      return 'checkout';
    case TypeOrderAlreadyExisting:
      return 'pay';
    default:
      return 'buynow';
  }
};

const renderButton = async (fundingSource: FUNDING_SOURCE, version: number) => {
  if (paypalScript.value?.Buttons && fundingSource) {
    const button = paypalScript.value?.Buttons({
      style: {
        layout: 'vertical',
        label: getLabel(props.type),
        color: 'gold',
      },
      fundingSource: fundingSource,
      async onClick(data, actions) {
        const success = await onValidationCallback();
        if (!success) {
          return actions.reject();
        }
        return actions.resolve();
      },
      onInit(data, actions) {
        onInit(actions);
      },
      async onCancel() {
        useNotification().send({
          message: t('error.paymentCancelled'),
          type: 'negative',
        });
        resetAPMs();
        await fetchSession();
        await useCartStockReservation().unreserve();
      },
      async createOrder() {
        let transactionType: 'order' | 'express' | 'basket' = 'express';

        if (props.type === TypeOrderAlreadyExisting) {
          transactionType = 'order';
        } else if (isCommit) {
          transactionType = 'basket';
        }

        const order = await createTransaction({
          type: transactionType,
          withShippingCallback: props.type !== TypeOrderAlreadyExisting && !isCommit,
          ...(props.type === TypeOrderAlreadyExisting && { plentyOrderId: props.plentyOrderId }),
        });

        if (order?.id && props.type !== TypeOrderAlreadyExisting) {
          const reserved = await useCartStockReservation().reserve();
          if (!reserved) return '';
        }

        if (props.type === TypeCartPreview || props.type === TypeSingleItem) {
          useLogEvent().logPayPalExpressFlow();
        }

        return order?.id ?? '';
      },
      async onApprove(data) {
        await onApprove(data);
      },
    });

    if (button.isEligible() && paypalButton.value && isMounted && version === renderVersion) {
      renderedButtons.add(button);
      try {
        await button.render(paypalButton.value);
      } catch (error) {
        // Closing/navigating away can reject an in-flight render; actual failures remain visible.
        if (isMounted && version === renderVersion) {
          // eslint-disable-next-line no-console -- Report real render failures, not expected route cancellation.
          console.warn('[PayPal] Could not render an express button.', error);
        }
      }
    }
  }
};

const createButton = async (version: number) => {
  if (paypalScript.value) {
    if (paypalButton.value) {
      paypalButton.value.innerHTML = '';
    }

    if (paypalScript.value.FUNDING) {
      const FUNDING_SOURCES: Array<string> = [];

      if (payPalVisibility.getVisibility(props.location ?? 'checkoutPage')) {
        FUNDING_SOURCES.push(paypalScript.value.FUNDING.PAYPAL as string);
      }
      if (payLaterVisibility.getVisibility(props.location ?? 'checkoutPage')) {
        FUNDING_SOURCES.push(paypalScript.value.FUNDING.PAYLATER as string);
      }

      await Promise.all(FUNDING_SOURCES.map((fundingSource) => renderButton(fundingSource as FUNDING_SOURCE, version)));
    }
  }
};

const refreshButton = async () => {
  const version = ++renderVersion;
  await closeButtons();
  await loadConfig();
  if (!isMounted || version !== renderVersion) return;
  if (!config.value || !isAvailable(props.location ?? 'checkoutPage').value) return;
  const script = await getScript(currency.value, isCommit);
  if (!isMounted || version !== renderVersion) return;
  paypalScript.value = script;
  await createButton(version);
};

// Register the watcher synchronously so Vue disposes it on route changes.
watch([currency, locale, loadScript], () => {
  if (isMounted) void refreshButton();
});
onNuxtReady(() => {
  if (isDisposed) return;
  isMounted = true;
  return refreshButton();
});
onBeforeUnmount(() => {
  isDisposed = true;
  isMounted = false;
  renderVersion++;
  void closeButtons();
});
</script>
