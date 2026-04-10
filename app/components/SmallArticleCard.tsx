import { memo } from "react";
import { Link } from "react-router";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import type { FirestoreImage } from "@/lib/types";

interface SmallArticleCardProps {
  title?: React.ReactNode;
  body?: string;
  image?: FirestoreImage;
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const SmallArticleCard = memo(function SmallArticleCard({
  title,
  body,
  image,
  href,
  selected,
  disabled,
  onClick,
}: SmallArticleCardProps) {
  const cardContent = (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl ${
        selected ? "ring-2 ring-secondary shadow-xl" : ""
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <ArticleCardHeader
        height={300}
        titleVariant="small"
        image={image?.src}
        title={title}
      />
      {body && (
        <div className="flex-1 bg-primary-light p-4">
          <p className="text-sm text-primary">{body}</p>
        </div>
      )}
      {(!title || !image) && (
        <div className="bg-primary-light p-4">
          <div className="mb-2 h-6 w-48 animate-pulse rounded bg-grey-500/20" />
          <div className="space-y-1">
            <div className="h-4 w-full animate-pulse rounded bg-grey-500/20" />
            <div className="h-4 w-full animate-pulse rounded bg-grey-500/20" />
            <div className="h-4 w-8 animate-pulse rounded bg-grey-500/20" />
          </div>
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="h-full w-full cursor-pointer text-left"
      >
        {cardContent}
      </button>
    );
  }

  if (href) {
    return <Link to={href}>{cardContent}</Link>;
  }

  return cardContent;
});
