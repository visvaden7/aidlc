# 테이블오더 서비스 - Unit of Work 의존성

---

## 의존성 매트릭스

| 유닛 | Unit 1 (Backend) | Unit 2 (Frontend Customer) | Unit 3 (Frontend Admin) |
|------|:-:|:-:|:-:|
| **Unit 1 (Backend Core)** | - | 없음 | 없음 |
| **Unit 2 (Frontend Customer)** | REST API 의존 | - | 없음 |
| **Unit 3 (Frontend Admin)** | REST API + SSE 의존 | 공유 기반 의존 | - |

---

## 의존성 상세

### Unit 1 → (독립)
- 다른 유닛에 대한 의존성 없음
- 가장 먼저 구축되어야 함
- API 계약이 Unit 2, Unit 3의 선행 조건

### Unit 2 → Unit 1
- **의존 유형**: REST API 호출
- **의존 엔드포인트**:
  - POST /api/auth/table/login
  - GET /api/stores/{storeId}/menus
  - GET /api/stores/{storeId}/categories
  - POST /api/tables/{tableId}/orders
  - GET /api/tables/{tableId}/orders
- **의존 수준**: 런타임 의존 (API 서버 필요)

### Unit 3 → Unit 1
- **의존 유형**: REST API + SSE
- **의존 엔드포인트**:
  - POST /api/auth/admin/login
  - GET /api/admin/tables
  - GET /api/admin/tables/{tableId}
  - PUT /api/admin/orders/{orderId}/status
  - DELETE /api/admin/orders/{orderId}
  - POST /api/admin/tables/{tableId}/complete
  - GET /api/admin/tables/{tableId}/history
  - POST/PUT/DELETE /api/admin/menus/*
  - GET /api/admin/sse/orders?token= (SSE)
- **의존 수준**: 런타임 의존 (API 서버 + SSE 필요)

### Unit 3 → Unit 2
- **의존 유형**: 코드 공유 (동일 Vite 앱)
- **공유 요소**:
  - `types/` - TypeScript 타입 정의
  - `services/api.ts` - Axios 인스턴스
  - `stores/authStore.ts` - 인증 상태 관리
  - `components/common/` - 공통 UI 컴포넌트
  - `routes/AppRoutes.tsx` - 라우팅 구조
- **의존 수준**: 빌드 타임 의존 (소스 코드 공유)

---

## 실행 순서

```
Unit 1 (Backend Core)
  |
  | API 계약 확정
  v
Unit 2 (Frontend Customer + 공통 기반)
  |
  | 공유 기반 확정
  v
Unit 3 (Frontend Admin)
  |
  v
Build & Test (전체 통합)
```

---

## 크리티컬 패스

```
Unit 1 Functional Design
  --> Unit 1 Code Generation
    --> Unit 2 Functional Design
      --> Unit 2 Code Generation
        --> Unit 3 Functional Design
          --> Unit 3 Code Generation
            --> Build & Test
```

모든 유닛이 순차적 크리티컬 패스 위에 있으며, 병렬 실행은 불가합니다.
