# PROOF — Two-Party Approval & Verifiable Decision Platform

**Arabic-first · English-ready · Real authentication · Two-party approvals · Private evidence · Public verification**

PROOF turns lightweight business agreements into evidence-backed decision records. Instead of agreeing in WhatsApp and manually documenting the decision later, the requester starts the agreement once in PROOF. The system creates an independent approval request for each party, binds both responses to the same evidence fingerprint, and automatically locks the final record only after both parties approve.

> PROOF records what was approved and links it to an exact file fingerprint and response trail. It is not a replacement for a legal contract and does not independently prove the truth of the underlying business claim.

## المنتج باختصار

المستخدم ما يسجل «قرار تم» يدويًا بعد انتهاء النقاش. يبدأ **طلب اعتماد** قبل الاتفاق النهائي: يضيف بيانات المعاملة، الطرف الأول، الطرف الثاني، والملف المرجعي. PROOF ينشئ رابط اعتماد مستقل لكل طرف. كل طرف يراجع نفس البيانات وبصمة الملف ويوافق أو يرفض من جواله بدون إنشاء حساب. إذا وافق الطرفان، تتحول المعاملة تلقائيًا إلى سجل نهائي مقفل وقابل للتحقق. إذا رفض أي طرف، تُغلق المعاملة كمرفوضة.

## Real product flow

1. Requester signs in with Supabase Auth.
2. Starts a new approval request with subject, project/context, amount, both parties and a reference file.
3. PROOF computes SHA-256 in the browser and uploads the original evidence to private owner-scoped Storage.
4. The database creates one pending transaction and two independent approval requests.
5. The owner can send each party's secure approval URL through WhatsApp with a pre-filled message, or copy the link.
6. Recipients need no PROOF account. Each link opens a mobile approval screen for that party.
7. Each party independently chooses Approve or Reject and may leave a note.
8. After the first approval the transaction remains `PENDING`.
9. After the second approval the database automatically changes the transaction to `APPROVED`, timestamps completion and locks the record.
10. A rejection by either party automatically changes the transaction to `REJECTED`.
11. Database audit events record party responses and the final state transition.
12. Only fully approved records become publicly verifiable through their `PR-0000` code.
13. Public visitors can compare their own copy against the recorded SHA-256 fingerprint locally in the browser without receiving the private original file.

## Product architecture

```text
Requester / Owner
    │
    ├─ Create agreement once
    ├─ Upload private reference evidence
    └─ Send approval links
            │
            ├───────────────┐
            ▼               ▼
       Party 1 link     Party 2 link
       Approve/Reject   Approve/Reject
            │               │
            └───────┬───────┘
                    ▼
             PostgreSQL workflow
             ├─ approval_requests
             ├─ two-party state check
             ├─ audit trail
             └─ automatic final lock
                    │
                    ▼
          Approved decision record
                    │
                    ▼
             Public verification
```

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5.9.2
- Supabase Auth
- Supabase PostgreSQL + Row Level Security
- Supabase private Storage
- PostgreSQL RPC workflow for no-account approval links
- Database triggers for audit and terminal-record immutability
- Web Crypto API / SHA-256
- WhatsApp click-to-send links (no paid messaging provider required for the current version)

## Security model

- No `service_role` key is exposed in the frontend.
- Authenticated owners can access only their own transactions through RLS.
- Evidence files live in a private bucket under the authenticated user's UID folder.
- Approval links use high-entropy UUID bearer tokens and expose only the fields required to review the approval request.
- Recipients cannot read the private Storage object through the approval screen.
- Approval state transitions run in database functions rather than trusting client-side state.
- The final decision is not `APPROVED` until both approval rows are `APPROVED`.
- A rejection by either party terminates the decision as `REJECTED`.
- Approved/rejected decision records are immutable through a PostgreSQL trigger.
- Public verification exposes approved metadata only; `owner_id` and private evidence paths are not exposed.
- File comparison occurs locally in the verifier's browser.

### About public approval RPCs

`get_approval_request` and `respond_to_approval` are intentionally callable without account authentication because approval recipients should not need to register. They are `SECURITY DEFINER` functions with a minimal fixed response surface and require possession of an unguessable approval token. Supabase Security Advisor therefore reports these public privileged RPCs as warnings by design. Treat approval URLs like private invitation links and do not post them publicly.

For deployments that require verified legal identity, add an OTP/e-signature identity provider. The free current version proves possession of the invitation link and records the response; it does not claim government-grade identity verification.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Bilingual product landing page |
| `/login` | Sign in / create owner account |
| `/dashboard` | Approval center and transaction list |
| `/dashboard/new` | Start a two-party approval request |
| `/decision/[id]` | Owner view, evidence, party states, WhatsApp invite actions and audit trail |
| `/approve/[token]` | No-account mobile approval/rejection screen for one party |
| `/verify` | Public approved-record lookup |
| `/verify/[code]` | Public integrity verification and local file comparison |
| `/api/health` | Deployment health response |

Arabic is the default experience. Use `?lang=ar` or `?lang=en`.

## Database

Base production schema:

```text
supabase/schema.sql
```

Dual-party approval migration:

```text
supabase/migrations/20260911_dual_party_approval.sql
```

The migration has been applied to the connected PROOF Supabase project and the two-party state transition has been smoke-tested against the database.

## Local development

```bash
npm install
npm run dev
```

## Current free notification strategy

The product does not require a paid SMS or WhatsApp provider. On the transaction page, PROOF generates the secure party-specific approval URL and opens WhatsApp with the recipient number and bilingual-ready invitation message pre-filled. The sender only presses Send in WhatsApp. The approval workflow itself is fully automated after that point.

A future WhatsApp Business/SMS adapter can replace click-to-send without changing the decision or approval architecture.

## CV summary

> Built a bilingual two-party approval and decision-integrity platform that automatically converts agreement requests into immutable, evidence-backed records after independent party approvals, using Supabase Auth, PostgreSQL RLS and RPC workflows, private Storage, SHA-256 fingerprinting, database-enforced audit trails, WhatsApp approval links, and public integrity verification with Next.js and TypeScript.
