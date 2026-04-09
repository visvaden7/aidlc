# Unit 1: Backend Core - Code Generation Plan

## Context
- **Unit**: Backend Core (Spring Boot / Java 21 / MySQL)
- **Design Artifacts**: domain-entities.md, business-rules.md, business-logic-model.md
- **Target Directory**: backend/

---

## Execution Steps

### Phase 1: Project Setup
- [x] 1.1 Spring Boot 프로젝트 초기화 (pom.xml - Spring Boot 3.x, Java 21, dependencies: spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, mysql-connector-j, jjwt, lombok, spring-boot-starter-test)
- [x] 1.2 application.yml 설정 (DB 연결, JPA 설정, JWT secret, server port)
- [x] 1.3 TableOrderApplication.java (메인 클래스)

### Phase 2: Entity & Repository Layer
- [x] 2.1 OrderStatus enum
- [x] 2.2 Store entity + StoreRepository
- [x] 2.3 AdminUser entity + AdminUserRepository
- [x] 2.4 TableInfo entity + TableInfoRepository
- [x] 2.5 Category entity + CategoryRepository
- [x] 2.6 Menu entity + MenuRepository
- [x] 2.7 TableSession entity + TableSessionRepository
- [x] 2.8 Order entity + OrderRepository
- [x] 2.9 OrderItem entity + OrderItemRepository

### Phase 3: DTO Layer
- [x] 3.1 Request DTOs (LoginRequest, TableLoginRequest, CreateOrderRequest, MenuRequest, UpdateOrderStatusRequest, MenuOrderRequest)
- [x] 3.2 Response DTOs (LoginResponse, TableLoginResponse, MenuResponse, CategoryResponse, OrderResponse, OrderItemResponse, TableSummaryResponse, TableDetailResponse, OrderHistoryResponse)

### Phase 4: Security Layer
- [x] 4.1 JwtTokenProvider (토큰 생성, 파싱, 검증)
- [x] 4.2 JwtAuthenticationFilter (요청별 JWT 필터)
- [x] 4.3 SecurityConfig (필터 체인, 공개/보호 경로, CORS)
- [x] 4.4 WebConfig (CORS 상세 설정)

### Phase 5: Service Layer
- [x] 5.1 SseService (이미터 관리, 이벤트 발행)
- [x] 5.2 AuthService (관리자/테이블 로그인, 잠금 처리)
- [x] 5.3 MenuService (CRUD, 카테고리 조회, 순서 변경)
- [x] 5.4 OrderService (주문 생성, 상태 변경, 삭제, 조회)
- [x] 5.5 TableService (테이블 현황, 이용완료, 과거 내역)

### Phase 6: Controller Layer
- [x] 6.1 AuthController (/api/auth/*)
- [x] 6.2 MenuController (/api/stores/*/menus, /api/admin/menus/*)
- [x] 6.3 OrderController (/api/tables/*/orders, /api/admin/orders/*)
- [x] 6.4 TableController (/api/admin/tables/*)
- [x] 6.5 SseController (/api/admin/sse/*)

### Phase 7: Exception Handling
- [x] 7.1 BusinessException (커스텀 예외)
- [x] 7.2 GlobalExceptionHandler (@ControllerAdvice)

### Phase 8: Seed Data
- [x] 8.1 data.sql (Store, AdminUser, Category, Menu, TableInfo 샘플 데이터)

### Phase 9: Unit Tests
- [x] 9.1 AuthService 테스트
- [x] 9.2 OrderService 테스트
- [x] 9.3 TableService 테스트
