import BaseMarkdown from "markdown-to-jsx";

interface MarkdownProps {
  content?: string;
}

export function Markdown({ content = "" }: MarkdownProps) {
  return (
    <div className="prose-malenovska">
      <BaseMarkdown options={{ forceBlock: true }}>{content || ""}</BaseMarkdown>
    </div>
  );
}
