import * as Accordion from "@radix-ui/react-accordion";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  FileText,
  Globe,
  Plane,
  Stethoscope,
  Shield,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const icons = [FileText, BadgeCheck, Shield, Stethoscope, Plane, Globe];

export function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="services-section" aria-labelledby="services-heading">
      <div className="section-inner">
        <div className="services-heading">
          <p className="section-kicker">{t.servicesSection.kicker}</p>
          <h2 id="services-heading">{t.servicesSection.title}</h2>
          <p className="services-intro">{t.servicesSection.intro}</p>
        </div>

        <div className="passport-card">
          <h3>{t.passport.title}</h3>
          <ul className="passport-types">
            <li>
              <strong>{t.passport.urgent}</strong>
              <ul>
                <li>{t.passport.urgent2}</li>
                <li>{t.passport.urgent5}</li>
              </ul>
            </li>
            <li>
              <strong>{t.passport.normal}</strong>
            </li>
          </ul>
          <p className="passport-req-label">{t.passport.required}</p>
          <ul className="passport-docs">
            {t.passport.docs.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <ul className="service-list">
          {t.services.map((service, index) => {
            const Icon = icons[index] ?? Globe;
            return (
              <li key={service.title} className="service-item">
                <span className="service-icon">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
              </li>
            );
          })}
        </ul>

        <div id="faq" className="faq-layout" aria-labelledby="faq-heading">
          <div className="faq-copy">
            <p className="section-kicker">FAQ</p>
            <h2 id="faq-heading">{t.nav.faq}</h2>
          </div>
          <Accordion.Root type="single" collapsible className="faq-list">
            {t.faq.map((item, index) => (
              <Accordion.Item key={item.q} value={`faq-${index}`} className="faq-item">
                <Accordion.Header>
                  <Accordion.Trigger className="faq-trigger">
                    <span>{item.q}</span>
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-answer">{item.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
