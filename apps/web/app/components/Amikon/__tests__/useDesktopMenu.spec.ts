import { describe, expect, it } from 'vitest';
import { useAmikonDesktopMenu } from '../useDesktopMenu';

describe('Amikon desktop menu interactions', () => {
  it('opens immediately on mouse hover without a click', () => {
    const menu = useAmikonDesktopMenu();
    expect(menu.isOpen.value).toBe(false);
    menu.openOnHover({ pointerType: 'mouse', buttons: 0 });
    expect(menu.isOpen.value).toBe(true);
    menu.openOnHover({ pointerType: 'mouse', buttons: 0 });
    expect(menu.isOpen.value).toBe(true);
  });

  it('does not hover-open for touch or pen, so the following tap opens normally', () => {
    for (const pointerType of ['touch', 'pen', '']) {
      const menu = useAmikonDesktopMenu();
      menu.openOnHover({ pointerType, buttons: 0 });
      expect(menu.isOpen.value).toBe(false);
      menu.toggle();
      expect(menu.isOpen.value).toBe(true);
    }
  });

  it('does not open while dragging with a mouse button held down', () => {
    const menu = useAmikonDesktopMenu();
    menu.openOnHover({ pointerType: 'mouse', buttons: 1 });
    expect(menu.isOpen.value).toBe(false);
  });

  it('continues to toggle with click or keyboard activation', () => {
    const menu = useAmikonDesktopMenu();
    menu.toggle();
    expect(menu.isOpen.value).toBe(true);
    menu.toggle();
    expect(menu.isOpen.value).toBe(false);
  });

  it('closes after hover and can reopen on a later hover', () => {
    const menu = useAmikonDesktopMenu();
    menu.openOnHover({ pointerType: 'mouse', buttons: 0 });
    menu.close();
    expect(menu.isOpen.value).toBe(false);
    menu.openOnHover({ pointerType: 'mouse', buttons: 0 });
    expect(menu.isOpen.value).toBe(true);
  });
});
