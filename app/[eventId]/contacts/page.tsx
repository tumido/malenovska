"use client";

import { ExternalLink, CalendarDays, Calendar, Mail } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Article } from "@/components/Article";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { Markdown } from "@/components/Markdown";

const ContactsPage = () => {
  const event = useEvent();

  const contactLinks = [
    { href: event.contact?.facebook, icon: ExternalLink, text: "Událost na facebooku" },
    { href: event.contact?.larpovadatabaze, icon: CalendarDays, text: "Larpová Databáze" },
    { href: event.contact?.larpcz, icon: Calendar, text: "LARP.cz" },
    { href: event.contact?.email ? `mailto:${event.contact.email}` : undefined, icon: Mail, text: "E-mail organizátorům" },
  ];

  return (
    <>
      <Banner title="Kontakt a tým" />
      <Article>
        <ArticleCardHeader height={600} image={event.contactImage?.src} />
        <div className="p-6">
          <div className="mx-auto max-w-3xl my-4">
            <Markdown content={event.contactText} />
          </div>
          <hr className="border-white/10" />
          <div className="mx-auto max-w-3xl mt-4">
            <h3 className="mb-4 text-xl font-bold">
              Kontakty a odkazy pro současný ročník
            </h3>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {contactLinks.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.text}
                    href={c.href || "#"}
                    target="_blank"
                    rel="external"
                    className={`inline-flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm transition-colors hover:bg-white/10 ${
                      !c.href ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    <Icon size={16} />
                    {c.text}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Article>
    </>
  );
};

export default ContactsPage;
