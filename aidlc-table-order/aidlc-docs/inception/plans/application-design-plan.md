# Application Design Plan - 테이블오더 서비스

## Context
- **Project**: 테이블오더 서비스 MVP (Greenfield)
- **Tech Stack**: React TypeScript + Java Spring Boot + MySQL + AWS
- **Stories**: 12 user stories (US-C01~C05, US-A01~A07)
- **Units**: Backend Core, Frontend Customer, Frontend Admin

---

## Design Questions

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택한 옵션 알파벳을 입력해 주세요.

### Question 1
Spring Boot 프로젝트의 Java 버전은 무엇을 사용하시겠습니까?

A) Java 17 (LTS, Spring Boot 3.x 최소 요구)
B) Java 21 (최신 LTS)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
프론트엔드 빌드 도구는 무엇을 사용하시겠습니까?

A) Vite (빠른 빌드, 최신 도구)
B) Create React App (전통적, 안정적)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
프론트엔드 상태 관리 방식은 무엇을 사용하시겠습니까?

A) React Context API (내장, 단순)
B) Zustand (경량 상태 관리)
C) Redux Toolkit (확장성, 복잡한 상태)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4
프론트엔드 UI 컴포넌트 라이브러리를 사용하시겠습니까?

A) MUI (Material UI) - 풍부한 컴포넌트, Material Design
B) Ant Design - 기업용 UI, 관리자 화면에 적합
C) 라이브러리 없이 직접 CSS 구현 (Tailwind CSS 또는 순수 CSS)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 5
백엔드-프론트엔드 간 HTTP 통신 라이브러리는 무엇을 사용하시겠습니까?

A) Axios (가장 널리 사용, 인터셉터 지원)
B) Fetch API (내장, 별도 설치 불필요)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Design Generation Execution Plan

### Phase 1: Component Identification
- [x] 1.1 Backend 컴포넌트 식별 (Controller, Service, Repository, Entity, Security, Config)
- [x] 1.2 Frontend 공통 컴포넌트 식별 (Router, Context, Common UI)
- [x] 1.3 Frontend Customer 컴포넌트 식별 (Pages, Components, Hooks)
- [x] 1.4 Frontend Admin 컴포넌트 식별 (Pages, Components, Hooks)
- [x] 1.5 컴포넌트 문서 저장 (components.md)

### Phase 2: Component Methods
- [x] 2.1 Backend Service 메서드 시그니처 정의
- [x] 2.2 Backend Controller 엔드포인트 시그니처 정의
- [x] 2.3 Frontend Hook 인터페이스 정의
- [x] 2.4 컴포넌트 메서드 문서 저장 (component-methods.md)

### Phase 3: Service Layer Design
- [x] 3.1 Backend 서비스 레이어 설계 (AuthService, MenuService, OrderService, TableService, SseService)
- [x] 3.2 Frontend API 서비스 레이어 설계
- [x] 3.3 서비스 문서 저장 (services.md)

### Phase 4: Dependency Mapping
- [x] 4.1 Backend 내부 의존성 매핑
- [x] 4.2 Frontend-Backend API 의존성 매핑
- [x] 4.3 Frontend 내부 의존성 매핑
- [x] 4.4 의존성 문서 저장 (component-dependency.md)

### Phase 5: Consolidated Design
- [x] 5.1 전체 설계 통합 문서 생성 (application-design.md)
