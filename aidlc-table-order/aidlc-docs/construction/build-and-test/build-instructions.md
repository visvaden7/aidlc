# Build Instructions

## Prerequisites

| 항목 | 요구사항 |
|------|---------|
| **Java** | JDK 21+ |
| **Maven** | 3.9+ |
| **Node.js** | 18+ (LTS) |
| **npm** | 9+ |
| **MySQL** | 8.0+ |
| **OS** | Linux / macOS / Windows |
| **Memory** | 4GB+ RAM 권장 |

## Environment Variables

```bash
# Backend (application.yml에서 기본값 설정됨, 필요 시 오버라이드)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/tableorder
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root1234

# Frontend (선택, 프록시 사용 시 불필요)
VITE_API_URL=http://localhost:8080
```

---

## Build Steps

### 1. Database 준비

```bash
# MySQL 접속 후 데이터베이스 생성
mysql -u root -p
CREATE DATABASE IF NOT EXISTS tableorder DEFAULT CHARACTER SET utf8mb4;
EXIT;
```

### 2. Backend Build

```bash
cd backend/

# 의존성 다운로드 및 빌드
mvn clean package -DskipTests

# 빌드 성공 확인
# 결과: target/tableorder-0.0.1-SNAPSHOT.jar
```

### 3. Frontend Build

```bash
cd frontend/

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 성공 확인
# 결과: dist/ 디렉토리
```

### 4. Backend 실행

```bash
cd backend/

# 개발 모드 실행 (H2 인메모리 DB 사용 가능, 또는 MySQL 연결)
mvn spring-boot:run

# 또는 JAR 직접 실행
java -jar target/tableorder-0.0.1-SNAPSHOT.jar

# 확인: http://localhost:8080 접속
```

### 5. Frontend 실행 (개발 모드)

```bash
cd frontend/

# 개발 서버 실행 (API 프록시 → localhost:8080)
npm run dev

# 확인: http://localhost:5173 접속
```

---

## Verify Build Success

| 항목 | 확인 방법 |
|------|---------|
| **Backend JAR** | `backend/target/tableorder-0.0.1-SNAPSHOT.jar` 존재 |
| **Frontend dist** | `frontend/dist/index.html` 존재 |
| **Backend 기동** | `curl http://localhost:8080/api/auth/admin/login` → 405 (Method Not Allowed) |
| **시드 데이터** | Backend 기동 시 `data.sql` 자동 실행 → 매장/메뉴/테이블 데이터 확인 |

---

## Troubleshooting

### Backend: MySQL 연결 실패
- **원인**: MySQL 미실행 또는 인증 정보 불일치
- **해결**: MySQL 실행 확인, `application.yml`의 datasource 설정 확인

### Frontend: npm install 실패
- **원인**: Node.js 버전 불일치
- **해결**: `node -v`로 18+ 확인, `nvm use 18` 실행

### Backend: Port 8080 사용 중
- **해결**: `application.yml`에서 `server.port` 변경 또는 기존 프로세스 종료
