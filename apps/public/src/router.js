import React, { lazy } from "react";

const Gallery = lazy(() => import("./pages/gallery"));
const Legends = lazy(() => import("./pages/legends"));
const LegendId = lazy(() => import("./pages/legend/id"));
const Rules = lazy(() => import("./pages/rules"));
const Info = lazy(() => import("./pages/info"));
const Contacts = lazy(() => import("./pages/contacts"));
const Races = lazy(() => import("./pages/races"));
const RaceId = lazy(() => import("./pages/race/id"));
const RegistrationNew = lazy(() => import("./pages/registration/new"));
const RegistrationSuccess = lazy(() => import("./pages/registration/success"));
const Attendees = lazy(() => import("./pages/attendees"));

export const useEventRouter = (event) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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
    disabled: event.date.toDate() > tomorrow,
    component: Gallery,
  },
  {
    type: "divider",
  },
  {
    type: "visible",
    title: "Nová registrace",
    icon: "person_add",
    path: `/${event.id}/registration/new`,
    owns: [`/${event.id}/registration/success`],
    disabled:
      !event.registrationAvailable && process.env.NODE_ENV !== "development",
    component: RegistrationNew,
  },
  {
    path: `/${event.id}/registration/success`,
    component: RegistrationSuccess,
  },
  {
    type: "visible",
    title: "Účastníci",
    icon: "how_to_reg",
    path: `/${event.id}/attendees`,
    disabled: event.date.toDate() < tomorrow,
    component: Attendees,
  },
]};
