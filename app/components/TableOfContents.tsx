import { useState, useEffect } from "react";
import { slugify } from "@/components/Markdown";

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export const parseHeadings = (markdown: string): Heading[] =>
  markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2]
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/[*_`~[\]]/g, "")
        .trim();
      return { level, text, slug: slugify(text) };
    })
    .filter((h): h is Heading => h !== null);

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = "";
        for (const h of headings) {
          const el = document.getElementById(h.slug);
          if (!el) continue;
          if (!current) current = h.slug;
          if (el.getBoundingClientRect().top <= 100) {
            current = h.slug;
          } else {
            break;
          }
        }
        setActiveSlug(current);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Delay initial call to let lazy-loaded Markdown render and set heading IDs
    const timeout = setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav aria-label="Obsah">
      <h2 className="mb-3 text-sm font-bold font-display uppercase tracking-wider text-primary">
        Obsah
      </h2>
      <ul className="space-y-1 border-l-2 border-gray-200">
        {headings.map((heading) => {
          const indent = heading.level - minLevel;
          const isActive = activeSlug === heading.slug;

          return (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                className={`block py-1 text-sm transition-colors ${
                  indent === 0
                    ? "pl-3"
                    : indent === 1
                      ? "pl-5"
                      : "pl-7"
                } ${
                  isActive
                    ? "-ml-[2px] border-l-2 border-secondary font-medium text-secondary"
                    : "text-gray-500 hover:text-primary"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.slug)
                    ?.scrollIntoView({ behavior: "smooth" });
                  history.replaceState(null, "", `#${heading.slug}`);
                }}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
