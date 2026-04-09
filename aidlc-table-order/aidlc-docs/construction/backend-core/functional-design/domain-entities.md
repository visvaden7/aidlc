# Unit 1: Backend Core - 도메인 엔티티 설계

---

## 1. Store (매장)

```
store_id        BIGINT       PK, AUTO_INCREMENT
store_name      VARCHAR(100) NOT NULL
store_code      VARCHAR(50)  NOT NULL, UNIQUE  -- 로그인 시 매장 식별자
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP
```

---

## 2. AdminUser (관리자)

```
admin_user_id   BIGINT       PK, AUTO_INCREMENT
store_id        BIGINT       FK -> Store, NOT NULL
username        VARCHAR(50)  NOT NULL
password_hash   VARCHAR(255) NOT NULL           -- bcrypt 해시
login_attempts  INT          DEFAULT 0          -- 로그인 시도 횟수
locked_until    DATETIME     NULL               -- 잠금 해제 시각
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP

UNIQUE(store_id, username)
```

---

## 3. TableInfo (테이블)

```
table_id        BIGINT       PK, AUTO_INCREMENT
store_id        BIGINT       FK -> Store, NOT NULL
table_number    INT          NOT NULL
table_password  VARCHAR(255) NOT NULL           -- bcrypt 해시
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP

UNIQUE(store_id, table_number)
```

---

## 4. Category (카테고리)

```
category_id     BIGINT       PK, AUTO_INCREMENT
store_id        BIGINT       FK -> Store, NOT NULL
category_name   VARCHAR(50)  NOT NULL
display_order   INT          NOT NULL, DEFAULT 0
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP
```

**Note**: 사전 정의 고정 목록 - 시드 데이터로 삽입, 관리자 CRUD 없음

---

## 5. Menu (메뉴)

```
menu_id         BIGINT       PK, AUTO_INCREMENT
category_id     BIGINT       FK -> Category, NOT NULL
store_id        BIGINT       FK -> Store, NOT NULL
menu_name       VARCHAR(100) NOT NULL
price           INT          NOT NULL           -- 원 단위 (정수)
description     VARCHAR(500) NULL
image_url       VARCHAR(500) NULL               -- 외부 이미지 URL
display_order   INT          NOT NULL, DEFAULT 0
is_available    BOOLEAN      NOT NULL, DEFAULT TRUE
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE
```

**검증 규칙**:
- menu_name: 필수, 1~100자
- price: 필수, 0 이상 1,000,000 이하
- category_id: 필수, 유효한 카테고리

---

## 6. TableSession (테이블 세션)

```
session_id      BIGINT       PK, AUTO_INCREMENT
table_id        BIGINT       FK -> TableInfo, NOT NULL
store_id        BIGINT       FK -> Store, NOT NULL
started_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP
ended_at        DATETIME     NULL               -- NULL = 활성 세션
is_active       BOOLEAN      NOT NULL, DEFAULT TRUE

INDEX(table_id, is_active)
```

**라이프사이클**:
- **생성**: 해당 테이블의 첫 주문 시 자동 생성 (is_active=true, ended_at=null)
- **종료**: 관리자 "이용완료" 시 (is_active=false, ended_at=현재시각)
- **규칙**: 테이블당 활성 세션은 최대 1개

---

## 7. Order (주문)

```
order_id        BIGINT       PK, AUTO_INCREMENT
session_id      BIGINT       FK -> TableSession, NOT NULL
store_id        BIGINT       FK -> Store, NOT NULL
table_id        BIGINT       FK -> TableInfo, NOT NULL
order_number    VARCHAR(20)  NOT NULL           -- 표시용 주문번호 (예: "ORD-001")
status          VARCHAR(20)  NOT NULL, DEFAULT 'WAITING'  -- WAITING, PREPARING, COMPLETE
total_amount    INT          NOT NULL           -- 원 단위
created_at      DATETIME     NOT NULL, DEFAULT CURRENT_TIMESTAMP

INDEX(session_id)
INDEX(table_id, created_at)
```

**주문번호 생성 규칙**: 세션 내 순차 번호 (예: 테이블3의 첫 주문 = "T3-001")

---

## 8. OrderItem (주문 항목)

```
order_item_id   BIGINT       PK, AUTO_INCREMENT
order_id        BIGINT       FK -> Order, NOT NULL, CASCADE DELETE
menu_id         BIGINT       FK -> Menu, NULL    -- 메뉴 삭제 시에도 이력 보존
menu_name       VARCHAR(100) NOT NULL            -- 스냅샷
quantity        INT          NOT NULL            -- 1 이상
unit_price      INT          NOT NULL            -- 스냅샷 (원 단위)
subtotal        INT          NOT NULL            -- quantity * unit_price
```

**스냅샷 이유**: 주문 후 메뉴 가격/이름 변경 시에도 주문 이력 정확성 보장

---

## 9. OrderStatus (Enum)

```java
public enum OrderStatus {
    WAITING,    // 대기중
    PREPARING,  // 준비중
    COMPLETE    // 완료
}
```

**상태 전이 규칙**:
```
WAITING -> PREPARING -> COMPLETE (단방향, 역방향 불가)
```
