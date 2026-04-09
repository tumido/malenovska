import { lazy, Suspense } from "react";

const BaseMarkdown = lazy(() => import("markdown-to-jsx"));

interface MarkdownProps {
  content?: string;
}

export const Markdown = ({ content = "" }: MarkdownProps) => {
  return (
    <div className="prose-malenovska">
      <Suspense fallback={null}>
        <BaseMarkdown options={{ forceBlock: true }}>{content || ""}</BaseMarkdown>
      </Suspense>
    </div>
  );
};
