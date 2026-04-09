# 테이블오더 서비스 - 컴포넌트 정의

---

## 1. Backend Components (Spring Boot / Java 21)

### 1.1 Entity Layer
| 컴포넌트 | 목적 | 책임 |
|----------|------|------|
| `Store` | 매장 정보 엔티티 | 매장 식별자, 이름, 코드 관리 |
| `AdminUser` | 관리자 계정 엔티티 | 관리자 인증 정보 관리 |
| `TableInfo` | 테이블 정보 엔티티 | 테이블 번호, 비밀번호 관리 |
| `Category` | 카테고리 엔티티 | 사전 정의 메뉴 카테고리 |
| `Menu` | 메뉴 엔티티 | 메뉴 상세 정보(이름, 가격, 설명, 이미지URL) |
| `TableSession` | 테이블 세션 엔티티 | 세션 라이프사이클(시작/종료) 관리 |
| `Order` | 주문 엔티티 | 주문 정보 및 상태 관리 |
| `OrderItem` | 주문 항목 엔티티 | 개별 주문 메뉴(스냅샷 포함) |

### 1.2 Repository Layer
| 컴포넌트 | 목적 |
|----------|------|
| `StoreRepository` | Store CRUD |
| `AdminUserRepository` | AdminUser 조회/인증 |
| `TableInfoRepository` | TableInfo CRUD |
| `CategoryRepository` | Category 조회 |
| `MenuRepository` | Menu CRUD, 카테고리별 조회, 순서 조정 |
| `TableSessionRepository` | 세션 생성/종료/조회 |
| `OrderRepository` | 주문 CRUD, 세션별/테이블별 조회 |
| `OrderItemRepository` | 주문 항목 CRUD |

### 1.3 Service Layer
| 컴포넌트 | 목적 | 책임 |
|----------|------|------|
| `AuthService` | 인증 처리 | 관리자 로그인, 테이블 로그인, JWT 발급/검증 |
| `MenuService` | 메뉴 관리 | 메뉴 CRUD, 카테고리별 조회, 순서 변경 |
| `OrderService` | 주문 처리 | 주문 생성, 상태 변경, 삭제, 세션별 조회 |
| `TableService` | 테이블 관리 | 세션 시작/종료(이용완료), 과거 내역 조회 |
| `SseService` | SSE 관리 | 이미터 관리, 이벤트 발행, 연결/해제 |

### 1.4 Controller Layer
| 컴포넌트 | 목적 | 엔드포인트 접두사 |
|----------|------|-------------------|
| `AuthController` | 인증 API | `/api/auth` |
| `MenuController` | 메뉴 API | `/api/stores/{storeId}/menus`, `/api/admin/menus` |
| `OrderController` | 주문 API | `/api/tables/{tableId}/orders`, `/api/admin/orders` |
| `TableController` | 테이블 API | `/api/admin/tables` |
| `SseController` | SSE 스트림 | `/api/admin/sse` |

### 1.5 Security & Config
| 컴포넌트 | 목적 |
|----------|------|
| `JwtTokenProvider` | JWT 토큰 생성/파싱/검증 |
| `JwtAuthenticationFilter` | 요청별 JWT 인증 필터 |
| `SecurityConfig` | Spring Security 설정 (필터 체인, 공개/보호 경로) |
| `WebConfig` | CORS 설정, 정적 리소스 설정 |
| `GlobalExceptionHandler` | 전역 예외 처리 (@ControllerAdvice) |

---

## 2. Frontend Components (React TypeScript / Vite / Ant Design)

### 2.1 공통 컴포넌트
| 컴포넌트 | 목적 |
|----------|------|
| `AppRoutes` | 라우팅 설정 (고객/관리자 경로 분리) |
| `ConfirmDialog` | 확인/취소 팝업 (Ant Design Modal 래퍼) |
| `Loading` | 로딩 표시 |
| `ErrorMessage` | 에러 메시지 표시 |
| `ProtectedRoute` | 인증 필요 경로 가드 |

### 2.2 Customer Pages
| 컴포넌트 | 목적 | 관련 스토리 |
|----------|------|-------------|
| `TableSetupPage` | 태블릿 초기 설정 화면 | US-C01 |
| `MenuPage` | 메뉴 조회/탐색 (기본 화면) | US-C02 |
| `CartPage` | 장바구니 관리 | US-C03 |
| `OrderConfirmPage` | 주문 확인 및 결과 표시 | US-C04 |
| `OrderHistoryPage` | 주문 내역 조회 | US-C05 |

### 2.3 Customer Components
| 컴포넌트 | 목적 |
|----------|------|
| `CategoryTabs` | 카테고리 탭 네비게이션 |
| `MenuCard` | 메뉴 카드 (이미지, 이름, 가격, 설명) |
| `CartItem` | 장바구니 항목 (수량 조절) |
| `OrderStatusBadge` | 주문 상태 배지 (대기중/준비중/완료) |
| `CustomerHeader` | 고객 화면 헤더 (장바구니 아이콘, 주문내역 링크) |

### 2.4 Admin Pages
| 컴포넌트 | 목적 | 관련 스토리 |
|----------|------|-------------|
| `AdminLoginPage` | 관리자 로그인 | US-A01 |
| `DashboardPage` | 실시간 주문 대시보드 | US-A02, US-A03 |
| `TableDetailPage` | 테이블 상세 (주문 목록, 상태 변경, 삭제) | US-A03, US-A04, US-A05 |
| `OrderHistoryPage` | 과거 주문 내역 | US-A06 |
| `MenuManagementPage` | 메뉴 CRUD 관리 | US-A07 |

### 2.5 Admin Components
| 컴포넌트 | 목적 |
|----------|------|
| `TableCard` | 테이블 카드 (테이블번호, 총주문액, 최신주문 미리보기) |
| `OrderCard` | 주문 카드 (주문번호, 메뉴, 금액, 상태) |
| `OrderStatusControl` | 주문 상태 변경 컨트롤 |
| `MenuForm` | 메뉴 등록/수정 폼 |
| `AdminHeader` | 관리자 화면 헤더 (네비게이션, 로그아웃) |
| `DateFilter` | 날짜 필터 컴포넌트 |

### 2.6 Hooks
| 훅 | 목적 |
|----|------|
| `useAutoLogin` | 태블릿 자동 로그인 로직 |
| `useCart` | 장바구니 상태 관리 (Zustand store) |
| `useAuth` | 관리자 인증 상태 관리 (Zustand store) |
| `useSSE` | SSE 연결 관리, 이벤트 구독, 자동 재연결 |

### 2.7 API Services
| 서비스 | 목적 |
|--------|------|
| `api.ts` | Axios 인스턴스 (인터셉터, 베이스URL) |
| `authApi.ts` | 인증 API 호출 |
| `menuApi.ts` | 메뉴 API 호출 |
| `orderApi.ts` | 주문 API 호출 |
| `tableApi.ts` | 테이블 API 호출 |

### 2.8 Stores (Zustand)
| 스토어 | 목적 |
|--------|------|
| `cartStore.ts` | 장바구니 상태 (메뉴 목록, 수량, 총액), localStorage 연동 |
| `authStore.ts` | 인증 상태 (JWT 토큰, 사용자 정보, 테이블 정보) |
| `orderStore.ts` | 관리자 대시보드 주문 상태 (SSE 이벤트 반영) |
