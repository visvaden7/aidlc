// === Menu ===
export interface Menu {
  menuId: number;
  menuName: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  displayOrder: number;
  isAvailable: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
}

// === Order ===
export type OrderStatus = 'WAITING' | 'PREPARING' | 'COMPLETE';

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// === Auth ===
export interface TableLoginRequest {
  storeCode: string;
  tableNumber: number;
  password: string;
}

export interface TableLoginResponse {
  token: string;
  storeId: number;
  tableId: number;
  sessionId: number | null;
  storeName: string;
}

export interface LoginRequest {
  storeCode: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  storeId: number;
  expiresIn: number;
}

// === Table ===
export interface TableSummary {
  tableId: number;
  tableNumber: number;
  totalAmount: number;
  activeSession: boolean;
  orderCount: number;
}

export interface TableDetail {
  tableId: number;
  tableNumber: number;
  totalAmount: number;
  activeSession: boolean;
  orders: OrderResponse[];
}

export interface OrderHistoryResponse {
  sessionId: number;
  startedAt: string;
  endedAt: string;
  orders: OrderResponse[];
  totalAmount: number;
}

// === Cart (Client-only) ===
export interface CartItemType {
  menuId: number;
  menuName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// === SSE ===
export type SSEEventType = 'new-order' | 'order-status-changed' | 'order-deleted' | 'table-session-completed';

export interface SSEEvent {
  eventType: SSEEventType;
  data: unknown;
  timestamp: string;
}

// === API Error ===
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
