# Unit 2: Frontend Customer - 컴포넌트 설계

---

## 1. 라우팅 구조

```
/                        → TableSetupPage (초기 설정, 미로그인 시)
/menu                    → MenuPage (메뉴 조회, 기본 화면)
/cart                    → CartPage (장바구니)
/order-confirm           → OrderConfirmPage (주문 확인/결과)
/orders                  → OrderHistoryPage (주문 내역)
/admin/login             → AdminLoginPage (Unit 3)
/admin/*                 → Admin Pages (Unit 3)
```

**라우팅 가드**:
- `/menu`, `/cart`, `/order-confirm`, `/orders` → 테이블 인증 필요 (ProtectedRoute)
- `/` → 인증 시 `/menu`로 리다이렉트
- `/admin/*` → 관리자 인증 필요 (Unit 3)

---

## 2. 레이아웃 설계 (Landscape 최적화)

### 2.1 전체 레이아웃
```
+----------------------------------------------------------------+
| CustomerHeader (고정 상단바)                                      |
|  [매장명]  [테이블 N번]          [주문내역] [장바구니(N)]            |
+----------------------------------------------------------------+
| Page Content (스크롤 영역)                                        |
|                                                                  |
|                                                                  |
+----------------------------------------------------------------+
```

- **최적화 해상도**: 1024x768 이상 (10인치 태블릿 가로 모드)
- **헤더 높이**: 56px 고정
- **콘텐츠 영역**: `calc(100vh - 56px)`, 내부 스크롤

---

## 3. 페이지 컴포넌트

### 3.1 TableSetupPage

| 항목 | 값 |
|------|-----|
| **경로** | `/` |
| **목적** | 태블릿 초기 설정 (매장코드, 테이블번호, 비밀번호 입력) |
| **스토리** | US-C01 |

**Props**: 없음 (최상위 페이지)

**State**:
```typescript
{
  storeCode: string;      // 매장 식별자 입력
  tableNumber: string;    // 테이블 번호 입력
  password: string;       // 비밀번호 입력
  isLoading: boolean;     // 로그인 처리 중
}
```

**UI 구성**:
```
+------------------------------------------+
|        테이블오더 서비스 로고/타이틀          |
|                                          |
|   [ 매장 식별자     ]                     |
|   [ 테이블 번호     ]                     |
|   [ 비밀번호        ]                     |
|                                          |
|   [      설정 완료      ]                 |
+------------------------------------------+
```

**상호작용**:
1. 폼 입력 → 설정 완료 클릭
2. `authApi.tableLogin()` 호출
3. 성공 시: authStore에 저장 + `/menu`로 이동
4. 실패 시: notification으로 에러 표시

---

### 3.2 MenuPage

| 항목 | 값 |
|------|-----|
| **경로** | `/menu` |
| **목적** | 카테고리별 메뉴 조회 및 장바구니 추가 |
| **스토리** | US-C02, US-C03 |

**State**:
```typescript
{
  categories: Category[];           // 카테고리 목록
  menus: Menu[];                    // 현재 카테고리의 메뉴 목록
  selectedCategoryId: number | null; // 선택된 카테고리 (null이면 첫 번째)
  isLoading: boolean;
}
```

**UI 구성 (Landscape)**:
```
+----------------------------------------------------------------+
| CustomerHeader                                                   |
+----------------------------------------------------------------+
| CategoryTabs (가로 스크롤)                                        |
| [찌개/탕] [구이] [사이드] [음료]                                    |
+----------------------------------------------------------------+
| MenuCard Grid (3~4열, 스크롤)                                     |
| +----------+ +----------+ +----------+ +----------+              |
| | 이미지    | | 이미지    | | 이미지    | | 이미지    |              |
| | 김치찌개  | | 된장찌개  | | 부대찌개  | | 순두부    |              |
| | 9,000원   | | 8,000원   | | 10,000원  | | 8,000원   |            |
| | [담기]    | | [담기]    | | [담기]    | | [담기]    |              |
| +----------+ +----------+ +----------+ +----------+              |
+----------------------------------------------------------------+
```

**상호작용**:
1. 페이지 진입 시: `menuApi.getCategories()` + `menuApi.getMenus(storeId)` 호출
2. 카테고리 탭 클릭 → 해당 카테고리 메뉴 필터링 (클라이언트 사이드)
3. 메뉴 카드 클릭 → 장바구니에 1개 즉시 추가 (이미 있으면 수량 +1)
4. 장바구니에 추가 시 notification으로 "장바구니에 추가되었습니다" 표시

---

### 3.3 CartPage

| 항목 | 값 |
|------|-----|
| **경로** | `/cart` |
| **목적** | 장바구니 검토, 수량 조절, 주문 확정 |
| **스토리** | US-C03, US-C04 |

**State**: cartStore에서 직접 사용 (별도 로컬 state 최소화)

**UI 구성**:
```
+----------------------------------------------------------------+
| CustomerHeader                                                   |
+----------------------------------------------------------------+
| 장바구니 (N개 항목)                                                |
+----------------------------------------------------------------+
| CartItem List                                                    |
| +------------------------------------------------------------+  |
| | 김치찌개          [-] 2 [+]              18,000원           |  |
| +------------------------------------------------------------+  |
| | 공기밥            [-] 2 [+]               2,000원           |  |
| +------------------------------------------------------------+  |
| | 콜라              [-] 1 [+]               2,000원    [삭제] |  |
| +------------------------------------------------------------+  |
|                                                                  |
|                           총 금액: 22,000원                       |
|                                                                  |
| [메뉴로 돌아가기]                    [주문하기]                     |
+----------------------------------------------------------------+
```

**상호작용**:
1. `+`/`-` 버튼 → cartStore.updateQuantity() (최소 1, 최대 10)
2. 삭제 버튼 → cartStore.removeItem()
3. 수량 0이 되면 자동 삭제
4. "주문하기" → `/order-confirm`으로 이동
5. 장바구니 비어있으면 빈 상태 UI + "메뉴 보러가기" 버튼

---

### 3.4 OrderConfirmPage

| 항목 | 값 |
|------|-----|
| **경로** | `/order-confirm` |
| **목적** | 주문 최종 확인 → 주문 전송 → 결과 표시 |
| **스토리** | US-C04 |

**State**:
```typescript
{
  orderResult: OrderResponse | null;  // 주문 성공 결과
  isSubmitting: boolean;              // 주문 전송 중
  isSuccess: boolean;                 // 주문 성공 여부
  countdown: number;                  // 리다이렉트 카운트다운 (5초)
}
```

**UI 구성 - 주문 확인 단계**:
```
+----------------------------------------------------------------+
| CustomerHeader                                                   |
+----------------------------------------------------------------+
| 주문 확인                                                         |
+----------------------------------------------------------------+
| 주문 항목 요약 (읽기 전용)                                          |
| - 김치찌개 x2 ................. 18,000원                          |
| - 공기밥 x2 ................... 2,000원                           |
| - 콜라 x1 ..................... 2,000원                           |
+----------------------------------------------------------------+
| 총 금액: 22,000원                                                 |
|                                                                  |
| [장바구니로 돌아가기]              [주문 확정]                       |
+----------------------------------------------------------------+
```

**UI 구성 - 주문 성공 단계**:
```
+----------------------------------------------------------------+
| 주문이 접수되었습니다!                                              |
|                                                                  |
| 주문번호: T1-001                                                  |
| 총 금액: 22,000원                                                 |
|                                                                  |
| N초 후 메뉴 화면으로 이동합니다...                                   |
+----------------------------------------------------------------+
```

**상호작용**:
1. "주문 확정" 클릭 → `orderApi.createOrder()` 호출
2. 성공 시: 장바구니 비우기 → 결과 화면 표시 → 5초 카운트다운 → `/menu` 리다이렉트
3. 실패 시: notification 에러 표시, 장바구니 유지
4. 장바구니가 비어있으면 `/menu`로 리다이렉트

---

### 3.5 OrderHistoryPage (Customer)

| 항목 | 값 |
|------|-----|
| **경로** | `/orders` |
| **목적** | 현재 세션의 주문 내역 및 상태 조회 |
| **스토리** | US-C05 |

**State**:
```typescript
{
  orders: OrderResponse[];   // 주문 목록
  isLoading: boolean;
}
```

**UI 구성**:
```
+----------------------------------------------------------------+
| CustomerHeader                                                   |
+----------------------------------------------------------------+
| 주문 내역                              [새로고침]                  |
+----------------------------------------------------------------+
| +------------------------------------------------------------+  |
| | T1-001  14:30                           대기중               |  |
| | - 김치찌개 x2 .... 18,000원                                  |  |
| | - 공기밥 x2 ...... 2,000원                                   |  |
| | 합계: 20,000원                                               |  |
| +------------------------------------------------------------+  |
| | T1-002  14:45                           준비중               |  |
| | - 콜라 x1 ........ 2,000원                                   |  |
| | 합계: 2,000원                                                |  |
| +------------------------------------------------------------+  |
|                                                                  |
| 총 주문 금액: 22,000원                                            |
+----------------------------------------------------------------+
```

**상호작용**:
1. 페이지 진입 시: `orderApi.getSessionOrders(tableId)` 호출
2. "새로고침" 버튼 클릭 → 주문 목록 재조회
3. 주문 없으면 빈 상태 UI 표시
4. 각 주문에 OrderStatusBadge 표시

---

## 4. 재사용 컴포넌트

### 4.1 CustomerHeader

**Props**:
```typescript
interface CustomerHeaderProps {
  storeName: string;
  tableNumber: number;
}
```

**구성 요소**:
- 좌: 매장명 + "테이블 N번"
- 우: 주문내역 링크(`/orders`), 장바구니 아이콘 + 아이템 수 배지(`/cart`)

---

### 4.2 CategoryTabs

**Props**:
```typescript
interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (categoryId: number) => void;
}
```

**동작**:
- 가로 스크롤 가능한 탭 목록
- 선택된 탭 강조 표시
- 초기 선택: 첫 번째 카테고리

---

### 4.3 MenuCard

**Props**:
```typescript
interface MenuCardProps {
  menu: Menu;
  onAdd: (menu: Menu) => void;
}
```

**구성 요소**:
- 이미지 (imageUrl, 기본 placeholder)
- 메뉴명
- 가격 (천 단위 콤마)
- 설명 (1줄 말줄임)
- "담기" 버튼
- 품절 시 오버레이 + 버튼 비활성화 (isAvailable=false)

---

### 4.4 CartItem

**Props**:
```typescript
interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (menuId: number, quantity: number) => void;
  onRemove: (menuId: number) => void;
}
```

**구성 요소**:
- 메뉴명
- `-` / 수량 / `+` 컨트롤 (1~10 범위)
- 소계 (단가 x 수량)
- 삭제 버튼

---

### 4.5 OrderStatusBadge

**Props**:
```typescript
interface OrderStatusBadgeProps {
  status: OrderStatus;
}
```

**색상 매핑**:
| 상태 | 색상 | 텍스트 |
|------|------|--------|
| WAITING | orange | 대기중 |
| PREPARING | blue | 준비중 |
| COMPLETE | green | 완료 |

---

## 5. 공통 컴포넌트

### 5.1 ConfirmDialog

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;   // 기본: "확인"
  cancelText?: string;    // 기본: "취소"
}
```

Ant Design `Modal.confirm` 래퍼.

---

### 5.2 Loading

**Props**:
```typescript
interface LoadingProps {
  message?: string;  // 기본: "로딩 중..."
}
```

Ant Design `Spin` 래퍼. 전체 화면 중앙 정렬.

---

### 5.3 ErrorMessage

**Props**:
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
```

Ant Design `Result` 래퍼. 에러 메시지 + 선택적 재시도 버튼.

---

### 5.4 ProtectedRoute

**Props**:
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'TABLE' | 'ADMIN';
}
```

**동작**:
- authStore에서 인증 상태 확인
- 미인증 시: TABLE → `/`, ADMIN → `/admin/login` 리다이렉트
- 인증 시: children 렌더링

---

## 6. Zustand Stores

### 6.1 cartStore

```typescript
interface CartState {
  items: CartItemType[];
  
  // Computed (get)
  totalAmount: () => number;
  itemCount: () => number;
  
  // Actions
  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
}

interface CartItemType {
  menuId: number;
  menuName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
```

**Persist**: `localStorage` key = `table-order-cart`
**특이사항**: 이용완료(세션 종료) 시 클리어 불필요 - 주문 확정 시만 클리어

---

### 6.2 authStore

```typescript
interface AuthState {
  token: string | null;
  storeId: number | null;
  tableId: number | null;
  tableNumber: number | null;
  storeName: string | null;
  role: 'TABLE' | 'ADMIN' | null;
  isAuthenticated: boolean;
  
  // Actions
  setTableAuth: (data: TableLoginResponse & { tableNumber: number; storeName: string; storeCode: string }) => void;
  setAdminAuth: (data: LoginResponse) => void;
  logout: () => void;
  checkAuth: () => boolean;
}
```

**Persist**: `localStorage` key = `table-order-auth`
**자동 로그인**: 앱 시작 시 localStorage에서 복원 → 토큰 유효성 확인

---

## 7. API Services

### 7.1 api.ts (Axios Instance)

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

// Request Interceptor: Authorization 헤더 추가
// Response Interceptor: 401 시 authStore.logout() + 리다이렉트
```

### 7.2 authApi.ts

| 메서드 | 엔드포인트 | 용도 |
|--------|-----------|------|
| `tableLogin(storeCode, tableNumber, password)` | POST /api/auth/table/login | 테이블 로그인 |
| `adminLogin(storeCode, username, password)` | POST /api/auth/admin/login | 관리자 로그인 (Unit 3) |

### 7.3 menuApi.ts

| 메서드 | 엔드포인트 | 용도 |
|--------|-----------|------|
| `getCategories(storeId)` | GET /api/stores/{storeId}/categories | 카테고리 목록 |
| `getMenus(storeId)` | GET /api/stores/{storeId}/menus | 전체 메뉴 목록 |
| `getMenusByCategory(storeId, categoryId)` | GET /api/stores/{storeId}/menus?categoryId= | 카테고리별 메뉴 |

### 7.4 orderApi.ts

| 메서드 | 엔드포인트 | 용도 |
|--------|-----------|------|
| `createOrder(tableId, storeId, items)` | POST /api/tables/{tableId}/orders | 주문 생성 |
| `getSessionOrders(tableId)` | GET /api/tables/{tableId}/orders | 현재 세션 주문 조회 |

---

## 8. TypeScript 타입 정의

```typescript
// === Menu ===
interface Menu {
  menuId: number;
  menuName: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  displayOrder: number;
  isAvailable: boolean;
}

interface Category {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
}

// === Order ===
type OrderStatus = 'WAITING' | 'PREPARING' | 'COMPLETE';

interface OrderResponse {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
}

interface OrderItemResponse {
  orderItemId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// === Auth ===
interface TableLoginRequest {
  storeCode: string;
  tableNumber: number;
  password: string;
}

interface TableLoginResponse {
  token: string;
  storeId: number;
  tableId: number;
  sessionId: number | null;
  storeName: string;
}

interface LoginRequest {
  storeCode: string;
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  storeId: number;
  expiresIn: number;
}

// === Table ===
interface TableSummary {
  tableId: number;
  tableNumber: number;
  totalAmount: number;
  activeSession: boolean;
  orderCount: number;
}

// === SSE (Unit 3) ===
type SSEEventType = 'new-order' | 'order-status-changed' | 'order-deleted' | 'table-session-completed';

interface SSEEvent {
  eventType: SSEEventType;
  data: any;
  timestamp: string;
}

// === Cart (Client-only) ===
interface CartItemType {
  menuId: number;
  menuName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
```
