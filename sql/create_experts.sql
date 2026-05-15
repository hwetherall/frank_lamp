create table if not exists experts (
  id text primary key,
  is_demo_target boolean default false,
  enrichment_status text not null check (enrichment_status in ('skeleton', 'enriched')),
  record jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists experts_updated_at on experts;

create trigger experts_updated_at
  before update on experts
  for each row
  execute function system.update_updated_at();
