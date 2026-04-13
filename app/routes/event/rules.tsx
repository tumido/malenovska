import { useMemo } from "react";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Markdown } from "@/components/Markdown";
import {
  TableOfContents,
  parseHeadings,
} from "@/components/TableOfContents";

const RulesPage = () => {
  const event = useEvent();
  const headings = useMemo(
    () => parseHeadings(event.rules || ""),
    [event.rules],
  );

  return (
    <>
      <PageHero title="Pravidla" image={event.rulesImage?.src} />

      {/* Full-width content */}
      <section className="-mx-4 bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="flex gap-10 lg:gap-14">
            <div className="min-w-0 max-w-3xl flex-1">
              <Markdown content={event.rules} />
            </div>
            {headings.length > 0 && (
              <aside className="hidden w-56 shrink-0 lg:block">
                <div className="sticky top-6">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default RulesPage;
