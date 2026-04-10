import { useState } from "react";
import { MapPin, ExternalLink, FileText } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";
import { Banner } from "@/components/Banner";
import { Map } from "@/components/Map";
import { timestampToDateStr, toTimeStr } from "@/lib/date";

const MARKER_COLORS = ["text-loading-red", "text-loading-yellow", "text-loading-orange"];

const InfoPage = () => {
  const event = useEvent();
  const [center, setCenter] = useState<[number, number] | undefined>();

  const timesToRender = [
    ["Datum akce", timestampToDateStr(event.date)],
    ["Začátek akce", event.onsiteStart ? toTimeStr(event.onsiteStart) : undefined],
    ["Otevření registrace", event.onsiteRegistrationOpen ? toTimeStr(event.onsiteRegistrationOpen) : undefined],
    ["Uzavření registrace", event.onsiteRegistrationClose ? toTimeStr(event.onsiteRegistrationClose) : undefined],
    ["Konec akce", event.onsiteEnd ? toTimeStr(event.onsiteEnd) : undefined],
  ];

  return (
    <>
      <Banner title="To důležité" />
      <div className="mx-auto max-w-7xl px-0 sm:px-5">
        <div className="overflow-hidden rounded-lg bg-primary shadow-lg">
          <div className="flex flex-col lg:flex-row">
            <div className="p-4 sm:px-6 lg:w-1/4">
              <h3 className="mb-3 mt-4 text-lg font-bold">K registraci</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-2">Registrační poplatek</td>
                    <td className="py-2 text-right">{event.price} Kč</td>
                  </tr>
                  {event.declaration && (
                    <tr className="border-b border-white/10">
                      <td className="py-2">Potvrzení pro mladší 18 let</td>
                      <td className="py-2 text-right">
                        <a href={event.declaration.src} target="_blank" rel="external" className="text-secondary hover:text-secondary-dark">
                          <FileText size={20} className="inline" />
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h3 className="mb-3 mt-6 text-lg font-bold">Do kalendáře</h3>
              <table className="w-full text-sm">
                <tbody>
                  {timesToRender.map(([label, value], i) => (
                    <tr key={i} className="border-b border-white/10">
                      <td className="py-2">{label}</td>
                      <td className="py-2 text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="mb-3 mt-6 text-lg font-bold">Do navigace</h3>
              <table className="w-full text-sm">
                <tbody>
                  {event.poi?.map((row, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer border-b border-white/10 hover:bg-white/5"
                      onClick={() => setCenter([row.latitude, row.longitude])}
                    >
                      <td className="w-6 py-2">
                        {row.color ? (
                          <MapPin size={18} style={{ color: row.color }} />
                        ) : (
                          <MapPin size={18} className={MARKER_COLORS[index % 3]} />
                        )}
                      </td>
                      <td className="py-2">
                        <span className="block truncate">{row.name}</span>
                        <span className="block truncate text-grey-400">{row.description}</span>
                      </td>
                      <td className="w-20 py-2 text-right">
                        <a
                          href={`https://www.mapy.cz/#z=16@mm=T@st=s@ssq=loc:${row.latitude}N ${row.longitude}E`}
                          target="_blank"
                          rel="external"
                          className="inline-block p-1 text-grey-400 hover:text-white"
                          title="Otevřít v Mapy.cz"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:w-3/4">
              {event.poi && event.poi.length > 0 && (
                <Map markers={event.poi} center={center} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
