import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  CalendarDays,
  ScrollText,
  Users,
  UserCheck,
  Image,
  Settings,
  LogOut,
  Ellipsis,
} from "lucide-react";

const allNavItems: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
}> = [
  { href: "/admin", label: "Přehled", icon: LayoutDashboard },
  {
    href: "/admin/events",
    label: "Události",
    icon: CalendarDays,
    roles: ["admin"],
  },
  {
    href: "/admin/legends",
    label: "Legendy",
    icon: ScrollText,
    roles: ["admin", "writer"],
  },
  { href: "/admin/races", label: "Strany", icon: Users, roles: ["admin"] },
  {
    href: "/admin/participants",
    label: "Účastníci",
    icon: UserCheck,
    roles: ["admin", "staff"],
  },
  { href: "/admin/galleries", label: "Galerie", icon: Image, roles: ["admin"] },
  {
    href: "/admin/config",
    label: "Nastavení",
    icon: Settings,
    roles: ["admin"],
  },
];

const MAX_BOTTOM_ITEMS = 4;

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const { signOut, role } = useAuth();

  const navItems = allNavItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  );

  // Close overflow menu on navigation
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const bottomItems = navItems.slice(0, MAX_BOTTOM_ITEMS);
  const overflowItems = navItems.slice(MAX_BOTTOM_ITEMS);
  const hasOverflow = overflowItems.length > 0;

  return (
    <div className="flex h-screen bg-primary text-primary-light">
      {/* Desktop permanent drawer */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:bg-primary-dark lg:text-white">
        <div className="h-14" />

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={`flex items-center gap-6 px-5 py-5 transition-colors hover:border-l-secondary border-l-2 ${
                    isActive(href)
                      ? "text-secondary border-l-secondary"
                      : "text-white border-l-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/20 p-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-6 px-5 py-5 text-white hover:text-secondary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-72">
        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6">
          {children}
        </main>

        {/* Mobile bottom app bar */}
        <nav
          className={`fixed bottom-0 left-0 right-0 rounded-t-2xl bg-primary-dark pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.4)] lg:hidden ${moreOpen ? "z-[60]" : "z-40"}`}
        >
          <div className="flex items-stretch justify-around px-2 pt-3 pb-2">
            {bottomItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex flex-1 flex-col items-center gap-1 py-1 text-[0.625rem] transition-colors ${
                    active ? "text-secondary" : "text-grey-400"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full px-5 py-1 transition-colors ${
                      active ? "bg-secondary/15" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`truncate ${active ? "font-bold" : ""}`}>
                    {label}
                  </span>
                </Link>
              );
            })}

            {hasOverflow ? (
              <div className="relative flex flex-1">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className={`flex flex-1 flex-col items-center gap-1 py-1 text-[0.625rem] transition-colors ${
                    moreOpen || overflowItems.some((i) => isActive(i.href))
                      ? "text-secondary"
                      : "text-grey-400"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center rounded-full px-5 py-1 transition-colors ${
                      moreOpen || overflowItems.some((i) => isActive(i.href))
                        ? "bg-secondary/15"
                        : ""
                    }`}
                  >
                    <Ellipsis className="h-5 w-5" />
                  </span>
                  <span
                    className={
                      moreOpen || overflowItems.some((i) => isActive(i.href))
                        ? "font-bold"
                        : ""
                    }
                  >
                    Více
                  </span>
                </button>

                {moreOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[60]"
                      onClick={() => setMoreOpen(false)}
                    />
                    <div className="absolute bottom-full right-0 z-[70] mb-2 mr-1 min-w-48 rounded-lg border border-white/10 bg-primary-dark py-1 shadow-xl">
                      {overflowItems.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          to={href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive(href)
                              ? "text-secondary"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {label}
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-white/20 pt-1">
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
                        >
                          <LogOut className="h-5 w-5 shrink-0" />
                          Odhlásit se
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={signOut}
                className="flex flex-1 flex-col items-center gap-1 py-1 text-[0.625rem] text-grey-400 transition-colors"
              >
                <span className="flex items-center justify-center rounded-full px-5 py-1">
                  <LogOut className="h-5 w-5" />
                </span>
                <span>Odhlásit</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminShell;
