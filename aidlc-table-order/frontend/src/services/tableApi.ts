import api from './api';
import type { TableSummary, TableDetail, OrderHistoryResponse } from '@/types';

export const tableApi = {
  getAllTables: (storeId: number) =>
    api.get<TableSummary[]>('/api/admin/tables', {
      params: { storeId },
    }),

  getTableDetail: (tableId: number) =>
    api.get<TableDetail>(`/api/admin/tables/${tableId}`),

  completeTable: (tableId: number, storeId: number) =>
    api.post(`/api/admin/tables/${tableId}/complete`, null, {
      params: { storeId },
    }),

  getTableHistory: (
    tableId: number,
    startDate?: string,
    endDate?: string,
  ) =>
    api.get<OrderHistoryResponse[]>(`/api/admin/tables/${tableId}/history`, {
      params: { startDate, endDate },
    }),
};
