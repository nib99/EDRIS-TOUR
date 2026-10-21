# Edris Tour & Travel

Production multilingual PWA for **EDRIS TOUR & TRAVEL** — owned by **EDRIS MUHAMMED**, based in **Finfinnee Boolee**.

| | |
|--|--|
| **Owner** | EDRIS MUHAMMED |
| **Phone** | 0922 005 374 |
| **WhatsApp / Telegram** | 0922 005 374 |
| **Location** | Finfinnee Boolee, Addis Ababa |

## Phases

| Phase | Scope |
|-------|--------|
| 1 | Public website, PWA, inquiry form, PostgreSQL |
| 2 | Secure `/admin` owner portal, inquiry workflow |
| 3 | Customers, documents, pricing, payments, receipts, revenue, notify hooks |
| **4** | **Official business identity, customer tracking page, tracking codes, CSV accounting export, staff/settings schema** |

## Phase 4 highlights

- Public site shows **EDRIS MUHAMMED**, **Finfinnee Boolee**, primary phone **0922 005 374**, WhatsApp & Telegram links
- Every new inquiry gets a **tracking code** (e.g. `EDR-A7K2M9`)
- Customer status page: **`/track?token=…`** (Afaan Oromo / Amharic / English)
- Form success message includes the tracking code
- Admin: track link per inquiry, business card on Overview
- **CSV export**: payments, inquiries, receipts (`/api/admin/export?type=…`)
- Schema: `tracking_token`, `staff`, `activity_log`, `settings`, document file fields

## Install

```bash
npm install
cp .env.example .env.local
```

Required env:

```text
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...   # ≥ 32 chars
```

```bash
npm run admin:secret
psql "$DATABASE_URL" -f db/schema.sql
npm run dev
```

- Website: `http://localhost:3000`
- Track: `http://localhost:3000/track`
- Admin: `http://localhost:3000/admin`

## Owner dashboard

1. **Overview** — pipeline, revenue, payment methods, **business profile**, CSV exports  
2. **Inquiries** — workflow, documents, quote, payment, track link, notify  
3. **Customers** — CRM by phone  
4. **Services** — ETB price list  
5. **Payments / Receipts** — ledger + printable `EDR-#####` receipts  

### Customer journey

```text
Customer submits form on website
  → Tracking code issued (EDR-XXXXXX)
  → Customer record upserted
  → Optional document checklist seeded
Owner processes in /admin
  → Status updates visible on /track?token=…
  → Payment → receipt
  → Completed
```

Share tracking links via WhatsApp:

`https://your-domain/track?token=EDR-XXXXXX`

## Contact channels (wired in UI)

| Channel | Value |
|---------|--------|
| Call | +251 922 00 53 74 |
| WhatsApp | https://wa.me/251922005374 |
| Telegram | https://t.me/+251922005374 |
| Office | Finfinnee Boolee |

Defined in `lib/business.ts` — single source of truth for the public site and track page.

## Exports (accounting)

While signed in to `/admin`:

- `/api/admin/export?type=payments`
- `/api/admin/export?type=inquiries`
- `/api/admin/export?type=receipts`

Or use the Overview buttons.

## Security

- Admin session: HttpOnly, SameSite=Strict, HMAC-signed, 8-hour TTL  
- Track API exposes only masked name, service, status, document counts — no phone or notes  
- Put production behind WAF/rate limits  

## Project layout (Phase 4 additions)

```text
lib/business.ts          Owner, phone, location, WA/TG helpers
lib/tracking.ts          Short tracking codes
app/track/page.tsx       Customer status UI
app/api/track/           Public tracking API
app/api/admin/export/    CSV downloads
db/schema.sql            Full Phase 1–4 migration
```
