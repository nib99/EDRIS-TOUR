import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type BeforeInstall = Event & { prompt: () => Promise<void> };

export function InstallButton() {
  const { t } = useI18n();
  const [promptEvent, setPromptEvent] = useState<BeforeInstall | null>(null);
  const [help, setHelp] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const nav = navigator as Navigator & { standalone?: boolean };
    setStandalone(media.matches || Boolean(nav.standalone));
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstall);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="h-11 px-2"
        onClick={() => {
          if (promptEvent) {
            void promptEvent.prompt();
            setPromptEvent(null);
            return;
          }
          const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
          if (ios) {
            window.location.href = "/?install=1&platform=ios";
            return;
          }
          setHelp((open) => !open);
        }}
      >
        <Download className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t.install}</span>
      </Button>
      {help ? (
        <p className="absolute end-0 top-12 z-20 w-56 rounded-md border border-line bg-surface p-3 text-sm text-muted shadow-panel">
          {t.installHelp}
        </p>
      ) : null}
    </div>
  );
}

export function PwaRegister() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
