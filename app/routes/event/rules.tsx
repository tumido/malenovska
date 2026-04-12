import { useMemo } from "react";
import { useEvent } from "@/contexts/EventContext";
import { Logo } from "@/components/Logo";
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

  const splitAt = event.name.indexOf("o");

  return (
    <>
      {/* Hero with rules image background */}
      <section
        className="relative -mx-4 -mt-2 flex min-h-[40vh] items-center justify-center bg-primary bg-cover bg-center sm:-mt-5 lg:min-h-[50vh] xl:min-h-[60vh]"
        style={{
          backgroundImage: event.rulesImage?.src
            ? `url(${event.rulesImage.src})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative flex w-full justify-center px-6">
          <div>
            <p className="-mb-2 font-display text-3xl font-semibold text-white/80 md:text-6xl">
              Pravidla
            </p>
            <h1 className="font-display text-5xl font-semibold text-white md:text-8xl">
              {event.name.slice(0, splitAt)}
              <Logo size="0.55em" />
              {event.name.slice(splitAt + 1)}
            </h1>
          </div>
        </div>
      </section>

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
