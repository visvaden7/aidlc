# Unit 1: Backend Core - 비즈니스 규칙

---

## BR-01: 관리자 인증

| 규칙 | 설명 |
|------|------|
| BR-01.1 | 로그인 시 store_code로 매장 조회 → username으로 관리자 조회 → bcrypt 비밀번호 검증 |
| BR-01.2 | JWT 토큰 유효기간: 16시간 |
| BR-01.3 | JWT payload: adminUserId, storeId, role("ADMIN"), exp |
| BR-01.4 | 로그인 실패 시 login_attempts 증가, 5회 실패 시 15분 잠금 (locked_until 설정) |
| BR-01.5 | 로그인 성공 시 login_attempts 초기화 |

---

## BR-02: 테이블 인증

| 규칙 | 설명 |
|------|------|
| BR-02.1 | store_code로 매장 조회 → table_number로 테이블 조회 → bcrypt 비밀번호 검증 |
| BR-02.2 | 테이블 토큰 payload: tableId, storeId, role("TABLE"), exp |
| BR-02.3 | 토큰 유효기간: 24시간 (태블릿 상시 접속 고려) |
| BR-02.4 | 응답에 활성 세션 ID 포함 (없으면 null) |

---

## BR-03: 메뉴 관리

| 규칙 | 설명 |
|------|------|
| BR-03.1 | 메뉴 등록 시 필수 필드 검증: menu_name, price, category_id |
| BR-03.2 | 가격 범위: 0 이상 1,000,000 이하 (정수, 원 단위) |
| BR-03.3 | category_id는 해당 매장의 유효한 카테고리여야 함 |
| BR-03.4 | 메뉴 삭제 시 기존 주문의 OrderItem은 유지 (menu_id FK NULL 허용) |
| BR-03.5 | 순서 변경: 메뉴 ID 목록 순서대로 display_order를 1부터 순차 할당 |
| BR-03.6 | 메뉴 조회 시 카테고리 display_order → 메뉴 display_order 순으로 정렬 |

---

## BR-04: 테이블 세션 라이프사이클

| 규칙 | 설명 |
|------|------|
| BR-04.1 | **세션 시작**: 해당 테이블에 활성 세션이 없는 상태에서 주문 생성 시 자동으로 새 세션 생성 |
| BR-04.2 | **활성 세션 제한**: 테이블당 활성 세션은 최대 1개 (is_active=true) |
| BR-04.3 | **세션 종료 (이용완료)**: is_active=false, ended_at=현재시각 설정 |
| BR-04.4 | **이용완료 후**: 해당 테이블의 다음 주문 시 새 세션 자동 생성 |
| BR-04.5 | **이용완료 조건**: 해당 테이블에 활성 세션이 있어야 함 (없으면 에러) |

---

## BR-05: 주문 생성

| 규칙 | 설명 |
|------|------|
| BR-05.1 | 주문 시 해당 테이블의 활성 세션 확인 → 없으면 새 세션 자동 생성 (BR-04.1) |
| BR-05.2 | 주문 항목의 menu_id로 메뉴 조회 → menu_name, unit_price 스냅샷 저장 |
| BR-05.3 | subtotal = quantity * unit_price (항목별) |
| BR-05.4 | total_amount = SUM(subtotal) (전체 주문) |
| BR-05.5 | 주문번호 생성: "T{tableNumber}-{세션 내 순번 3자리}" (예: T3-001, T3-002) |
| BR-05.6 | 초기 상태: WAITING |
| BR-05.7 | 주문 생성 후 SSE 이벤트 발행: `new-order` |
| BR-05.8 | 주문 항목이 비어있으면 에러 |
| BR-05.9 | 메뉴의 is_available이 false이면 주문 불가 |

---

## BR-06: 주문 상태 변경

| 규칙 | 설명 |
|------|------|
| BR-06.1 | 상태 전이: WAITING → PREPARING → COMPLETE (단방향만 허용) |
| BR-06.2 | 잘못된 전이 시도 시 에러 (예: COMPLETE → WAITING) |
| BR-06.3 | 상태 변경 후 SSE 이벤트 발행: `order-status-changed` |

---

## BR-07: 주문 삭제

| 규칙 | 설명 |
|------|------|
| BR-07.1 | 관리자만 삭제 가능 (ADMIN 토큰 필요) |
| BR-07.2 | 주문 삭제 시 관련 OrderItem도 함께 삭제 (CASCADE) |
| BR-07.3 | 삭제 후 SSE 이벤트 발행: `order-deleted` |

---

## BR-08: 주문 조회

| 규칙 | 설명 |
|------|------|
| BR-08.1 | 고객 조회: 해당 테이블의 활성 세션(is_active=true) 주문만 반환 |
| BR-08.2 | 활성 세션이 없으면 빈 목록 반환 |
| BR-08.3 | 정렬: created_at ASC (시간순) |
| BR-08.4 | 관리자 조회: 해당 테이블의 활성 세션 주문 전체 |

---

## BR-09: 과거 내역 조회

| 규칙 | 설명 |
|------|------|
| BR-09.1 | 완료된 세션(is_active=false)의 주문만 조회 |
| BR-09.2 | 날짜 필터: startDate ~ endDate 범위의 ended_at 기준 |
| BR-09.3 | 정렬: ended_at DESC (최근 세션 먼저) |
| BR-09.4 | 각 세션별 주문 그룹화 (세션 시작/종료 시각 포함) |

---

## BR-10: SSE 이벤트

| 이벤트 타입 | 발행 시점 | 데이터 |
|-------------|-----------|--------|
| `new-order` | 주문 생성 후 | orderId, tableId, tableNumber, orderNumber, items, totalAmount |
| `order-status-changed` | 상태 변경 후 | orderId, tableId, newStatus |
| `order-deleted` | 주문 삭제 후 | orderId, tableId |
| `table-session-completed` | 이용완료 후 | tableId, sessionId |

| 규칙 | 설명 |
|------|------|
| BR-10.1 | SseEmitter 타임아웃: 30분, 클라이언트 자동 재연결 |
| BR-10.2 | SSE 인증: query parameter로 JWT 전달 |
| BR-10.3 | 이벤트는 해당 storeId에 연결된 모든 이미터에 브로드캐스트 |
| BR-10.4 | 전송 실패 시 해당 이미터 자동 제거 |

---

## BR-11: 시드 데이터

| 데이터 | 내용 |
|--------|------|
| Store | 1개 매장 (store_code: "STORE001") |
| AdminUser | 1개 계정 (username: "admin", password: "admin1234" → bcrypt) |
| Category | 4개 (메인메뉴, 사이드메뉴, 음료, 디저트) |
| Menu | 카테고리당 3~4개, 총 12~15개 메뉴 (외부 이미지 URL 포함) |
| TableInfo | 5개 테이블 (table_number: 1~5, password: "1234" → bcrypt) |
