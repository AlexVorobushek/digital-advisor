# Digital Advisor - Backend

## Tech Stack
- **Framework:** Spring Boot 3.4.x (Java 21)
- **Database:** PostgreSQL
- **Security:** Spring Security + JWT
- **Orchestration:** Docker Compose

## Core Entities
- `User` (Auth)
- `AuthenticRole`
- `RoleEvent`
- `SuperResource`
- `BlockingProcess`
- `Victory`
- `Reflection`
- `Focus` & `FocusTask`
- `ChronicleEntry`
- `MetaTest`
- `BusinessModel`
- `AISession`

## Development
- `mvn spring-boot:run` to start locally.
- `docker-compose up` for the full stack.

## API Endpoints
- **POST `/api/auth/signup`**: Регистрация { email, password, name }
- **POST `/api/auth/login`**: Вход { email, password } -> { token, id, email }
- **GET `/api/test/all`**: Публичный контент
- **GET `/api/test/user`**: Контент для авторизованных пользователей (нужен Bearer token)

## Integration Guide
1. **Frontend to Backend**:
   - Update API calls in React app to use `http://localhost:8080/api`.
   - Store JWT token in `localStorage` after login.
   - Include `Authorization: Bearer <token>` header in protected requests.

2. **Docker**:
   - `docker-compose up --build` will build and start all services.
   - Database is accessible on `localhost:5432` (postgres/postgres).
   - Backend is on `localhost:8080`.
   - Frontend is on `localhost:3028`.
