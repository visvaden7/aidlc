import api from './api';
import type { OrderResponse } from '@/types';

interface CreateOrderItem {
  menuId: number;
  quantity: number;
}

interface CreateOrderRequest {
  items: CreateOrderItem[];
}

export const orderApi = {
  createOrder: (tableId: number, storeId: number, data: CreateOrderRequest) =>
    api.post<OrderResponse>(`/api/tables/${tableId}/orders`, data, {
      params: { storeId },
    }),

  getSessionOrders: (tableId: number) =>
    api.get<OrderResponse[]>(`/api/tables/${tableId}/orders`),
};
