import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AdminDesk } from "@/components/admin-desk";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/controls";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner desk · Edris Tour & Travel" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Session =
  | { authenticated: true; mode: string }
  | { authenticated: false; mode: "env" | "stored" | "demo" | "setup"; demoPassword?: string };

function AdminPage() {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [setup, setSetup] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/session", { credentials: "same-origin" });
    setSession((await response.json()) as Session);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error === "rate" ? t.errors.rate : t.admin.badLogin);
      return;
    }
    setPassword("");
    await refresh();
  }

  async function createPassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 10) {
      setError(t.admin.passwordShort);
      return;
    }
    if (password !== again) {
      setError(t.admin.passwordMismatch);
      return;
    }
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/setup", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      setError(t.errors.generic);
      return;
    }
    setPassword("");
    setAgain("");
    await refresh();
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <p className="text-muted">{t.admin.loading}</p>
      </main>
    );
  }

  if (session.authenticated) {
    return <AdminDesk mode={session.mode} onLogout={() => void refresh()} />;
  }

  const showSetup = session.mode === "setup" || setup;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-4 shadow-panel">
        <p className="text-sm font-semibold text-forest">Edris</p>
        <h1 className="mt-2 font-display text-3xl text-ink">{showSetup ? t.admin.setupTitle : t.admin.loginTitle}</h1>
        <p className="mt-2 text-sm text-muted">{showSetup ? t.admin.setupBody : t.admin.loginBody}</p>
        {session.mode === "demo" && session.demoPassword && !showSetup ? (
          <p className="mt-4 rounded-md bg-paper-2 px-3 py-3 text-sm text-ink">
            {t.admin.demoLead}: <span className="font-semibold tabular-nums">{session.demoPassword}</span>
          </p>
        ) : null}
        <form className="mt-5 grid gap-4" onSubmit={showSetup ? createPassword : login}>
          <Field label={t.admin.password}>
            <TextInput
              type="password"
              autoComplete={showSetup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          {showSetup ? (
            <Field label={t.admin.passwordAgain}>
              <TextInput
                type="password"
                autoComplete="new-password"
                value={again}
                onChange={(event) => setAgain(event.target.value)}
                required
              />
            </Field>
          ) : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? t.admin.signingIn : showSetup ? t.admin.create : t.admin.signIn}
          </Button>
        </form>
        {session.mode === "demo" ? (
          <button type="button" className="mt-4 text-sm text-forest" onClick={() => setSetup((value) => !value)}>
            {showSetup ? t.admin.loginTitle : t.admin.setupTitle}
          </button>
        ) : null}
        <Link to="/" className="mt-6 block text-sm text-faint">
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
