/** Returns to the cart after the checkout has rendered removal of its last item. */
export const useEmptyCheckoutRedirect = () => {
  const { cartIsEmpty } = useCart();
  const { createOrderLoading: processingOrder } = useDynamicPaymentButtons();
  const { send } = useNotification();
  const localePath = useLocalizedPath();

  watch(
    cartIsEmpty,
    async (isEmpty) => {
      if (!isEmpty || processingOrder.value) {
        return;
      }

      send({ type: 'neutral', message: t('cart.emptyNotification') });
      await navigateTo(localePath(paths.cart));
    },
    // Do not switch Nuxt layouts while the cart update is still patching checkout children.
    { flush: 'post' },
  );
};
