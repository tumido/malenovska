import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("choose", "routes/choose.tsx"),

  layout("routes/event-layout.tsx", [
    route(":eventId", "routes/event/index.tsx"),
    route(":eventId/legends", "routes/event/legends.tsx"),
    route(":eventId/legend/:id", "routes/event/legend.tsx"),
    route(":eventId/races", "routes/event/races.tsx"),
    route(":eventId/race/:id", "routes/event/race.tsx"),
    route(":eventId/rules", "routes/event/rules.tsx"),
    route(":eventId/info", "routes/event/info.tsx"),
    route(":eventId/contacts", "routes/event/contacts.tsx"),
    route(":eventId/gallery", "routes/event/gallery.tsx"),
    route(":eventId/signup", "routes/event/signup.tsx"),
    route(":eventId/attendees", "routes/event/attendees.tsx"),
    route(":eventId/confirmation", "routes/event/confirmation.tsx"),
  ]),

  layout("routes/admin-layout.tsx", [
    route("admin", "routes/admin/dashboard.tsx"),
    route("admin/config", "routes/admin/config.tsx"),
    route("admin/events", "routes/admin/events/list.tsx"),
    route("admin/events/new", "routes/admin/events/new.tsx"),
    route("admin/events/:id", "routes/admin/events/edit.tsx"),
    route("admin/legends", "routes/admin/legends/list.tsx"),
    route("admin/legends/new", "routes/admin/legends/new.tsx"),
    route("admin/legends/:id", "routes/admin/legends/edit.tsx"),
    route("admin/races", "routes/admin/races/list.tsx"),
    route("admin/races/new", "routes/admin/races/new.tsx"),
    route("admin/races/:id", "routes/admin/races/edit.tsx"),
    route("admin/galleries", "routes/admin/galleries/list.tsx"),
    route("admin/galleries/new", "routes/admin/galleries/new.tsx"),
    route("admin/galleries/:id", "routes/admin/galleries/edit.tsx"),
    route("admin/participants", "routes/admin/participants/list.tsx"),
    route("admin/participants/:id", "routes/admin/participants/edit.tsx"),
  ]),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
