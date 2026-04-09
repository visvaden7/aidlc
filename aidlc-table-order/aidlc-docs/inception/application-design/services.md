# 테이블오더 서비스 - 서비스 레이어 설계

---

## 1. Backend Services

### AuthService
- **책임**: 관리자/테이블 인증, JWT 토큰 관리
- **의존성**: AdminUserRepository, TableInfoRepository, StoreRepository, JwtTokenProvider
- **오케스트레이션**:
  - `adminLogin`: StoreRepository로 매장 조회 → AdminUserRepository로 사용자 조회 → bcrypt 비밀번호 검증 → JWT 발급 (16시간 만료)
  - `tableLogin`: StoreRepository로 매장 조회 → TableInfoRepository로 테이블 조회 → 비밀번호 검증 → 테이블용 토큰 발급 → 활성 세션 정보 반환

### MenuService
- **책임**: 메뉴 CRUD, 카테고리 조회, 노출 순서 관리
- **의존성**: MenuRepository, CategoryRepository
- **오케스트레이션**:
  - `getMenusByStore`: 매장별 전체 메뉴 조회 (카테고리 순서 → 메뉴 순서)
  - `createMenu`: 필수 필드/가격 검증 → 메뉴 저장
  - `updateMenuOrder`: 메뉴 ID 목록 순서대로 displayOrder 일괄 갱신

### OrderService
- **책임**: 주문 생성, 상태 변경, 삭제, 조회
- **의존성**: OrderRepository, OrderItemRepository, TableSessionRepository, MenuRepository, SseService
- **오케스트레이션**:
  - `createOrder`: 활성 세션 확인 (없으면 자동 생성) → 메뉴 정보 조회 → 스냅샷 저장 → 주문번호 생성 → SSE 이벤트 발행 (`new-order`)
  - `updateOrderStatus`: 주문 조회 → 상태 변경 → SSE 이벤트 발행 (`order-status-changed`)
  - `deleteOrder`: 주문 조회 → 주문 항목 삭제 → 주문 삭제 → SSE 이벤트 발행 (`order-deleted`)

### TableService
- **책임**: 테이블 현황 조회, 세션 관리 (시작/종료)
- **의존성**: TableInfoRepository, TableSessionRepository, OrderRepository, SseService
- **오케스트레이션**:
  - `getAllTablesWithSummary`: 모든 테이블 조회 → 각 테이블의 활성 세션 주문 합산
  - `completeTableSession`: 활성 세션 조회 → ended_at 기록, is_active=false → 테이블 상태 리셋 → SSE 이벤트 발행 (`table-session-completed`)
  - `getTableHistory`: 완료된 세션의 주문 내역 조회 (날짜 필터링)

### SseService
- **책임**: SSE 연결 관리, 이벤트 브로드캐스트
- **의존성**: 없음 (다른 서비스가 이 서비스를 호출)
- **오케스트레이션**:
  - `subscribe`: SseEmitter 생성 (타임아웃 30분) → storeId별 이미터 목록에 추가 → 타임아웃/에러 시 자동 제거
  - `publishEvent`: storeId에 연결된 모든 이미터에 이벤트 전송 → 전송 실패 시 이미터 제거

---

## 2. Frontend API Services

### api.ts (Axios Instance)
- **책임**: Axios 인스턴스 생성, 공통 설정
- **설정**:
  - baseURL: 환경변수에서 API 서버 주소
  - Request 인터셉터: Authorization 헤더에 JWT 토큰 추가
  - Response 인터셉터: 401 에러 시 자동 로그아웃 처리

### authApi.ts
- **책임**: 인증 관련 API 호출
- **메서드**: `adminLogin()`, `tableLogin()`

### menuApi.ts
- **책임**: 메뉴 관련 API 호출
- **메서드**: `getMenus()`, `getCategories()`, `createMenu()`, `updateMenu()`, `deleteMenu()`, `reorderMenus()`

### orderApi.ts
- **책임**: 주문 관련 API 호출
- **메서드**: `createOrder()`, `getSessionOrders()`, `getTableOrders()`, `updateOrderStatus()`, `deleteOrder()`

### tableApi.ts
- **책임**: 테이블 관련 API 호출
- **메서드**: `getAllTables()`, `getTableDetail()`, `completeTable()`, `getTableHistory()`

---

## 3. Frontend Zustand Stores

### cartStore.ts
- **책임**: 장바구니 상태 관리, localStorage 자동 영속화
- **상태**: items, totalAmount, itemCount
- **액션**: addItem, removeItem, updateQuantity, clearCart
- **미들웨어**: persist (localStorage)

### authStore.ts
- **책임**: 인증 상태 관리 (관리자/테이블 겸용)
- **상태**: token, storeId, tableId, role, isAuthenticated
- **액션**: login, logout, checkAuth, setTableInfo
- **미들웨어**: persist (localStorage)

### orderStore.ts
- **책임**: 관리자 대시보드 주문 상태 관리 (SSE 이벤트 반영)
- **상태**: tables (테이블별 주문 목록), newOrderIds (강조 표시용)
- **액션**: setTables, addOrder, updateOrder, removeOrder, resetTable, clearNewOrderHighlight
