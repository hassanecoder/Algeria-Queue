# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + React Query + Framer Motion + Recharts

## Application

**Khadamatech - Queue & Appointment Booking Portal for Algeria**

A full-featured digital queue management and appointment booking system for Algerian public services.

### Pages
- **Home** (`/`) - Hero, service categories, benefits
- **Find Office** (`/offices`) - Search/filter all offices by wilaya & category
- **Office Detail** (`/offices/:id`) - Office info, services, queue status, book
- **Booking** (`/book/:officeId`) - 3-step appointment wizard
- **My Appointments** (`/appointments`) - Track by phone number
- **Queue Status** (`/queue/:officeId`) - Live queue tracker
- **Admin Dashboard** (`/admin`) - Staff queue management + stats

### Data
- 58 Algerian wilayas + communes
- 8 service categories (Civil Registry, CNI/Passport, Tax, CNAS, APC, Health, Vehicles, ANEM)
- 14 offices across Alger, Oran, Constantine, Sétif, Blida
- Rich service definitions with required documents
- Sample appointments with statuses

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── queue-app/          # React Vite frontend (served at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seeding script
```

## Key Commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/scripts run seed` — seed database with Algerian data
- `pnpm run typecheck` — full TypeScript check

## Database Schema

- `wilayas` — 58 Algerian provinces
- `communes` — municipalities per wilaya
- `service_categories` — 8 public service categories
- `offices` — government offices with hours, ratings, contact
- `office_services` — specific services with required docs and fees
- `appointments` — citizen appointments with queue position and status

## API Routes

All routes prefixed with `/api`:
- `GET /wilayas`, `GET /wilayas/:id/communes`
- `GET /service-categories`
- `GET /offices`, `GET /offices/:id`, `GET /offices/:id/services`, `GET /offices/:id/available-slots`
- `GET /appointments?phone=`, `POST /appointments`, `GET /appointments/:id`, `POST /appointments/:id/cancel`
- `GET /queues/:officeId/status`, `GET /queues/:officeId/my-position`
- `GET /admin/offices/:id/queue`, `PATCH /admin/offices/:id/appointments/:id/status`, `GET /admin/stats`
