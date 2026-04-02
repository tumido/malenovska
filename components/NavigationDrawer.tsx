"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LayoutDashboard } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import type { NavItem } from "@/lib/navigation";

interface NavigationDrawerProps {
  navigation: NavItem[];
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function NavigationDrawer({
  navigation,
  onClose,
  showCloseButton,
}: NavigationDrawerProps) {
  const event = useEvent();
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (!item.path) return false;
    const fullPath = `/${event.id}/${item.path}`;
    if (pathname.startsWith(fullPath)) return true;
    return item.owns?.some((p) => pathname.startsWith(p)) ?? false;
  };

  return (
    <div className="flex h-full flex-col">
      {showCloseButton && (
        <div className="flex h-14 items-center px-2">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/10"
            aria-label="Zavřít menu"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto" onClick={onClose}>
        <ul className="py-2">
          {navigation.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <li key={`divider_${idx}`} className="my-5 border-t border-white/20" />
              );
            }
            if (item.type !== "visible") return null;

            const active = isActive(item);
            const disabled = !item.path || item.disabled;
            const Icon = item.icon;

            return (
              <li key={item.path || `item_${idx}`}>
                {disabled ? (
                  <span className="flex items-center gap-4 px-4 py-3 text-grey-500 cursor-not-allowed">
                    {Icon && <Icon size={20} />}
                    <span>{item.title}</span>
                  </span>
                ) : (
                  <Link
                    href={`/${event.id}/${item.path}`}
                    className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/10 ${
                      active ? "bg-white/10 text-secondary" : "text-white"
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/20" onClick={onClose}>
        <Link
          href="/choose"
          className="flex items-center gap-4 px-4 py-4 text-white transition-colors hover:bg-white/10"
        >
          <LayoutDashboard size={20} />
          <div>
            <span className="block font-bold">Další ročníky</span>
            <span className="block text-sm text-grey-500">Právě prohlížíte:</span>
            <span className="text-sm text-grey-500">
              {event.name} {event.year}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
