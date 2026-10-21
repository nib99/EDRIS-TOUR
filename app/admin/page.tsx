"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "new" | "contacted" | "documents_pending" | "in_progress" | "completed" | "cancelled";
type DocStatus = "pending" | "received" | "verified" | "rejected" | "waived";
type Tab = "overview" | "inquiries" | "customers" | "services" | "payments" | "receipts";

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string;
  status: Status;
  admin_note: string;
  customer_id: number | null;
  assigned_to: string;
  quoted_amount: string | number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  docs_pending: number;
  docs_total: number;
  paid_total: string | number;
  tracking_token?: string | null;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  inquiry_count: number;
  total_paid: string | number;
  created_at: string;
};

type Service = {
  id: number;
  code: string;
  name_en: string;
  name_am: string;
  name_om: string;
  category: string;
  base_price: string | number;
  currency: string;
  description: string;
  active: boolean;
  sort_order: number;
};

type Payment = {
  id: number;
  inquiry_id: number | null;
  customer_id: number | null;
  amount: string | number;
  currency: string;
  method: string;
  status: string;
  reference: string;
  notes: string;
  paid_at: string;
  inquiry_name?: string;
  inquiry_service?: string;
  customer_name?: string;
};

type Receipt = {
  id: number;
  receipt_no: string;
  customer_name: string;
  customer_phone: string;
  service_label: string;
  amount: string | number;
  currency: string;
  method: string;
  notes: string;
  issued_at: string;
  inquiry_id: number | null;
  payment_id: number | null;
};

type Doc = {
  id: number;
  inquiry_id: number;
  doc_name: string;
  required: boolean;
  status: DocStatus;
  notes: string;
  received_at: string | null;
};

type Stats = {
  inquiries: { total: number; new_count: number; active: number; completed: number; cancelled: number };
  payments: {
    revenue_total: string | number;
    revenue_month: string | number;
    revenue_today: string | number;
    payment_count: number;
    pending_count: number;
  };
  customers: { total: number };
  documents: { pending_required: number; received: number };
  byMethod: { method: string; c: number; total: string | number }[];
};

const statusLabels: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  documents_pending: "Documents pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled"
};

const docStatusLabels: Record<DocStatus, string> = {
  pending: "Pending",
  received: "Received",
  verified: "Verified",
  rejected: "Rejected",
  waived: "Waived"
};

const methodLabels: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  telebirr: "Telebirr",
  cbe_birr: "CBE Birr",
  chapa: "Chapa",
  other: "Other"
};

function money(v: string | number | null | undefined, currency = "ETB") {
  const n = Number(v || 0);
  return `${n.toLocaleString("en-ET", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [custQuery, setCustQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [payForm, setPayForm] = useState({
    inquiryId: 0,
    amount: "",
    method: "cash",
    reference: "",
    notes: ""
  });
  const [svcEdit, setSvcEdit] = useState<Service | null>(null);
  const [printReceipt, setPrintReceipt] = useState<Receipt | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  function exportCsv(type: "payments" | "inquiries" | "receipts") {
    window.open(`/api/admin/export?type=${type}`, "_blank");
  }

  function trackUrl(token?: string | null) {
    if (!token) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/track?token=${encodeURIComponent(token)}`;
  }

  async function loadInquiries() {
    const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
    if (res.status === 401) {
      setLoggedIn(false);
      return false;
    }
    const data = await res.json();
    setItems(data.inquiries || []);
    setLoggedIn(true);
    return true;
  }

  async function loadStats() {
    const res = await fetch("/api/admin/stats", { cache: "no-store" });
    if (res.ok) setStats(await res.json());
  }

  async function loadCustomers(q = "") {
    const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(q)}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCustomers(data.customers || []);
    }
  }

  async function loadServices() {
    const res = await fetch("/api/admin/services", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setServices(data.services || []);
    }
  }

  async function loadPayments() {
    const res = await fetch("/api/admin/payments?limit=100", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setPayments(data.payments || []);
    }
  }

  async function loadReceipts() {
    const res = await fetch("/api/admin/receipts", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setReceipts(data.receipts || []);
    }
  }

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const ok = await loadInquiries();
    if (ok) {
      await Promise.all([loadStats(), loadCustomers(custQuery), loadServices(), loadPayments(), loadReceipts()]);
    }
    setLoading(false);
  }, [custQuery]);

  useEffect(() => {
    refreshAll();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      setLoginError("Invalid password.");
      return;
    }
    setPassword("");
    await refreshAll();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setItems([]);
  }

  async function updateInquiry(
    id: number,
    patch: {
      status?: Status;
      adminNote?: string;
      assignedTo?: string;
      quotedAmount?: number | null;
      currency?: string;
    }
  ) {
    const res = await fetch(`/api/admin/inquiries?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (!res.ok) {
      flash("Could not save.");
      return;
    }
    const data = await res.json();
    setItems((cur) =>
      cur.map((x) =>
        x.id === id
          ? {
              ...x,
              status: data.inquiry.status,
              admin_note: data.inquiry.admin_note,
              assigned_to: data.inquiry.assigned_to,
              quoted_amount: data.inquiry.quoted_amount,
              currency: data.inquiry.currency,
              customer_id: data.inquiry.customer_id,
              updated_at: data.inquiry.updated_at
            }
          : x
      )
    );
    flash("Saved.");
  }

  async function openDocs(inquiryId: number) {
    if (expandedId === inquiryId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inquiryId);
    const res = await fetch(`/api/admin/documents?inquiryId=${inquiryId}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setDocs(data.documents || []);
    } else {
      setDocs([]);
    }
  }

  async function seedDocs(inquiryId: number) {
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId })
    });
    const data = await res.json();
    if (res.ok) {
      flash(data.seeded ? `Seeded ${data.seeded} documents.` : data.message || "Done.");
      await openDocs(inquiryId);
      setExpandedId(inquiryId);
      await loadInquiries();
    } else flash("Could not seed checklist.");
  }

  async function updateDoc(id: number, status: DocStatus, notes = "") {
    const res = await fetch(`/api/admin/documents?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes })
    });
    if (res.ok) {
      const data = await res.json();
      setDocs((cur) => cur.map((d) => (d.id === id ? data.document : d)));
      flash("Document updated.");
      await loadInquiries();
    } else flash("Could not update document.");
  }

  async function recordPayment() {
    const amount = Number(payForm.amount);
    if (!payForm.inquiryId || !Number.isFinite(amount) || amount <= 0) {
      flash("Enter inquiry and amount.");
      return;
    }
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inquiryId: payForm.inquiryId,
        amount,
        method: payForm.method,
        reference: payForm.reference,
        notes: payForm.notes,
        issueReceipt: true
      })
    });
    if (!res.ok) {
      flash("Payment failed.");
      return;
    }
    const data = await res.json();
    flash(data.receipt ? `Payment recorded. Receipt ${data.receipt.receipt_no}` : "Payment recorded.");
    setPayForm({ inquiryId: 0, amount: "", method: "cash", reference: "", notes: "" });
    await Promise.all([loadPayments(), loadReceipts(), loadInquiries(), loadStats()]);
    if (data.receipt) setPrintReceipt(data.receipt);
  }

  async function saveService() {
    if (!svcEdit) return;
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: svcEdit.id,
        name_en: svcEdit.name_en,
        name_am: svcEdit.name_am,
        name_om: svcEdit.name_om,
        category: svcEdit.category,
        base_price: Number(svcEdit.base_price) || 0,
        currency: svcEdit.currency,
        description: svcEdit.description,
        active: svcEdit.active,
        sort_order: svcEdit.sort_order
      })
    });
    if (res.ok) {
      flash("Service saved.");
      setSvcEdit(null);
      await loadServices();
    } else flash("Could not save service.");
  }

  async function notifyStatus(item: Inquiry) {
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "status_change",
        inquiryId: item.id,
        channel: "whatsapp",
        statusLabel: statusLabels[item.status]
      })
    });
    const data = await res.json();
    if (res.ok) flash(`Notify ${data.status || "queued"} (configure NOTIFY_PROVIDER to send).`);
    else flash("Notify failed.");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.name, x.phone, x.service, x.message, x.status, x.assigned_to].join(" ").toLowerCase().includes(q)
    );
  }, [items, query]);

  if (!loggedIn) {
    return (
      <main className="admin-shell">
        <section className="login-card">
          <div className="admin-logo">EDRIS</div>
          <span className="admin-eyebrow">OWNER PORTAL · PHASE 3</span>
          <h1>Secure dashboard</h1>
          <p>Sign in to manage operations, customers, payments and documents.</p>
          <form onSubmit={login}>
            <label>
              Password
              <input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="admin-btn" disabled={!password}>
              Sign in
            </button>
            {loginError && <div className="admin-error">{loginError}</div>}
          </form>
          <a href="/">← Back to website</a>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-top">
        <div>
          <span className="admin-eyebrow">EDRIS TOUR & TRAVEL · PHASE 3</span>
          <h1>Operations Dashboard</h1>
        </div>
        <div className="admin-actions">
          <button className="admin-secondary" onClick={refreshAll}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <a href="/" className="admin-secondary">
            View site
          </a>
          <button className="admin-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {(
          [
            ["overview", "Overview"],
            ["inquiries", "Inquiries"],
            ["customers", "Customers"],
            ["services", "Services"],
            ["payments", "Payments"],
            ["receipts", "Receipts"]
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} className={tab === id ? "tab active" : "tab"} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {notice && <div className="admin-notice">{notice}</div>}

      {tab === "overview" && stats && (
        <section>
          <div className="metrics metrics-wide">
            <div>
              <span>New</span>
              <strong>{stats.inquiries.new_count}</strong>
            </div>
            <div>
              <span>Active</span>
              <strong>{stats.inquiries.active}</strong>
            </div>
            <div>
              <span>Completed</span>
              <strong>{stats.inquiries.completed}</strong>
            </div>
            <div>
              <span>Customers</span>
              <strong>{stats.customers.total}</strong>
            </div>
            <div>
              <span>Revenue today</span>
              <strong className="money">{money(stats.payments.revenue_today)}</strong>
            </div>
            <div>
              <span>This month</span>
              <strong className="money">{money(stats.payments.revenue_month)}</strong>
            </div>
            <div>
              <span>All-time revenue</span>
              <strong className="money">{money(stats.payments.revenue_total)}</strong>
            </div>
            <div>
              <span>Docs pending</span>
              <strong>{stats.documents.pending_required}</strong>
            </div>
          </div>

          <div className="panel-grid">
            <article className="panel">
              <h3>Payment methods</h3>
              {stats.byMethod.length === 0 && <p className="muted">No payments recorded yet.</p>}
              <ul className="method-list">
                {stats.byMethod.map((m) => (
                  <li key={m.method}>
                    <span>{methodLabels[m.method] || m.method}</span>
                    <strong>
                      {m.c} · {money(m.total)}
                    </strong>
                  </li>
                ))}
              </ul>
            </article>
            <article className="panel">
              <h3>Pipeline</h3>
              <ul className="method-list">
                <li>
                  <span>Total inquiries</span>
                  <strong>{stats.inquiries.total}</strong>
                </li>
                <li>
                  <span>Cancelled</span>
                  <strong>{stats.inquiries.cancelled}</strong>
                </li>
                <li>
                  <span>Completed payments</span>
                  <strong>{stats.payments.payment_count}</strong>
                </li>
                <li>
                  <span>Docs received/verified</span>
                  <strong>{stats.documents.received}</strong>
                </li>
              </ul>
            </article>
            <article className="panel">
              <h3>Business</h3>
              <ul className="method-list">
                <li><span>Owner</span><strong>EDRIS MUHAMMED</strong></li>
                <li><span>Phone / WA / TG</span><strong>0922 005 374</strong></li>
                <li><span>Location</span><strong>Finfinnee Boolee</strong></li>
              </ul>
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="admin-secondary" onClick={() => exportCsv("payments")}>Export payments CSV</button>
                <button className="admin-secondary" onClick={() => exportCsv("inquiries")}>Export inquiries CSV</button>
                <button className="admin-secondary" onClick={() => exportCsv("receipts")}>Export receipts CSV</button>
              </div>
            </article>
            <article className="panel">
              <h3>Workflow</h3>
              <p className="muted small">
                Customer → Inquiry → Document checklist → Quote → Payment → Receipt → Complete
              </p>
              <p className="muted small">
                Ethiopian payments: record Cash, Telebirr, CBE Birr or bank transfer. Chapa online checkout can be
                enabled via <code>PAYMENT_PROVIDER</code>.
              </p>
              <p className="muted small">
                WhatsApp/SMS: set <code>NOTIFY_PROVIDER</code> (see README). Messages are logged even when provider is
                off.
              </p>
            </article>
          </div>
        </section>
      )}

      {tab === "inquiries" && (
        <section>
          <div className="admin-toolbar">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, service, assignee…"
            />
          </div>
          <div className="inquiry-list">
            {filtered.map((item) => (
              <article className="inquiry-card" key={item.id}>
                <div className="inquiry-main">
                  <div className="inquiry-title">
                    <div>
                      <h2>{item.name}</h2>
                      <p>
                        {item.phone} · {item.service}
                        {item.assigned_to ? ` · ${item.assigned_to}` : ""}
                      </p>
                    </div>
                    <span className={`status status-${item.status}`}>{statusLabels[item.status]}</span>
                  </div>
                  {item.message && <p className="inquiry-message">{item.message}</p>}
                  <div className="inquiry-meta">
                    <small>Received {new Date(item.created_at).toLocaleString()}</small>
                    <small>
                      Docs {item.docs_total - item.docs_pending}/{item.docs_total}
                    </small>
                    <small>Paid {money(item.paid_total, item.currency || "ETB")}</small>
                    {item.quoted_amount != null && (
                      <small>Quote {money(item.quoted_amount, item.currency || "ETB")}</small>
                    )}
                    {item.tracking_token && (
                      <small>
                        <a href={trackUrl(item.tracking_token)} target="_blank" rel="noreferrer">
                          Track {item.tracking_token}
                        </a>
                      </small>
                    )}
                  </div>
                </div>
                <div className="inquiry-controls">
                  <label>
                    Status
                    <select
                      value={item.status}
                      onChange={(e) => updateInquiry(item.id, { status: e.target.value as Status })}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Assigned to
                    <input
                      defaultValue={item.assigned_to || ""}
                      placeholder="Staff name"
                      onBlur={(e) => updateInquiry(item.id, { assignedTo: e.target.value })}
                    />
                  </label>
                  <label>
                    Quoted amount (ETB)
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      defaultValue={item.quoted_amount != null ? Number(item.quoted_amount) : ""}
                      placeholder="0.00"
                      onBlur={(e) => {
                        const v = e.target.value === "" ? null : Number(e.target.value);
                        updateInquiry(item.id, { quotedAmount: v, currency: "ETB" });
                      }}
                    />
                  </label>
                  <label>
                    Internal note
                    <textarea
                      defaultValue={item.admin_note || ""}
                      rows={2}
                      onBlur={(e) => updateInquiry(item.id, { adminNote: e.target.value })}
                      placeholder="Follow-up notes…"
                    />
                  </label>
                  <div className="btn-row">
                    <a className="call-btn" href={`tel:${item.phone}`}>
                      Call
                    </a>
                    <a
                      className="admin-secondary"
                      href={`https://wa.me/${item.phone.replace(/[^\d+]/g, "").replace(/^0/, "251")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                    <button className="admin-secondary" onClick={() => openDocs(item.id)}>
                      {expandedId === item.id ? "Hide docs" : "Documents"}
                    </button>
                    <button
                      className="admin-secondary"
                      onClick={() =>
                        setPayForm({
                          inquiryId: item.id,
                          amount: item.quoted_amount ? String(item.quoted_amount) : "",
                          method: "cash",
                          reference: "",
                          notes: ""
                        })
                      }
                    >
                      Pay
                    </button>
                    <button className="admin-secondary" onClick={() => notifyStatus(item)}>
                      Notify
                    </button>
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="docs-panel">
                    <div className="docs-head">
                      <h3>Document checklist</h3>
                      <button className="admin-secondary" onClick={() => seedDocs(item.id)}>
                        Seed from template
                      </button>
                    </div>
                    {!docs.length && <p className="muted">No documents yet. Seed a checklist from the service template.</p>}
                    {docs.map((d) => (
                      <div className="doc-row" key={d.id}>
                        <div>
                          <strong>
                            {d.doc_name}
                            {d.required ? "" : " (optional)"}
                          </strong>
                          <small>{d.received_at ? ` · ${new Date(d.received_at).toLocaleDateString()}` : ""}</small>
                        </div>
                        <select
                          value={d.status}
                          onChange={(e) => updateDoc(d.id, e.target.value as DocStatus, d.notes)}
                        >
                          {Object.entries(docStatusLabels).map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {!filtered.length && <div className="empty">No inquiries found.</div>}
          </div>

          {payForm.inquiryId > 0 && (
            <div className="modal-backdrop" onClick={() => setPayForm((p) => ({ ...p, inquiryId: 0 }))}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Record payment · Inquiry #{payForm.inquiryId}</h3>
                <label>
                  Amount (ETB)
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={payForm.amount}
                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  />
                </label>
                <label>
                  Method
                  <select value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
                    {Object.entries(methodLabels).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Reference / Txn ID
                  <input
                    value={payForm.reference}
                    onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })}
                    placeholder="Telebirr / bank ref"
                  />
                </label>
                <label>
                  Notes
                  <input value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} />
                </label>
                <div className="btn-row">
                  <button className="admin-btn" onClick={recordPayment}>
                    Save & issue receipt
                  </button>
                  <button className="admin-secondary" onClick={() => setPayForm((p) => ({ ...p, inquiryId: 0 }))}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "customers" && (
        <section>
          <div className="admin-toolbar">
            <input
              value={custQuery}
              onChange={(e) => setCustQuery(e.target.value)}
              placeholder="Search customers…"
              onKeyDown={(e) => {
                if (e.key === "Enter") loadCustomers(custQuery);
              }}
            />
            <button className="admin-btn" onClick={() => loadCustomers(custQuery)}>
              Search
            </button>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Inquiries</th>
                  <th>Total paid</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <a href={`tel:${c.phone}`}>{c.phone}</a>
                    </td>
                    <td>{c.inquiry_count}</td>
                    <td>{money(c.total_paid)}</td>
                    <td className="muted">{c.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!customers.length && <div className="empty">No customers yet.</div>}
          </div>
        </section>
      )}

      {tab === "services" && (
        <section>
          <p className="muted" style={{ marginBottom: 14 }}>
            Set your real service prices. Seeded catalog covers passport, COC, police clearance, medical, ILMS, visa and
            tickets.
          </p>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name_en}</strong>
                      <div className="muted small">{s.code}</div>
                    </td>
                    <td>{s.category}</td>
                    <td>{money(s.base_price, s.currency)}</td>
                    <td>{s.active ? "Yes" : "No"}</td>
                    <td>
                      <button className="admin-secondary" onClick={() => setSvcEdit({ ...s })}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {svcEdit && (
            <div className="modal-backdrop" onClick={() => setSvcEdit(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit service</h3>
                <label>
                  Name (EN)
                  <input value={svcEdit.name_en} onChange={(e) => setSvcEdit({ ...svcEdit, name_en: e.target.value })} />
                </label>
                <label>
                  Base price
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={svcEdit.base_price}
                    onChange={(e) => setSvcEdit({ ...svcEdit, base_price: e.target.value })}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={svcEdit.category}
                    onChange={(e) => setSvcEdit({ ...svcEdit, category: e.target.value })}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows={2}
                    value={svcEdit.description}
                    onChange={(e) => setSvcEdit({ ...svcEdit, description: e.target.value })}
                  />
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={svcEdit.active}
                    onChange={(e) => setSvcEdit({ ...svcEdit, active: e.target.checked })}
                  />{" "}
                  Active
                </label>
                <div className="btn-row">
                  <button className="admin-btn" onClick={saveService}>
                    Save
                  </button>
                  <button className="admin-secondary" onClick={() => setSvcEdit(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "payments" && (
        <section>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Ref</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.paid_at).toLocaleString()}</td>
                    <td>{p.customer_name || p.inquiry_name || "—"}</td>
                    <td>{p.inquiry_service || "—"}</td>
                    <td>{money(p.amount, p.currency)}</td>
                    <td>{methodLabels[p.method] || p.method}</td>
                    <td className="muted">{p.reference || "—"}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!payments.length && <div className="empty">No payments yet. Record from an inquiry.</div>}
          </div>
        </section>
      )}

      {tab === "receipts" && (
        <section>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.receipt_no}</strong>
                    </td>
                    <td>{new Date(r.issued_at).toLocaleString()}</td>
                    <td>
                      {r.customer_name}
                      <div className="muted small">{r.customer_phone}</div>
                    </td>
                    <td>{r.service_label}</td>
                    <td>{money(r.amount, r.currency)}</td>
                    <td>{methodLabels[r.method] || r.method}</td>
                    <td>
                      <button className="admin-secondary" onClick={() => setPrintReceipt(r)}>
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!receipts.length && <div className="empty">No receipts issued yet.</div>}
          </div>
        </section>
      )}

      {printReceipt && (
        <div className="modal-backdrop" onClick={() => setPrintReceipt(null)}>
          <div className="modal receipt-print" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-body">
              <div className="receipt-brand">EDRIS TOUR & TRAVEL</div>
              <div className="muted small">Receipt / የደረሰኝ</div>
              <h2>{printReceipt.receipt_no}</h2>
              <p>
                <strong>Date:</strong> {new Date(printReceipt.issued_at).toLocaleString()}
              </p>
              <p>
                <strong>Customer:</strong> {printReceipt.customer_name}
                {printReceipt.customer_phone ? ` · ${printReceipt.customer_phone}` : ""}
              </p>
              <p>
                <strong>Service:</strong> {printReceipt.service_label}
              </p>
              <p>
                <strong>Amount:</strong> {money(printReceipt.amount, printReceipt.currency)}
              </p>
              <p>
                <strong>Method:</strong> {methodLabels[printReceipt.method] || printReceipt.method}
              </p>
              {printReceipt.notes && (
                <p>
                  <strong>Notes:</strong> {printReceipt.notes}
                </p>
              )}
              <p className="muted small" style={{ marginTop: 20 }}>
                Thank you for choosing EDRIS Tour & Travel.
              </p>
            </div>
            <div className="btn-row no-print">
              <button className="admin-btn" onClick={() => window.print()}>
                Print
              </button>
              <button className="admin-secondary" onClick={() => setPrintReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
