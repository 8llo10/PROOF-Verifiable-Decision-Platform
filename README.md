# PROOF — Verifiable Decision Integrity Platform

**Arabic-first · English-ready · Real authentication · Real persistence · Public integrity verification**

PROOF turns informal operational approvals into evidence-backed decision records. It is built for teams that make important decisions in chats, screenshots, PDFs and field conversations, then need to prove later **what was approved, by whom, when, and against which exact file**.

> PROOF verifies the integrity of the evidence file. It does not claim that the underlying business statement is truthful.

## المنتج باختصار

بدل ما تضيع موافقة تشغيلية مهمة داخل واتساب أو صورة أو ملف معدل، PROOF يحفظ القرار كسجل مستقل مع الأطراف والمشروع والمبلغ والدليل الأصلي وبصمة SHA-256. بعد اعتماد القرار يصبح السجل نهائيًا، ويقدر أي شخص معه كود السجل يتحقق من القرار ويرفع نسخته من الملف للتأكد أنها مطابقة بايت-ببايت للدليل المعتمد — بدون كشف الملف الأصلي الخاص.

## Real product flow

1. Create a free account with Supabase Auth.
2. Create a decision record with project/context, parties and optional amount.
3. Upload the original evidence to a private per-user Storage folder.
4. PROOF computes a SHA-256 fingerprint before persisting the record.
5. Approve or reject the record; PostgreSQL writes the audit event atomically.
6. Approved/rejected records become immutable at the database layer.
7. Share the `PR-0000` verification code for approved records.
8. Public visitors can inspect approved metadata and compare their own file copy locally against the stored SHA-256 fingerprint.

## Product architecture

```text
Browser / Next.js UI
├── Arabic / English interface (RTL + LTR)
├── Supabase Auth session
├── Web Crypto SHA-256
├── Owner dashboard
├── Decision creation + private evidence upload
├── Approval / rejection controls
└── Public verification
        │
        ▼
Supabase
├── Auth
├── PostgreSQL
│   ├── decisions
│   ├── audit_events
│   ├── owner-scoped RLS
│   ├── approved-only anon verification
│   └── terminal-record immutability trigger
└── Private Storage
    └── evidence/{auth.uid()}/...
```

## Stack

- **Next.js 16** App Router
- **React 19**
- **TypeScript 5.9.2**
- **Supabase Auth**
- **Supabase PostgreSQL** with Row Level Security
- **Supabase private Storage**
- **Web Crypto API / SHA-256**
- **Vercel / Netlify compatible**

## Security model

PROOF does not require a `service_role` key in the frontend or deployment environment.

- The browser uses a Supabase **publishable key**, which is safe to expose by design.
- Every decision has an `owner_id` linked to `auth.users`.
- Authenticated users can read and manage only their own records.
- New records must belong to `auth.uid()` and start as `PENDING`.
- Evidence uploads are restricted to the authenticated user's top-level Storage folder.
- The original evidence bucket is private.
- Public/anonymous access can read **approved records only**.
- Anonymous database privileges are limited to public verification columns; `owner_id` and `evidence_path` are not exposed.
- Audit events are inserted by a database trigger, not by the client.
- Approved and rejected records are terminal and immutable through a PostgreSQL trigger.
- Public file comparison happens locally in the visitor's browser; the comparison file does not need to be uploaded to PROOF.
- Supabase Security Advisor currently reports **0 security lints** for the configured project.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Bilingual product landing page |
| `/login` | Sign in / create account |
| `/dashboard` | Authenticated owner workspace |
| `/dashboard/new` | Create a real decision record |
| `/decision/[id]` | Owner detail, evidence, approval/rejection and audit trail |
| `/verify` | Public code lookup |
| `/verify/[code]` | Public approved-record integrity verification |
| `/api/health` | Lightweight deployment health response |

Use `?lang=ar` or `?lang=en` to switch the product interface. Arabic is the default experience.

## Database

The complete production schema is in:

```text
supabase/schema.sql
```

It includes tables, indexes, RLS policies, private Storage policies, database-generated audit events and terminal-record immutability.

## Local development

```bash
npm install
npm run dev
```

The repository is connected to the production Supabase project through its public project URL and publishable key in `lib/supabase-browser.ts`. No server secret is required.

## Integrity scope

A SHA-256 `MATCH` means the tested file is byte-for-byte identical to the fingerprint recorded with the approved decision. It does **not** independently validate whether the people, price, project or business claim inside the evidence are true.

## CV summary

> Built a bilingual decision-integrity platform that converts informal operational approvals into evidence-backed records using Supabase Auth, owner-scoped PostgreSQL RLS, private file storage, SHA-256 fingerprinting, database-enforced immutable terminal records, audit trails, and public integrity verification with Next.js and TypeScript.
