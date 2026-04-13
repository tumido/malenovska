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
  color: z.string().optional(),
});

const registrationExtraSchema = z.object({
  type: z.enum(["text", "number", "checkbox", "markdown"]),
  size: z.number().optional(),
  content: z.string().optional(),
  props: z
    .object({
      id: z.string().optional(),
      label: z.string().optional(),
    })
    .optional(),
});

export const eventSchema = z.object({
  id: z.string().min(1, req),
  name: z.string().min(1, req),
  year: z.number(),
  date: z.any().refine((v) => v != null, req),
  type: z.boolean(),
  display: z.boolean(),
  description: z.string().max(200, { message: "Maximálně 200 znaků" }).optional(),
  heroImage: firestoreImageOptional.optional(),

  // Rules
  rules: z.string().optional(),
  rulesImage: firestoreImageOptional.optional(),

  // Registration
  registrationAvailable: z.boolean(),
  registrationBeforeAbove: z.string().optional(),
  registrationBeforeBelow: z.string().optional(),
  registrationAfter: z.string().optional(),
  registrationList: z.string().optional(),
  registrationExtras: z.array(registrationExtraSchema).optional(),

  // Pricing
  price: z.number({ message: "Vyplňte toto pole" }),
  declaration: firestoreImageOptional.optional(),

  // Map
  poi: z.array(poiSchema).optional(),

  // Contact
  contact: z
    .object({
      facebook: z.string().optional(),
      larpovadatabaze: z.string().optional(),
      larpcz: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  contactImage: firestoreImageOptional.optional(),
  contactText: z.string().optional(),

  // Schedule
  onsiteStart: z.any().optional(),
  onsiteEnd: z.any().optional(),
  onsiteRegistrationOpen: z.any().optional(),
  onsiteRegistrationClose: z.any().optional(),
  onsiteRules: z.any().optional(),
  onsiteQuestStart: z.any().optional(),
  onsiteLastQuest: z.any().optional(),

  // Email templates
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  emailUnder18: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

// --- Config ---

export const configSchema = z.object({
  event: z.string().min(1, req),
});

export type ConfigFormValues = z.infer<typeof configSchema>;
