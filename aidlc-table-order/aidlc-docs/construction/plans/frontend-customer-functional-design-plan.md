# Unit 2: Frontend Customer - Functional Design Plan

## Context
- **Unit**: Frontend Customer (React TypeScript / Vite / Ant Design / Zustand)
- **Scope**: 고객 대면 페이지 + 프론트엔드 공통 기반 (프로젝트 초기화, 라우팅, 공통 컴포넌트, API 설정, 타입 정의)
- **Related Stories**: US-C01 ~ US-C05
- **Dependency**: Unit 1 (Backend Core) API 계약

---

## Execution Steps

### Step 1: Context Analysis
- [x] 1.1 Unit 정의 및 스토리 매핑 분석
- [x] 1.2 Backend API 계약 확인 (엔드포인트, 요청/응답 DTO)

### Step 2: Frontend Component Hierarchy
- [x] 2.1 고객 페이지 컴포넌트 계층 구조 정의
- [x] 2.2 공통 컴포넌트 정의 (ConfirmDialog, Loading, ErrorMessage, ProtectedRoute)
- [x] 2.3 고객 전용 컴포넌트 정의 (CategoryTabs, MenuCard, CartItem, OrderStatusBadge, CustomerHeader)

### Step 3: State Management Design
- [x] 3.1 cartStore (Zustand + localStorage persist) 상태/액션 설계
- [x] 3.2 authStore (Zustand + localStorage persist) 상태/액션 설계

### Step 4: User Interaction Flows
- [x] 4.1 자동 로그인 흐름 (useAutoLogin)
- [x] 4.2 메뉴 조회/탐색 흐름
- [x] 4.3 장바구니 관리 흐름
- [x] 4.4 주문 생성/확인 흐름
- [x] 4.5 주문 내역 조회 흐름

### Step 5: API Integration Points
- [x] 5.1 Axios 인스턴스 설계 (인터셉터, 에러 핸들링)
- [x] 5.2 각 API 서비스 메서드 ↔ 백엔드 엔드포인트 매핑

### Step 6: Business Rules & Validation
- [x] 6.1 프론트엔드 유효성 검증 규칙
- [x] 6.2 에러 처리 및 사용자 피드백 규칙

### Step 7: Generate Artifacts
- [x] 7.1 frontend-components.md (컴포넌트 계층, Props, State, 상호작용)
- [x] 7.2 business-rules.md (프론트엔드 비즈니스 규칙)
- [x] 7.3 business-logic-model.md (사용자 흐름 상세)

---

## Questions

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 뒤에 선택지 또는 답변을 작성해 주세요.

---

### Q1: 태블릿 화면 최적화 방향

태블릿 고객 화면의 기본 레이아웃 방향은?

- **A**: 세로(Portrait) 최적화 - 모바일 스타일, 스크롤 중심
- **B**: 가로(Landscape) 최적화 - 넓은 화면 활용, 좌우 분할 가능
- **C**: 반응형 - 양방향 모두 지원

[Answer]: B

---

### Q2: 메뉴 카드 클릭 시 동작

고객이 메뉴 카드를 클릭하면 어떻게 동작해야 하나요?

- **A**: 바로 장바구니에 1개 추가 (빠른 주문 우선)
- **B**: 수량 선택 팝업 표시 후 장바구니에 추가
- **C**: 메뉴 상세 정보 팝업 표시 (설명, 이미지 확대) + 수량 선택 후 추가

[Answer]: A

---

### Q3: "전체 메뉴" 탭 유무

카테고리 탭에 "전체" 탭이 필요한가요?

- **A**: "전체" 탭 포함 - 모든 카테고리 메뉴를 한번에 표시 (기본 선택)
- **B**: "전체" 탭 없음 - 첫 번째 카테고리가 기본 선택

[Answer]: B

---

### Q4: 장바구니 수량 제한

장바구니에서 단일 메뉴의 최대 주문 수량은?

- **A**: 10개
- **B**: 20개
- **C**: 99개
- **D**: 제한 없음

[Answer]:A

---

### Q5: 주문 내역 실시간 갱신

고객 주문 내역 페이지에서 주문 상태가 변경될 때 실시간 반영이 필요한가요?

- **A**: 폴링 방식 - 일정 간격(예: 10초)으로 자동 갱신
- **B**: 수동 갱신 - 새로고침 버튼으로 갱신
- **C**: 실시간 불필요 - 페이지 진입 시 1회만 조회

[Answer]:B

---

### Q6: 에러/알림 표시 방식

에러 메시지와 성공 알림을 어떻게 표시할까요?

- **A**: Ant Design message (화면 상단 토스트)
- **B**: Ant Design notification (화면 우측 상단 알림)
- **C**: 인라인 에러 (해당 위치에 직접 표시)
- **D**: A+C 혼합 (성공/일반 에러는 토스트, 폼 유효성 에러는 인라인)

[Answer]:B

---
