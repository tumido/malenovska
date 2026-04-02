import { EventShell } from "@/components/EventShell";

export function generateStaticParams() {
  return [{ eventId: "_" }];
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EventShell>{children}</EventShell>;
}
