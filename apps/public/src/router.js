import React, { lazy } from "react";

const Gallery = lazy(() => import("./pages/event/gallery"));
const Legends = lazy(() => import("./pages/event/legends"));
const LegendId = lazy(() => import("./pages/event/legend/id"));
const Rules = lazy(() => import("./pages/event/rules"));
const Info = lazy(() => import("./pages/event/info"));
const Contacts = lazy(() => import("./pages/event/contacts"));
const Races = lazy(() => import("./pages/event/races"));
const RaceId = lazy(() => import("./pages/event/race/id"));
const RegistrationNew = lazy(() => import("./pages/event/signup"));
const Attendees = lazy(() => import("./pages/event/attendees"));
const Confirmation = lazy(() => import("./pages/event/confirmation"));

export const useEventRouter = (event) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setUTCHours(23);
  tomorrow.setUTCMinutes(59);
  const eventInFuture = Number(event.date.toDate()) < Number(tomorrow);

  return [
    {
      type: "visible",
      title: "Legendy a příběhy",
      icon: "receipt",
      path: `/${event.id}/legends`,
      owns: [`/${event.id}/legend/`],
      component: Legends,
    },
    {
      type: "hidden",
      path: `/${event.id}/legend/:id`,
      component: LegendId,
    },
    {
      type: "visible",
      title: "Pravidla",
      icon: "gavel",
      path: `/${event.id}/rules`,
      component: Rules,
    },
    {
      type: "visible",
      title: "Svět",
      icon: "map",
    },
    {
      type: "visible",
      title: "Bojující strany",
      icon: "group",
      path: `/${event.id}/races`,
      owns: [`/${event.id}/race/`],
      component: Races,
    },
    {
      path: `/${event.id}/race/:id`,
      component: RaceId,
    },
    {
      type: "visible",
      title: "Důležité informace",
      icon: "location_on",
      path: `/${event.id}/info`,
      component: Info,
    },
    {
      type: "visible",
      title: "Kontakty",
      icon: "mail_outline",
      path: `/${event.id}/contacts`,
      component: Contacts,
    },
    {
      type: "visible",
      title: "Galerie",
      className: "material-icons-outlined",
      icon: "collections_outline",
      path: `/${event.id}/gallery`,
      disabled: eventInFuture,
      component: Gallery,
    },
    {
      type: "divider",
    },
    {
      type: "visible",
      title: "Nová registrace",
      icon: "person_add",
      path: `/${event.id}/signup`,
      disabled:
        (!event.registrationAvailable || eventInFuture) &&
        process.env.NODE_ENV !== "development",
      component: RegistrationNew,
    },
    {
      type: "visible",
      title: "Účastníci",
      icon: "how_to_reg",
      path: `/${event.id}/attendees`,
      disabled: !eventInFuture,
      component: Attendees,
    },
    {
      path: `/${event.id}/confirmation`,
      component: Confirmation,
    },
  ];
};

1636203480000;
1636243164621;
