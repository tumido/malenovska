import { lazy, Suspense, useCallback, type ReactNode } from "react";

const BaseMarkdown = lazy(() => import("markdown-to-jsx"));

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const HeadingWithId = ({
  as: Tag,
  children,
  ...props
}: {
  as: "h1" | "h2" | "h3";
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const ref = useCallback((node: HTMLHeadingElement | null) => {
    if (node?.textContent) {
      node.id = slugify(node.textContent);
    }
  }, []);

  return (
    <Tag ref={ref} className="scroll-mt-20" {...props}>
      {children}
    </Tag>
  );
};

const headingOverrides = {
  h1: { component: HeadingWithId, props: { as: "h1" } },
  h2: { component: HeadingWithId, props: { as: "h2" } },
  h3: { component: HeadingWithId, props: { as: "h3" } },
};

interface MarkdownProps {
  content?: string;
}

export const Markdown = ({ content = "" }: MarkdownProps) => {
  return (
    <div className="prose-malenovska">
      <Suspense fallback={null}>
        <BaseMarkdown
          options={{ forceBlock: true, overrides: headingOverrides }}
        >
          {content || ""}
        </BaseMarkdown>
      </Suspense>
    </div>
  );
};
