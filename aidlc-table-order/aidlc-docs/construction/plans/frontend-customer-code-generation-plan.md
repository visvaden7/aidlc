# Unit 2: Frontend Customer - Code Generation Plan

## Context
- **Unit**: Frontend Customer (React TypeScript / Vite / Ant Design / Zustand)
- **Design Artifacts**: frontend-components.md, business-rules.md, business-logic-model.md
- **Target Directory**: frontend/
- **Dependencies**: Unit 1 (Backend Core) API 계약

---

## Execution Steps

### Phase 1: Project Setup
- [x] 1.1 Vite 프로젝트 초기화 (package.json - React 18, TypeScript, Vite 5, dependencies: react-router-dom, zustand, axios, antd, @ant-design/icons)
- [x] 1.2 tsconfig.json (strict mode, path alias)
- [x] 1.3 vite.config.ts (proxy 설정, port 5173)
- [x] 1.4 index.html (기본 HTML)

### Phase 2: TypeScript Type Definitions
- [x] 2.1 types/index.ts (Menu, Category, OrderStatus, OrderResponse, OrderItemResponse, TableLoginRequest, TableLoginResponse, LoginRequest, LoginResponse, TableSummary, CartItemType, SSEEventType, SSEEvent)

### Phase 3: API Layer
- [x] 3.1 services/api.ts (Axios 인스턴스, Request/Response 인터셉터, 401 글로벌 핸들링)
- [x] 3.2 services/authApi.ts (tableLogin, adminLogin)
- [x] 3.3 services/menuApi.ts (getCategories, getMenus, getMenusByCategory)
- [x] 3.4 services/orderApi.ts (createOrder, getSessionOrders)

### Phase 4: State Management (Zustand Stores)
- [x] 4.1 stores/authStore.ts (token, storeId, tableId, role, persist middleware)
- [x] 4.2 stores/cartStore.ts (items, totalAmount, itemCount, addItem, removeItem, updateQuantity, clearCart, persist middleware)

### Phase 5: Common Components
- [x] 5.1 components/common/Loading.tsx
- [x] 5.2 components/common/ErrorMessage.tsx
- [x] 5.3 components/common/ConfirmDialog.tsx
- [x] 5.4 components/common/ProtectedRoute.tsx

### Phase 6: Customer Components
- [x] 6.1 components/customer/CustomerHeader.tsx (매장명, 테이블번호, 장바구니 아이콘, 주문내역 링크)
- [x] 6.2 components/customer/CategoryTabs.tsx (가로 스크롤 탭, 선택 상태)
- [x] 6.3 components/customer/MenuCard.tsx (이미지, 이름, 가격, 설명, 담기 버튼, 품절 오버레이)
- [x] 6.4 components/customer/CartItem.tsx (메뉴명, 수량 +-,  소계, 삭제 버튼)
- [x] 6.5 components/customer/OrderStatusBadge.tsx (WAITING/PREPARING/COMPLETE 색상 배지)

### Phase 7: Customer Pages
- [x] 7.1 pages/customer/TableSetupPage.tsx (매장코드, 테이블번호, 비밀번호 입력 → 로그인)
- [x] 7.2 pages/customer/MenuPage.tsx (카테고리 탭 + 메뉴 카드 그리드, Landscape 최적화)
- [x] 7.3 pages/customer/CartPage.tsx (장바구니 목록, 수량 조절, 총 금액, 주문하기 버튼)
- [x] 7.4 pages/customer/OrderConfirmPage.tsx (주문 요약 → 확정 → 결과 + 5초 리다이렉트)
- [x] 7.5 pages/customer/OrderHistoryPage.tsx (현재 세션 주문 목록, 새로고침 버튼)

### Phase 8: Routing & App Entry
- [x] 8.1 routes/AppRoutes.tsx (고객/관리자 경로 분리, ProtectedRoute 적용)
- [x] 8.2 App.tsx (AppRoutes 래핑)
- [x] 8.3 main.tsx (React 엔트리포인트)
- [x] 8.4 App.css (글로벌 스타일, Landscape 최적화)

### Phase 9: Unit Tests
- [x] 9.1 cartStore 테스트 (addItem, removeItem, updateQuantity, clearCart, 수량 제한)
- [x] 9.2 OrderStatusBadge 테스트 (3가지 상태별 렌더링)
- [x] 9.3 ProtectedRoute 테스트 (인증/미인증 분기)
