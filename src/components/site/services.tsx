import * as Accordion from "@radix-ui/react-accordion";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  Globe,
  Landmark,
  Luggage,
  Moon,
  Plane,
} from "lucide-react";
import { faqs, services } from "@/data/catalog";

const icons = [Globe, Landmark, Moon, Plane, Building2, Luggage, BadgeCheck];

export function Services() {
  return (
    <section id="services" className="services-section" aria-labelledby="services-heading">
      <div className="section-inner">
        <div className="services-heading">
          <div>
            <p className="section-kicker">A travel desk, thoughtfully connected</p>
            <h2 id="services-heading" className="services-title">
              The details that make a journey work.
            </h2>
          </div>
          <p className="services-intro">
            From the first flight search to the hotel check-in, bring the moving
            parts to one desk in Bole, Addis Ababa.
          </p>
        </div>
        <ul className="service-list">
          {services.map((service, index) => {
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
            <p className="section-kicker">Before you set off</p>
            <h2 id="faq-heading">A few clear answers.</h2>
            <p>
              Useful things to know before you start a plan with the travel desk.
            </p>
          </div>
          <Accordion.Root type="single" collapsible className="faq-list">
            {faqs.map((item, index) => (
              <Accordion.Item key={item.q} value={`faq-${index}`} className="faq-item">
                <Accordion.Header>
                  <Accordion.Trigger className="faq-trigger">
                    <span>{item.q}</span>
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-answer">
                  {item.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
