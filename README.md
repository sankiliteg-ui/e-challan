# e-Challan India

A production-style traffic challan portal built with React, TypeScript, Tailwind CSS, and Supabase.

This project supports citizen-facing challan search and payment flows, role-aware admin access, protected history views, and a polished motion-driven UI.

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Routing and Access Control](#routing-and-access-control)
6. [Data Model and Security](#data-model-and-security)
7. [Local Setup](#local-setup)
8. [Environment Variables](#environment-variables)
9. [Running the App](#running-the-app)
10. [Database and Supabase Workflow](#database-and-supabase-workflow)
11. [Testing and Linting](#testing-and-linting)
12. [Deployment Notes](#deployment-notes)
13. [Troubleshooting](#troubleshooting)
14. [Roadmap Ideas](#roadmap-ideas)

## Overview

e-Challan India is a web portal for managing and viewing traffic challans.

It includes:
- Public and authenticated flows for challan lookup.
- Protected payment and history pages.
- Admin-restricted dashboard controls.
- Supabase-backed data retrieval and role-based row-level access control.

## Core Features

- Dashboard with key challan statistics and recent items.
- Challan search by:
	- vehicle number
	- challan number
	- owner name
- Pending and overdue challan view for payment flow.
- Challan history with receipt download support.
- Authentication with email/password via Supabase Auth.
- Role-aware route protection (user/admin).
- Responsive navigation and smooth UI transitions.

## Tech Stack

Frontend:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- Framer Motion

Data/Auth:
- Supabase Postgres
- Supabase Auth
- Row Level Security policies

Developer Tooling:
- ESLint
- Vitest + Testing Library

## Project Structure

Main areas:
- [src/pages](src/pages): route-level screens.
- [src/components](src/components): reusable UI and layout.
- [src/contexts](src/contexts): auth/session context.
- [src/lib](src/lib): services and utilities.
- [src/integrations/supabase](src/integrations/supabase): Supabase client and generated types.
- [supabase/migrations](supabase/migrations): SQL schema and policy migrations.

Key files:
- [src/App.tsx](src/App.tsx): app providers and route map.
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx): auth state and role retrieval.
- [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx): route guard logic.
- [src/lib/challanService.ts](src/lib/challanService.ts): challan query utilities.

## Routing and Access Control

Routes are defined in [src/App.tsx](src/App.tsx).

Access behavior:
- Open routes:
	- /
	- /auth
	- /violations
	- /help
- Auth-protected routes:
	- /check
	- /pay
	- /history
- Admin-only route:
	- /admin

Route protection is implemented with [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx), backed by auth state from [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx).

## Data Model and Security

Schema and security policies are defined in [supabase/migrations/20260410071537_ab57b000-a35c-4ea0-9627-dd9d5ce7c443.sql](supabase/migrations/20260410071537_ab57b000-a35c-4ea0-9627-dd9d5ce7c443.sql).

Main tables:
- profiles
- user_roles
- challans

Security highlights:
- RLS enabled on profiles, user_roles, challans.
- Role helper function has_role is used in policies.
- challans select is allowed for anon/authenticated users.
- challans insert/update/delete is admin-restricted.

Implication:
- Frontend users can search and view challans.
- Write operations require an authenticated admin role under current policy design.

## Local Setup

Prerequisites:
- Node.js 18+ (recommended Node.js 20+)
- npm 9+
- A Supabase project with the migration applied

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a .env file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

These are consumed by [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts).
Use your project's public anon/publishable key here. Keep the Supabase secret key on the server side only; do not place it in the Vite frontend env.

## Running the App

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Database and Supabase Workflow

1. Apply migration in [supabase/migrations](supabase/migrations).
2. Configure env values.
3. Start app and verify auth + challan queries.

For a fresh Supabase project, you can also run [supabase/bootstrap.sql](supabase/bootstrap.sql) in the Supabase SQL editor. It creates the schema, policies, triggers, and starter challan rows in one step.

Current note on seeding:
- [package.json](package.json#L11) defines a seed script as node seed.mjs.
- The file seed.mjs is currently not present in the repository.
- Running npm run seed fails until seed.mjs is restored or the script is updated.

Recommended options:
- Add back seed.mjs with service-role-based inserts, or
- Seed directly using SQL in Supabase SQL Editor.

## Testing and Linting

Lint:

```bash
npm run lint
```

Run tests once:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Deployment Notes

- Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your host environment.
- Verify redirect URLs in Supabase Auth settings match deployed domain.
- Confirm RLS policies align with desired production access model.

## Troubleshooting

1. Auth pages load but sign-in fails:
Check Supabase URL/key values and Auth provider settings.

2. Data reads return empty unexpectedly:
Verify challans data exists and migration/policies were applied in the same Supabase project.

3. Seed command fails:
Confirm seed.mjs exists or replace the package seed command with a valid seeding entry.

4. Admin route inaccessible:
Ensure current user has admin role in user_roles.

## Roadmap Ideas

- Add pagination and server-side filtering for large challan datasets.
- Add audited challan payment records and transaction references.
- Add CSV export for admin reporting.
- Add E2E tests for auth, search, and payment flows.
