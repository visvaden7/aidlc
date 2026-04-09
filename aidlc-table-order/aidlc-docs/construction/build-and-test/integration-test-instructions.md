# Integration Test Instructions

## Purpose
Backend API와 Frontend 간의 통합을 검증합니다. Backend를 실행한 상태에서 주요 사용자 시나리오를 수동 또는 curl로 테스트합니다.

---

## Setup

```bash
# 1. MySQL 실행 + tableorder DB 생성
# 2. Backend 실행
cd backend/
mvn spring-boot:run

# 3. Frontend 실행 (별도 터미널)
cd frontend/
npm run dev
```

---

## Test Scenarios

### Scenario 1: 관리자 로그인
```bash
# 성공 케이스 (시드 데이터: STORE001 / admin / admin1234)
curl -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE001","username":"admin","password":"admin1234"}'

# 예상: {"token":"eyJ...","storeId":1,"expiresIn":57600}
# JWT 토큰을 ADMIN_TOKEN 변수에 저장
ADMIN_TOKEN="<응답의 token 값>"
```

### Scenario 2: 테이블 로그인
```bash
# 테이블 1번 로그인 (시드 데이터: 비밀번호 1234)
curl -X POST http://localhost:8080/api/auth/table/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE001","tableNumber":1,"password":"1234"}'

# 예상: {"token":"eyJ...","storeId":1,"tableId":1,"sessionId":null,"storeName":"맛있는 한식당"}
TABLE_TOKEN="<응답의 token 값>"
```

### Scenario 3: 메뉴 조회
```bash
# 카테고리 조회
curl -H "Authorization: Bearer $TABLE_TOKEN" \
  http://localhost:8080/api/stores/1/categories

# 예상: 4개 카테고리 (찌개/탕, 구이, 사이드, 음료)

# 전체 메뉴 조회
curl -H "Authorization: Bearer $TABLE_TOKEN" \
  http://localhost:8080/api/stores/1/menus

# 예상: 13개 메뉴
```

### Scenario 4: 주문 생성
```bash
# 주문 생성 (김치찌개 2개)
curl -X POST "http://localhost:8080/api/tables/1/orders?storeId=1" \
  -H "Authorization: Bearer $TABLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menuId":1,"quantity":2}]}'

# 예상: {"orderId":1,"orderNumber":"T1-001","status":"WAITING","totalAmount":18000,...}
```

### Scenario 5: 테이블 현황 조회 (관리자)
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/admin/tables?storeId=1"

# 예상: 5개 테이블 목록, 테이블 1번은 activeSession=true, totalAmount=18000
```

### Scenario 6: 주문 상태 변경 (관리자)
```bash
curl -X PUT http://localhost:8080/api/admin/orders/1/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'

# 예상: status=PREPARING
```

### Scenario 7: 이용완료 처리
```bash
curl -X POST "http://localhost:8080/api/admin/tables/1/complete?storeId=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 예상: 200 OK
```

### Scenario 8: SSE 연결 테스트
```bash
# 터미널 1: SSE 구독
curl -N "http://localhost:8080/api/admin/sse/orders?token=$ADMIN_TOKEN"

# 터미널 2: 주문 생성 (테이블 2번으로 로그인 후)
# → 터미널 1에서 "new-order" 이벤트 수신 확인
```

---

## UI Integration Test (브라우저)

### Flow A: 고객 주문 플로우
1. `http://localhost:5173/` 접속
2. 매장 식별자: `STORE001`, 테이블 번호: `1`, 비밀번호: `1234` 입력 → 설정 완료
3. 메뉴 화면에서 카테고리 전환 확인
4. 메뉴 클릭 → 장바구니 추가 notification 확인
5. 장바구니 → 수량 조절 → 주문하기
6. 주문 확인 → 주문 확정 → 성공 화면 + 5초 카운트다운
7. 주문 내역에서 주문 표시 확인

### Flow B: 관리자 운영 플로우
1. `http://localhost:5173/admin/login` 접속
2. 매장 식별자: `STORE001`, 사용자명: `admin`, 비밀번호: `admin1234` → 로그인
3. 대시보드에서 테이블 카드 확인 (활성/비활성)
4. 테이블 카드 클릭 → 모달에서 주문 목록 확인
5. 주문 상태 변경 (대기중 → 준비중 → 완료)
6. 주문 삭제 → 확인 팝업 → 삭제 확인
7. 이용완료 → 테이블 리셋 확인
8. 메뉴관리 → 메뉴 추가/수정/삭제/순서변경

### Flow C: SSE 실시간 테스트
1. 관리자 대시보드 오픈 상태 유지
2. 별도 탭에서 고객으로 주문 생성
3. 대시보드에서 테이블 카드 깜빡임 + notification 확인
