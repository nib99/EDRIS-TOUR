-- ============================================================
-- EDRIS TOUR & TRAVEL — Phase 3 Complete Business Operations
-- Run against PostgreSQL / Neon:
--   psql "$DATABASE_URL" -f db/schema.sql
-- ============================================================

-- ─── Inquiries (Phase 1–2, extended) ───────────────────────
create table if not exists inquiries (
  id bigserial primary key,
  name varchar(120) not null,
  phone varchar(40) not null,
  service varchar(120) not null,
  message varchar(2000) not null default '',
  status varchar(32) not null default 'new',
  admin_note varchar(3000) not null default '',
  customer_id bigint,
  assigned_to varchar(120) not null default '',
  quoted_amount numeric(12,2),
  currency varchar(8) not null default 'ETB',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table inquiries add column if not exists status varchar(32);
alter table inquiries add column if not exists admin_note varchar(3000);
alter table inquiries add column if not exists updated_at timestamptz;
alter table inquiries add column if not exists customer_id bigint;
alter table inquiries add column if not exists assigned_to varchar(120);
alter table inquiries add column if not exists quoted_amount numeric(12,2);
alter table inquiries add column if not exists currency varchar(8);

update inquiries set status = 'new' where status is null;
update inquiries set admin_note = '' where admin_note is null;
update inquiries set updated_at = created_at where updated_at is null;
update inquiries set assigned_to = '' where assigned_to is null;
update inquiries set currency = 'ETB' where currency is null;

alter table inquiries alter column status set default 'new';
alter table inquiries alter column status set not null;
alter table inquiries alter column admin_note set default '';
alter table inquiries alter column admin_note set not null;
alter table inquiries alter column updated_at set default now();
alter table inquiries alter column updated_at set not null;
alter table inquiries alter column assigned_to set default '';
alter table inquiries alter column assigned_to set not null;
alter table inquiries alter column currency set default 'ETB';
alter table inquiries alter column currency set not null;

create index if not exists inquiries_created_at_idx on inquiries(created_at desc);
create index if not exists inquiries_status_idx on inquiries(status);
create index if not exists inquiries_phone_idx on inquiries(phone);
create index if not exists inquiries_customer_id_idx on inquiries(customer_id);

-- ─── Customers ─────────────────────────────────────────────
create table if not exists customers (
  id bigserial primary key,
  name varchar(120) not null,
  phone varchar(40) not null,
  email varchar(160) not null default '',
  notes varchar(3000) not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phone)
);

create index if not exists customers_phone_idx on customers(phone);
create index if not exists customers_name_idx on customers(name);

-- ─── Service catalog & pricing ─────────────────────────────
create table if not exists services (
  id bigserial primary key,
  code varchar(64) not null unique,
  name_en varchar(160) not null,
  name_am varchar(160) not null default '',
  name_om varchar(160) not null default '',
  category varchar(64) not null default 'general',
  base_price numeric(12,2) not null default 0,
  currency varchar(8) not null default 'ETB',
  description varchar(2000) not null default '',
  active boolean not null default true,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_active_idx on services(active, sort_order);

insert into services (code, name_en, name_am, name_om, category, base_price, description, sort_order)
select * from (values
  ('passport_normal', 'Passport – Normal Service', 'ፓስፖርት – መደበኛ', 'Paaspoortii – Tajaajila Idilee', 'passport', 0::numeric, 'Standard passport application support', 10),
  ('passport_5day', 'Passport – 5-Day Urgent', 'ፓስፖርት – 5 ቀን አስቸኳይ', 'Paaspoortii – Guyyaa 5 Ariifachiisaa', 'passport', 0::numeric, 'Urgent 5-day passport coordination', 20),
  ('passport_2day', 'Passport – 2-Day Urgent', 'ፓስፖርት – 2 ቀን አስቸኳይ', 'Paaspoortii – Guyyaa 2 Ariifachiisaa', 'passport', 0::numeric, 'Urgent 2-day passport coordination', 30),
  ('coc', 'Certificate of Competence (COC)', 'የብቃት ማረጋገጫ (COC)', 'Ragaa Gahumsaa (COC)', 'document', 0::numeric, 'COC application support', 40),
  ('police_clearance', 'Police Clearance', 'የፖሊስ ማረጋገጫ', 'Ragaa Poolisii', 'document', 0::numeric, 'Police clearance certificate support', 50),
  ('medical', 'Medical Appointment', 'የሕክምና ቀጠሮ', 'Beellama Fayyaa', 'document', 0::numeric, 'Medical appointment coordination', 60),
  ('ilms', 'ILMS Support', 'ILMS ድጋፍ', 'Deeggarsa ILMS', 'document', 0::numeric, 'ILMS system support', 70),
  ('visa', 'Visa Support', 'የቪዛ ድጋፍ', 'Deeggarsa Viizaa', 'visa', 0::numeric, 'Visa application assistance', 80),
  ('air_ticket', 'Air Ticket', 'የአየር ትኬት', 'Tikeetii Xiyyaaraa', 'travel', 0::numeric, 'Domestic and international air tickets', 90)
) as v(code, name_en, name_am, name_om, category, base_price, description, sort_order)
where not exists (select 1 from services limit 1);

-- ─── Document checklist templates per service ──────────────
create table if not exists document_templates (
  id bigserial primary key,
  service_code varchar(64) not null,
  doc_name varchar(160) not null,
  required boolean not null default true,
  sort_order int not null default 10,
  notes varchar(500) not null default ''
);

create index if not exists document_templates_service_idx on document_templates(service_code, sort_order);

insert into document_templates (service_code, doc_name, required, sort_order)
select * from (values
  ('passport_normal', 'National ID / Kebele ID', true, 10),
  ('passport_normal', 'Birth certificate / age proof', true, 20),
  ('passport_normal', 'Passport application form', true, 30),
  ('passport_normal', 'Passport-size photos', true, 40),
  ('passport_normal', 'Previous passport (if any)', false, 50),
  ('passport_5day', 'National ID / Kebele ID', true, 10),
  ('passport_5day', 'Birth certificate / age proof', true, 20),
  ('passport_5day', 'Passport application form', true, 30),
  ('passport_5day', 'Passport-size photos', true, 40),
  ('passport_5day', 'Urgency justification letter', true, 50),
  ('passport_2day', 'National ID / Kebele ID', true, 10),
  ('passport_2day', 'Birth certificate / age proof', true, 20),
  ('passport_2day', 'Passport application form', true, 30),
  ('passport_2day', 'Passport-size photos', true, 40),
  ('passport_2day', 'Urgency justification letter', true, 50),
  ('coc', 'National ID', true, 10),
  ('coc', 'Educational certificates', true, 20),
  ('coc', 'Application form', true, 30),
  ('police_clearance', 'National ID', true, 10),
  ('police_clearance', 'Passport copy (if any)', false, 20),
  ('police_clearance', 'Application request letter', true, 30),
  ('medical', 'National ID / Passport', true, 10),
  ('medical', 'Referral / request letter', false, 20),
  ('visa', 'Valid passport', true, 10),
  ('visa', 'Passport-size photos', true, 20),
  ('visa', 'Invitation / employment letter', false, 30),
  ('visa', 'Bank statement / financial proof', false, 40),
  ('visa', 'Visa application form', true, 50),
  ('air_ticket', 'Valid passport / ID', true, 10),
  ('air_ticket', 'Travel dates confirmation', true, 20)
) as v(service_code, doc_name, required, sort_order)
where not exists (select 1 from document_templates limit 1);

-- ─── Per-inquiry document tracking ─────────────────────────
create table if not exists inquiry_documents (
  id bigserial primary key,
  inquiry_id bigint not null references inquiries(id) on delete cascade,
  doc_name varchar(160) not null,
  required boolean not null default true,
  status varchar(32) not null default 'pending',
  notes varchar(1000) not null default '',
  received_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiry_documents_inquiry_idx on inquiry_documents(inquiry_id);
create index if not exists inquiry_documents_status_idx on inquiry_documents(status);

-- ─── Payments ──────────────────────────────────────────────
create table if not exists payments (
  id bigserial primary key,
  inquiry_id bigint references inquiries(id) on delete set null,
  customer_id bigint references customers(id) on delete set null,
  amount numeric(12,2) not null,
  currency varchar(8) not null default 'ETB',
  method varchar(40) not null default 'cash',
  status varchar(32) not null default 'completed',
  reference varchar(120) not null default '',
  provider_ref varchar(160) not null default '',
  notes varchar(1000) not null default '',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_inquiry_idx on payments(inquiry_id);
create index if not exists payments_customer_idx on payments(customer_id);
create index if not exists payments_paid_at_idx on payments(paid_at desc);
create index if not exists payments_status_idx on payments(status);

-- ─── Receipts / invoices ───────────────────────────────────
create table if not exists receipts (
  id bigserial primary key,
  receipt_no varchar(40) not null unique,
  inquiry_id bigint references inquiries(id) on delete set null,
  customer_id bigint references customers(id) on delete set null,
  payment_id bigint references payments(id) on delete set null,
  customer_name varchar(120) not null,
  customer_phone varchar(40) not null default '',
  service_label varchar(200) not null,
  amount numeric(12,2) not null,
  currency varchar(8) not null default 'ETB',
  method varchar(40) not null default 'cash',
  notes varchar(1000) not null default '',
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists receipts_issued_at_idx on receipts(issued_at desc);
create index if not exists receipts_customer_idx on receipts(customer_id);
create index if not exists receipts_inquiry_idx on receipts(inquiry_id);

create sequence if not exists receipt_no_seq start 1001;

-- ─── Notification log (WhatsApp / SMS hooks) ───────────────
create table if not exists notification_log (
  id bigserial primary key,
  channel varchar(20) not null,
  recipient varchar(80) not null,
  template_key varchar(64) not null default '',
  body varchar(2000) not null default '',
  status varchar(32) not null default 'queued',
  provider_ref varchar(160) not null default '',
  inquiry_id bigint,
  customer_id bigint,
  error_message varchar(500) not null default '',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists notification_log_created_idx on notification_log(created_at desc);
create index if not exists notification_log_status_idx on notification_log(status);

-- ============================================================
-- Phase 4 — Staff, tracking tokens, activity log, exports
-- ============================================================

-- Public status-tracking token on each inquiry
alter table inquiries add column if not exists tracking_token varchar(48);
alter table inquiries add column if not exists tracking_token_created_at timestamptz;

create unique index if not exists inquiries_tracking_token_uidx
  on inquiries(tracking_token) where tracking_token is not null;

-- Staff accounts (owner + agents)
create table if not exists staff (
  id bigserial primary key,
  username varchar(64) not null unique,
  display_name varchar(120) not null,
  role varchar(32) not null default 'agent',
  -- owner | agent
  password_hash varchar(128) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists staff_active_idx on staff(active);

-- Activity / audit log
create table if not exists activity_log (
  id bigserial primary key,
  actor varchar(120) not null default 'owner',
  action varchar(64) not null,
  entity_type varchar(40) not null default '',
  entity_id bigint,
  detail varchar(2000) not null default '',
  created_at timestamptz not null default now()
);

create index if not exists activity_log_created_idx on activity_log(created_at desc);
create index if not exists activity_log_entity_idx on activity_log(entity_type, entity_id);

-- Document file references (name + optional URL / storage key)
alter table inquiry_documents add column if not exists file_name varchar(255);
alter table inquiry_documents add column if not exists file_url varchar(1000);
alter table inquiry_documents add column if not exists file_note varchar(500);

-- Business settings key/value (location, phones, etc.)
create table if not exists settings (
  key varchar(64) primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('business_name', 'EDRIS TOUR & TRAVEL'),
  ('owner_name', 'EDRIS MUHAMMED'),
  ('phone', '0922005374'),
  ('whatsapp', '0922005374'),
  ('telegram', '0922005374'),
  ('location', 'Finfinnee Boolee'),
  ('location_detail', 'Finfinnee Boolee, Addis Ababa, Ethiopia')
on conflict (key) do nothing;
