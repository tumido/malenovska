import { z } from "zod";

const req = { message: "Vyplňte toto pole" };

const firestoreImageRequired = z.object({
  src: z.string().min(1, req),
  title: z.string().optional(),
});

const firestoreImageOptional = z.object({
  src: z.string(),
  title: z.string().optional(),
});

// --- Legend ---

export const legendSchema = z.object({
  title: z.string().min(1, req),
  event: z.string().min(1, req),
  perex: z.string().min(1, req).max(200, { message: "Maximálně 200 znaků" }),
  content: z.string().min(1, req),
  image: firestoreImageRequired,
});

export type LegendFormValues = z.infer<typeof legendSchema>;

// --- Race ---

export const raceSchema = z.object({
  name: z.string().min(1, req),
  event: z.string().min(1, req),
  limit: z.number().min(0),
  priority: z.number().min(0),
  color: z.string().min(1, req),
  colorName: z.string().min(1, req),
  legend: z.string().min(1, req),
  requirements: z.string().min(1, req),
  image: firestoreImageRequired,
});

export type RaceFormValues = z.infer<typeof raceSchema>;

// --- Gallery ---

export const gallerySchema = z.object({
  name: z.string().min(1, req),
  event: z.string().min(1, req),
  author: z.string().min(1, req),
  url: z.string().min(1, req),
  cover: firestoreImageRequired,
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;

// --- Participant ---

export const participantSchema = z.object({
  event: z.string().min(1, req),
  race: z.string().min(1, req),
  firstName: z.string().min(1, req),
  lastName: z.string().min(1, req),
  nickName: z.string().optional(),
  group: z.string().optional(),
  note: z.string().optional(),
});

export type ParticipantFormValues = z.infer<typeof participantSchema> & Record<string, unknown>;

// --- Event ---

const poiSchema = z.object({
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  color: z.string().nullish(),
});

const registrationExtraSchema = z.object({
  type: z.enum(["text", "number", "checkbox", "markdown"]),
  size: z.number().nullish(),
  content: z.string().nullish(),
  props: z
    .object({
      id: z.string().nullish(),
      label: z.string().nullish(),
    })
    .nullish(),
});

export const eventSchema = z.object({
  id: z.string().min(1, req),
  name: z.string().min(1, req),
  year: z.number(),
  date: z.any().refine((v) => v != null, req),
  type: z.boolean(),
  display: z.boolean(),
  description: z.string().max(200, { message: "Maximálně 200 znaků" }).nullish(),
  heroImage: firestoreImageOptional.nullish(),

  // Rules
  rules: z.string().nullish(),
  rulesImage: firestoreImageOptional.nullish(),

  // Registration
  registrationAvailable: z.boolean(),
  registrationBeforeAbove: z.string().nullish(),
  registrationBeforeBelow: z.string().nullish(),
  registrationAfter: z.string().nullish(),
  registrationList: z.string().nullish(),
  registrationExtras: z.array(registrationExtraSchema).nullish(),

  // Pricing
  price: z.number({ message: "Vyplňte toto pole" }),
  declaration: firestoreImageOptional.nullish(),

  // Map
  poi: z.array(poiSchema).nullish(),

  // Contact
  contact: z
    .object({
      facebook: z.string().nullish(),
      larpovadatabaze: z.string().nullish(),
      larpcz: z.string().nullish(),
      email: z.string().nullish(),
    })
    .nullish(),
  contactImage: firestoreImageOptional.nullish(),
  contactText: z.string().nullish(),

  // Schedule
  onsiteStart: z.any().nullish(),
  onsiteEnd: z.any().nullish(),
  onsiteRegistrationOpen: z.any().nullish(),
  onsiteRegistrationClose: z.any().nullish(),
  onsiteRules: z.any().nullish(),
  onsiteQuestStart: z.any().nullish(),
  onsiteLastQuest: z.any().nullish(),

  // Email templates
  emailSubject: z.string().nullish(),
  emailBody: z.string().nullish(),
  emailUnder18: z.string().nullish(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

// --- Config ---

export const configSchema = z.object({
  event: z.string().min(1, req),
});

export type ConfigFormValues = z.infer<typeof configSchema>;
