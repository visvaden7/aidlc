import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  storeId: number | null;
  tableId: number | null;
  tableNumber: number | null;
  storeName: string | null;
  storeCode: string | null;
  role: 'TABLE' | 'ADMIN' | null;
  isAuthenticated: boolean;

  setTableAuth: (data: {
    token: string;
    storeId: number;
    tableId: number;
    tableNumber: number;
    storeName: string;
    storeCode: string;
  }) => void;
  setAdminAuth: (data: { token: string; storeId: number }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      storeId: null,
      tableId: null,
      tableNumber: null,
      storeName: null,
      storeCode: null,
      role: null,
      isAuthenticated: false,

      setTableAuth: (data) =>
        set({
          token: data.token,
          storeId: data.storeId,
          tableId: data.tableId,
          tableNumber: data.tableNumber,
          storeName: data.storeName,
          storeCode: data.storeCode,
          role: 'TABLE',
          isAuthenticated: true,
        }),

      setAdminAuth: (data) =>
        set({
          token: data.token,
          storeId: data.storeId,
          tableId: null,
          tableNumber: null,
          storeName: null,
          storeCode: null,
          role: 'ADMIN',
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          storeId: null,
          tableId: null,
          tableNumber: null,
          storeName: null,
          storeCode: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'table-order-auth' },
  ),
);
