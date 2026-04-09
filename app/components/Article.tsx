import { ArticleCardHeader } from "@/components/ArticleCardHeader";

interface ArticleProps {
  children?: React.ReactNode;
}

export const Article = ({ children }: ArticleProps) => {
  return (
    <div className="mx-auto max-w-5xl px-0 sm:px-4">
      <div className="overflow-hidden rounded-none bg-primary-light text-primary shadow-lg sm:rounded-lg">
        {children ?? (
          <>
            <ArticleCardHeader />
            <div className="p-6">
              <div className="h-4 w-3/4 animate-pulse rounded bg-grey-500/20" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
