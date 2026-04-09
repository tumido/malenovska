import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Article } from "@/components/Article";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { Markdown } from "@/components/Markdown";

const RulesPage = () => {
  const event = useEvent();

  return (
    <>
      <Banner title="Pravidla" />
      <Article>
        <ArticleCardHeader image={event.rulesImage?.src} />
        <div className="p-6">
          <div className="mx-auto max-w-3xl mt-4">
            <Markdown content={event.rules} />
          </div>
        </div>
      </Article>
    </>
  );
};

export default RulesPage;
