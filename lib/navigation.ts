import type { Event } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  ScrollText,
  Gavel,
  Globe,
  Users,
  MapPin,
  Mail,
  Image,
  UserPlus,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";

export type NavItemType = "visible" | "hidden" | "divider";

export interface NavItem {
  type: NavItemType;
  title?: string;
  icon?: LucideIcon;
  path?: string;
  owns?: string[];
  disabled?: boolean;
}

export const getNavigation = (event: Event): NavItem[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(23, 59, 0, 0);
  const eventInFuture = event.date.toDate() > yesterday;

  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  return [
    {
      type: "visible",
      title: "Legendy a příběhy",
      icon: ScrollText,
      path: "legends",
      owns: [`/${event.id}/legend`],
    },
    {
      type: "hidden",
      path: "legend",
    },
    {
      type: "visible",
      title: "Pravidla",
      icon: Gavel,
      path: "rules",
    },
    {
      type: "visible",
      title: "Svět",
      icon: Globe,
      disabled: true,
    },
    {
      type: "visible",
      title: "Bojující strany",
      icon: Users,
      path: "races",
      owns: [`/${event.id}/race`],
    },
    {
      type: "hidden",
      path: "race",
    },
    {
      type: "visible",
      title: "Důležité informace",
      icon: MapPin,
      path: "info",
    },
    {
      type: "visible",
      title: "Kontakty",
      icon: Mail,
      path: "contacts",
    },
    {
      type: "visible",
      title: "Galerie",
      icon: Image,
      path: "gallery",
      disabled: eventInFuture,
    },
    {
      type: "divider",
    },
    {
      type: "visible",
      title: "Nová registrace",
      icon: UserPlus,
      path: "signup",
      disabled: isDev ? false : !eventInFuture || !event.registrationAvailable,
    },
    {
      type: "visible",
      title: "Účastníci",
      icon: UserCheck,
      path: "attendees",
      disabled: isDev ? false : !eventInFuture,
    },
    {
      type: "hidden",
      path: "confirmation",
    },
  ];
};

export { LayoutDashboard };
