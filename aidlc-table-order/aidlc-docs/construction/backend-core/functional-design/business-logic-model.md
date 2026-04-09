# Unit 1: Backend Core - 비즈니스 로직 모델

---

## 1. 인증 흐름

### 관리자 로그인
```
Client -> AuthController.adminLogin(storeCode, username, password)
  -> AuthService.adminLogin()
    1. StoreRepository.findByStoreCode(storeCode) -> Store (없으면 404)
    2. AdminUserRepository.findByStoreIdAndUsername(storeId, username) -> AdminUser (없으면 401)
    3. locked_until 확인 -> 잠금 상태면 423 (Locked)
    4. BCrypt.matches(password, password_hash) -> 불일치 시 login_attempts++, 5회 초과 시 잠금 설정, 401
    5. login_attempts = 0 으로 초기화
    6. JwtTokenProvider.generateToken(adminUserId, "ADMIN", storeId, 16h)
  <- LoginResponse(token, storeId, expiresIn)
```

### 테이블 로그인
```
Client -> AuthController.tableLogin(storeCode, tableNumber, password)
  -> AuthService.tableLogin()
    1. StoreRepository.findByStoreCode(storeCode) -> Store (없으면 404)
    2. TableInfoRepository.findByStoreIdAndTableNumber(storeId, tableNumber) -> TableInfo (없으면 404)
    3. BCrypt.matches(password, table_password) -> 불일치 시 401
    4. TableSessionRepository.findByTableIdAndIsActive(tableId, true) -> 활성 세션 (없으면 null)
    5. JwtTokenProvider.generateToken(tableId, "TABLE", storeId, 24h)
  <- TableLoginResponse(token, storeId, tableId, sessionId or null)
```

---

## 2. 주문 생성 흐름

```
Client -> OrderController.createOrder(tableId, CreateOrderRequest)
  -> OrderService.createOrder()
    1. JWT에서 tableId, storeId 추출 및 검증
    2. 주문 항목 검증: items가 비어있지 않은지 확인
    3. TableSessionRepository.findByTableIdAndIsActive(tableId, true)
       -> 활성 세션 없으면:
          새 TableSession 생성 (is_active=true, started_at=now)
    4. 각 항목에 대해:
       a. MenuRepository.findById(menuId) -> Menu (없으면 404)
       b. menu.is_available 확인 (false면 400)
       c. OrderItem 생성 (menu_name=스냅샷, unit_price=스냅샷, subtotal 계산)
    5. total_amount = SUM(all subtotals)
    6. 주문번호 생성: 세션 내 주문 수 조회 -> "T{tableNumber}-{count+1 zero-padded 3}"
    7. Order 저장 (status=WAITING)
    8. OrderItem 전체 저장
    9. SseService.publishEvent(storeId, "new-order", orderData)
  <- OrderResponse(orderId, orderNumber, status, totalAmount, items, createdAt)
```

---

## 3. 주문 상태 변경 흐름

```
Client -> OrderController.updateOrderStatus(orderId, UpdateOrderStatusRequest)
  -> OrderService.updateOrderStatus()
    1. OrderRepository.findById(orderId) -> Order (없으면 404)
    2. 현재 상태에서 요청 상태로 전이 가능한지 검증:
       WAITING -> PREPARING: OK
       PREPARING -> COMPLETE: OK
       기타: 400 (Invalid state transition)
    3. Order.status 업데이트
    4. SseService.publishEvent(storeId, "order-status-changed", {orderId, tableId, newStatus})
  <- OrderResponse
```

---

## 4. 테이블 이용완료 흐름

```
Client -> TableController.completeTableSession(tableId)
  -> TableService.completeTableSession()
    1. TableSessionRepository.findByTableIdAndIsActive(tableId, true)
       -> 활성 세션 없으면 400 (No active session)
    2. session.is_active = false
    3. session.ended_at = now
    4. TableSession 저장
    5. SseService.publishEvent(storeId, "table-session-completed", {tableId, sessionId})
  <- void (200 OK)
```

---

## 5. SSE 구독 흐름

```
Client -> SseController.subscribe(token query param)
  -> SseService.subscribe()
    1. JwtTokenProvider.validateToken(token) -> Claims (실패 시 401)
    2. Claims에서 storeId 추출
    3. SseEmitter 생성 (timeout: 30분)
    4. emitter.onCompletion -> removeEmitter(storeId, emitter)
    5. emitter.onTimeout -> removeEmitter(storeId, emitter)
    6. emitter.onError -> removeEmitter(storeId, emitter)
    7. storeEmitters.computeIfAbsent(storeId, new CopyOnWriteArrayList).add(emitter)
  <- SseEmitter

이벤트 발행:
  SseService.publishEvent(storeId, eventType, data)
    1. storeEmitters.get(storeId) -> emitters (없으면 무시)
    2. 각 emitter에 대해:
       try: emitter.send(SseEmitter.event().name(eventType).data(data))
       catch: removeEmitter(storeId, emitter)
```

---

## 6. 메뉴 관리 흐름

### 메뉴 등록
```
Client -> MenuController.createMenu(MenuRequest)
  -> MenuService.createMenu()
    1. JWT에서 storeId 추출
    2. 필수 필드 검증 (menu_name, price, category_id)
    3. 가격 범위 검증 (0 <= price <= 1,000,000)
    4. CategoryRepository.findById(categoryId) -> Category (없으면 404, storeId 일치 확인)
    5. 동일 카테고리 내 최대 display_order 조회 -> +1
    6. Menu 저장
  <- MenuResponse
```

### 메뉴 순서 변경
```
Client -> MenuController.reorderMenus(List<MenuOrderRequest>)
  -> MenuService.updateMenuOrder()
    1. 요청된 메뉴 ID 목록 순서대로 display_order를 1부터 순차 할당
    2. 일괄 업데이트
  <- void (200 OK)
```

---

## 7. 과거 내역 조회 흐름

```
Client -> TableController.getTableHistory(tableId, startDate?, endDate?)
  -> TableService.getTableHistory()
    1. 완료된 세션 조회: is_active=false, 해당 tableId
    2. 날짜 필터 적용: ended_at BETWEEN startDate AND endDate (파라미터 있는 경우)
    3. 각 세션별 주문 목록 조회
    4. 정렬: ended_at DESC
  <- List<OrderHistoryResponse> (세션별 그룹화)
```
