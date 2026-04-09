# Table Order Service (테이블오더 서비스) - AI-DLC Workflow Plan

## Context

사용자가 테이블오더 서비스를 Greenfield로 구축하고자 함. 상세한 요구사항 문서(`requirements/table-order-requirements.md`, `requirements/constraints.md`)가 제공되었고, 기술 스택 및 운영 환경에 대한 11개 명확화 질문에 답변 완료. 현재 AI-DLC Requirements Analysis 단계 진행 중.

### 확정된 기술 결정
| 항목 | 결정 |
|------|------|
| Frontend | React (TypeScript), 단일 앱 (라우팅 분리) |
| Backend | Java + Spring Boot |
| Database | MySQL |
| Deployment | AWS (EC2, RDS) |
| Image | 외부 URL만 (업로드 없음) |
| Store | 단일 매장 전용 |
| Categories | 사전 정의 고정 목록 |
| Scale | 소규모 1~10 테이블 |
| Seed Data | 포함 |
| Security Extension | 미적용 |

---

## Phase 1: INCEPTION (남은 단계)

### Step 1: Requirements Analysis 완료
- `aidlc-docs/inception/requirements/requirements.md` 생성
- Intent analysis 포함: New Project, System-wide scope, Complex complexity
- 사용자 답변 반영하여 기능/비기능 요구사항 정리
- 제외 기능(결제, OAuth, 알림 등) 명시
- **승인 게이트**: 사용자 검토 및 승인 필요

### Step 2: User Stories (EXECUTE - Standard)
- **실행 근거**: 신규 사용자 기능, 2가지 사용자 유형(고객/관리자), 복잡한 비즈니스 로직(세션 관리, 실시간 주문), 다수 사용자 여정
- Part 1: 스토리 계획 + 질문 → 답변 수집 → 승인
- Part 2: 스토리/페르소나 생성 → 승인
- 산출물: `stories.md`, `personas.md`

### Step 3: Workflow Planning (ALWAYS EXECUTE)
- 실행 계획 문서 생성 (Mermaid 시각화 포함)
- 단계별 EXECUTE/SKIP 결정 및 근거
- 산출물: `execution-plan.md`
- **승인 게이트**: 사용자 검토 및 승인 필요

### Step 4: Application Design (EXECUTE - Standard)
- **실행 근거**: 완전히 새로운 컴포넌트 필요 (프론트엔드 페이지, 백엔드 서비스, 데이터 모델, SSE)
- 컴포넌트 식별, 메서드 시그니처, 서비스 레이어, 의존성 매핑
- 산출물: `components.md`, `component-methods.md`, `services.md`, `component-dependency.md`, `application-design.md`
- **승인 게이트**: 계획 승인 + 설계 승인

### Step 5: Units Generation (EXECUTE - Standard)
- **3개 유닛으로 분해**:
  1. **Backend Core**: Spring Boot 전체 (엔티티, 리포지토리, 서비스, 컨트롤러, JWT, SSE, 시드데이터)
  2. **Frontend Customer**: 고객 페이지 (메뉴 조회, 장바구니, 주문, 주문내역, 자동로그인)
  3. **Frontend Admin**: 관리자 페이지 (로그인, 대시보드, 주문모니터링, 테이블관리, 메뉴관리)
- 실행 순서: Backend → Frontend Customer → Frontend Admin
- 산출물: `unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md`
- **승인 게이트**: 계획 승인 + 유닛 승인

---

## Phase 2: CONSTRUCTION

### 단계별 EXECUTE/SKIP 결정

| 단계 | 결정 | 근거 |
|------|------|------|
| Functional Design | **EXECUTE** (per-unit) | 비즈니스 로직 복잡: 세션 라이프사이클, 주문 상태머신, SSE 이벤트, JWT 인증 |
| NFR Requirements | **SKIP** | 기술 스택 확정, 소규모, 보안 미적용, 성능 요건 단순(SSE 2초) |
| NFR Design | **SKIP** | NFR Requirements 미실행, 복잡한 NFR 패턴 불필요 |
| Infrastructure Design | **SKIP** | AWS 구성 단순(EC2 1대 + RDS 1대), 코드 생성 시 설정 파일에서 충분히 커버 |
| Code Generation | **EXECUTE** (per-unit) | 핵심 산출물 |
| Build and Test | **EXECUTE** | 필수 |

### Unit 1: Backend Core
1. **Functional Design**: 도메인 엔티티, 비즈니스 룰, 데이터 흐름, API 설계 → 승인
2. **Code Generation**: Part 1 계획 → 승인 → Part 2 코드 생성 → 승인

### Unit 2: Frontend Customer
1. **Functional Design**: 고객 UI 컴포넌트, 상태 관리, API 통합, 자동로그인 로직 → 승인
2. **Code Generation**: Part 1 계획 → 승인 → Part 2 코드 생성 → 승인

### Unit 3: Frontend Admin
1. **Functional Design**: 관리자 UI 컴포넌트, SSE 통합, 대시보드 레이아웃 → 승인
2. **Code Generation**: Part 1 계획 → 승인 → Part 2 코드 생성 → 승인

### Build and Test
- 빌드 지침, 유닛 테스트, 통합 테스트 지침 생성
- 산출물: `build-instructions.md`, `unit-test-instructions.md`, `integration-test-instructions.md`, `build-and-test-summary.md`

---

## 핵심 아키텍처 결정

### 프로젝트 구조
```
<workspace-root>/
  backend/                    # Spring Boot
    pom.xml
    src/main/java/com/tableorder/
      config/                 # SecurityConfig, WebConfig, SseConfig
      controller/             # Auth, Menu, Order, Table, SSE
      dto/request/response/   # Request/Response DTOs
      entity/                 # JPA Entities
      repository/             # Spring Data JPA Repositories
      service/                # Business Logic
      security/               # JWT Provider, Auth Filter
      exception/              # Global Exception Handler
    src/main/resources/
      application.yml
      data.sql                # Seed data
    src/test/
  frontend/                   # React TypeScript
    package.json, tsconfig.json, vite.config.ts
    src/
      pages/customer/         # Menu, Cart, OrderConfirm, OrderHistory, TableSetup
      pages/admin/            # Login, Dashboard, MenuManagement, TableDetail
      components/             # customer/, admin/, common/
      hooks/                  # useCart, useSSE, useAuth, useAutoLogin
      services/               # API 호출 레이어
      store/                  # Context (Cart, Auth)
      types/                  # TypeScript 타입 정의
```

### 데이터 모델 (8 엔티티)
- **Store**: store_id, store_name, store_code
- **AdminUser**: admin_user_id, store_id(FK), username, password_hash
- **TableInfo**: table_id, store_id(FK), table_number, table_password
- **Category**: category_id, store_id(FK), category_name, display_order
- **Menu**: menu_id, category_id(FK), store_id(FK), menu_name, price, description, image_url, display_order, is_available
- **TableSession**: session_id, table_id(FK), store_id(FK), started_at, ended_at, is_active
- **Order**: order_id, session_id(FK), store_id(FK), table_id(FK), order_number, status, total_amount, created_at
- **OrderItem**: order_item_id, order_id(FK), menu_id(FK), menu_name(snapshot), quantity, unit_price(snapshot), subtotal

### 주요 API 엔드포인트
- `POST /api/auth/admin/login` - 관리자 로그인 (JWT)
- `POST /api/auth/table/login` - 테이블 자동로그인
- `GET /api/stores/{storeId}/menus` - 메뉴 조회
- `POST/PUT/DELETE /api/admin/menus/*` - 메뉴 CRUD
- `POST /api/tables/{tableId}/orders` - 주문 생성
- `GET /api/tables/{tableId}/orders` - 현재 세션 주문 조회
- `PUT /api/admin/orders/{orderId}/status` - 주문 상태 변경
- `DELETE /api/admin/orders/{orderId}` - 주문 삭제
- `POST /api/admin/tables/{tableId}/complete` - 이용완료 처리
- `GET /api/admin/tables/{tableId}/history` - 과거 내역 조회
- `GET /api/admin/sse/orders` - SSE 실시간 스트림

### SSE 구현
- Backend: Spring `SseEmitter` + `ConcurrentHashMap<storeId, List<SseEmitter>>`
- 이벤트 타입: `new-order`, `order-status-changed`, `order-deleted`, `table-session-completed`
- Frontend: `useSSE` 커스텀 훅, EventSource API, 자동 재연결
- JWT 전달: SSE는 커스텀 헤더 미지원 → query parameter로 토큰 전달

### 세션 관리
- **테이블 세션**: localStorage에 store_code/table_number/password 저장, 첫 주문 시 TableSession 생성, 이용완료 시 종료
- **관리자 세션**: JWT 16시간 만료, localStorage 저장, JwtAuthenticationFilter로 검증

---

## 검증 방법

1. **Backend**: `mvn clean test` → 유닛 테스트 통과 확인
2. **Frontend**: `npm test` → 컴포넌트 테스트 통과 확인
3. **통합 테스트**: Backend 기동 후 API 호출 테스트 (curl/Postman)
4. **SSE 테스트**: 브라우저에서 EventSource 연결 후 주문 생성 시 실시간 이벤트 수신 확인
5. **E2E 흐름**: 테이블 설정 → 메뉴 조회 → 장바구니 → 주문 → 관리자 대시보드 실시간 수신 확인

---

## 주요 파일 참조
- `requirements/table-order-requirements.md` - 원본 요구사항
- `requirements/constraints.md` - 제외 기능 목록
- `aidlc-docs/aidlc-state.md` - 워크플로우 상태 추적
- `aidlc-docs/inception/requirements/requirement-verification-questions.md` - 기술 결정 답변
- `.aidlc-rule-details/inception/*.md` - 각 Inception 단계 규칙
- `.aidlc-rule-details/construction/*.md` - 각 Construction 단계 규칙
