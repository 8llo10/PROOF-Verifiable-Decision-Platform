# PROOF — Verifiable Decision Integrity Platform

PROOF turns informal operational approvals into verifiable decision records. Each record stores the original evidence metadata, a server-generated SHA-256 fingerprint, approval state, and an audit trail. A public verification page can recalculate a file fingerprint and prove whether it is byte-for-byte identical to the evidence that was recorded.

## Why it exists

Operational decisions often happen in chat messages, calls, screenshots, PDFs, and scattered files. When the decision is challenged later, teams need to answer four simple questions: what was approved, who was involved, when was it decided, and is this still the exact file that was approved?

PROOF makes that evidence chain explicit without becoming a full ERP, ticketing system, or workflow suite.

## Core flow

1. An administrator creates a decision and uploads the original evidence.
2. The server validates the request and computes the file's SHA-256 fingerprint.
3. Evidence is stored in a private Supabase Storage bucket; the decision metadata is stored in PostgreSQL.
4. The decision is approved or rejected and the action is appended to the audit trail.
5. Once approved, a PostgreSQL trigger prevents mutation of the evidence identity fields.
6. Anyone with the public record code can verify another copy of the file against the stored fingerprint.

## Architecture

```text
app/
├── api/
│   ├── decisions/               # HTTP endpoints only
│   ├── health/                  # deployment health endpoint
│   ├── login/                   # admin session
│   ├── logout/
│   └── verify-file/             # public integrity check
├── dashboard/                   # protected admin UI
├── decision/[id]/               # protected decision details
├── verify/[code]/               # public verification record
└── page.tsx                     # landing page

components/                      # reusable UI components
lib/
├── decisions/
│   ├── constants.ts             # domain limits/defaults
│   ├── validation.ts            # boundary validation
│   ├── repository.ts            # persistence operations
│   └── service.ts               # business logic
├── auth.ts                      # signed admin cookie
├── data.ts                      # read models + demo fallback
├── hash.ts                      # SHA-256 utility
├── supabase-admin.ts            # server-only Supabase client
└── types.ts                     # domain types

supabase/
└── schema.sql                   # tables, indexes, RLS, storage, integrity trigger
```

## Stack

- Next.js App Router + React + TypeScript
- Supabase PostgreSQL + private Storage
- Node.js `crypto` for SHA-256 and signed admin sessions
- Vercel-ready deployment
- Resilient built-in demo record for portfolio review

## Security and integrity choices

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and never exposed to the browser.
- RLS is enabled and browser roles have no table access.
- Evidence Storage is private.
- File size and required fields are validated at the server boundary.
- Admin access uses an HttpOnly, SameSite cookie signed with HMAC-SHA256.
- Approved evidence identity (`hash`, `path`, `name`, `size`) is protected by a database trigger.
- Verification compares the recalculated SHA-256 digest with the stored digest; files are never trusted by filename.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase variables, PROOF intentionally starts in **Demo Mode** with the public record `PR-1042`. This makes the deployed portfolio demo resilient while keeping write operations disabled until a database is configured.

Default demo password: `proof-demo-2026`. When Supabase persistence is enabled, set `PROOF_ADMIN_PASSWORD` and `PROOF_COOKIE_SECRET`; PROOF refuses to fall back to demo credentials in connected mode.

## Enable real persistence

Create a Supabase project, open SQL Editor, and run:

```text
supabase/schema.sql
```

Then configure:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
PROOF_ADMIN_PASSWORD=choose-a-strong-password
PROOF_COOKIE_SECRET=choose-a-long-random-secret
```

Never commit `.env.local`.

## Useful routes

| Route | Purpose |
|---|---|
| `/` | Product landing page |
| `/login` | Admin login |
| `/dashboard` | Decisions dashboard |
| `/dashboard/new` | Create a decision |
| `/verify` | Find a public record |
| `/verify/PR-1042` | Built-in demo record |
| `/api/health` | Deployment health check |

## Verification demo

Download `public/demo-evidence.txt`, open `/verify/PR-1042`, and upload the file. The result should be `MATCH`. Change one character and upload it again; the result should be `MISMATCH`.

## CV summary

> Built a verifiable decision-integrity platform that converts informal operational approvals into evidence-backed records using SHA-256 file fingerprinting, immutable approved evidence, audit trails, private storage, and public integrity verification with Next.js, TypeScript, PostgreSQL, and Supabase.
