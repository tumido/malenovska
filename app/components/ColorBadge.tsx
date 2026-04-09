interface ColorBadgeProps {
  color?: string;
  colorName?: string;
}

const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export const ColorBadge = ({ color, colorName }: ColorBadgeProps) => {
  if (!color) return null;

  return (
    <span
      className="ml-2 inline-block rounded-full px-3 py-1 text-sm font-medium shadow-md first-letter:capitalize"
      style={{ backgroundColor: color, color: getContrastColor(color) }}
    >
      {colorName}
    </span>
  );
};
