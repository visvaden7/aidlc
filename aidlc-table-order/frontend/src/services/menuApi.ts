import api from './api';
import type { Category, Menu } from '@/types';

export const menuApi = {
  getCategories: (storeId: number) =>
    api.get<Category[]>(`/api/stores/${storeId}/categories`),

  getMenus: (storeId: number) =>
    api.get<Menu[]>(`/api/stores/${storeId}/menus`),

  getMenusByCategory: (storeId: number, categoryId: number) =>
    api.get<Menu[]>(`/api/stores/${storeId}/menus`, {
      params: { categoryId },
    }),
};
