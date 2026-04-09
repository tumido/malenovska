import { Link, useLocation } from "react-router";
import { ChevronLeft, LayoutDashboard } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import type { NavItem } from "@/lib/navigation";

interface NavigationDrawerProps {
  navigation: NavItem[];
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const NavigationDrawer = ({
  navigation,
  onClose,
  showCloseButton,
}: NavigationDrawerProps) => {
  const event = useEvent();
  const { pathname } = useLocation();

  const isActive = (item: NavItem) => {
    if (!item.path) return false;
    const fullPath = `/${event.id}/${item.path}`;
    if (pathname.startsWith(fullPath)) return true;
    return item.owns?.some((p) => pathname.startsWith(p)) ?? false;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-2">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/10"
            aria-label="Zavřít menu"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto" onClick={onClose}>
        <ul className="py-2">
          {navigation.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <li
                  key={`divider_${idx}`}
                  className="my-5 border-t border-white/20"
                />
              );
            }
            if (item.type !== "visible") return null;

            const active = isActive(item);
            const disabled = !item.path || item.disabled;
            const Icon = item.icon;

            return (
              <li key={item.path || `item_${idx}`}>
                {disabled ? (
                  <span className="flex items-center gap-6 px-5 py-5 text-grey-500 cursor-not-allowed  border-l-2 border-l-transparent">
                    {Icon && <Icon size={20} />}
                    <span>{item.title}</span>
                  </span>
                ) : (
                  <Link
                    to={`/${event.id}/${item.path}`}
                    className={`flex items-center gap-6 px-5 py-5 transition-colors hover:border-l-secondary border-l-2 ${
                      active
                        ? " text-secondary border-l-secondary"
                        : "text-white border-l-transparent"
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link
              to="/choose"
              className="flex items-center gap-6 px-5 py-5 text-white transition-colors border-l-2 border-l-transparent hover:border-l-secondary"
            >
              <LayoutDashboard size={20} />
              <div>
                <span className="block">Další ročníky</span>
                <span className="block text-sm text-grey-500">
                  Právě prohlížíte:
                </span>
                <span className="text-sm text-grey-500">
                  {event.name} {event.year}
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-white/20" onClick={onClose}></div>
    </div>
  );
};
