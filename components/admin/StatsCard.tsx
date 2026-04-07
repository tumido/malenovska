"use client";

import Link from "next/link";

interface StatsCardAction {
  href: string;
  icon: React.ReactNode;
  title: string;
}

interface StatsCardProps {
  label: string;
  value: number | string | null;
  href?: string;
  loading?: boolean;
  actions?: StatsCardAction[];
  className?: string;
}

const StatsCard = ({ label, value, href, loading, actions, className }: StatsCardProps) => {
  return (
    <div className={`rounded-lg border border-gray-700 bg-neutral-800 p-4 shadow-sm ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-1">
            {actions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                title={action.title}
                className="rounded p-1 text-gray-500 hover:bg-gray-700 hover:text-secondary transition-colors"
              >
                {action.icon}
              </Link>
            ))}
          </div>
        )}
      </div>
      {loading ? (
        <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-700" />
      ) : href ? (
        <Link href={href} className="mt-1 block text-2xl font-bold text-primary-light hover:text-secondary transition-colors">
          {value ?? "–"}
        </Link>
      ) : (
        <p className="mt-1 text-2xl font-bold text-primary-light">{value ?? "–"}</p>
      )}
    </div>
  );
};

export default StatsCard;
