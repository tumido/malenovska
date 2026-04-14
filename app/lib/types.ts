import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "writer" | "staff";

export interface AdminConfig {
  users: Array<{ email: string; role: UserRole }>;
}

export interface FirestoreImage {
  src: string;
  title?: string;
}

export interface POI {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  color?: string;
}

export interface RegistrationExtra {
  type: "text" | "number" | "checkbox" | "markdown";
  size?: number;
  content?: string;
  props?: {
    id?: string;
    label?: string;
  };
}

export interface Event {
  id: string;
  name: string;
  year: number;
  date: Timestamp;
  type: boolean; // true = Bitva, false = Šarvátka
  display: boolean;
  description: string;
  heroImage?: FirestoreImage;

  // Rules
  rules: string;
  rulesImage?: FirestoreImage;

  // Registration
  registrationAvailable: boolean;
  registrationBeforeAbove?: string;
  registrationBeforeBelow?: string;
  registrationAfter?: string;
  registrationList?: string;
  registrationExtras?: RegistrationExtra[];

  // Map & location
  poi: POI[];

  // Pricing
  price?: number;
  declaration?: FirestoreImage;

  // Contact
  contact?: {
    facebook?: string;
    larpovadatabaze?: string;
    larpcz?: string;
    email?: string;
  };
  contactImage?: FirestoreImage;
  contactText?: string;

  // Schedule (Timestamps in legacy data, time strings from admin form)
  onsiteStart?: Timestamp | string;
  onsiteEnd?: Timestamp | string;
  onsiteRegistrationOpen?: Timestamp | string;
  onsiteRegistrationClose?: Timestamp | string;
  onsiteRules?: Timestamp | string;
  onsiteQuestStart?: Timestamp | string;
  onsiteLastQuest?: Timestamp | string;

  // Email templates
  emailSubject?: string;
  emailBody?: string;
  emailUnder18?: string;

  lastupdate?: Timestamp;
}

export interface Legend {
  id: string;
  title: string;
  event: string;
  publishedAt: Timestamp;
  perex: string;
  content: string;
  image?: FirestoreImage;
  createdby?: string;
  createdate?: Timestamp;
  lastupdate?: Timestamp;
}

export interface Race {
  id: string;
  name: string;
  event: string;
  limit: number;
  priority: number;
  color: string;
  colorName: string;
  legend: string;
  requirements: string;
  image?: FirestoreImage;
  createdby?: string;
  createdate?: Timestamp;
  lastupdate?: Timestamp;
}

export interface Participant {
  id: string;
  event: string;
  race: string;
  firstName: string;
  nickName?: string;
  lastName: string;
  group?: string;
  note?: string;
  createdate?: Timestamp;
  lastupdate?: Timestamp;
  [key: string]: unknown;
}

export interface ParticipantPrivate {
  age: number;
  email: string;
}

export interface Gallery {
  id: string;
  event: string;
  name: string;
  author: string;
  url: string;
  cover: FirestoreImage;
  createdate?: Timestamp;
  lastupdate?: Timestamp;
}

export interface Config {
  event: string;
  knownGroups?: string[];
}
