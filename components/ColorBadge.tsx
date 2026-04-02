interface ColorBadgeProps {
  color?: string;
  colorName?: string;
}

export function ColorBadge({ color, colorName }: ColorBadgeProps) {
  if (!color) return null;

  return (
    <span
      className="ml-2 inline-block rounded px-3 py-1 shadow-md"
      style={{ backgroundColor: color }}
    >
      <span
        className="color-badge-text first-letter:capitalize"
        style={{ background: "inherit" }}
      >
        {colorName}
      </span>
    </span>
  );
}
