# Unit 3: Frontend Admin - Functional Design Plan

## Context
- **Unit**: Frontend Admin (React TypeScript, Ant Design, Zustand, SSE)
- **Scope**: 관리자 대면 페이지 + SSE 통합
- **Related Stories**: US-A01 ~ US-A07
- **Dependencies**: Unit 1 (Backend Core API), Unit 2 (공유 기반: types, api.ts, authStore, common components)

---

## Execution Steps

### Step 1: Context Analysis
- [x] 1.1 Unit 정의 및 스토리 매핑 분석
- [x] 1.2 Backend API 계약 확인 (관리자 엔드포인트, SSE 엔드포인트)
- [x] 1.3 Unit 2 공유 기반 확인 (authStore, ProtectedRoute, types, api.ts)

### Step 2: Admin Component Hierarchy
- [x] 2.1 관리자 페이지 컴포넌트 계층 구조 정의
- [x] 2.2 관리자 전용 컴포넌트 정의 (TableCard, OrderCard, OrderStatusControl, MenuForm, AdminHeader, DateFilter)

### Step 3: State Management Design
- [x] 3.1 orderStore (SSE 이벤트 반영, 대시보드 상태)

### Step 4: SSE Integration Design
- [x] 4.1 useSSE 훅 설계 (EventSource, 자동 재연결, 이벤트 핸들링)

### Step 5: User Interaction Flows
- [x] 5.1 관리자 로그인 흐름
- [x] 5.2 대시보드 실시간 모니터링 흐름
- [x] 5.3 주문 상태 변경 흐름
- [x] 5.4 주문 삭제 흐름
- [x] 5.5 테이블 이용완료 흐름
- [x] 5.6 과거 주문 내역 조회 흐름
- [x] 5.7 메뉴 관리 (CRUD) 흐름

### Step 6: API Integration Points
- [x] 6.1 tableApi 서비스 메서드 ↔ 백엔드 엔드포인트 매핑
- [x] 6.2 관리자 전용 order/menu API 매핑

### Step 7: Business Rules & Validation
- [x] 7.1 관리자 프론트엔드 비즈니스 규칙
- [x] 7.2 메뉴 폼 유효성 검증 규칙

### Step 8: Generate Artifacts
- [x] 8.1 frontend-components.md
- [x] 8.2 business-rules.md
- [x] 8.3 business-logic-model.md

---

## Questions

아래 질문에 답변해 주세요.

---

### Q1: 대시보드 테이블 카드 레이아웃

대시보드에서 테이블 카드를 어떻게 배치할까요?

- **A**: 그리드 형식 - 테이블 번호순으로 고정 그리드 (빈 테이블도 표시)
- **B**: 리스트 형식 - 활성 세션 테이블만 상단에, 빈 테이블 하단에 표시
- **C**: 그리드 형식 - 활성 테이블 강조, 빈 테이블 회색 처리

[Answer]: C

---

### Q2: 새 주문 알림 표시 방식

SSE로 새 주문이 들어왔을 때 관리자에게 어떻게 알릴까요?

- **A**: 해당 테이블 카드 깜빡임(pulse) 효과 + notification
- **B**: notification만 표시
- **C**: 해당 테이블 카드 깜빡임(pulse) 효과만

[Answer]: A

---

### Q3: 테이블 상세 표시 방식

대시보드에서 테이블 카드를 클릭하면?

- **A**: 별도 페이지(/admin/tables/:id)로 이동
- **B**: 사이드 패널(Drawer)로 상세 표시
- **C**: 모달(Modal)로 상세 표시

[Answer]: C

---

### Q4: 메뉴 관리 - 순서 변경 방식

메뉴 순서를 어떻게 변경할까요?

- **A**: 드래그 앤 드롭
- **B**: 위/아래 화살표 버튼
- **C**: 순서 번호 직접 입력

[Answer]: A

---

### Q5: 관리자 네비게이션 구조

관리자 화면의 네비게이션은?

- **A**: 상단 헤더 탭 (대시보드 | 메뉴관리 | 로그아웃)
- **B**: 좌측 사이드바 (Ant Design Layout.Sider)
- **C**: 상단 헤더 + 드롭다운 메뉴

[Answer]: B

---
