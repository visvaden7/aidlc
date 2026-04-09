import api from './api';
import type { TableLoginRequest, TableLoginResponse, LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  tableLogin: (data: TableLoginRequest) =>
    api.post<TableLoginResponse>('/api/auth/table/login', data),

  adminLogin: (data: LoginRequest) =>
    api.post<LoginResponse>('/api/auth/admin/login', data),
};
