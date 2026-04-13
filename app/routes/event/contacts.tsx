import { ExternalLink, CalendarDays, Calendar, Mail } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Markdown } from "@/components/Markdown";

const ContactsPage = () => {
  const event = useEvent();
  const contactLinks = [
    { href: event.contact?.facebook, icon: ExternalLink, label: "Facebook", text: "Událost na facebooku" },
    { href: event.contact?.larpovadatabaze, icon: CalendarDays, label: "Larpová Databáze", text: "Záznam v databázi" },
    { href: event.contact?.larpcz, icon: Calendar, label: "LARP.cz", text: "Kalendář akcí" },
    { href: event.contact?.email ? `mailto:${event.contact.email}` : undefined, icon: Mail, label: "E-mail", text: "Napište organizátorům" },
  ];

  return (
    <>
      <PageHero title="Kontakt a tým" image={event.contactImage?.src} />

      {/* Content section */}
      <section className="-mx-4 bg-primary-light text-primary">
        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8 lg:py-14">
          {event.contactText && (
            <div className="mb-10">
              <Markdown content={event.contactText} />
            </div>
          )}

          {/* Contact link cards */}
          <h3 className="mb-4 font-display text-xl font-bold">
            Kontakty a odkazy pro současný ročník
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contactLinks.map((c) => {
              const Icon = c.icon;
              const disabled = !c.href;

              return (
                <a
                  key={c.label}
                  href={c.href || "#"}
                  target="_blank"
                  rel="external"
                  className={`group flex items-center gap-4 rounded-lg bg-white px-4 py-3 shadow-md transition-colors ${disabled ? "pointer-events-none opacity-40" : "hover:bg-grey-200"}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 transition-colors ${!disabled ? "group-hover:bg-secondary/20" : ""}`}>
                    <Icon size={22} className="text-secondary" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-primary">
                      {c.label}
                    </div>
                    <div className="text-xs text-primary/60">
                      {c.text}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactsPage;
