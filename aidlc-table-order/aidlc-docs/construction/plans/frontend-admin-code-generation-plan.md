# Unit 3: Frontend Admin - Code Generation Plan

## Context
- **Unit**: Frontend Admin (React TypeScript, Ant Design, Zustand, SSE)
- **Design Artifacts**: frontend-components.md, business-rules.md, business-logic-model.md
- **Target Directory**: frontend/src/ (Unit 2에서 생성한 프로젝트에 추가)
- **Dependencies**: Unit 1 (Backend Core API), Unit 2 (공유 기반)

---

## Execution Steps

### Phase 1: API Layer (관리자 전용)
- [x] 1.1 services/tableApi.ts (getAllTables, getTableDetail, completeTable, getTableHistory)
- [x] 1.2 services/adminOrderApi.ts (updateOrderStatus, deleteOrder)
- [x] 1.3 services/adminMenuApi.ts (createMenu, updateMenu, deleteMenu, reorderMenus)
- [x] 1.4 services/api.ts 수정 (401 시 role 기반 리다이렉트 분기)

### Phase 2: State Management & Hooks
- [x] 2.1 stores/orderStore.ts (highlightedTableIds, addHighlight, removeHighlight)
- [x] 2.2 hooks/useSSE.ts (EventSource 연결, 자동 재연결, 이벤트 핸들링)

### Phase 3: Admin Layout
- [x] 3.1 components/admin/AdminLayout.tsx (Sider + Header + Content, collapsible)

### Phase 4: Admin Components
- [x] 4.1 components/admin/TableCard.tsx (테이블 카드, 활성/비활성, pulse 애니메이션)
- [x] 4.2 components/admin/OrderCard.tsx (주문 카드, 상태 변경/삭제 버튼)
- [x] 4.3 components/admin/OrderStatusControl.tsx (상태 전이 버튼)
- [x] 4.4 components/admin/MenuForm.tsx (메뉴 등록/수정 모달 폼)
- [x] 4.5 components/admin/DateFilter.tsx (날짜 범위 필터)
- [x] 4.6 components/admin/TableDetailModal.tsx (테이블 상세 모달)

### Phase 5: Admin Pages
- [x] 5.1 pages/admin/AdminLoginPage.tsx (관리자 로그인)
- [x] 5.2 pages/admin/DashboardPage.tsx (실시간 대시보드 + SSE + 테이블 카드 그리드)
- [x] 5.3 pages/admin/AdminOrderHistoryPage.tsx (과거 주문 내역 + 날짜 필터)
- [x] 5.4 pages/admin/MenuManagementPage.tsx (메뉴 CRUD + 드래그 앤 드롭)

### Phase 6: Routing Update
- [x] 6.1 routes/AppRoutes.tsx 수정 (관리자 라우트 추가, ProtectedRoute role=ADMIN)

### Phase 7: Styles
- [x] 7.1 App.css 추가 (pulse 애니메이션, 관리자 레이아웃 스타일)

### Phase 8: Dependencies Update
- [x] 8.1 package.json에 @dnd-kit/core, @dnd-kit/sortable 추가 (드래그 앤 드롭)

### Phase 9: Unit Tests
- [x] 9.1 orderStore 테스트 (highlight 추가/제거)
- [x] 9.2 OrderStatusControl 테스트 (상태별 버튼 렌더링)
- [x] 9.3 TableCard 테스트 (활성/비활성 렌더링)
