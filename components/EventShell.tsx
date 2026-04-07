"use client";

import { useParams } from "next/navigation";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import type { Event } from "@/lib/types";
import { EventProvider } from "@/contexts/EventContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";
import { Loading } from "@/components/Loading";
import { getNavigation } from "@/lib/navigation";

export const EventShell = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams<{ eventId: string }>();

  const [events, loading] = useCollectionData(
    query(typedCollection<Event>("events"), where("id", "==", eventId)),
  );

  const event = events?.[0];

  if (loading) return <Loading />;

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-grey-400 text-lg">Událost nenalezena.</p>
      </div>
    );
  }

  const navigation = getNavigation(event);
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  return (
    <EventProvider event={event}>
      <Header
        navigation={navigation}
        banner={isDev ? "DEVELOPMENT" : undefined}
      />
      <div className="flex flex-col pt-14 lg:ml-72 lg:pt-0">
        <div id="top" />
        <main className="flex-1 px-4 pt-2 sm:pt-5 min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
      <ScrollTop />
    </EventProvider>
  );
};
