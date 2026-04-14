import { useMemo } from "react";
import { useParams } from "react-router";
import { doc } from "firebase/firestore";
import { useDocumentData } from "@/lib/firestore-hooks";
import { typedCollection } from "@/lib/firebase";
import type { Event } from "@/lib/types";
import { EventProvider } from "@/contexts/EventContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTop } from "@/components/ScrollTop";
import { Loading } from "@/components/Loading";
import { getNavigation } from "@/lib/navigation";

export const EventShell = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams();

  const [event, loading] = useDocumentData(
    doc(typedCollection<Event>("events"), eventId!),
  );

  const navigation = useMemo(
    () => (event ? getNavigation(event) : []),
    [event],
  );

  const isDev = import.meta.env.VITE_DEV_MODE === "true";

  if (!event) {
    if (!loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-grey-400 text-lg">Událost nenalezena.</p>
        </div>
      );
    }

    return (
      <>
        {/* Minimal header shell during loading — no NavigationDrawer (needs EventContext) */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-primary lg:hidden">
          {isDev && (
            <div className="bg-secondary-dark px-4 py-1 text-center text-sm text-white truncate">
              DEVELOPMENT
            </div>
          )}
          <div className="flex h-14 items-center px-2" />
        </header>
        {isDev && (
          <div className="fixed top-0 left-72 right-0 z-40 hidden bg-secondary-dark px-4 py-1 text-center text-sm text-white truncate lg:block">
            DEVELOPMENT
          </div>
        )}
        <nav className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:bg-primary lg:text-white" />
        <div className="flex flex-col pt-14 lg:ml-72 lg:pt-0">
          <div id="top" />
          <main className="flex-1 px-4 pt-2 sm:pt-5 min-h-screen">
            <Loading />
          </main>
          <Footer />
        </div>
      </>
    );
  }

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
