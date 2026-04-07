"use client";

import Link from "next/link";
import { query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { typedCollection } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { EventAvailabilityChip } from "@/components/EventAvailabilityChip";
import { Markdown } from "@/components/Markdown";
import { EventProvider } from "@/contexts/EventContext";
import type { Event } from "@/lib/types";

const EventItem = ({ event }: { event: Event }) => {
  return (
    <EventProvider event={event}>
      <Link href={`/${event.id}`} className="block w-full">
        <div className="rounded-lg bg-primary p-4 shadow transition-shadow hover:shadow-xl">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{event.name}</h3>
            <EventAvailabilityChip />
          </div>
          <p className="mb-2 text-sm text-grey-400">
            {event.type ? "Bitva, podzim" : "Šarvátka, jaro"} {event.year}
          </p>
          <Markdown content={event.description} />
        </div>
      </Link>
    </EventProvider>
  );
};

const ChoosePage = () => {
  const [events, loading] = useCollectionData(
    query(typedCollection<Event>("events"), where("display", "==", true))
  );

  const today = new Date();
  const thisYear = (events ?? [])
    .filter((e) => e.date?.toDate?.().getFullYear() === today.getFullYear())
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const pastYears = (events ?? [])
    .filter((e) => e.date?.toDate?.().getFullYear() !== today.getFullYear())
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div
      className="flex min-h-screen justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url(/background.webp)" }}
    >
      <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-black/75 p-4 md:w-1/3 lg:w-1/4">
        <p className="mt-8 text-xs uppercase tracking-widest text-grey-500">
          Malenovské události roku {today.getFullYear()}
        </p>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-lg bg-grey-500/20" />
            ))
          : thisYear.map((e) => <EventItem key={e.id} event={e} />)}

        <p className="mt-4 text-xs uppercase tracking-widest text-grey-500">V letech minulých</p>
        {!loading && pastYears.map((e) => <EventItem key={e.id} event={e} />)}
      </div>
      <div className="hidden flex-1 flex-col items-center justify-center text-white md:flex">
        <h1 className="font-display text-8xl font-bold">
          Malen
          <Logo size="5rem" bgColor="#fff" fgColor="#000" />
          vská
        </h1>
        <p className="mt-4">Kdo zvítězí tentokrát? Vyber si tu bitvu, která tě zajímá.</p>
      </div>
    </div>
  );
};

export default ChoosePage;
