# 🚀 SaaS Platform – Project Management System

---

## 📖 About the Project

This is a **SaaS‑style project management platform** designed to showcase a complete full‑stack workflow.  
It combines a powerful **Next.js** frontend with a robust **NestJS** backend, all orchestrated via **Turborepo** monorepo.

**Key features (under active development):**
- ✅ JWT authentication & authorization
- ✅ Workspaces, projects, and task management
- ✅ Drag‑and‑drop Kanban board
- ✅ Real‑time updates via WebSockets
- ✅ Advanced filtering, search, and pagination
- ✅ Dockerized local development
- ✅ CI/CD with GitHub Actions

---

## 🛠 Tech Stack

| Area           | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| **Monorepo**   | Turborepo + npm workspaces                                                 |
| **Frontend**   | Next.js (App Router), React, Tailwind CSS                                  |
| **Backend**    | NestJS, TypeScript                                                         |
| **Database**   | PostgreSQL, Prisma ORM                                                     |
| **Real‑time**  | WebSockets (NestJS Gateway)                                                |
| **Container**  | Docker, Docker Compose                                                     |
| **CI/CD**      | GitHub Actions                                                             |
| **Deploy**     | Vercel (frontend), Railway (backend) – planned                             |

---

## 📁 Project Structure

```
saas-platform/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS application
├── packages/              # Shared utilities / types (future)
├── docker-compose.yml     # Local service orchestration
├── turbo.json             # Turborepo pipeline config
└── package.json           # Root package with workspaces
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone git@github.com:imagineapril/saas-platform.git
cd saas-platform
```

### 2. Switch to the develop branch (main development branch)

```bash
git checkout develop
```

### 3. Install dependencies

```bash
npm install
```
### 4. Start all services with Docker Compose

```bash
docker compose up -d
```
This will spin up:

PostgreSQL on port 5432
Backend (NestJS) on port 4000
Frontend (Next.js) on port 3000

### 5. Access the application

- **Frontend:** [http://localhost:3000](http://localhost:3000)  
- **Backend API:** [http://localhost:4000](http://localhost:4000)  
- **Prisma Studio:** run `npx prisma studio` inside the backend container (or locally after connecting to the database).

---

### 🧪 Running Tests

- **Unit tests:** `npm run test` (in each app folder)  
- **E2E tests:** `npm run test:e2e` (in each app folder)

---

### 🐳 Docker

The project includes a `docker-compose.yml` for consistent local development.

---

### 📅 Roadmap

- [x] Monorepo setup & infrastructure  
- [ ] JWT authentication  
- [ ] Workspace, Project, Task CRUD  
- [ ] Drag‑and‑drop board  
- [ ] WebSocket real‑time updates  
- [ ] Deployment to Vercel / Railway  
- [ ] CI/CD pipeline (GitHub Actions)  
- [ ] Logging & monitoring

## ✨ Author

**Julia Timokhina**  
[GitHub](https://github.com/imagineapril) • [LinkedIn](https://www.linkedin.com/in/julia-timokhina-8a3801403/)

Built with ❤️ as a full‑stack portfolio project.