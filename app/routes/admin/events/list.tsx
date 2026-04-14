import { AdminListPage } from "@/components/admin/AdminListPage";
import type { Event } from "@/lib/types";
import { Check, X } from "lucide-react";

const columns = [
  { key: "name", label: "Název", sortable: true },
  { key: "year", label: "Rok", sortable: true },
  {
    key: "type",
    label: "Typ",
    render: (e: Event) => (e.type ? "Bitva" : "Šarvátka"),
  },
  {
    key: "display",
    label: "Zobrazena",
    render: (e: Event) =>
      e.display ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
  {
    key: "registrationAvailable",
    label: "Registrace",
    render: (e: Event) =>
      e.registrationAvailable ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      ),
  },
];

const EventsListPage = () => (
  <AdminListPage<Event>
    collection="events"
    columns={columns}
    orderByField="year"
    orderByDirection="desc"
    searchField="name"
    searchPlaceholder="Hledat událost…"
    newPath="/admin/events/new"
    newLabel="Nová událost"
    useFilter={false}
    confirmMessage={(e) => `Opravdu smazat událost "${e.name}"?`}
  />
);

export default EventsListPage;
