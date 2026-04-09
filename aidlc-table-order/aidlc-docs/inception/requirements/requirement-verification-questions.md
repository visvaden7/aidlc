# Requirements Verification Questions

테이블오더 서비스 요구사항 분석을 위해 아래 질문에 답변해 주세요.
각 질문의 [Answer]: 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.

---

## Question 1
프론트엔드(고객용/관리자용) 기술 스택은 무엇을 사용하시겠습니까?

A) React (JavaScript)
B) React (TypeScript)
C) Vue.js (TypeScript)
D) Next.js (TypeScript)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
백엔드 기술 스택은 무엇을 사용하시겠습니까?

A) Node.js + Express (TypeScript)
B) Node.js + NestJS (TypeScript)
C) Python + FastAPI
D) Java + Spring Boot
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 3
데이터베이스는 무엇을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) SQLite (개발/프로토타입용)
D) MongoDB (NoSQL)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
고객용 UI와 관리자용 UI를 어떻게 구성하시겠습니까?

A) 하나의 프론트엔드 앱에 통합 (라우팅으로 분리)
B) 별도의 프론트엔드 앱으로 분리 (2개 앱)
C) 고객용은 모바일 최적화 웹앱, 관리자용은 별도 데스크톱 웹앱
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
배포 환경은 어떻게 계획하고 계십니까?

A) AWS (EC2, RDS 등)
B) 로컬 서버 / 온프레미스
C) Docker 컨테이너 기반
D) 배포는 아직 고려하지 않음 (로컬 개발 환경에서 먼저 동작하는 것이 목표)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
메뉴 이미지 처리 방식은 어떻게 하시겠습니까? 요구사항에 "이미지 URL"이 언급되어 있습니다.

A) 외부 이미지 URL만 입력 (이미지 업로드 없음)
B) 서버에 이미지 파일 업로드 후 URL 자동 생성
C) 클라우드 스토리지(S3 등)에 업로드 후 URL 자동 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
이 서비스는 단일 매장용입니까, 다중 매장을 지원해야 합니까?

A) 단일 매장 전용 (하나의 서버 인스턴스 = 하나의 매장)
B) 다중 매장 지원 (하나의 서버에서 여러 매장 관리)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
관리자용 메뉴 관리 기능에서 카테고리 관리도 필요합니까?

A) 예 - 카테고리 CRUD(생성/조회/수정/삭제) 기능 필요
B) 아니오 - 카테고리는 사전 정의된 고정 목록 사용
C) 카테고리는 메뉴 등록 시 자유 텍스트로 입력
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9
테이블 수는 매장당 대략 어느 정도를 예상하십니까? (성능 설계 참고용)

A) 소규모: 1~10개 테이블
B) 중규모: 11~30개 테이블
C) 대규모: 31~50개 테이블
D) 초대규모: 50개 이상
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
초기 데이터(샘플 매장, 메뉴, 테이블 등)를 시드 데이터로 포함하시겠습니까?

A) 예 - 샘플 데이터(매장, 카테고리, 메뉴, 테이블)를 시드로 포함
B) 아니오 - 빈 상태에서 시작, 관리자가 직접 등록
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 11: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes - 모든 SECURITY 규칙을 blocking 제약 조건으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No - SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B
