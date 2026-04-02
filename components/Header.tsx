"use client";

import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import type { NavItem } from "@/lib/navigation";

interface HeaderProps {
  navigation: NavItem[];
  banner?: string;
}

export function Header({ navigation, banner }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = useCallback(() => setDrawerOpen(true), []);
  const handleClose = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-primary lg:hidden">
        {banner && (
          <div className="bg-secondary-dark px-4 py-1 text-center text-sm text-white truncate">
            {banner}
          </div>
        )}
        <div className="flex h-14 items-center px-2">
          <button
            onClick={handleOpen}
            className="rounded-full p-2 text-white hover:bg-white/10"
            aria-label="Otevřít menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Desktop banner */}
      {banner && (
        <div className="fixed top-0 left-72 right-0 z-40 hidden bg-secondary-dark px-4 py-1 text-center text-sm text-white truncate lg:block">
          {banner}
        </div>
      )}

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white transition-transform duration-300 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavigationDrawer
          navigation={navigation}
          onClose={handleClose}
          showCloseButton
        />
      </div>

      {/* Desktop permanent drawer */}
      <nav
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:bg-primary lg:text-white"
      >
        <NavigationDrawer navigation={navigation} />
      </nav>
    </>
  );
}
