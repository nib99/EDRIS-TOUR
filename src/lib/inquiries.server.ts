import { CHECKLIST, type CheckState, type InquiryStatus, type PaymentStatus, isServiceId, makeReference, phonesMatch } from "@/lib/catalog";
import { dbSource, getSql } from "@/lib/db";
import type { InquiryDetail, InquirySummary, Metrics, PublicTrack } from "@/lib/inquiry-types";

type InquiryRow = {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  language: string;
  service: string;
  passport_speed: string | null;
  destination: string | null;
  travel_date: string | null;
  message: string | null;
  status: string;
  internal_notes: string;
  assigned_staff: string | null;
  payment_amount: string | number | null;
  payment_currency: string;
  payment_status: string;
  payment_method: string | null;
  receipt_number: string | null;
  receipt_issued_at: unknown;
  application_ref: string | null;
  application_authority: string | null;
  application_submitted_at: unknown;
  created_at: unknown;
  updated_at: unknown;
  contacted_at: unknown;
  completed_at: unknown;
};

function iso(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString();
}

function money(value: string | number | null): string | null {
  if (value == null || value === "") return null;
  return String(value);
}

function summary(row: InquiryRow): InquirySummary {
  return {
    id: row.id,
    reference: row.reference,
    fullName: row.full_name,
    phone: row.phone,
    service: row.service,
    passportSpeed: row.passport_speed,
    destination: row.destination,
    status: row.status,
    paymentStatus: row.payment_status,
    assignedStaff: row.assigned_staff,
    createdAt: iso(row.created_at) ?? new Date(0).toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date(0).toISOString(),
  };
}

let seedPromise: Promise<void> | null = null;

function ensureDemoSeed(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  if (!seedPromise) {
    seedPromise = seedNow().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function seedNow(): Promise<void> {
  const sql = await getSql();
  const count = await sql<{ n: number }>`select count(*)::int as n from inquiries`;
  if (Number(count[0]?.n ?? 0) > 0) return;
  const samples = [
    {
      name: "Hana Bekele",
      phone: "+251911220011",
      service: "passport",
      speed: "urgent_2",
      destination: "Dubai",
      status: "new",
      city: "Addis Ababa",
    },
    {
      name: "Gemechu Tadesse",
      phone: "+251922330044",
      service: "coc",
      speed: null,
      destination: null,
      status: "documents_pending",
      city: "Adama",
    },
    {
      name: "Fatima Ali",
      phone: "+251933440055",
      service: "visa",
      speed: null,
      destination: "Riyadh",
      status: "in_progress",
      city: "Dire Dawa",
    },
    {
      name: "Samuel Desta",
      phone: "+251944550066",
      service: "police",
      speed: null,
      destination: "Doha",
      status: "completed",
      city: "Addis Ababa",
    },
  ] as const;
  for (const sample of samples) {
    await createInquiry({
      fullName: sample.name,
      phone: sample.phone,
      email: null,
      city: sample.city,
      language: "en",
      service: sample.service,
      passportSpeed: sample.speed,
      destination: sample.destination,
      travelDate: null,
      message: null,
      status: sample.status,
    });
  }
  const visa = await sql<{ id: string }>`select id from inquiries where full_name = 'Fatima Ali' limit 1`;
  if (visa[0]) {
    await sql`
      update inquiries
      set assigned_staff = 'Marta Hailu',
          payment_status = 'partial',
          payment_amount = 4500,
          payment_method = 'Telebirr',
          application_ref = 'VISA-2041',
          application_authority = 'Immigration',
          application_submitted_at = now(),
          contacted_at = now()
      where id = ${visa[0].id}
    `;
  }
  const done = await sql<{ id: string }>`select id from inquiries where full_name = 'Samuel Desta' limit 1`;
  if (done[0]) {
    await sql`
      update inquiries
      set assigned_staff = 'Yonas Kebede',
          payment_status = 'paid',
          payment_amount = 800,
          payment_method = 'Cash',
          receipt_number = 'RCT-1008',
          receipt_issued_at = now(),
          contacted_at = now(),
          completed_at = now(),
          internal_notes = ${"[desk] Clearance collected and handed to the customer."}
      where id = ${done[0].id}
    `;
  }
}

export async function createInquiry(input: {
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  language: string;
  service: string;
  passportSpeed: string | null;
  destination: string | null;
  travelDate: string | null;
  message: string | null;
  status?: string;
}): Promise<{ reference: string }> {
  const sql = await getSql();
  const id = crypto.randomUUID();
  let reference = makeReference();
  const status = input.status ?? "new";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await sql`
        insert into inquiries (
          id, reference, full_name, phone, email, city, language, service,
          passport_speed, destination, travel_date, message, status
        ) values (
          ${id}, ${reference}, ${input.fullName}, ${input.phone}, ${input.email},
          ${input.city}, ${input.language}, ${input.service}, ${input.passportSpeed},
          ${input.destination}, ${input.travelDate}, ${input.message}, ${status}
        )
      `;
      break;
    } catch (error) {
      const code = (error as { code?: string }).code;
      const message = error instanceof Error ? error.message : "";
      if (code === "23505" || /unique/i.test(message)) {
        reference = makeReference();
        if (attempt === 2) throw error;
        continue;
      }
      throw error;
    }
  }
  const docs = isServiceId(input.service) ? CHECKLIST[input.service] : [];
  for (const doc of docs) {
    await sql`
      insert into checklist_items (inquiry_id, doc_key, state)
      values (${id}, ${doc}, 'missing')
    `;
  }
  await sql`
    insert into status_events (inquiry_id, from_status, to_status, note)
    values (${id}, null, ${status}, 'opened')
  `;
  return { reference };
}

export async function metrics(): Promise<Metrics> {
  await ensureDemoSeed();
  const sql = await getSql();
  const rows = await sql<{
    total: number;
    new_count: number;
    active: number;
    completed: number;
  }>`
    select
      count(*)::int as total,
      count(*) filter (where status = 'new')::int as new_count,
      count(*) filter (where status in ('contacted', 'documents_pending', 'in_progress'))::int as active,
      count(*) filter (where status = 'completed')::int as completed
    from inquiries
  `;
  const row = rows[0];
  return {
    total: Number(row?.total ?? 0),
    newCount: Number(row?.new_count ?? 0),
    active: Number(row?.active ?? 0),
    completed: Number(row?.completed ?? 0),
  };
}

function likePattern(query: string): string {
  const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
  return `%${escaped}%`;
}

export async function listInquiries(query: string, status: string): Promise<InquirySummary[]> {
  await ensureDemoSeed();
  const sql = await getSql();
  const q = query.trim();
  const pattern = q ? likePattern(q) : "";
  const rows = await sql<InquiryRow>`
    select id, reference, full_name, phone, email, city, language, service, passport_speed,
           destination, travel_date, message, status, internal_notes, assigned_staff,
           payment_amount::text as payment_amount, payment_currency, payment_status,
           payment_method, receipt_number, receipt_issued_at, application_ref,
           application_authority, application_submitted_at, created_at, updated_at,
           contacted_at, completed_at
    from inquiries
    where (
      ${q} = ''
      or full_name ilike ${pattern}
      or phone ilike ${pattern}
      or reference ilike ${pattern}
      or coalesce(destination, '') ilike ${pattern}
      or coalesce(email, '') ilike ${pattern}
    )
    and (
      ${status} = ''
      or ${status} = 'all'
      or (${status} = 'active' and status in ('contacted', 'documents_pending', 'in_progress'))
      or status = ${status}
    )
    order by created_at desc
    limit 100
  `;
  return rows.map(summary);
}

async function loadRow(id: string): Promise<InquiryRow | null> {
  const sql = await getSql();
  const rows = await sql<InquiryRow>`
    select id, reference, full_name, phone, email, city, language, service, passport_speed,
           destination, travel_date, message, status, internal_notes, assigned_staff,
           payment_amount::text as payment_amount, payment_currency, payment_status,
           payment_method, receipt_number, receipt_issued_at, application_ref,
           application_authority, application_submitted_at, created_at, updated_at,
           contacted_at, completed_at
    from inquiries
    where id = ${id}
  `;
  return rows[0] ?? null;
}

export async function getInquiry(id: string): Promise<InquiryDetail | null> {
  await ensureDemoSeed();
  const row = await loadRow(id);
  if (!row) return null;
  const sql = await getSql();
  const checklist = await sql<{ id: number; doc_key: string; state: string }>`
    select id, doc_key, state from checklist_items where inquiry_id = ${id} order by id
  `;
  const events = await sql<{
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    created_at: unknown;
  }>`
    select id, from_status, to_status, note, created_at
    from status_events
    where inquiry_id = ${id}
    order by created_at asc, id asc
  `;
  return {
    ...summary(row),
    email: row.email,
    city: row.city,
    language: row.language,
    travelDate: row.travel_date,
    message: row.message,
    internalNotes: row.internal_notes,
    paymentAmount: money(row.payment_amount),
    paymentCurrency: row.payment_currency,
    paymentMethod: row.payment_method,
    receiptNumber: row.receipt_number,
    receiptIssuedAt: iso(row.receipt_issued_at),
    applicationRef: row.application_ref,
    applicationAuthority: row.application_authority,
    applicationSubmittedAt: iso(row.application_submitted_at),
    contactedAt: iso(row.contacted_at),
    completedAt: iso(row.completed_at),
    checklist: checklist.map((item) => ({ id: Number(item.id), docKey: item.doc_key, state: item.state })),
    events: events.map((event) => ({
      id: Number(event.id),
      fromStatus: event.from_status,
      toStatus: event.to_status,
      note: event.note,
      createdAt: iso(event.created_at) ?? new Date(0).toISOString(),
    })),
  };
}

export async function trackInquiry(reference: string, phone: string): Promise<PublicTrack | null> {
  const sql = await getSql();
  const rows = await sql<InquiryRow>`
    select id, reference, full_name, phone, email, city, language, service, passport_speed,
           destination, travel_date, message, status, internal_notes, assigned_staff,
           payment_amount::text as payment_amount, payment_currency, payment_status,
           payment_method, receipt_number, receipt_issued_at, application_ref,
           application_authority, application_submitted_at, created_at, updated_at,
           contacted_at, completed_at
    from inquiries
    where upper(reference) = upper(${reference.trim()})
  `;
  const row = rows.find((item) => phonesMatch(item.phone, phone));
  if (!row) return null;
  const detail = await getInquiry(row.id);
  if (!detail) return null;
  return {
    reference: detail.reference,
    fullName: detail.fullName,
    service: detail.service,
    passportSpeed: detail.passportSpeed,
    destination: detail.destination,
    status: detail.status,
    paymentStatus: detail.paymentStatus,
    paymentAmount: detail.paymentAmount,
    paymentCurrency: detail.paymentCurrency,
    receiptNumber: detail.receiptNumber,
    applicationRef: detail.applicationRef,
    applicationAuthority: detail.applicationAuthority,
    assignedStaff: detail.assignedStaff,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    checklist: detail.checklist,
    events: detail.events.map((event) => ({
      id: event.id,
      toStatus: event.toStatus,
      createdAt: event.createdAt,
    })),
  };
}

export type InquiryPatch = {
  status?: InquiryStatus;
  appendNote?: string;
  assignedStaff?: string | null;
  paymentAmount?: number | null;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string | null;
  receiptNumber?: string | null;
  applicationRef?: string | null;
  applicationAuthority?: string | null;
  checklist?: Array<{ id: number; state: CheckState }>;
};

export async function patchInquiry(id: string, patch: InquiryPatch): Promise<InquiryDetail | null> {
  const current = await getInquiry(id);
  if (!current) return null;
  const sql = await getSql();
  const nextStatus = patch.status ?? (current.status as InquiryStatus);
  let notes = current.internalNotes;
  if (patch.appendNote && patch.appendNote.trim()) {
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const line = `[${stamp}] ${patch.appendNote.trim().slice(0, 500)}`;
    notes = notes ? `${notes}\n${line}` : line;
    if (notes.length > 8000) notes = notes.slice(notes.length - 8000);
  }
  const staff = patch.assignedStaff === undefined ? current.assignedStaff : patch.assignedStaff;
  const amount =
    patch.paymentAmount === undefined
      ? current.paymentAmount
      : patch.paymentAmount == null
        ? null
        : String(patch.paymentAmount);
  const payStatus = patch.paymentStatus ?? current.paymentStatus;
  const method = patch.paymentMethod === undefined ? current.paymentMethod : patch.paymentMethod;
  let receipt = patch.receiptNumber === undefined ? current.receiptNumber : patch.receiptNumber;
  if (receipt) receipt = receipt.slice(0, 40);
  const appRef = patch.applicationRef === undefined ? current.applicationRef : patch.applicationRef;
  const authority =
    patch.applicationAuthority === undefined ? current.applicationAuthority : patch.applicationAuthority;
  const contacted =
    nextStatus !== "new" && nextStatus !== "cancelled"
      ? (current.contactedAt ?? new Date().toISOString())
      : current.contactedAt;
  const completed = nextStatus === "completed" ? (current.completedAt ?? new Date().toISOString()) : current.completedAt;
  const receiptAt =
    receipt && !current.receiptIssuedAt ? new Date().toISOString() : receipt ? current.receiptIssuedAt : null;
  const appAt =
    appRef && !current.applicationSubmittedAt
      ? new Date().toISOString()
      : appRef
        ? current.applicationSubmittedAt
        : null;

  await sql`
    update inquiries set
      status = ${nextStatus},
      internal_notes = ${notes},
      assigned_staff = ${staff},
      payment_amount = ${amount},
      payment_status = ${payStatus},
      payment_method = ${method},
      receipt_number = ${receipt},
      receipt_issued_at = ${receiptAt},
      application_ref = ${appRef},
      application_authority = ${authority},
      application_submitted_at = ${appAt},
      contacted_at = ${contacted},
      completed_at = ${completed},
      updated_at = now()
    where id = ${id}
  `;

  if (patch.status && patch.status !== current.status) {
    await sql`
      insert into status_events (inquiry_id, from_status, to_status, note)
      values (${id}, ${current.status}, ${patch.status}, null)
    `;
  }

  if (patch.checklist) {
    for (const item of patch.checklist) {
      await sql`
        update checklist_items
        set state = ${item.state}
        where id = ${item.id} and inquiry_id = ${id}
      `;
    }
  }

  return getInquiry(id);
}
