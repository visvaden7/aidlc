import api from './api';
import type { OrderResponse, OrderStatus } from '@/types';

export const adminOrderApi = {
  updateOrderStatus: (orderId: number, status: OrderStatus) =>
    api.put<OrderResponse>(`/api/admin/orders/${orderId}/status`, { status }),

  deleteOrder: (orderId: number) =>
    api.delete(`/api/admin/orders/${orderId}`),
};
