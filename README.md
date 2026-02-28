# PrepEdge — AI-Powered Interview Platform

PrepEdge is an AI-powered interview platform that streamlines the hiring pipeline from job posting to candidate evaluation. It features **AI resume screening**, **real-time voice interviews with an AI interviewer**, and **automated interview report generation** — all within a multi-role system for candidates, recruiters, and admins.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Apps](#apps)
    - [REST Backend](#rest-backend)
    - [WebSocket Backend](#websocket-backend)
    - [Frontend](#frontend)
- [Shared Packages](#shared-packages)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Real-Time Interview Flow](#real-time-interview-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

PrepEdge connects **recruiters** who post jobs with **candidates** who apply, get their resumes AI-screened, and then go through a **live AI-powered voice interview**. The platform handles the entire lifecycle:

1. **Recruiters** create and manage job postings
2. **Candidates** upload resumes which are AI-analyzed and scored against job requirements
3. Candidates who pass the resume threshold (score ≥ 65) can apply
4. Candidates enter a **real-time voice interview** with an adaptive AI interviewer
5. The AI generates a **structured interview report** with scores and a hire recommendation
6. Recruiters and candidates can view interview reports and dashboards

---

## Architecture

```
┌─────────────────────────────────┐
│     Frontend (React + Vite)     │
│         Port: 5173              │
└────────┬───────────────┬────────┘
         │ HTTP/REST      │ WebSocket
         ▼                ▼
┌─────────────────┐  ┌────────────────────┐
│  REST Backend   │  │  WebSocket Backend │
│  Express :5000  │  │  ws :8080          │
└────────┬────────┘  └─────────┬──────────┘
         │                     │
         ▼                     ▼
┌─────────────────────────────────────────┐
│          @repo/db (Prisma ORM)          │
│             PostgreSQL                  │
└─────────────────────────────────────────┘
                    │
    ┌───────────────┼──────────────────┐
    │               │                  │
Azure Blob     Google Gemini     ElevenLabs
(Resume PDFs)  (AI Analysis)     (TTS / STT)
```

- **Frontend** → REST API at `:5000` for auth, jobs, resumes, applications, dashboards
- **Frontend** → WebSocket at `:8080` for live AI interview sessions
- **REST Backend** handles authentication (JWT), CRUD operations, resume upload to Azure Blob Storage, and AI resume analysis via Gemini
- **WebSocket Backend** manages real-time interviews: adaptive AI questioning, speech-to-text, text-to-speech, and final report generation
- Both backends share the **`@repo/db`** Prisma client for PostgreSQL access

---

## Tech Stack

| Layer                 | Technologies                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Frontend**          | React 19, Vite 7, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, React Hook Form, Zod, Recharts |
| **REST Backend**      | Express 5, TypeScript, JWT, Multer, pdf-parse                                                     |
| **WebSocket Backend** | ws (WebSocket library), TypeScript, JWT                                                           |
| **Database**          | PostgreSQL, Prisma ORM 6                                                                          |
| **AI / LLM**          | Google Gemini (via OpenAI-compatible SDK), LangChain                                              |
| **Speech**            | ElevenLabs (Text-to-Speech & Speech-to-Text)                                                      |
| **Storage**           | Azure Blob Storage (resume PDFs)                                                                  |
| **Monorepo**          | Turborepo, pnpm workspaces                                                                        |
| **Tooling**           | ESLint, Prettier, TypeScript 5.9                                                                  |

---

## Project Structure

```
PrepEdgePlatform/
├── apps/
│   ├── backend/              # REST API (Express, port 5000)
│   │   └── src/
│   │       ├── controllers/  # Route handlers (auth, jobs, applications, dashboard)
│   │       ├── middlewares/   # JWT verification, role-based access guards
│   │       ├── routes/        # Route definitions
│   │       └── utils/         # Resume analysis, Azure upload
│   │
│   ├── ws-backend/           # Real-time interview server (WebSocket, port 8080)
│   │   └── src/
│   │       ├── index.ts      # WebSocket server entry
│   │       └── utils/        # AI greeting, answer evaluation, report generation, TTS/STT
│   │
│   └── frontend/             # React SPA (Vite, port 5173)
│       └── src/
│           ├── components/ui/ # 50+ shadcn/ui components
│           ├── hooks/         # Custom hooks (useIsMobile)
│           └── lib/           # Utilities (cn)
│
├── packages/
│   ├── db/                   # Prisma schema & client (shared across backends)
│   │   └── prisma/
│   │       └── schema.prisma # Database models
│   ├── ui/                   # Shared React component library
│   ├── eslint-config/        # Shared ESLint configurations
│   └── typescript-config/    # Shared tsconfig presets
│
├── turbo.json                # Turborepo pipeline config
├── pnpm-workspace.yaml       # pnpm workspace definition
└── package.json              # Root package.json
```

---

## Apps

### REST Backend

**Location:** `apps/backend/` &nbsp;|&nbsp; **Port:** `5000` &nbsp;|&nbsp; **Base Path:** `/api/v1`

The Express REST API handles all CRUD operations, authentication, and AI-powered resume analysis.

**Key Features:**

- **Authentication** — Sign up / sign in with bcrypt hashing and JWT (30-day expiry, HTTP-only cookie)
- **Role-Based Access** — Middleware guards for `CANDIDATE`, `RECRUITER`, and `ADMIN` roles
- **Job Management** — Full CRUD for recruiters to create, update, and delete job postings
- **Resume Analysis** — Upload PDF resume → parse text → send to Gemini AI with job description → receive structured score (0–100), strengths, missing skills, gaps, and suggestions
- **Application Pipeline** — Candidates apply to jobs (requires resume score ≥ 65); application tracks status through the hiring pipeline
- **Interview Session Creation** — Generates a separate interview JWT token used for WebSocket authentication
- **Dashboard Analytics** — Separate dashboard endpoints for candidates, recruiters, and admins with relevant statistics
- **Azure Blob Storage** — Resumes uploaded and stored as publicly accessible PDFs

---

### WebSocket Backend

**Location:** `apps/ws-backend/` &nbsp;|&nbsp; **Port:** `8080` &nbsp;|&nbsp; **Path:** `/api/v1/interview`

The real-time backend powers the live AI interview experience using WebSockets, ElevenLabs for voice, and Gemini for intelligence.

**Key Features:**

- **JWT-Authenticated Connections** — Clients connect with an interview token (`?token=<jwt>`) generated by the REST backend
- **AI Interviewer** — Gemini generates personalized greetings, adaptive follow-up questions, and evaluates each answer in real-time
- **Voice Pipeline** — Candidate speaks → audio sent as binary frame → ElevenLabs STT transcribes → AI evaluates → generates next question → ElevenLabs TTS speaks it back
- **Adaptive Questioning** — AI adjusts question difficulty based on candidate performance (strong/average/weak), varies question types (technical, behavioral, problem-solving, culture-fit)
- **Interview Report Generation** — On interview end, AI reviews the entire conversation and generates a structured report with scores for technical depth, problem-solving, communication (0–10 each), overall score, and a recommendation (Strong Hire / Hire / Consider / No Hire)

---

### Frontend

**Location:** `apps/frontend/` &nbsp;|&nbsp; **Port:** `5173`

The React single-page application built with Vite, Tailwind CSS, and shadcn/ui.

**Key Features:**

- **50+ shadcn/ui Components** — Fully installed component library (accordion, dialog, dropdown, form, table, sidebar, charts, etc.)
- **React Hook Form + Zod** — Type-safe form validation
- **Recharts** — Dashboard analytics and data visualization
- **Responsive Design** — Mobile-first with `useIsMobile` hook

> **Note:** The frontend is currently in the scaffolding stage with the component library set up and ready for page development.

---

## Shared Packages

| Package                   | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `@repo/db`                | Prisma ORM client + schema definitions. Exports `PrismaClient` used by both backends. |
| `@repo/ui`                | Shared React component library (Button, Card, Code)                                   |
| `@repo/eslint-config`     | Shared ESLint configurations for the monorepo                                         |
| `@repo/typescript-config` | Shared `tsconfig.json` presets (base, React, Next.js)                                 |

---

## Database Schema

### Models

| Model                 | Description                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**              | Candidates, recruiters, and admins. Identified by email.                                                                                    |
| **Job**               | Job postings created by recruiters with title, description, requirements, salary, location, and type.                                       |
| **Application**       | A candidate's application to a job. Stores resume URL, AI score, strengths, missing skills, experience gaps. Unique per candidate-job pair. |
| **Interview**         | A 1:1 interview session tied to an application. Tracks status and timing.                                                                   |
| **InterviewQuestion** | Individual questions asked during an interview with answer text and AI evaluation, ordered by `orderIndex`.                                 |
| **InterviewReport**   | AI-generated summary after interview completion — overall score, strengths, weaknesses, and hire recommendation.                            |

### Enums

| Enum                | Values                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `UserRole`          | `CANDIDATE` · `RECRUITER` · `ADMIN`                                                                             |
| `JobType`           | `FULL_TIME` · `PART_TIME` · `CONTRACT` · `INTERNSHIP` · `FREELANCE`                                             |
| `JobStatus`         | `ACTIVE` · `INACTIVE` · `CLOSED` · `DRAFT`                                                                      |
| `ApplicationStatus` | `PENDING` · `REVIEWING` · `INTERVIEW_SCHEDULED` · `INTERVIEW_COMPLETED` · `ACCEPTED` · `REJECTED` · `WITHDRAWN` |
| `InterviewStatus`   | `SCHEDULED` · `IN_PROGRESS` · `COMPLETED` · `REVIEWED` · `ACCEPTED` · `REJECTED` · `CANCELLED`                  |
| `QuestionType`      | `TECHNICAL` · `BEHAVIORAL` · `PROBLEM_SOLVING` · `CULTURE_FIT` · `GENERAL`                                      |

### Relationships

```
User ──1:N──▶ Job               (recruiter posts jobs)
User ──1:N──▶ Application       (candidate applies)
User ──1:N──▶ Interview         (candidate interviews)
Job  ──1:N──▶ Application
Application ──1:1──▶ Interview
Interview ──1:N──▶ InterviewQuestion
Interview ──1:1──▶ InterviewReport
```

---

## API Reference

### Authentication

| Method | Endpoint               | Auth | Description                                    |
| ------ | ---------------------- | ---- | ---------------------------------------------- |
| `POST` | `/api/v1/auth/sign-up` | —    | Register a new user (default role: CANDIDATE)  |
| `POST` | `/api/v1/auth/sign-in` | —    | Login, returns JWT in cookie and response body |

### Jobs

| Method   | Endpoint                 | Auth  | Role      | Description                      |
| -------- | ------------------------ | ----- | --------- | -------------------------------- |
| `POST`   | `/api/v1/create-a-job`   | Token | RECRUITER | Create a new job posting         |
| `PUT`    | `/api/v1/update-a-job`   | Token | RECRUITER | Update job status                |
| `DELETE` | `/api/v1/delete-a-job`   | Token | RECRUITER | Delete a job posting             |
| `GET`    | `/api/v1/get-all-job`    | Token | Any       | Get all active jobs              |
| `GET`    | `/api/v1/get-all-my-job` | Token | RECRUITER | Get recruiter's own job postings |

### Applications & Interviews

| Method | Endpoint                                 | Auth  | Role                | Description                                        |
| ------ | ---------------------------------------- | ----- | ------------------- | -------------------------------------------------- |
| `POST` | `/api/v1/resume-analysis`                | Token | CANDIDATE           | Upload and AI-analyze a PDF resume against a job   |
| `POST` | `/api/v1/create-application`             | Token | CANDIDATE           | Submit an application (requires resume score ≥ 65) |
| `POST` | `/api/v1/create-interview`               | Token | CANDIDATE           | Create an interview session, returns interview JWT |
| `GET`  | `/api/v1/get-interview-report/:reportId` | Token | Candidate/Recruiter | Retrieve interview report                          |

### Dashboards

| Method | Endpoint                      | Auth  | Role      | Description                   |
| ------ | ----------------------------- | ----- | --------- | ----------------------------- |
| `GET`  | `/api/v1/dashboard/candidate` | Token | CANDIDATE | Candidate stats and overview  |
| `GET`  | `/api/v1/dashboard/recruiter` | Token | RECRUITER | Recruiter stats and overview  |
| `GET`  | `/api/v1/dashboard/admin`     | Token | ADMIN     | Platform-wide admin analytics |

### Utility

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| `GET`  | `/api/v1/health-check` | Server health check          |
| `POST` | `/api/v1/tts`          | Test text-to-speech endpoint |

---

## Real-Time Interview Flow

The WebSocket interview follows this protocol:

### Connection

```
ws://localhost:8080/api/v1/interview?token=<interview_jwt>
```

### Message Protocol

**Client → Server:**

| Message Type       | Payload                                    | Description                                                |
| ------------------ | ------------------------------------------ | ---------------------------------------------------------- |
| `Start_Interview`  | `{ type: "Start_Interview" }`              | Begin the interview — AI sends greeting and first question |
| `ANSWER_FROM_USER` | `{ type: "ANSWER_FROM_USER", questionId }` | Signal that the next binary frame is the audio answer      |
| _(binary frame)_   | Audio buffer                               | Candidate's spoken answer audio                            |
| `END_INTERVIEW`    | `{ type: "END_INTERVIEW" }`                | End interview — triggers report generation                 |

**Server → Client:**

| Message Type       | Payload                                     | Description                                 |
| ------------------ | ------------------------------------------- | ------------------------------------------- |
| `AI_MESSAGE_START` | `{ type, questionId, text, audioIncoming }` | AI question text, signals audio will follow |
| _(binary frame)_   | MP3 audio                                   | AI-spoken question audio                    |
| `AI_MESSAGE_END`   | `{ type, questionId }`                      | Marks end of audio stream for this question |
| `INTERVIEW_ENDED`  | `{ type, message }`                         | Interview complete, report generated        |
| `ERROR`            | `{ type, message }`                         | Error notification                          |

### Pipeline

```
Candidate speaks → Audio binary frame
    → ElevenLabs STT (speech-to-text)
    → Gemini AI evaluates answer + generates next question
    → ElevenLabs TTS (text-to-speech)
    → Audio binary frame sent back to candidate
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9.0.0
- **PostgreSQL** database
- **Azure Blob Storage** account (for resume uploads)
- **Google Gemini** API key
- **ElevenLabs** API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PrepEdgePlatform

# Install dependencies
pnpm install

# Set up the database
pnpm --filter @repo/db exec prisma migrate dev

# Start all apps in development mode
pnpm dev
```

### Run Individual Apps

```bash
# REST backend only
pnpm dev --filter backend

# WebSocket backend only
pnpm dev --filter ws-backend

# Frontend only
pnpm dev --filter frontend
```

### Build

```bash
# Build all apps and packages
pnpm build

# Build a specific app
pnpm build --filter backend
```

---

## Environment Variables

### REST Backend (`apps/backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/prepedge
JWT_SECRET=your-jwt-secret
INTERVIEW_SECRET=your-interview-secret
GEMINI_API_KEY=your-gemini-api-key
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_CONTAINER_NAME=resumes
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

### WebSocket Backend (`apps/ws-backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/prepedge
INTERVIEW_SECRET=your-interview-secret
GEMINI_API_KEY=your-gemini-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

### Database Package (`packages/db/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/prepedge
```
