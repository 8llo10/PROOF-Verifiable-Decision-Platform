create or replace function public.get_approval_request(p_token uuid)
returns table(request_id uuid,decision_id uuid,code text,title text,summary text,project_name text,amount numeric,currency text,evidence_name text,evidence_hash char(64),decision_status text,party_role text,party_name text,approval_status text,counterpart_status text,created_at timestamptz,expires_at timestamptz)
language sql security definer set search_path=public,pg_temp
as $$
  select ar.id,d.id,d.code,d.title,d.summary,d.project_name,d.amount,d.currency,d.evidence_name,d.evidence_hash,d.status,ar.party_role,ar.party_name,ar.status,coalesce(other_ar.status,'PENDING'),ar.created_at,ar.expires_at
  from public.approval_requests ar
  join public.decisions d on d.id=ar.decision_id
  left join public.approval_requests other_ar on other_ar.decision_id=ar.decision_id and other_ar.party_role<>ar.party_role
  where ar.token=p_token and (ar.expires_at>=now() or ar.status<>'PENDING')
  limit 1;
$$;

create or replace function public.respond_to_approval(p_token uuid,p_action text,p_note text default null)
returns table(code text,decision_status text,approval_status text,party_role text,responded_at timestamptz)
language plpgsql security definer set search_path=public,pg_temp
as $$
declare
  v_req public.approval_requests%rowtype;
  v_decision_status text;
begin
  if p_action not in ('APPROVED','REJECTED') then raise exception 'Invalid approval action'; end if;

  select * into v_req from public.approval_requests where token=p_token for update;
  if not found then raise exception 'Approval request not found'; end if;
  if v_req.expires_at<now() then raise exception 'Approval request expired'; end if;
  if v_req.status<>'PENDING' then raise exception 'Approval request already completed'; end if;

  select d.status into v_decision_status from public.decisions d where d.id=v_req.decision_id for update;
  if v_decision_status<>'PENDING' then raise exception 'Decision is no longer pending'; end if;

  update public.approval_requests set status=p_action,note=nullif(trim(coalesce(p_note,'')),''),responded_at=now() where id=v_req.id;
  insert into public.audit_events(decision_id,event_type,message)
  values(v_req.decision_id,case when p_action='APPROVED' then 'PARTY_APPROVED' else 'PARTY_REJECTED' end,
    case when p_action='APPROVED' then v_req.party_name||' approved the request as '||v_req.party_role||'.' else v_req.party_name||' rejected the request as '||v_req.party_role||'.' end);

  if p_action='REJECTED' then
    update public.decisions set status='REJECTED',decided_at=now(),decision_note=nullif(trim(coalesce(p_note,'')),'') where id=v_req.decision_id and status='PENDING';
  elsif (select count(*) from public.approval_requests where decision_id=v_req.decision_id and status='APPROVED')=2 then
    update public.decisions set status='APPROVED',decided_at=now(),approval_completed_at=now(),decision_note='Approved by both parties.' where id=v_req.decision_id and status='PENDING';
  end if;

  return query select d.code,d.status,ar.status,ar.party_role,ar.responded_at from public.decisions d join public.approval_requests ar on ar.id=v_req.id where d.id=v_req.decision_id;
end;
$$;

revoke all on function public.get_approval_request(uuid) from public;
grant execute on function public.get_approval_request(uuid) to anon,authenticated;
revoke all on function public.respond_to_approval(uuid,text,text) from public;
grant execute on function public.respond_to_approval(uuid,text,text) to anon,authenticated;
