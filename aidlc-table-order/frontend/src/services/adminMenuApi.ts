import api from './api';
import type { Menu } from '@/types';

interface MenuFormData {
  menuName: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
  isAvailable: boolean;
}

interface MenuOrderItem {
  menuId: number;
  displayOrder: number;
}

export const adminMenuApi = {
  createMenu: (storeId: number, data: MenuFormData) =>
    api.post<Menu>('/api/admin/menus', { ...data, storeId }),

  updateMenu: (menuId: number, data: MenuFormData) =>
    api.put<Menu>(`/api/admin/menus/${menuId}`, data),

  deleteMenu: (menuId: number) =>
    api.delete(`/api/admin/menus/${menuId}`),

  reorderMenus: (orderList: MenuOrderItem[]) =>
    api.put('/api/admin/menus/reorder', orderList),
};
