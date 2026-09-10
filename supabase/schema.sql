-- PROOF database schema
create extension if not exists pgcrypto;

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^PR-[0-9]{4}$'),
  title text not null,
  summary text not null,
  project_name text,
  amount numeric(14,2),
  currency text not null default 'SAR',
  parties text[] not null default '{}',
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  evidence_path text not null,
  evidence_name text not null,
  evidence_type text,
  evidence_size bigint,
  evidence_hash char(64) not null check (evidence_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_note text
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id) on delete cascade,
  event_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists decisions_code_idx on public.decisions(code);
create index if not exists decisions_created_idx on public.decisions(created_at desc);
create index if not exists audit_decision_idx on public.audit_events(decision_id, created_at desc);

alter table public.decisions enable row level security;
alter table public.audit_events enable row level security;

-- Explicit deny policies make browser access intent unambiguous.
drop policy if exists "deny_browser_decisions" on public.decisions;
create policy "deny_browser_decisions" on public.decisions
for all to anon, authenticated
using (false)
with check (false);

drop policy if exists "deny_browser_audit_events" on public.audit_events;
create policy "deny_browser_audit_events" on public.audit_events
for all to anon, authenticated
using (false)
with check (false);

-- App uses SERVICE ROLE on the server only. No browser table access is required.
revoke all on public.decisions from anon, authenticated;
revoke all on public.audit_events from anon, authenticated;
grant all on public.decisions to service_role;
grant all on public.audit_events to service_role;

insert into storage.buckets (id, name, public, file_size_limit)
values ('evidence','evidence',false,6291456)
on conflict (id) do update set public=false, file_size_limit=6291456;

-- Storage also stays private. The server uses the service role.

-- Once approved, the evidence identity is immutable even if application code changes later.
create or replace function public.protect_approved_evidence()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.status = 'APPROVED' and (
    new.evidence_hash is distinct from old.evidence_hash or
    new.evidence_path is distinct from old.evidence_path or
    new.evidence_name is distinct from old.evidence_name or
    new.evidence_size is distinct from old.evidence_size
  ) then
    raise exception 'Approved evidence is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists decisions_protect_approved_evidence on public.decisions;
create trigger decisions_protect_approved_evidence
before update on public.decisions
for each row execute function public.protect_approved_evidence();

revoke all on function public.protect_approved_evidence() from public, anon, authenticated;
grant execute on function public.protect_approved_evidence() to service_role;

-- Audit entries are database-generated so the state change and its audit event commit atomically.
create or replace function public.write_decision_audit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events (decision_id, event_type, message)
    values (new.id, 'CREATED', 'Decision record created and evidence fingerprinted.');
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.audit_events (decision_id, event_type, message)
    values (
      new.id,
      new.status,
      case new.status
        when 'APPROVED' then 'Decision approved. Evidence fingerprint locked to the record.'
        when 'REJECTED' then 'Decision rejected.'
        else 'Decision status changed.'
      end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists decisions_write_audit on public.decisions;
create trigger decisions_write_audit
after insert or update of status on public.decisions
for each row execute function public.write_decision_audit();

revoke all on function public.write_decision_audit() from public, anon, authenticated;
grant execute on function public.write_decision_audit() to service_role;
