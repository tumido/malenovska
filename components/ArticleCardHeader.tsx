interface ArticleCardHeaderProps {
  image?: string;
  title?: React.ReactNode;
  height?: number;
  titleVariant?: "large" | "small";
}

function getThumbnailUrl(image: string, height?: number): string {
  try {
    const url = new URL(image);
    const delim = url.pathname.lastIndexOf(".");
    const suffix = height && height < 400 ? "_650x650" : "_1200x1200";
    url.pathname = url.pathname.slice(0, delim) + suffix + url.pathname.slice(delim);
    return url.toString();
  } catch {
    return image;
  }
}

export function ArticleCardHeader({
  image,
  title,
  height = 400,
  titleVariant = "large",
}: ArticleCardHeaderProps) {
  const titleClass = titleVariant === "small" ? "text-xl" : "text-2xl md:text-3xl";

  return (
    <div className="relative" style={{ height }}>
      {image ? (
        <img
          src={getThumbnailUrl(image, height)}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = image;
          }}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-grey-500/20" />
      )}
      {title && (
        <div className="absolute bottom-0 w-full bg-black/30 px-4 py-3 pt-4 text-white backdrop-blur-sm">
          <h2 className={`font-display font-bold ${titleClass}`}>{title}</h2>
        </div>
      )}
    </div>
  );
}
