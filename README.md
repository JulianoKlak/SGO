# SGO - Sistema de Gerenciamento de Oficinas

A complete ERP system for automotive workshops (oficinas mecânicas), covering clients, vehicles, service orders, stages, tasks, products, inventory, and users.

---

## Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Node.js, Express, Sequelize ORM         |
| Database | MariaDB 10.11                           |
| Frontend | Vue 3, Quasar Framework, Pinia          |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [Docker](https://www.docker.com/) & Docker Compose (for the database container)

---

## Quick Start with Docker

Start the MariaDB database:

```bash
docker compose up -d
```

The database will be initialised automatically from `sgo_db.sql`.

---

## Manual Setup

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

Copy and edit the backend env file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials (see [Environment Variables](#environment-variables)).

### 3. Seed the database

```bash
npm run seed
```

### 4. Start development servers

```bash
npm run dev
```

This starts both the backend API and the frontend dev server concurrently.

---

## Default Credentials

| Username | Password  | Type  |
|----------|-----------|-------|
| admin    | admin123  | Admin |

---

## User Types

| Value | Role     | Description                        |
|-------|----------|------------------------------------|
| 0     | User     | Standard user (receptionist, etc.) |
| 1     | Admin    | Full administrative access         |
| 2     | Mechanic | Workshop technician                |

---

## API Endpoints Overview

| Resource        | Base Path               |
|-----------------|-------------------------|
| Authentication  | `POST /api/auth/login`  |
| Users           | `/api/users`            |
| Clients         | `/api/clients`          |
| Vehicles        | `/api/vehicles`         |
| Products        | `/api/products`         |
| Services        | `/api/services`         |
| Inventory       | `/api/inventory`        |
| Service Orders  | `/api/service-orders`   |
| Stages          | `/api/stages`           |
| Tasks           | `/api/tasks`            |
| Dashboard       | `/api/dashboard`        |

All protected routes require a Bearer JWT token in the `Authorization` header.

---

## Environment Variables

Create `backend/.env` based on the following:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sgo_db
DB_USER=sgo_user
DB_PASSWORD=sgo_pass

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=8h
```

---

## Project Structure

```
SGO/
├── backend/
│   ├── server.js               # Express entry point
│   └── src/
│       ├── config/             # Database & app config
│       ├── middlewares/        # Auth & error middlewares
│       ├── models/             # Sequelize models
│       ├── modules/            # Feature modules (routes + controllers)
│       │   ├── auth/
│       │   ├── clients/
│       │   ├── vehicles/
│       │   ├── products/
│       │   ├── services/
│       │   ├── inventory/
│       │   ├── serviceOrders/
│       │   ├── stages/
│       │   ├── tasks/
│       │   ├── users/
│       │   └── dashboard/
│       ├── uploads/            # Uploaded files (git-ignored)
│       └── utils/              # Shared utilities
├── frontend/
│   ├── quasar.config.js
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── stores/             # Pinia stores
│       └── router/
├── sgo_db.sql                  # Database schema
├── docker-compose.yml          # MariaDB container
└── package.json                # Root scripts (concurrently)
```
