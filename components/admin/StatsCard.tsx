"use client";

import Link from "next/link";

interface StatsCardProps {
  label: string;
  value: number | string | null;
  href?: string;
  loading?: boolean;
}

const StatsCard = ({ label, value, href, loading }: StatsCardProps) => {
  const content = (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {loading ? (
        <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-gray-900">{value ?? "–"}</p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
};

export default StatsCard;
