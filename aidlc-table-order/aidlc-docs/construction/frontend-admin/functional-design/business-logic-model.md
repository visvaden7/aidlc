# Unit 3: Frontend Admin - 비즈니스 로직 모델

---

## Flow 1: 관리자 로그인 (AdminLoginPage)

```
AdminLoginPage 렌더링
  |
  v
인증 상태 확인 (authStore)
  +-- 이미 ADMIN 인증됨 --> "/admin/dashboard"로 리다이렉트
  |
  +-- 미인증
        |
        v
      사용자 입력: storeCode, username, password
        |
        v
      "로그인" 클릭
        |
        v
      입력값 유효성 검증
        +-- 빈 필드 --> notification 에러
        |
        +-- 유효
              |
              v
            isLoading = true
              |
              v
            authApi.adminLogin({ storeCode, username, password })
              |
              +-- 성공 (200)
              |     |
              |     v
              |   authStore.setAdminAuth({ token, storeId })
              |   navigate("/admin/dashboard")
              |
              +-- 실패 (401)
              |     --> notification.error("매장 정보 또는 비밀번호를 확인해주세요")
              |
              +-- 실패 (423 Locked)
                    --> notification.error("계정이 잠겼습니다. 15분 후 다시 시도해주세요.")
```

---

## Flow 2: 대시보드 실시간 모니터링 (DashboardPage)

```
DashboardPage 마운트
  |
  v
[병렬 실행]
  +-- tableApi.getAllTables(storeId) --> tables 상태 저장
  +-- useSSE.connect(storeId, token) --> SSE 연결
  |
  v
테이블 카드 그리드 렌더링
  - 활성 테이블: 밝은 배경, 주문액/건수 표시
  - 비활성 테이블: 회색 배경
  |
  v
SSE 이벤트 수신 루프:
  |
  +-- "new-order" 이벤트
  |     |
  |     v
  |   orderStore.addHighlight(tableId)
  |   notification.info("테이블 N번 새 주문이 들어왔습니다")
  |   tableApi.getAllTables(storeId) --> 목록 갱신
  |   setTimeout(() => orderStore.removeHighlight(tableId), 3000)
  |
  +-- "order-status-changed" 이벤트
  |     |
  |     v
  |   tableApi.getAllTables(storeId) --> 목록 갱신
  |   모달 열려있으면 → tableApi.getTableDetail(tableId) 재조회
  |
  +-- "order-deleted" 이벤트
  |     |
  |     v
  |   tableApi.getAllTables(storeId) --> 목록 갱신
  |   모달 열려있으면 → tableApi.getTableDetail(tableId) 재조회
  |
  +-- "table-session-completed" 이벤트
        |
        v
      tableApi.getAllTables(storeId) --> 목록 갱신
      모달 열려있고 해당 테이블이면 → 모달 닫기

DashboardPage 언마운트
  |
  v
useSSE.disconnect() --> EventSource 닫기
```

---

## Flow 3: 테이블 상세 모달 (TableDetailModal)

```
테이블 카드 클릭
  |
  v
selectedTableId = tableId
isDetailModalOpen = true
  |
  v
tableApi.getTableDetail(tableId)
  |
  +-- 성공 --> tableDetail 저장, 모달 렌더링
  +-- 실패 --> notification.error
  |
  v
모달 내 상호작용:
  |
  +-- 주문 상태 변경 버튼 클릭
  |     |
  |     v
  |   orderApi.updateOrderStatus(orderId, newStatus)
  |     +-- 성공 --> notification.success + 상세 재조회
  |     +-- 실패 --> notification.error
  |
  +-- 주문 삭제 버튼 클릭
  |     |
  |     v
  |   ConfirmDialog "이 주문을 삭제하시겠습니까?"
  |     +-- 확인 --> orderApi.deleteOrder(orderId)
  |     |     +-- 성공 --> notification.success + 상세 재조회
  |     |     +-- 실패 --> notification.error
  |     +-- 취소 --> 아무 동작 없음
  |
  +-- 이용완료 버튼 클릭
  |     |
  |     v
  |   ConfirmDialog "이용완료 처리하시겠습니까?"
  |     +-- 확인 --> tableApi.completeTable(tableId, storeId)
  |     |     +-- 성공 --> 모달 닫기 + 대시보드 갱신 + notification.success
  |     |     +-- 실패 --> notification.error
  |     +-- 취소 --> 아무 동작 없음
  |
  +-- 과거 내역 보기 클릭
  |     --> navigate("/admin/tables/{tableId}/history")
  |
  +-- 닫기 (X 또는 배경 클릭)
        --> isDetailModalOpen = false, selectedTableId = null
```

---

## Flow 4: 과거 주문 내역 조회 (OrderHistoryPage Admin)

```
OrderHistoryPage 마운트
  |
  v
URL params에서 tableId 추출
startDate = 오늘, endDate = 오늘
  |
  v
tableApi.getTableHistory(tableId, startDate, endDate)
  |
  +-- 성공 --> histories 저장 (세션별 그룹화된 데이터)
  +-- 실패 --> notification.error
  |
  v
렌더링: 세션별 카드
  각 세션: 시작~종료 시각, 총 금액, 주문 목록
  |
  v
날짜 필터 변경 (DateFilter)
  |
  v
tableApi.getTableHistory(tableId, newStartDate, newEndDate)
  --> histories 갱신
```

---

## Flow 5: 메뉴 관리 (MenuManagementPage)

```
MenuManagementPage 마운트
  |
  v
[병렬 실행]
  +-- menuApi.getCategories(storeId)
  +-- menuApi.getMenus(storeId)
  |
  v
selectedCategoryId = categories[0].categoryId
메뉴 목록 렌더링 (드래그 가능 테이블)
  |
  v
사용자 상호작용:
  |
  +-- 카테고리 탭 클릭
  |     --> selectedCategoryId 변경 → 필터링
  |
  +-- "메뉴 추가" 클릭
  |     --> isFormModalOpen=true, editingMenu=null
  |     --> MenuForm 모달 (빈 폼)
  |
  +-- "수정" 클릭
  |     --> isFormModalOpen=true, editingMenu=해당 메뉴
  |     --> MenuForm 모달 (프리필)
  |
  +-- MenuForm "저장" 클릭
  |     |
  |     v
  |   Ant Design Form 유효성 검증
  |     +-- 실패 --> 인라인 에러 표시
  |     +-- 성공
  |           |
  |           v
  |         editingMenu === null?
  |           +-- 신규: menuApi.createMenu(storeId, values)
  |           +-- 수정: menuApi.updateMenu(menuId, values)
  |           |
  |           v
  |         성공 --> 모달 닫기 + 목록 갱신 + notification.success
  |         실패 --> notification.error
  |
  +-- "삭제" 클릭
  |     --> ConfirmDialog → menuApi.deleteMenu(menuId)
  |     --> 성공: 목록 갱신 + notification.success
  |
  +-- 드래그 앤 드롭 (순서 변경)
        |
        v
      newOrder = 재정렬된 메뉴 ID + displayOrder 목록
        |
        v
      menuApi.reorderMenus(newOrder)
        +-- 성공 --> 목록 상태 갱신
        +-- 실패 --> 원래 순서로 롤백 + notification.error
```

---

## Flow 6: SSE 연결 관리 (useSSE)

```
useSSE.connect(storeId, token) 호출
  |
  v
EventSource 생성
  url = "/api/admin/sse/orders?token={token}"
  |
  v
이벤트 리스너 등록:
  - "new-order" → onNewOrder 콜백
  - "order-status-changed" → onStatusChanged 콜백
  - "order-deleted" → onOrderDeleted 콜백
  - "table-session-completed" → onSessionCompleted 콜백
  |
  v
연결 상태 관리:
  onopen → isConnected = true, retryCount = 0
  onerror → isConnected = false
    |
    v
  retryCount < 5?
    +-- YES --> 3초 후 재연결 시도, retryCount++
    +-- NO  --> notification.error "실시간 연결 끊김"

useSSE.disconnect() 호출 (또는 cleanup)
  |
  v
EventSource.close()
isConnected = false
```

---

## Flow 7: 401 글로벌 핸들링 (관리자)

```
ANY Admin API 요청
  |
  v
Response Status === 401
  |
  v
Axios Response Interceptor (api.ts에서 이미 구현)
  |
  v
authStore.logout()
  |
  v
window.location.href = "/" 
  --> 관리자는 "/" 진입 시 TableSetupPage가 표시되므로
      직접 "/admin/login"으로 수동 이동 필요

**Note**: 401 인터셉터의 리다이렉트 경로를 role 기반으로 분기하는 개선 가능
- role === 'ADMIN' → "/admin/login"
- role === 'TABLE' → "/"
이는 Code Generation 시 api.ts를 수정하여 반영.
```
