# DocMe Monorepo

Enterprise monorepo combining the DocMe corporate website, a content management system (CMS) admin portal, and an Express.js backend with PostgreSQL & Prisma.

---

## 1. Project Architecture

```text
docme-website/
├── apps/
│   ├── web/                      # Existing public Next.js website (Port 3002)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   │
│   ├── cms/                      # CMS admin dashboard (Next.js) (Port 3003)
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   ├── media/
│   │   │   └── users/
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   │
│   └── api/                      # Node.js + Express backend (Port 5000)
│       └── src/
│           ├── config/
│           ├── middleware/
│           ├── modules/
│           │   ├── auth/
│           │   ├── users/
│           │   ├── pages/
│           │   ├── sections/
│           │   ├── media/
│           │   └── publishing/
│           ├── routes/
│           ├── services/
│           ├── utils/
│           ├── app.ts
│           └── server.ts
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│       └── schema.prisma
│
├── docs/
│   └── cms-api.md
│
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Technology Stack

- **Public Website (`apps/web`)**: Next.js 15, React 18, TypeScript, TailwindCSS, Framer Motion, GSAP.
- **CMS Admin (`apps/cms`)**: Next.js 15, React 18, TypeScript, TailwindCSS, Lucide Icons.
- **Backend API (`apps/api`)**: Node.js, Express.js, TypeScript, Session Auth, REST API (`/api/v1`).
- **Database & ORM**: PostgreSQL, Prisma ORM (`database/schema/schema.prisma`).
- **Workspaces**: npm workspaces (`apps/*`).

---

## 3. Installation & Getting Started

### 3.1 Install Dependencies
From the repository root:
```bash
npm install
```

### 3.2 Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` points to your PostgreSQL database.

---

## 4. Development Commands

Run applications individually or all workspaces together from the root directory:

| Task | Command | Default URL |
| :--- | :--- | :--- |
| **All Apps** | `npm run dev` | Runs all workspace dev servers |
| **Public Website** | `npm run dev:web` | [http://localhost:3002](http://localhost:3002) |
| **CMS Dashboard** | `npm run dev:cms` | [http://localhost:3003](http://localhost:3003) |
| **Backend API** | `npm run dev:api` | [http://localhost:5000](http://localhost:5000) |

---

## 5. Build Commands

| Task | Command |
| :--- | :--- |
| **Build All Workspaces** | `npm run build` |
| **Build Public Website** | `npm run build:web` |
| **Build CMS Dashboard** | `npm run build:cms` |
| **Build Backend API** | `npm run build:api` |

---

## 6. Database & Prisma Workflows

```bash
# Generate Prisma Client from schema
npm run prisma:generate

# Run Database Migrations (PostgreSQL)
npm run prisma:migrate

# Seed Initial Roles & Data
npx tsx database/seeds/seed.ts
```

---

## 7. API Documentation

Detailed endpoint specifications, authentication schemas, and request/response contracts are documented in:
- [CMS REST API Docs](file:///docs/cms-api.md)