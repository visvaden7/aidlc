# 테이블오더 서비스 - 컴포넌트 메서드 시그니처

> **Note**: 비즈니스 룰 상세는 Functional Design(Construction Phase)에서 정의합니다.

---

## 1. Backend Service Methods

### AuthService
```java
LoginResponse adminLogin(String storeCode, String username, String password)
TableLoginResponse tableLogin(String storeCode, int tableNumber, String password)
String generateToken(Long userId, String role, Long storeId)
Claims validateToken(String token)
```

### MenuService
```java
List<MenuResponse> getMenusByStore(Long storeId)
List<MenuResponse> getMenusByCategory(Long storeId, Long categoryId)
List<CategoryResponse> getCategories(Long storeId)
MenuResponse createMenu(Long storeId, MenuRequest request)
MenuResponse updateMenu(Long menuId, MenuRequest request)
void deleteMenu(Long menuId)
void updateMenuOrder(List<MenuOrderRequest> orderList)
```

### OrderService
```java
OrderResponse createOrder(Long tableId, CreateOrderRequest request)
List<OrderResponse> getOrdersByCurrentSession(Long tableId)
List<OrderResponse> getOrdersByTable(Long tableId)
OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus)
void deleteOrder(Long orderId)
```

### TableService
```java
List<TableSummaryResponse> getAllTablesWithSummary(Long storeId)
TableDetailResponse getTableDetail(Long tableId)
void completeTableSession(Long tableId)
List<OrderHistoryResponse> getTableHistory(Long tableId, LocalDate startDate, LocalDate endDate)
```

### SseService
```java
SseEmitter subscribe(Long storeId)
void publishEvent(Long storeId, String eventType, Object data)
void removeEmitter(Long storeId, SseEmitter emitter)
```

---

## 2. Backend Controller Endpoints

### AuthController
```
POST /api/auth/admin/login     -> LoginResponse
POST /api/auth/table/login     -> TableLoginResponse
```

### MenuController
```
GET  /api/stores/{storeId}/menus                -> List<MenuResponse>
GET  /api/stores/{storeId}/menus?categoryId=    -> List<MenuResponse>
GET  /api/stores/{storeId}/categories           -> List<CategoryResponse>
POST /api/admin/menus                           -> MenuResponse
PUT  /api/admin/menus/{menuId}                  -> MenuResponse
DELETE /api/admin/menus/{menuId}                -> void
PUT  /api/admin/menus/reorder                   -> void
```

### OrderController
```
POST /api/tables/{tableId}/orders               -> OrderResponse
GET  /api/tables/{tableId}/orders               -> List<OrderResponse>
GET  /api/admin/tables/{tableId}/orders         -> List<OrderResponse>
PUT  /api/admin/orders/{orderId}/status         -> OrderResponse
DELETE /api/admin/orders/{orderId}              -> void
```

### TableController
```
GET  /api/admin/tables                          -> List<TableSummaryResponse>
GET  /api/admin/tables/{tableId}                -> TableDetailResponse
POST /api/admin/tables/{tableId}/complete       -> void
GET  /api/admin/tables/{tableId}/history        -> List<OrderHistoryResponse>
```

### SseController
```
GET  /api/admin/sse/orders?token=               -> SseEmitter
```

---

## 3. Frontend Hook Interfaces

### useAutoLogin
```typescript
interface UseAutoLogin {
  isLoggedIn: boolean;
  storeId: number | null;
  tableId: number | null;
  sessionId: number | null;
  login: (storeCode: string, tableNumber: number, password: string) => Promise<void>;
  checkAutoLogin: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

### useCart (Zustand Store)
```typescript
interface CartStore {
  items: CartItem[];
  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
}
```

### useAuth (Zustand Store)
```typescript
interface AuthStore {
  token: string | null;
  storeId: number | null;
  isAuthenticated: boolean;
  login: (storeCode: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}
```

### useSSE
```typescript
interface UseSSE {
  isConnected: boolean;
  lastEvent: SSEEvent | null;
  connect: (storeId: number, token: string) => void;
  disconnect: () => void;
  onEvent: (eventType: string, callback: (data: any) => void) => void;
}
```

---

## 4. TypeScript Type Definitions

```typescript
// Menu types
interface Menu { menuId: number; menuName: string; price: number; description: string; imageUrl: string; categoryId: number; displayOrder: number; }
interface Category { categoryId: number; categoryName: string; displayOrder: number; }
interface CartItem { menu: Menu; quantity: number; }

// Order types
type OrderStatus = 'WAITING' | 'PREPARING' | 'COMPLETE';
interface Order { orderId: number; orderNumber: string; status: OrderStatus; totalAmount: number; items: OrderItem[]; createdAt: string; }
interface OrderItem { orderItemId: number; menuName: string; quantity: number; unitPrice: number; subtotal: number; }

// Table types
interface TableSummary { tableId: number; tableNumber: number; totalAmount: number; activeSession: boolean; recentOrders: Order[]; }

// SSE types
type SSEEventType = 'new-order' | 'order-status-changed' | 'order-deleted' | 'table-session-completed';
interface SSEEvent { eventType: SSEEventType; data: any; timestamp: string; }

// Auth types
interface AdminLoginRequest { storeCode: string; username: string; password: string; }
interface TableLoginRequest { storeCode: string; tableNumber: number; password: string; }
interface LoginResponse { token: string; storeId: number; expiresIn: number; }
interface TableLoginResponse { token: string; storeId: number; tableId: number; sessionId: number | null; }
```
