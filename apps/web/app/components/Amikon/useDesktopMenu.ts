import { ref } from 'vue';

export const useAmikonDesktopMenu = () => {
  const isOpen = ref(false);

  const openOnHover = (event: Pick<PointerEvent, 'pointerType' | 'buttons'>) => {
    // Touch and pen events must not open the menu before their subsequent click.
    if (event.pointerType === 'mouse' && event.buttons === 0) isOpen.value = true;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, openOnHover, toggle, close };
};
