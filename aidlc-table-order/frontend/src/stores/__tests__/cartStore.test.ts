import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';
import type { Menu } from '@/types';

const mockMenu: Menu = {
  menuId: 1,
  menuName: '김치찌개',
  price: 9000,
  description: '맛있는 김치찌개',
  imageUrl: 'https://example.com/img.jpg',
  categoryId: 1,
  displayOrder: 1,
  isAvailable: true,
};

const mockMenu2: Menu = {
  menuId: 2,
  menuName: '된장찌개',
  price: 8000,
  description: '',
  imageUrl: '',
  categoryId: 1,
  displayOrder: 2,
  isAvailable: true,
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('addItem adds a new menu to cart', () => {
    const result = useCartStore.getState().addItem(mockMenu);
    expect(result).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].menuId).toBe(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('addItem increments quantity for existing menu', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('addItem returns false when quantity reaches max (10)', () => {
    useCartStore.setState({
      items: [{ menuId: 1, menuName: '김치찌개', price: 9000, imageUrl: '', quantity: 10 }],
    });
    const result = useCartStore.getState().addItem(mockMenu);
    expect(result).toBe(false);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
  });

  it('removeItem removes menu from cart', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu2);
    useCartStore.getState().removeItem(1);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].menuId).toBe(2);
  });

  it('updateQuantity changes item quantity', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().updateQuantity(1, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('updateQuantity removes item when quantity < 1', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updateQuantity clamps to max 10', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().updateQuantity(1, 15);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
  });

  it('clearCart empties all items', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('getTotalAmount calculates correctly', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu2);
    // 김치찌개 9000 x 2 + 된장찌개 8000 x 1 = 26000
    expect(useCartStore.getState().getTotalAmount()).toBe(26000);
  });

  it('getItemCount counts total items', () => {
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu);
    useCartStore.getState().addItem(mockMenu2);
    // 김치찌개 x2 + 된장찌개 x1 = 3
    expect(useCartStore.getState().getItemCount()).toBe(3);
  });
});
