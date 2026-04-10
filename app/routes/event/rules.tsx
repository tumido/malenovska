import { useMemo } from "react";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Article } from "@/components/Article";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
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
      <Banner title="Pravidla" />
      <Article>
        <ArticleCardHeader image={event.rulesImage?.src} />
        <div className="p-6">
          {headings.length > 0 && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4 lg:hidden">
              <TableOfContents headings={headings} />
            </div>
          )}
          <div className="flex gap-8">
            <div className="mt-4 min-w-0 max-w-3xl flex-1">
              <Markdown content={event.rules} />
            </div>
            {headings.length > 0 && (
              <div className="hidden w-52 shrink-0 lg:block">
                <div className="sticky top-20 mt-4">
                  <TableOfContents headings={headings} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Article>
    </>
  );
};

export default RulesPage;
