# 테이블오더 서비스 - 컴포넌트 의존성

---

## 1. Backend 내부 의존성

```
Controller Layer
  |
  v
Service Layer
  |
  v
Repository Layer
  |
  v
Entity Layer (JPA)
  |
  v
MySQL Database
```

### 상세 의존성 매트릭스

| 컴포넌트 | 의존 대상 |
|----------|-----------|
| **AuthController** | AuthService |
| **MenuController** | MenuService |
| **OrderController** | OrderService |
| **TableController** | TableService |
| **SseController** | SseService |
| **AuthService** | StoreRepository, AdminUserRepository, TableInfoRepository, JwtTokenProvider |
| **MenuService** | MenuRepository, CategoryRepository |
| **OrderService** | OrderRepository, OrderItemRepository, TableSessionRepository, MenuRepository, SseService |
| **TableService** | TableInfoRepository, TableSessionRepository, OrderRepository, SseService |
| **SseService** | (없음 - 다른 서비스에 의해 호출됨) |
| **JwtAuthenticationFilter** | JwtTokenProvider |
| **SecurityConfig** | JwtAuthenticationFilter |

### SSE 이벤트 발행 흐름

```
OrderService.createOrder()       --> SseService.publishEvent("new-order")
OrderService.updateOrderStatus() --> SseService.publishEvent("order-status-changed")
OrderService.deleteOrder()       --> SseService.publishEvent("order-deleted")
TableService.completeSession()   --> SseService.publishEvent("table-session-completed")
```

---

## 2. Frontend-Backend API 의존성

| Frontend 컴포넌트 | Backend API | 방향 |
|-------------------|-------------|------|
| `TableSetupPage` | POST /api/auth/table/login | REST |
| `useAutoLogin` | POST /api/auth/table/login | REST |
| `MenuPage` | GET /api/stores/{storeId}/menus | REST |
| `MenuPage` | GET /api/stores/{storeId}/categories | REST |
| `OrderConfirmPage` | POST /api/tables/{tableId}/orders | REST |
| `OrderHistoryPage (Customer)` | GET /api/tables/{tableId}/orders | REST |
| `AdminLoginPage` | POST /api/auth/admin/login | REST |
| `DashboardPage` | GET /api/admin/tables | REST |
| `DashboardPage` | GET /api/admin/sse/orders?token= | SSE |
| `TableDetailPage` | GET /api/admin/tables/{tableId} | REST |
| `TableDetailPage` | PUT /api/admin/orders/{orderId}/status | REST |
| `TableDetailPage` | DELETE /api/admin/orders/{orderId} | REST |
| `TableDetailPage` | POST /api/admin/tables/{tableId}/complete | REST |
| `OrderHistoryPage (Admin)` | GET /api/admin/tables/{tableId}/history | REST |
| `MenuManagementPage` | POST/PUT/DELETE /api/admin/menus/* | REST |

---

## 3. Frontend 내부 의존성

### Store 의존성
```
Pages / Components
  |
  +-- useCart (cartStore)     <-- Customer Pages
  +-- useAuth (authStore)     <-- All Pages (인증 가드)
  +-- useSSE                  <-- DashboardPage
  +-- orderStore              <-- DashboardPage, TableDetailPage
  |
  v
API Services (authApi, menuApi, orderApi, tableApi)
  |
  v
Axios Instance (api.ts)
```

### 페이지-컴포넌트 의존성

| Page | Components | Hooks/Stores |
|------|-----------|--------------|
| `MenuPage` | CategoryTabs, MenuCard, CustomerHeader | authStore |
| `CartPage` | CartItem, CustomerHeader | cartStore |
| `OrderConfirmPage` | - | cartStore, orderApi |
| `OrderHistoryPage (C)` | OrderStatusBadge | authStore, orderApi |
| `TableSetupPage` | - | authStore, useAutoLogin |
| `DashboardPage` | TableCard, OrderCard, AdminHeader | orderStore, useSSE, tableApi |
| `TableDetailPage` | OrderCard, OrderStatusControl, AdminHeader | orderStore, orderApi, tableApi |
| `MenuManagementPage` | MenuForm, AdminHeader | menuApi |
| `OrderHistoryPage (A)` | DateFilter, AdminHeader | tableApi |

---

## 4. 유닛 간 의존성

```
+-------------------+
|  Unit 1: Backend  |  <-- 독립 (의존성 없음)
+-------------------+
        |
        | REST API + SSE
        v
+------------------------+     +---------------------+
| Unit 2: Frontend       |     | Unit 3: Frontend    |
| Customer               |     | Admin               |
+------------------------+     +---------------------+
        |                              |
        +--------- 공유 ------+--------+
                              |
                   types/, api.ts, authStore,
                   common components
```

- **Unit 1 (Backend)**: 독립적, 먼저 구축
- **Unit 2 (Frontend Customer)**: Unit 1의 API 계약 필요
- **Unit 3 (Frontend Admin)**: Unit 1의 API 계약 필요, Unit 2와 공유 요소 존재 (types, api.ts, authStore, common)
