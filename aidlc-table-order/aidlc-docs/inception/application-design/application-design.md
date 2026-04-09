# 테이블오더 서비스 - 통합 애플리케이션 설계

---

## 1. 기술 스택 확정

| Layer | 기술 | 버전/도구 |
|-------|------|-----------|
| **Frontend** | React + TypeScript | Vite, Ant Design, Zustand, Axios |
| **Backend** | Java + Spring Boot | Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security |
| **Database** | MySQL | 8.x |
| **실시간 통신** | SSE (Server-Sent Events) | Spring SseEmitter + EventSource API |
| **인증** | JWT | jjwt 라이브러리 |
| **배포** | AWS | EC2 + RDS |

---

## 2. 아키텍처 개요

```
+------------------------------------------+
|           Client (Browser)               |
|  +------------------+ +---------------+  |
|  | Customer Pages   | | Admin Pages   |  |
|  | (React/TS/Vite)  | | (React/TS)    |  |
|  +--------+---------+ +------+--------+  |
|           |                  |            |
|     Axios (REST)      Axios + EventSource |
+-----------|------------------|-----------+
            |                  |
            v                  v
+------------------------------------------+
|        Spring Boot Backend               |
|  +------------------------------------+  |
|  |         Controller Layer           |  |
|  |  Auth | Menu | Order | Table | SSE |  |
|  +------------------------------------+  |
|  |         Service Layer              |  |
|  |  Auth | Menu | Order | Table | SSE |  |
|  +------------------------------------+  |
|  |        Repository Layer            |  |
|  |         (Spring Data JPA)          |  |
|  +------------------------------------+  |
|  |         Security Layer             |  |
|  |   JWT Provider + Auth Filter       |  |
|  +------------------------------------+  |
+------------------------------------------+
            |
            v
+------------------------------------------+
|          MySQL Database                  |
|  Store, AdminUser, TableInfo, Category,  |
|  Menu, TableSession, Order, OrderItem    |
+------------------------------------------+
```

---

## 3. 프로젝트 구조

```
<workspace-root>/
  backend/
    pom.xml
    src/main/java/com/tableorder/
      TableOrderApplication.java
      config/
        SecurityConfig.java
        WebConfig.java
      controller/
        AuthController.java
        MenuController.java
        OrderController.java
        TableController.java
        SseController.java
      dto/
        request/   (LoginRequest, CreateOrderRequest, MenuRequest 등)
        response/  (LoginResponse, MenuResponse, OrderResponse 등)
      entity/
        Store.java, AdminUser.java, TableInfo.java,
        Category.java, Menu.java, TableSession.java,
        Order.java, OrderItem.java, OrderStatus.java(enum)
      repository/
        StoreRepository.java ... OrderItemRepository.java
      service/
        AuthService.java, MenuService.java, OrderService.java,
        TableService.java, SseService.java
      security/
        JwtTokenProvider.java, JwtAuthenticationFilter.java
      exception/
        GlobalExceptionHandler.java, BusinessException.java
    src/main/resources/
      application.yml
      data.sql
    src/test/java/com/tableorder/
      service/, controller/

  frontend/
    package.json
    tsconfig.json
    vite.config.ts
    src/
      App.tsx
      main.tsx
      routes/AppRoutes.tsx
      pages/
        customer/ (TableSetupPage, MenuPage, CartPage, OrderConfirmPage, OrderHistoryPage)
        admin/ (AdminLoginPage, DashboardPage, TableDetailPage, OrderHistoryPage, MenuManagementPage)
      components/
        customer/ (CategoryTabs, MenuCard, CartItem, OrderStatusBadge, CustomerHeader)
        admin/ (TableCard, OrderCard, OrderStatusControl, MenuForm, AdminHeader, DateFilter)
        common/ (ConfirmDialog, Loading, ErrorMessage, ProtectedRoute)
      hooks/ (useAutoLogin, useSSE)
      stores/ (cartStore, authStore, orderStore)
      services/ (api, authApi, menuApi, orderApi, tableApi)
      types/ (menu, order, table, auth)
```

---

## 4. 데이터 모델

### ERD 요약
```
Store (1) --- (N) AdminUser
Store (1) --- (N) TableInfo
Store (1) --- (N) Category
Category (1) --- (N) Menu
TableInfo (1) --- (N) TableSession
TableSession (1) --- (N) Order
Order (1) --- (N) OrderItem
```

### 엔티티 상세

| 엔티티 | PK | 주요 필드 | FK |
|--------|-----|-----------|-----|
| Store | store_id | store_name, store_code | - |
| AdminUser | admin_user_id | username, password_hash | store_id |
| TableInfo | table_id | table_number, table_password | store_id |
| Category | category_id | category_name, display_order | store_id |
| Menu | menu_id | menu_name, price, description, image_url, display_order, is_available | category_id, store_id |
| TableSession | session_id | started_at, ended_at, is_active | table_id, store_id |
| Order | order_id | order_number, status(ENUM), total_amount, created_at | session_id, store_id, table_id |
| OrderItem | order_item_id | menu_name, quantity, unit_price, subtotal | order_id, menu_id |

---

## 5. API 설계 요약

| 그룹 | 메서드 | 경로 | 인증 |
|------|--------|------|------|
| Auth | POST | /api/auth/admin/login | 없음 |
| Auth | POST | /api/auth/table/login | 없음 |
| Menu | GET | /api/stores/{storeId}/menus | 테이블 토큰 |
| Menu | GET | /api/stores/{storeId}/categories | 테이블 토큰 |
| Menu | POST/PUT/DELETE | /api/admin/menus/* | 관리자 JWT |
| Order | POST | /api/tables/{tableId}/orders | 테이블 토큰 |
| Order | GET | /api/tables/{tableId}/orders | 테이블 토큰 |
| Order | PUT | /api/admin/orders/{orderId}/status | 관리자 JWT |
| Order | DELETE | /api/admin/orders/{orderId} | 관리자 JWT |
| Table | GET | /api/admin/tables | 관리자 JWT |
| Table | POST | /api/admin/tables/{tableId}/complete | 관리자 JWT |
| Table | GET | /api/admin/tables/{tableId}/history | 관리자 JWT |
| SSE | GET | /api/admin/sse/orders?token= | Query param |

---

## 6. 핵심 설계 결정

| 결정 | 내용 | 근거 |
|------|------|------|
| SSE 인증 | Query parameter로 JWT 전달 | EventSource API가 커스텀 헤더 미지원 |
| 주문 스냅샷 | OrderItem에 menu_name, unit_price 복사 | 메뉴 변경 시 이력 보존 |
| 세션 자동 시작 | 첫 주문 시 TableSession 생성 | 관리자 수동 시작 불필요 |
| 장바구니 영속 | Zustand + localStorage persist | 새로고침 시에도 유지 |
| 프론트엔드 통합 | 단일 Vite 앱, 라우팅 분리 | 공유 컴포넌트/스토어 재사용 |
| 상태 관리 | Zustand | 경량, 보일러플레이트 최소 |
| UI 라이브러리 | Ant Design | 풍부한 컴포넌트, 관리자 화면에 적합 |

---

## 참조 문서
- [components.md](components.md) - 컴포넌트 정의
- [component-methods.md](component-methods.md) - 메서드 시그니처
- [services.md](services.md) - 서비스 레이어 설계
- [component-dependency.md](component-dependency.md) - 의존성 매핑
