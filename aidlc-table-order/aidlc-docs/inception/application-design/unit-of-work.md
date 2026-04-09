# 테이블오더 서비스 - Unit of Work 정의

---

## Unit 분해 전략
- **방식**: Layer-Based (Backend/Frontend 분리) + Persona-Based (고객/관리자 분리)
- **총 유닛**: 3개
- **실행 순서**: Unit 1 → Unit 2 → Unit 3 (의존성 기반 순차 실행)

---

## Unit 1: Backend Core

### 개요
| 항목 | 값 |
|------|-----|
| **이름** | backend-core |
| **유형** | Spring Boot 백엔드 애플리케이션 |
| **범위** | 전체 서버 로직 (인증, 메뉴, 주문, 테이블, SSE) |
| **의존성** | 없음 (최우선 구축) |

### 책임
- JPA 엔티티 및 MySQL 데이터베이스 스키마
- Spring Data JPA 리포지토리
- 비즈니스 로직 서비스 (Auth, Menu, Order, Table, SSE)
- REST API 컨트롤러 및 SSE 엔드포인트
- JWT 인증/인가 (Spring Security)
- 시드 데이터 (data.sql)
- 백엔드 유닛 테스트

### 코드 위치
```
backend/
  pom.xml
  src/main/java/com/tableorder/
    config/, controller/, dto/, entity/,
    repository/, service/, security/, exception/
  src/main/resources/
    application.yml, data.sql
  src/test/
```

### 관련 스토리
US-C01, US-C02, US-C03, US-C04, US-C05, US-A01, US-A02, US-A03, US-A04, US-A05, US-A06, US-A07 (모든 스토리의 백엔드 부분)

---

## Unit 2: Frontend Customer

### 개요
| 항목 | 값 |
|------|-----|
| **이름** | frontend-customer |
| **유형** | React TypeScript 프론트엔드 (고객 파트) |
| **범위** | 고객 대면 페이지 + 프론트엔드 공통 기반(프로젝트 초기화, 라우팅, 공통 컴포넌트, API 설정, Zustand 스토어, 타입 정의) |
| **의존성** | Unit 1 (API 계약) |

### 책임
- Vite 프로젝트 초기화 및 설정
- 라우팅 구조 (AppRoutes)
- 공통 컴포넌트 (ConfirmDialog, Loading, ErrorMessage, ProtectedRoute)
- Axios 인스턴스 및 인터셉터 설정
- TypeScript 타입 정의 (전체)
- Zustand 스토어 (cartStore, authStore)
- 고객 페이지: TableSetupPage, MenuPage, CartPage, OrderConfirmPage, OrderHistoryPage
- 고객 컴포넌트: CategoryTabs, MenuCard, CartItem, OrderStatusBadge, CustomerHeader
- 훅: useAutoLogin
- API 서비스: authApi, menuApi, orderApi
- 프론트엔드 유닛 테스트 (고객 파트)

### 코드 위치
```
frontend/
  package.json, tsconfig.json, vite.config.ts
  src/
    App.tsx, main.tsx
    routes/AppRoutes.tsx
    pages/customer/
    components/customer/, components/common/
    hooks/useAutoLogin.ts
    stores/cartStore.ts, stores/authStore.ts
    services/api.ts, authApi.ts, menuApi.ts, orderApi.ts
    types/
```

### 관련 스토리
US-C01, US-C02, US-C03, US-C04, US-C05

---

## Unit 3: Frontend Admin

### 개요
| 항목 | 값 |
|------|-----|
| **이름** | frontend-admin |
| **유형** | React TypeScript 프론트엔드 (관리자 파트) |
| **범위** | 관리자 대면 페이지 + SSE 통합 |
| **의존성** | Unit 1 (API 계약), Unit 2 (공유 기반: types, api.ts, authStore, common components) |

### 책임
- 관리자 페이지: AdminLoginPage, DashboardPage, TableDetailPage, OrderHistoryPage, MenuManagementPage
- 관리자 컴포넌트: TableCard, OrderCard, OrderStatusControl, MenuForm, AdminHeader, DateFilter
- Zustand 스토어: orderStore
- 훅: useSSE
- API 서비스: tableApi
- SSE 연결 관리 (EventSource)
- 프론트엔드 유닛 테스트 (관리자 파트)

### 코드 위치
```
frontend/src/
  pages/admin/
  components/admin/
  hooks/useSSE.ts
  stores/orderStore.ts
  services/tableApi.ts
```

### 관련 스토리
US-A01, US-A02, US-A03, US-A04, US-A05, US-A06, US-A07

---

## Greenfield 코드 구조 전략

단일 Git 저장소에 `backend/`와 `frontend/` 디렉토리로 분리:

```
<workspace-root>/
  backend/           # Unit 1: Spring Boot
  frontend/          # Unit 2 + Unit 3: React (단일 앱)
  aidlc-docs/        # 문서만
  requirements/      # 원본 요구사항
```

Frontend는 물리적으로 하나의 Vite 앱이지만, 논리적으로 Unit 2(고객+공통 기반)와 Unit 3(관리자)로 나누어 순차 개발합니다.
