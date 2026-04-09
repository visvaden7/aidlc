# 테이블오더 서비스 - Unit of Work Story Map

---

## 스토리-유닛 매핑

| Story ID | 스토리 명 | Unit 1 (Backend) | Unit 2 (Frontend Customer) | Unit 3 (Frontend Admin) |
|----------|-----------|:-:|:-:|:-:|
| US-C01 | 테이블 태블릿 초기 설정 | API: table/login | TableSetupPage, useAutoLogin | - |
| US-C02 | 메뉴 조회 및 탐색 | API: menus, categories | MenuPage, CategoryTabs, MenuCard | - |
| US-C03 | 장바구니에 메뉴 추가 | - | CartPage, CartItem, cartStore | - |
| US-C04 | 주문 생성 및 확인 | API: create order, SSE event | OrderConfirmPage | - |
| US-C05 | 주문 내역 조회 | API: session orders | OrderHistoryPage, OrderStatusBadge | - |
| US-A01 | 관리자 로그인 | API: admin/login, JWT | - | AdminLoginPage |
| US-A02 | 실시간 주문 모니터링 | API: tables, SSE stream | - | DashboardPage, TableCard, useSSE |
| US-A03 | 주문 상태 변경 | API: update status, SSE event | - | OrderStatusControl, OrderCard |
| US-A04 | 주문 삭제 | API: delete order, SSE event | - | TableDetailPage (삭제 기능) |
| US-A05 | 테이블 이용완료 | API: complete session, SSE event | - | TableDetailPage (이용완료 기능) |
| US-A06 | 과거 주문 내역 조회 | API: table history | - | OrderHistoryPage, DateFilter |
| US-A07 | 메뉴 관리 | API: menu CRUD | - | MenuManagementPage, MenuForm |

---

## 유닛별 스토리 요약

### Unit 1: Backend Core
- **관련 스토리**: 12개 전체 (모든 스토리의 서버 측 로직)
- **핵심 구현**: 엔티티, 리포지토리, 서비스, 컨트롤러, JWT, SSE, 시드데이터

### Unit 2: Frontend Customer
- **관련 스토리**: US-C01 ~ US-C05 (5개)
- **핵심 구현**: 고객 페이지, 장바구니 스토어, 자동 로그인, + 공통 기반

### Unit 3: Frontend Admin
- **관련 스토리**: US-A01 ~ US-A07 (7개)
- **핵심 구현**: 관리자 페이지, SSE 통합, 주문 스토어, 대시보드

---

## 스토리 커버리지 검증

- 모든 12개 스토리가 최소 1개 유닛에 할당됨: **PASS**
- US-C01, US-C02, US-C04, US-C05는 Backend + Frontend Customer 양쪽에 할당: **PASS**
- US-A01~A07은 Backend + Frontend Admin 양쪽에 할당: **PASS**
- US-C03(장바구니)은 Frontend Customer에만 할당 (순수 클라이언트 로직): **PASS**
- 미할당 스토리 없음: **PASS**
