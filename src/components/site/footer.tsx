import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-gold/60 text-gold">
            <Compass className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-gold">Idris Tour & Travel</p>
            <p className="text-xs tracking-widest text-muted uppercase">From Ethiopia to the world</p>
          </div>
        </div>

        <div className="text-sm text-muted">
          <p>Addis Ababa · Bole</p>
          <p className="mt-0.5">© {new Date().getFullYear()} Idris Tour & Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
