-- Customer inquiries for the Edris owner desk.
-- Public visitors may insert a row. Reads and updates stay behind the owner session.

create table if not exists owner_settings (
  id smallint primary key default 1 check (id = 1),
  password_hash text,
  session_secret text,
  updated_at timestamptz not null default now()
);

create table if not exists inquiries (
  id text primary key,
  reference text not null unique,
  full_name text not null,
  phone text not null,
  email text,
  city text,
  language text not null default 'om',
  service text not null,
  passport_speed text,
  destination text,
  travel_date text,
  message text,
  status text not null default 'new',
  internal_notes text not null default '',
  assigned_staff text,
  payment_amount numeric,
  payment_currency text not null default 'ETB',
  payment_status text not null default 'unpaid',
  payment_method text,
  receipt_number text,
  receipt_issued_at timestamptz,
  application_ref text,
  application_authority text,
  application_submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contacted_at timestamptz,
  completed_at timestamptz,
  constraint inquiries_status_chk check (
    status in ('new', 'contacted', 'documents_pending', 'in_progress', 'completed', 'cancelled')
  ),
  constraint inquiries_speed_chk check (
    passport_speed is null or passport_speed in ('urgent_2', 'urgent_5', 'normal')
  ),
  constraint inquiries_payment_chk check (
    payment_status in ('unpaid', 'partial', 'paid', 'refunded')
  )
);

create index if not exists inquiries_status_idx on inquiries (status);
create index if not exists inquiries_created_idx on inquiries (created_at desc);
create index if not exists inquiries_reference_idx on inquiries (reference);

create table if not exists checklist_items (
  id serial primary key,
  inquiry_id text not null references inquiries (id) on delete cascade,
  doc_key text not null,
  state text not null default 'missing',
  constraint checklist_state_chk check (state in ('missing', 'received', 'verified')),
  unique (inquiry_id, doc_key)
);

create table if not exists status_events (
  id serial primary key,
  inquiry_id text not null references inquiries (id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists status_events_inquiry_idx on status_events (inquiry_id, created_at);
