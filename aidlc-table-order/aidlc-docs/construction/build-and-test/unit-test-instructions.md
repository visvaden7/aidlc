# Unit Test Execution

## Backend Unit Tests

### 실행

```bash
cd backend/
mvn test
```

### 테스트 목록

| 테스트 클래스 | 테스트 케이스 | 검증 내용 |
|--------------|-------------|----------|
| **AuthServiceTest** | adminLogin_success | 관리자 로그인 성공, JWT 발급 |
| | adminLogin_wrongPassword_incrementAttempts | 잘못된 비밀번호 시 시도 횟수 증가 |
| | adminLogin_storeNotFound | 존재하지 않는 매장 예외 |
| **OrderServiceTest** | createOrder_success | 주문 생성 성공, 주문번호 생성, SSE 이벤트 |
| | createOrder_unavailableMenu_throwsException | 품절 메뉴 주문 시 예외 |
| | updateOrderStatus_validTransition | 유효한 상태 전이 (WAITING→PREPARING) |
| | updateOrderStatus_invalidTransition_throwsException | 잘못된 상태 전이 예외 |
| **TableServiceTest** | completeTableSession_success | 이용완료 처리 성공 |
| | completeTableSession_noActiveSession_throwsException | 활성 세션 없을 때 예외 |
| | getAllTablesWithSummary_returnsAllTables | 테이블 현황 조회 |

### 예상 결과
- **총 테스트**: 10개
- **예상 성공**: 10개
- **테스트 리포트**: `backend/target/surefire-reports/`

---

## Frontend Unit Tests

### 실행

```bash
cd frontend/
npm install    # 최초 1회
npm test
```

### 테스트 목록

| 테스트 파일 | 테스트 케이스 | 검증 내용 |
|------------|-------------|----------|
| **cartStore.test.ts** | addItem adds a new menu | 새 메뉴 추가 |
| | addItem increments quantity | 기존 메뉴 수량 증가 |
| | addItem returns false at max | 최대 수량(10) 도달 시 false |
| | removeItem removes menu | 메뉴 제거 |
| | updateQuantity changes quantity | 수량 변경 |
| | updateQuantity removes at 0 | 0 이하 시 자동 삭제 |
| | updateQuantity clamps to max | 최대 10으로 클램핑 |
| | clearCart empties all | 전체 비우기 |
| | getTotalAmount calculates | 총 금액 계산 |
| | getItemCount counts total | 총 수량 계산 |
| **OrderStatusBadge.test.tsx** | renders WAITING as 대기중 | WAITING 상태 렌더링 |
| | renders PREPARING as 준비중 | PREPARING 상태 렌더링 |
| | renders COMPLETE as 완료 | COMPLETE 상태 렌더링 |
| | has correct test id | data-testid 확인 |
| **ProtectedRoute.test.tsx** | renders when authenticated | 인증 시 children 렌더링 |
| | redirects when not authenticated | 미인증 시 리다이렉트 |
| | redirects when role mismatch | 역할 불일치 시 리다이렉트 |
| **orderStore.test.ts** | addHighlight adds table id | 하이라이트 추가 |
| | addHighlight no duplicate | 중복 방지 |
| | addHighlight multiple tables | 다중 테이블 |
| | removeHighlight removes specific | 특정 테이블 제거 |
| | clearHighlights removes all | 전체 클리어 |
| **OrderStatusControl.test.tsx** | renders button for WAITING | WAITING 버튼 렌더링 |
| | renders button for PREPARING | PREPARING 버튼 렌더링 |
| | renders nothing for COMPLETE | COMPLETE 시 버튼 없음 |
| | calls onChange WAITING→PREPARING | 상태 전이 콜백 |
| | calls onChange PREPARING→COMPLETE | 상태 전이 콜백 |
| **TableCard.test.tsx** | renders active table | 활성 테이블 렌더링 |
| | renders inactive table | 비활성 테이블 렌더링 |
| | calls onClick | 클릭 콜백 |
| | applies pulse when highlighted | 하이라이트 CSS |
| | no pulse when not highlighted | 비하이라이트 |

### 예상 결과
- **총 테스트**: 31개
- **예상 성공**: 31개
- **테스트 리포트**: 콘솔 출력
