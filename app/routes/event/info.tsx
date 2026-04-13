import { useState } from "react";
import { MapPin, ExternalLink, FileText, Wallet, CalendarDays } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Map } from "@/components/Map";
import { timestampToDateStr, toTimeStr } from "@/lib/date";

const MARKER_COLORS = ["bg-loading-red", "bg-loading-yellow", "bg-loading-orange"];

const InfoPage = () => {
  const event = useEvent();
  const [center, setCenter] = useState<[number, number] | undefined>();
  const [activePoi, setActivePoi] = useState<number | null>(null);

  const timelineItems = [
    { label: "Začátek akce", time: event.onsiteStart ? toTimeStr(event.onsiteStart) : undefined },
    { label: "Otevření registrace", time: event.onsiteRegistrationOpen ? toTimeStr(event.onsiteRegistrationOpen) : undefined },
    { label: "Uzavření registrace", time: event.onsiteRegistrationClose ? toTimeStr(event.onsiteRegistrationClose) : undefined },
    { label: "Konec akce", time: event.onsiteEnd ? toTimeStr(event.onsiteEnd) : undefined },
  ].filter((item) => item.time);

  const handlePoiClick = (index: number, lat: number, lng: number) => {
    setActivePoi(index);
    setCenter([lat, lng]);
  };

  return (
    <>
      <PageHero title="To důležité" compact />
      <div className="-mx-4 bg-black/80 px-4 pt-8 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Info cards row */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left column: Price + Declaration stacked */}
          <div className="flex flex-col gap-4">
            {/* Price card */}
            <div className="flex flex-1 items-center gap-4 rounded-lg bg-primary-light px-4 py-3 shadow-lg">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                <Wallet size={22} className="text-secondary" />
              </div>
              <div>
                <div className="text-xs text-primary/60">Registrační poplatek</div>
                <div className="font-display text-3xl font-bold text-primary">
                  {event.price}
                  <span className="ml-1 text-base text-primary/60">Kč</span>
                </div>
              </div>
            </div>

            {/* Declaration card */}
            {event.declaration && (
              <a
                href={event.declaration.src}
                target="_blank"
                rel="external"
                className="group flex flex-1 items-center gap-4 rounded-lg bg-primary-light px-4 py-3 shadow-lg transition-colors hover:bg-grey-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                  <FileText size={22} className="text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-primary/60">Ke stažení</div>
                  <div className="font-display text-lg font-bold text-primary">
                    Potvrzení pro mladší 18 let
                  </div>
                </div>
              </a>
            )}
          </div>

          {/* Right column: Date + vertical timeline */}
          <div className="rounded-lg bg-primary-light shadow-lg">
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                <CalendarDays size={22} className="text-secondary" />
                {timelineItems.length > 0 && (
                  <div className="absolute top-full h-[2.3125rem] w-px bg-primary/20" />
                )}
              </div>
              <div>
                <div className="text-xs text-primary/60">Datum konání</div>
                <div className="font-display text-3xl font-bold text-primary">
                  {timestampToDateStr(event.date)}
                </div>
              </div>
            </div>
            {timelineItems.length > 0 && (
              <div className="pb-4 pl-[calc(1rem+1.25rem-0.375rem)] pr-4 pt-2">
                <div className="space-y-3">
                  {timelineItems.map((item, i) => (
                    <div key={i} className="flex items-baseline">
                      <div className="relative flex w-3 shrink-0 items-center justify-center">
                        {i < timelineItems.length - 1 && (
                          <div className="absolute top-0 h-[calc(100%+0.75rem+100%)] w-px bg-primary/20" />
                        )}
                        <div className={`relative z-10 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-secondary" : "border-2 border-secondary bg-primary-light"}`} />
                      </div>
                      <span className="ml-[1.875rem] w-12 shrink-0 font-display text-sm leading-none font-bold text-primary">{item.time}</span>
                      <span className="ml-3 text-sm leading-none text-primary/60">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map section */}
        {event.poi && event.poi.length > 0 && (
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            {/* Map */}
            <div className="relative z-0">
              <Map markers={event.poi} center={center} />
            </div>

            {/* Floating POI pills */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-2 p-4">
              <div className="pointer-events-auto flex flex-wrap justify-center gap-2">
                {event.poi.map((poi, index) => (
                  <button
                    key={index}
                    onClick={() => handlePoiClick(index, poi.latitude, poi.longitude)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shadow-md backdrop-blur-sm transition-all ${activePoi === index ? "bg-secondary/90 text-white ring-1 ring-secondary" : "bg-primary/80 text-grey-300 hover:bg-primary/90 hover:text-white"}`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${!poi.color ? MARKER_COLORS[index % 3] : ""}`}
                      style={poi.color ? { backgroundColor: poi.color } : undefined}
                    />
                    {poi.name}
                    <a
                      href={`https://www.mapy.cz/#z=16@mm=T@st=s@ssq=loc:${poi.latitude}N ${poi.longitude}E`}
                      target="_blank"
                      rel="external"
                      className="ml-1 text-grey-400 transition-colors hover:text-secondary"
                      title="Otevřít v Mapy.cz"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </button>
                ))}
              </div>
              {activePoi !== null && event.poi[activePoi]?.description && (
                <div className="pointer-events-auto rounded-full bg-primary/80 px-4 py-1.5 text-sm text-grey-300 shadow-md backdrop-blur-sm">
                  <MapPin size={14} className="mr-1 inline" style={{ color: event.poi[activePoi].color }} />
                  {event.poi[activePoi].description}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default InfoPage;
