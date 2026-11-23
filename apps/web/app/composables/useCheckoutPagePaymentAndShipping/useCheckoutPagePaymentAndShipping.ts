import type { PaymentMethod, ShippingMethod } from '@plentymarkets/shop-api';
import { paymentProviderGetters, shippingProviderGetters } from '@plentymarkets/shop-api';

const ID_SHIPPING_CHECKBOX = '#shipping-agreement-checkbox';

const getFallbackPaymentMethod = (
  paymentMethods: PaymentMethod[],
  selectedShippingMethod: ShippingMethod | undefined,
) => {
  return paymentMethods.find((method) => {
    return (
      !paymentProviderGetters.isPaymentMethodExcluded(selectedShippingMethod, method.id) &&
      !paymentProviderGetters.isPaymentMethodUnavailable(paymentMethods, method.id)
    );
  });
};

export const useCheckoutPagePaymentAndShipping = () => {
  const { send } = useNotification();
  const { data: cart } = useCart();
  const { fetchSession } = useFetchSession();
  const {
    loading: paymentLoading,
    data: paymentMethodData,
    fetchPaymentMethods,
    savePaymentMethod,
  } = usePaymentMethods();
  const { shippingPrivacyAgreement, setShippingPrivacyAgreement, setShippingPrivacyAgreementErrors } =
    useAdditionalInformation();

  const {
    loading: shippingLoading,
    data: shippingMethodData,
    selectedMethod: selectedShippingMethod,
    getShippingMethods,
    saveShippingMethod,
  } = useCartShippingMethods();

  const paymentMethods = computed(() => paymentMethodData.value);
  const shippingMethods = computed(() => shippingProviderGetters.getShippingProviders(shippingMethodData.value));
  const selectedPaymentId = computed(() => cart?.value?.methodOfPaymentId || 0);
  const methodUpdatePending = useState('checkout-method-update-pending', () => false);
  const disableShippingPayment = computed(
    () => methodUpdatePending.value || shippingLoading.value || paymentLoading.value,
  );

  const handleShippingMethodUpdate = async (shippingMethodId: string) => {
    const existingShippingMethod = selectedShippingMethod.value
      ? shippingProviderGetters.getParcelServicePresetId(selectedShippingMethod.value)
      : null;

    if (methodUpdatePending.value || existingShippingMethod === shippingMethodId) {
      return;
    }

    methodUpdatePending.value = true;
    try {
      await saveShippingMethod(Number(shippingMethodId));
      usePreferredDelivery().disableAllOptions();
      await fetchSession();
      await getShippingMethods();
      await fetchPaymentMethods();

      const isPaymentMethodExcluded = paymentProviderGetters.isPaymentMethodExcluded(
        selectedShippingMethod.value,
        selectedPaymentId.value,
      );

      const isPaymentMethodUnavailable = paymentProviderGetters.isPaymentMethodUnavailable(
        paymentMethods.value.list,
        selectedPaymentId.value,
      );

      if (isPaymentMethodExcluded || isPaymentMethodUnavailable) {
        send({ message: t('billing.methodChanged'), type: 'warning' });

        const fallbackMethod = getFallbackPaymentMethod(paymentMethods.value.list, selectedShippingMethod.value);
        if (fallbackMethod) {
          await savePaymentMethod(fallbackMethod.id);
          await fetchSession();
          await getShippingMethods();
        }
      }

      setShippingPrivacyAgreement(false);
    } finally {
      methodUpdatePending.value = false;
    }
  };

  const handlePaymentMethodUpdate = async (paymentMethodId: number) => {
    if (methodUpdatePending.value || selectedPaymentId.value === paymentMethodId) {
      return;
    }
    methodUpdatePending.value = true;
    try {
      await savePaymentMethod(paymentMethodId);
      await fetchSession();
      await getShippingMethods();
    } finally {
      methodUpdatePending.value = false;
    }
  };

  const validateShippingTerms = () => {
    const shouldAcceptAgreement = selectedShippingMethod.value
      ? shippingProviderGetters.getDataPrivacyAgreementHint(selectedShippingMethod.value)
      : false;

    if (shouldAcceptAgreement) {
      setShippingPrivacyAgreementErrors(!shippingPrivacyAgreement.value);
      if (!shippingPrivacyAgreement.value) scrollToHTMLObject(ID_SHIPPING_CHECKBOX);
    }

    return shouldAcceptAgreement ? shippingPrivacyAgreement.value : true;
  };

  return {
    paymentLoading,
    shippingLoading,
    disableShippingPayment,
    paymentMethods,
    shippingMethods,
    selectedPaymentId,
    handleShippingMethodUpdate,
    handlePaymentMethodUpdate,
    validateShippingTerms,
  };
};
