# Unit 2: Frontend Customer - 비즈니스 로직 모델

---

## Flow 1: 앱 초기화 및 자동 로그인

```
앱 시작 (main.tsx)
  |
  v
authStore에서 localStorage 복원 (Zustand persist)
  |
  v
token 존재 여부 확인
  |
  +-- token 없음 --> "/" (TableSetupPage) 표시
  |
  +-- token 있음
        |
        v
      현재 경로 확인
        |
        +-- "/" 접근 --> "/menu"로 리다이렉트
        |
        +-- 보호 경로 접근 --> 정상 렌더링
        |
        v
      API 요청 시 401 발생하면
        |
        v
      authStore.logout() → localStorage 클리어 → "/" 리다이렉트
```

**핵심 결정**: 앱 시작 시 별도 토큰 유효성 검증 API를 호출하지 않음. 실제 API 사용 시점에서 401로 감지하여 처리. 이는 불필요한 네트워크 요청을 줄이고, 테이블 태블릿 환경에서 빠른 초기 로딩을 보장.

---

## Flow 2: 테이블 초기 설정 (TableSetupPage)

```
TableSetupPage 렌더링
  |
  v
사용자 입력: storeCode, tableNumber, password
  |
  v
"설정 완료" 클릭
  |
  v
입력값 유효성 검증 (프론트엔드)
  +-- 빈 필드 있음 --> notification 에러 표시
  |
  +-- 유효
        |
        v
      isLoading = true, 버튼 비활성화
        |
        v
      authApi.tableLogin(storeCode, tableNumber, password)
        |
        +-- 성공 (200)
        |     |
        |     v
        |   authStore.setTableAuth({
        |     token, storeId, tableId, tableNumber, storeName, storeCode
        |   })
        |     |
        |     v
        |   "/menu"로 navigate
        |
        +-- 실패 (401/404)
              |
              v
            notification.error("매장 정보를 확인해주세요")
            isLoading = false
```

---

## Flow 3: 메뉴 조회 및 탐색 (MenuPage)

```
MenuPage 마운트
  |
  v
useEffect: 데이터 로드
  |
  +-- menuApi.getCategories(storeId) → categories 상태 저장
  +-- menuApi.getMenus(storeId) → allMenus 상태 저장
  |
  v
selectedCategoryId = categories[0].categoryId (첫 번째)
  |
  v
화면 렌더링:
  - CategoryTabs: categories 목록, 선택 상태
  - MenuCard Grid: allMenus.filter(m => m.categoryId === selectedCategoryId)
  |
  v
사용자 상호작용:
  |
  +-- 카테고리 탭 클릭
  |     |
  |     v
  |   selectedCategoryId 변경 → 메뉴 목록 필터링 (API 호출 없음)
  |
  +-- 메뉴 카드 클릭 (isAvailable=true)
        |
        v
      cartStore.addItem(menu)
        |
        +-- 새 메뉴: items에 { menuId, menuName, price, imageUrl, quantity: 1 } 추가
        +-- 기존 메뉴 (qty < 10): quantity + 1
        +-- 기존 메뉴 (qty = 10): notification "최대 수량 도달"
        |
        v
      notification.success("장바구니에 추가되었습니다")
```

---

## Flow 4: 장바구니 관리 (CartPage)

```
CartPage 마운트
  |
  v
cartStore에서 items, totalAmount, itemCount 읽기
  |
  v
items.length === 0?
  +-- YES --> 빈 장바구니 UI + "메뉴 보러가기" 링크
  +-- NO  --> CartItem 목록 렌더링
  |
  v
사용자 상호작용:
  |
  +-- "+" 클릭 (quantity < 10)
  |     --> cartStore.updateQuantity(menuId, quantity + 1)
  |
  +-- "+" 클릭 (quantity = 10)
  |     --> notification "최대 수량 도달"
  |
  +-- "-" 클릭 (quantity > 1)
  |     --> cartStore.updateQuantity(menuId, quantity - 1)
  |
  +-- "-" 클릭 (quantity = 1)
  |     --> cartStore.removeItem(menuId)
  |
  +-- "삭제" 클릭
  |     --> cartStore.removeItem(menuId)
  |
  +-- "메뉴로 돌아가기" 클릭
  |     --> navigate("/menu")
  |
  +-- "주문하기" 클릭
        --> navigate("/order-confirm")

모든 변경은 Zustand persist로 localStorage 자동 동기화
```

---

## Flow 5: 주문 생성 및 확인 (OrderConfirmPage)

```
OrderConfirmPage 마운트
  |
  v
cartStore.items 확인
  +-- 비어있음 --> navigate("/menu")
  |
  +-- 항목 있음 --> 주문 요약 표시
        |
        v
      "주문 확정" 클릭
        |
        v
      isSubmitting = true, 버튼 비활성화
        |
        v
      request = {
        items: cartStore.items.map(i => ({
          menuId: i.menuId,
          quantity: i.quantity
        }))
      }
        |
        v
      orderApi.createOrder(authStore.tableId, authStore.storeId, request)
        |
        +-- 성공 (200)
        |     |
        |     v
        |   cartStore.clearCart()
        |   orderResult = response.data
        |   isSuccess = true
        |   countdown = 5
        |     |
        |     v
        |   setInterval: countdown-- (매 1초)
        |     |
        |     v
        |   countdown === 0 --> navigate("/menu")
        |
        +-- 실패 (400 - 품절)
        |     |
        |     v
        |   notification.error("주문할 수 없는 메뉴가 포함되어 있습니다")
        |   isSubmitting = false
        |   (장바구니 유지)
        |
        +-- 실패 (기타)
              |
              v
            notification.error(서버 에러 메시지)
            isSubmitting = false
            (장바구니 유지)
```

---

## Flow 6: 주문 내역 조회 (OrderHistoryPage)

```
OrderHistoryPage 마운트
  |
  v
isLoading = true
  |
  v
orderApi.getSessionOrders(authStore.tableId)
  |
  +-- 성공
  |     |
  |     v
  |   orders = response.data (createdAt 역순 정렬)
  |   isLoading = false
  |     |
  |     v
  |   orders.length === 0?
  |     +-- YES --> "아직 주문 내역이 없습니다" 빈 상태 UI
  |     +-- NO  --> 주문 목록 렌더링
  |                   각 주문: 주문번호, 시각, 항목 목록, 총액, OrderStatusBadge
  |                   하단: 전체 총 금액
  |
  +-- 실패
        --> notification.error → 에러 UI 표시
  |
  v
"새로고침" 버튼 클릭
  |
  v
같은 API 재호출 → 목록 갱신
```

---

## Flow 7: 401 에러 글로벌 핸들링

```
ANY API 요청
  |
  v
Response Status === 401
  |
  v
Axios Response Interceptor 동작
  |
  v
authStore.logout()
  - token = null
  - storeId = null
  - tableId = null
  - isAuthenticated = false
  - localStorage 클리어
  |
  v
notification.error("인증이 만료되었습니다. 다시 설정해주세요.")
  |
  v
window.location.href = "/" (강제 리다이렉트)
```

**Note**: navigate() 대신 window.location.href 사용 이유 - 인터셉터는 React Router 컨텍스트 밖에서 실행되므로.
