-- PROOF — production schema
create extension if not exists pgcrypto;

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
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
create index if not exists decisions_owner_created_idx on public.decisions(owner_id, created_at desc);
create index if not exists audit_decision_idx on public.audit_events(decision_id, created_at desc);

alter table public.decisions enable row level security;
alter table public.audit_events enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on public.decisions from anon;
grant select (code,title,summary,project_name,amount,currency,parties,status,evidence_name,evidence_type,evidence_size,evidence_hash,created_at,decided_at,decision_note) on public.decisions to anon;
grant select, insert, update, delete on public.decisions to authenticated;
grant select on public.audit_events to authenticated;

create policy "public_can_verify_approved_decisions" on public.decisions
for select to anon using (status='APPROVED');

create policy "owners_can_read_decisions" on public.decisions
for select to authenticated using ((select auth.uid())=owner_id);

create policy "owners_can_create_pending_decisions" on public.decisions
for insert to authenticated
with check ((select auth.uid())=owner_id and status='PENDING');

create policy "owners_can_update_decisions" on public.decisions
for update to authenticated
using ((select auth.uid())=owner_id)
with check ((select auth.uid())=owner_id);

create policy "owners_can_delete_pending_decisions" on public.decisions
for delete to authenticated
using ((select auth.uid())=owner_id and status='PENDING');

create policy "owners_can_read_audit_events" on public.audit_events
for select to authenticated
using (exists (
  select 1 from public.decisions d
  where d.id=audit_events.decision_id and d.owner_id=(select auth.uid())
));

-- Approved or rejected records are terminal and immutable.
create or replace function public.protect_approved_evidence()
returns trigger language plpgsql
set search_path=public,pg_temp
as $$
begin
  if old.status in ('APPROVED','REJECTED') and new is distinct from old then
    raise exception 'Terminal decision record is immutable';
  end if;
  return new;
end;
$$;
revoke all on function public.protect_approved_evidence() from public,anon,authenticated;

drop trigger if exists decisions_protect_approved_evidence on public.decisions;
create trigger decisions_protect_approved_evidence
before update on public.decisions
for each row execute function public.protect_approved_evidence();

-- Audit events are written atomically by the database, never by clients.
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;

create or replace function private.write_decision_audit()
returns trigger language plpgsql security definer
set search_path=public,pg_temp
as $$
begin
  if tg_op='INSERT' then
    insert into public.audit_events(decision_id,event_type,message)
    values(new.id,'CREATED','Decision record created and evidence fingerprinted.');
  elsif tg_op='UPDATE' and new.status is distinct from old.status then
    insert into public.audit_events(decision_id,event_type,message)
    values(new.id,new.status,
      case new.status
        when 'APPROVED' then 'Decision approved. Evidence fingerprint locked to the record.'
        when 'REJECTED' then 'Decision rejected.'
        else 'Decision status changed.'
      end);
  end if;
  return new;
end;
$$;
revoke all on function private.write_decision_audit() from public,anon,authenticated;

drop trigger if exists decisions_write_audit on public.decisions;
create trigger decisions_write_audit
after insert or update of status on public.decisions
for each row execute function private.write_decision_audit();

-- Evidence files remain private and are isolated by the user's auth UID folder.
insert into storage.buckets(id,name,public,file_size_limit)
values('evidence','evidence',false,6291456)
on conflict(id) do update set public=false,file_size_limit=6291456;

create policy "owners_can_upload_evidence" on storage.objects
for insert to authenticated
with check(bucket_id='evidence' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy "owners_can_read_evidence" on storage.objects
for select to authenticated
using(bucket_id='evidence' and (storage.foldername(name))[1]=(select auth.uid()::text));

create policy "owners_can_delete_evidence" on storage.objects
for delete to authenticated
using(bucket_id='evidence' and (storage.foldername(name))[1]=(select auth.uid()::text));
