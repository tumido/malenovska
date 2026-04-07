"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  ScrollText,
  Users,
  UserCheck,
  Image,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Události", icon: CalendarDays },
  { href: "/admin/legends", label: "Legendy", icon: ScrollText },
  { href: "/admin/races", label: "Strany", icon: Users },
  { href: "/admin/participants", label: "Účastníci", icon: UserCheck },
  { href: "/admin/galleries", label: "Galerie", icon: Image },
  { href: "/admin/config", label: "Nastavení", icon: Settings },
];

const AdminShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin")
      return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-primary text-primary-light">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile slide-over drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary-dark text-white transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center px-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-2 text-white hover:bg-white/10"
            aria-label="Zavřít menu"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
          <ul className="py-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
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

        <div className="border-t border-white/20 p-4" onClick={() => setSidebarOpen(false)}>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-6 px-5 py-5 text-white hover:text-secondary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Desktop permanent drawer */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:bg-primary-dark lg:text-white">
        <div className="h-14" />

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
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
        <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-4 bg-primary px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-full p-2 text-white hover:bg-white/10" aria-label="Otevřít menu">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-primary-light">
            {navItems.find((n) => isActive(n.href))?.label ?? "Admin"}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pt-18 lg:p-6 lg:pt-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
