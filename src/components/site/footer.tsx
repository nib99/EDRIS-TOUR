import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <img src="/logo.png" alt="" width={36} height={36} className="footer-logo" />
            Idris Tour &amp; Travel
          </div>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <p className="footer-details">{t.footer.details}</p>
          <p className="footer-phones">
            {t.contact.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>
                {p}
              </a>
            ))}
          </p>
          <p className="footer-thanks">{t.contact.thanks} 🙏 · Idris Mohammed</p>
        </div>
        <div className="footer-right">
          <p>{t.footer.disclaimer}</p>
          <a href="#film">
            {t.footer.back} <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
