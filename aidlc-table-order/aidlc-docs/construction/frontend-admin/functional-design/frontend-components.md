# Unit 3: Frontend Admin - 컴포넌트 설계

---

## 1. 라우팅 구조 (관리자)

```
/admin/login             → AdminLoginPage
/admin/dashboard         → DashboardPage (기본)
/admin/menu              → MenuManagementPage
/admin/tables/:id/history → OrderHistoryPage (관리자)
```

**라우팅 가드**:
- `/admin/dashboard`, `/admin/menu`, `/admin/tables/*` → 관리자 인증 필요 (ProtectedRoute role=ADMIN)
- `/admin/login` → 이미 인증 시 `/admin/dashboard`로 리다이렉트

---

## 2. 레이아웃 설계 (좌측 사이드바)

```
+------------------+---------------------------------------------+
| Sider (200px)    | Header (상단바)                               |
|                  |  [매장명]                      [관리자] [로그아웃] |
| [로고]           +---------------------------------------------+
|                  | Page Content (스크롤 영역)                     |
| [대시보드]       |                                               |
| [메뉴관리]       |                                               |
|                  |                                               |
|                  |                                               |
+------------------+---------------------------------------------+
```

- **Sider 너비**: 200px (Ant Design Layout.Sider, collapsible)
- **Header 높이**: 64px
- **콘텐츠 영역**: 나머지 공간, 내부 스크롤

---

## 3. 페이지 컴포넌트

### 3.1 AdminLoginPage

| 항목 | 값 |
|------|-----|
| **경로** | `/admin/login` |
| **목적** | 관리자 로그인 (매장코드, 사용자명, 비밀번호) |
| **스토리** | US-A01 |

**State**:
```typescript
{
  storeCode: string;
  username: string;
  password: string;
  isLoading: boolean;
}
```

**UI 구성**:
```
+------------------------------------------+
|        관리자 로그인                        |
|                                          |
|   [ 매장 식별자     ]                     |
|   [ 사용자명        ]                     |
|   [ 비밀번호        ]                     |
|                                          |
|   [       로그인       ]                  |
+------------------------------------------+
```

**상호작용**:
1. 폼 입력 → 로그인 클릭
2. `authApi.adminLogin()` 호출
3. 성공: authStore.setAdminAuth() + `/admin/dashboard` 이동
4. 실패: notification 에러 (잠금 시 "계정이 잠겼습니다. 15분 후 다시 시도해주세요.")

---

### 3.2 DashboardPage

| 항목 | 값 |
|------|-----|
| **경로** | `/admin/dashboard` |
| **목적** | 실시간 주문 모니터링 대시보드 |
| **스토리** | US-A02, US-A03, US-A04, US-A05 |

**State**:
```typescript
{
  tables: TableSummary[];
  isLoading: boolean;
  selectedTableId: number | null;     // 모달용
  isDetailModalOpen: boolean;
  tableDetail: TableDetail | null;
}
```

**UI 구성**:
```
+------------------------------------------------------------------+
| AdminLayout (Sider + Header)                                      |
+------------------------------------------------------------------+
| 대시보드 - 테이블 현황                                               |
+------------------------------------------------------------------+
| TableCard Grid (3~5열)                                             |
| +----------+ +----------+ +----------+ +----------+ +----------+  |
| | T1       | | T2       | | T3       | | T4       | | T5       |  |
| | 활성     | | 빈 테이블 | | 활성     | | 빈 테이블 | | 활성     |  |
| | 45,000원 | |          | | 18,000원 | |          | | 9,000원  |  |
| | 주문 3건 | |          | | 주문 1건 | |          | | 주문 1건 |  |
| +----------+ +----------+ +----------+ +----------+ +----------+  |
+------------------------------------------------------------------+
```

**상호작용**:
1. 페이지 진입 시: `tableApi.getAllTables()` 호출 + useSSE 연결
2. SSE 이벤트 수신 → orderStore 업데이트 → 테이블 목록 갱신
3. 테이블 카드 클릭 → 테이블 상세 모달 오픈
4. 모달 내에서 주문 상태 변경, 주문 삭제, 이용완료 가능

---

### 3.3 TableDetailModal (DashboardPage 내부)

**Props**:
```typescript
interface TableDetailModalProps {
  open: boolean;
  tableId: number | null;
  onClose: () => void;
  onRefresh: () => void;
}
```

**UI 구성**:
```
+----------------------------------------------+
| 테이블 3번 상세                    [X 닫기]    |
+----------------------------------------------+
| 총 주문액: 27,000원                            |
+----------------------------------------------+
| OrderCard List                                |
| +------------------------------------------+ |
| | T3-001  14:30      대기중                  | |
| | - 김치찌개 x2 .... 18,000원                | |
| | [준비중으로 변경]            [삭제]          | |
| +------------------------------------------+ |
| | T3-002  14:45      준비중                  | |
| | - 콜라 x1 ........ 2,000원                 | |
| | [완료로 변경]                [삭제]          | |
| +------------------------------------------+ |
+----------------------------------------------+
| [과거 내역 보기]        [이용완료]              |
+----------------------------------------------+
```

**상호작용**:
1. 모달 오픈 시: `tableApi.getTableDetail(tableId)` 호출
2. 상태 변경 버튼 → `orderApi.updateOrderStatus()` → 목록 갱신
3. 삭제 버튼 → ConfirmDialog → `orderApi.deleteOrder()` → 목록 갱신
4. 이용완료 → ConfirmDialog → `tableApi.completeTable()` → 모달 닫기 + 대시보드 갱신
5. 과거 내역 → `/admin/tables/:id/history`로 이동

---

### 3.4 OrderHistoryPage (Admin)

| 항목 | 값 |
|------|-----|
| **경로** | `/admin/tables/:id/history` |
| **목적** | 특정 테이블의 과거 세션 주문 내역 조회 |
| **스토리** | US-A06 |

**State**:
```typescript
{
  histories: OrderHistoryResponse[];
  isLoading: boolean;
  startDate: string | null;
  endDate: string | null;
}
```

**UI 구성**:
```
+------------------------------------------------------------------+
| AdminLayout                                                        |
+------------------------------------------------------------------+
| 테이블 N번 - 과거 주문 내역      [← 대시보드로]                       |
+------------------------------------------------------------------+
| DateFilter: [시작일] ~ [종료일]  [검색]                              |
+------------------------------------------------------------------+
| 세션 1 (14:00 ~ 16:30)        총 45,000원                         |
|   T1-001  14:10  김치찌개x2, 공기밥x2   20,000원  완료              |
|   T1-002  14:30  콜라x3                 6,000원   완료              |
+------------------------------------------------------------------+
| 세션 2 (18:00 ~ 20:15)        총 32,000원                         |
|   T1-003  18:20  된장찌개x2             16,000원  완료              |
+------------------------------------------------------------------+
```

**상호작용**:
1. 페이지 진입 시: 오늘 날짜로 기본 조회
2. 날짜 필터 변경 → `tableApi.getTableHistory(tableId, startDate, endDate)`
3. 세션별 그룹화하여 표시

---

### 3.5 MenuManagementPage

| 항목 | 값 |
|------|-----|
| **경로** | `/admin/menu` |
| **목적** | 메뉴 CRUD + 순서 변경 |
| **스토리** | US-A07 |

**State**:
```typescript
{
  categories: Category[];
  menus: Menu[];
  selectedCategoryId: number | null;
  isLoading: boolean;
  isFormModalOpen: boolean;
  editingMenu: Menu | null;     // null이면 신규, 있으면 수정
}
```

**UI 구성**:
```
+------------------------------------------------------------------+
| AdminLayout                                                        |
+------------------------------------------------------------------+
| 메뉴 관리                              [+ 메뉴 추가]               |
+------------------------------------------------------------------+
| CategoryTabs: [찌개/탕] [구이] [사이드] [음료]                      |
+------------------------------------------------------------------+
| 드래그 가능한 메뉴 목록 (Ant Design Table + DnD)                    |
| | 순서 | 이미지 | 메뉴명    | 가격     | 상태  | 액션             |   |
| |  ::  | [img] | 김치찌개  | 9,000원  | 판매중 | [수정] [삭제]    |   |
| |  ::  | [img] | 된장찌개  | 8,000원  | 품절  | [수정] [삭제]    |   |
| |  ::  | [img] | 부대찌개  | 10,000원 | 판매중 | [수정] [삭제]    |   |
+------------------------------------------------------------------+
```

**상호작용**:
1. 페이지 진입 시: 카테고리 + 메뉴 목록 로드
2. 카테고리 탭 클릭 → 필터링
3. "메뉴 추가" → MenuForm 모달 (editingMenu=null)
4. "수정" → MenuForm 모달 (editingMenu=해당 메뉴)
5. "삭제" → ConfirmDialog → `menuApi.deleteMenu()`
6. 드래그 앤 드롭 → `menuApi.reorderMenus()` 호출

---

## 4. 재사용 컴포넌트

### 4.1 AdminHeader

**Props**: 없음 (authStore에서 직접 읽음)

**구성 요소**:
- 좌: 페이지 제목 (breadcrumb)
- 우: "관리자" 라벨 + 로그아웃 버튼

---

### 4.2 AdminLayout

**Props**:
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}
```

Ant Design `Layout` + `Layout.Sider` + `Layout.Header` + `Layout.Content` 조합.
사이드바: collapsible, 메뉴 항목 (대시보드, 메뉴관리).

---

### 4.3 TableCard

**Props**:
```typescript
interface TableCardProps {
  table: TableSummary;
  isHighlighted: boolean;    // 새 주문 시 깜빡임
  onClick: (tableId: number) => void;
}
```

**구성 요소**:
- 테이블 번호
- 활성/비활성 상태 배지
- 총 주문액 (활성 시)
- 주문 건수 (활성 시)
- 새 주문 시 pulse 애니메이션 (CSS @keyframes)
- 비활성 테이블은 회색 배경/텍스트

---

### 4.4 OrderCard

**Props**:
```typescript
interface OrderCardProps {
  order: OrderResponse;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onDelete: (orderId: number) => void;
}
```

**구성 요소**:
- 주문번호 + 시각 + OrderStatusBadge
- 주문 항목 목록
- OrderStatusControl (상태 변경 버튼)
- 삭제 버튼

---

### 4.5 OrderStatusControl

**Props**:
```typescript
interface OrderStatusControlProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}
```

**동작**:
- WAITING → "준비중으로 변경" 버튼 표시
- PREPARING → "완료로 변경" 버튼 표시
- COMPLETE → 버튼 없음 (최종 상태)

---

### 4.6 MenuForm

**Props**:
```typescript
interface MenuFormProps {
  open: boolean;
  menu: Menu | null;          // null=신규, 있으면=수정
  categories: Category[];
  onSubmit: (values: MenuFormValues) => void;
  onCancel: () => void;
}

interface MenuFormValues {
  menuName: string;
  price: number;
  description: string;
  categoryId: number;
  imageUrl: string;
  isAvailable: boolean;
}
```

Ant Design `Modal` + `Form`. 수정 시 기존 값 프리필.

---

### 4.7 DateFilter

**Props**:
```typescript
interface DateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (startDate: string | null, endDate: string | null) => void;
}
```

Ant Design `DatePicker.RangePicker`.

---

## 5. Zustand Store

### 5.1 orderStore

```typescript
interface OrderStoreState {
  highlightedTableIds: Set<number>;    // 새 주문 알림 강조

  addHighlight: (tableId: number) => void;
  removeHighlight: (tableId: number) => void;
  clearHighlights: () => void;
}
```

**SSE 이벤트 연동**:
- `new-order` → 해당 tableId를 highlightedTableIds에 추가 + 3초 후 자동 제거
- `order-status-changed` → 대시보드 갱신 트리거
- `order-deleted` → 대시보드 갱신 트리거
- `table-session-completed` → 대시보드 갱신 트리거

---

## 6. useSSE Hook

```typescript
interface UseSSEReturn {
  isConnected: boolean;
  connect: (storeId: number, token: string) => void;
  disconnect: () => void;
}
```

**내부 동작**:
1. `EventSource` 생성: `/api/admin/sse/orders?token={jwt}`
2. 이벤트 리스너 등록: `new-order`, `order-status-changed`, `order-deleted`, `table-session-completed`
3. 자동 재연결: `onerror` 시 3초 후 재연결 시도 (최대 5회)
4. 컴포넌트 unmount 시 연결 해제 (cleanup)
5. 이벤트 수신 시 콜백 함수 호출 → DashboardPage에서 데이터 갱신

---

## 7. API Services (관리자 전용)

### 7.1 tableApi.ts

| 메서드 | 엔드포인트 | 용도 |
|--------|-----------|------|
| `getAllTables(storeId)` | GET /api/admin/tables | 전체 테이블 현황 |
| `getTableDetail(tableId)` | GET /api/admin/tables/{tableId} | 테이블 상세 (주문 포함) |
| `completeTable(tableId, storeId)` | POST /api/admin/tables/{tableId}/complete | 이용완료 |
| `getTableHistory(tableId, startDate, endDate)` | GET /api/admin/tables/{tableId}/history | 과거 내역 |

### 7.2 관리자용 order/menu API (기존 확장)

| 메서드 | 엔드포인트 | 용도 |
|--------|-----------|------|
| `updateOrderStatus(orderId, status)` | PUT /api/admin/orders/{orderId}/status | 상태 변경 |
| `deleteOrder(orderId)` | DELETE /api/admin/orders/{orderId} | 주문 삭제 |
| `createMenu(storeId, data)` | POST /api/admin/menus | 메뉴 등록 |
| `updateMenu(menuId, data)` | PUT /api/admin/menus/{menuId} | 메뉴 수정 |
| `deleteMenu(menuId)` | DELETE /api/admin/menus/{menuId} | 메뉴 삭제 |
| `reorderMenus(orderList)` | PUT /api/admin/menus/reorder | 순서 변경 |
