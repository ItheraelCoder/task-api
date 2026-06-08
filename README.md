# Task API

![CI](https://github.com/ItheraelCoder/task-api/actions/workflows/ci.yml/badge.svg?branch=main)

REST API for task management with JWT authentication, refresh token rotation, and role-based access control.

Built with a TypeScript-first stack focused on type safety, clean architecture, and professional Git workflows.

## Tech Stack

- **Runtime:** Bun
- **Framework:** Express
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod v4
- **Authentication:** JWT (access + refresh tokens) with Argon2id password hashing
- **Testing:** Vitest + Supertest (integration tests)
- **CI:** GitHub Actions

## Features

- User registration and login with secure password hashing (Argon2id)
- Access token (15m) + refresh token (7d) with rotation strategy
- Single active session per user — login invalidates previous tokens
- Role-based access control (admin / user)
- Full task CRUD with ownership validation
- Admins can read and delete any user's tasks
- Centralized error handling with operational vs non-operational error distinction
- Zod validation on all incoming data (body, params, query)
- Environment variable validation at startup
- 25 integration tests covering auth flows, RBAC, and edge cases

## Requirements

- [Bun](https://bun.sh) v1.0+
- PostgreSQL 14+

## Installation

```bash
# Clone the repository
git clone https://github.com/ItheraelCoder/task-api.git
cd task-api

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
bun run db:generate
bun run db:push

# Start development server
bun dev
```

## Environment Variables

| Variable                 | Description                         | Example                                               |
| ------------------------ | ----------------------------------- | ----------------------------------------------------- |
| `PORT`                   | Server port                         | `3000`                                                |
| `NODE_ENV`               | Environment                         | `development`                                         |
| `DATABASE_URL`           | PostgreSQL connection string        | `postgresql://user:pass@localhost:5432/task_api`      |
| `DATABASE_URL_TEST`      | Test database URL                   | `postgresql://user:pass@localhost:5432/task_api_test` |
| `JWT_SECRET`             | Access token secret (min 32 chars)  | —                                                     |
| `JWT_EXPIRES_IN`         | Access token expiry                 | `15m`                                                 |
| `JWT_REFRESH_SECRET`     | Refresh token secret (min 32 chars) | —                                                     |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry                | `7d`                                                  |

## API Endpoints

### Auth

| Method | Endpoint             | Auth   | Description              |
| ------ | -------------------- | ------ | ------------------------ |
| `POST` | `/api/auth/register` | No     | Register a new user      |
| `POST` | `/api/auth/login`    | No     | Login and receive tokens |
| `POST` | `/api/auth/refresh`  | No     | Rotate refresh token     |
| `POST` | `/api/auth/logout`   | Bearer | Invalidate session       |

### Tasks

| Method   | Endpoint         | Auth   | Description                     |
| -------- | ---------------- | ------ | ------------------------------- |
| `POST`   | `/api/tasks`     | Bearer | Create a task                   |
| `GET`    | `/api/tasks`     | Bearer | List own tasks                  |
| `GET`    | `/api/tasks/:id` | Bearer | Get task by ID (owner or admin) |
| `PATCH`  | `/api/tasks/:id` | Bearer | Update task (owner only)        |
| `DELETE` | `/api/tasks/:id` | Bearer | Delete task (owner or admin)    |

### Health

| Method | Endpoint  | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| `GET`  | `/health` | No   | Server health check |

## Request & Response Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

```json
{
  "status": "success",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "role": "user" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Create Task

```http
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "userId": "uuid",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

## Testing

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage
```

Tests use a separate database (`DATABASE_URL_TEST`). Make sure it exists before running tests.

The test suite covers:

- Auth flows: register, login, refresh token rotation, logout
- Input validation: invalid emails, short passwords, malformed UUIDs
- Security: user enumeration prevention, ownership validation, RBAC
- Edge cases: duplicate emails, expired tokens, non-existent resources
