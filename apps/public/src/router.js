import { lazy } from "react";

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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(23);
  yesterday.setUTCMinutes(59);
  const eventInFuture = event.date.toDate() > yesterday; // Should flip day before event

  return [
    {
      type: "visible",
      title: "Legendy a příběhy",
      icon: "receipt",
      path: "legends",
      owns: [`/${event.id}/legend`],
      component: Legends,
    },
    {
      type: "hidden",
      path: "legend/:id",
      component: LegendId,
    },
    {
      type: "visible",
      title: "Pravidla",
      icon: "gavel",
      path: 'rules',
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
      path: `races`,
      owns: [`/${event.id}/race`],
      component: Races,
    },
    {
      path: 'race/:id',
      component: RaceId,
    },
    {
      type: "visible",
      title: "Důležité informace",
      icon: "location_on",
      path: `info`,
      component: Info,
    },
    {
      type: "visible",
      title: "Kontakty",
      icon: "mail_outline",
      path: `contacts`,
      component: Contacts,
    },
    {
      type: "visible",
      title: "Galerie",
      className: "material-icons-outlined",
      icon: "collections_outline",
      path: 'gallery',
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
      path: 'signup',
      disabled:
        process.env.NODE_ENV === "development"
          ? false
          : !eventInFuture || !event.registrationAvailable,
      component: RegistrationNew,
    },
    {
      type: "visible",
      title: "Účastníci",
      icon: "how_to_reg",
      path: `attendees`,
      disabled:
        process.env.NODE_ENV === "development"
          ? false
          : !eventInFuture,
      component: Attendees,
    },
    {
      path: 'confirmation',
      component: Confirmation,
    },
  ];
};
