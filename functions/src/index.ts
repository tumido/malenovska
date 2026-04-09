import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { sendDiscordNotification } from "./discord.js";
import { sendMail } from "./email.js";
import { renderEmail } from "./templates.js";

initializeApp();
const db = getFirestore();

const DISCORD_URL = defineString("DISCORD_WEBHOOK");
const GMAIL_CLIENT_ID = defineString("GMAIL_CLIENT_ID");
const GMAIL_CLIENT_SECRET = defineSecret("GMAIL_CLIENT_SECRET");
const GMAIL_REFRESH_TOKEN = defineSecret("GMAIL_REFRESH_TOKEN");

interface ParticipantData {
  firstName: string;
  lastName: string;
  nickName?: string;
  group?: string;
  note?: string;
  race: string;
  event: string;
}

const fetchParticipantData = async (participantId: string, email: string, age: number) => {
  const snap = await db.collection("participants").doc(participantId).get();
  const participant = snap.data() as ParticipantData;

  const raceSnap = await db.collection("races").doc(participant.race).get();
  const raceName = (raceSnap.data() as { name: string }).name;

  const fullName = `${participant.firstName}${
    participant.nickName ? ` (${participant.nickName}) ` : " "
  }${participant.lastName}`;

  return {
    ...participant,
    email,
    age,
    race: raceName,
    fullName,
  };
};

const fetchEvent = async (eventId: string) => {
  const snap = await db.collection("events").doc(eventId).get();
  const event = snap.data() as {
    name: string;
    year: number;
    date: Timestamp;
    id: string;
    emailSubject?: string;
    emailBody?: string;
    emailUnder18?: string;
  };

  return {
    ...event,
    email: `${event.id}@malenovska.cz`,
    date: event.date.toDate().toLocaleDateString("cs-CZ"),
  };
};

const formatRegistrationNotification = (
  data: { fullName: string; race: string; group?: string; age: number; note?: string },
  action: string,
) => {
  return (
    `**${data.fullName}** ${action}\n> Strana: **${data.race}**` +
    (data.group ? `\n> Skupina: **${data.group}**` : "") +
    (data.age < 15 ? `\n> Věk: **${data.age}**` : "") +
    (data.note ? `\n> Poznámka: **${data.note}**` : "")
  );
};

export const emailAttendee = onDocumentCreated(
  {
    document: "participants/{id}/private/_",
    secrets: [GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const { email, age } = snapshot.data() as { email: string; age: number };
    const data = await fetchParticipantData(event.params.id, email, age);
    const eventData = await fetchEvent(data.event);

    logger.info("New registration", { participant: data.fullName, event: eventData.name });

    const rendered = renderEmail(eventData, data, {
      subject: eventData.emailSubject,
      body: eventData.emailBody,
      under18: eventData.emailUnder18,
    });

    if (!rendered) {
      logger.warn("Email templates not configured, skipping email", { event: eventData.name });
      return;
    }

    const notification = formatRegistrationNotification(data, "se právě registroval");
    await sendDiscordNotification(DISCORD_URL.value(), notification);

    await sendMail({
      clientId: GMAIL_CLIENT_ID.value(),
      clientSecret: GMAIL_CLIENT_SECRET.value(),
      refreshToken: GMAIL_REFRESH_TOKEN.value(),
      from: "Malenovský krmelec <krmelec@malenovska.cz>",
      to: email,
      replyTo: `${eventData.name} <${eventData.email}>`,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });
  },
);

export const emailAttendeeOnUpdate = onDocumentUpdated(
  {
    document: "participants/{id}/private/_",
    secrets: [GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const change = event.data;
    if (!change) return;

    const newValue = change.after.data() as { email: string; age: number };
    const previousValue = change.before.data() as { email: string; age: number };

    if (newValue.email === previousValue.email) return;

    const data = await fetchParticipantData(event.params.id, newValue.email, newValue.age);
    const eventData = await fetchEvent(data.event);

    logger.info("Registration updated", { participant: data.fullName, event: eventData.name });

    const rendered = renderEmail(eventData, data, {
      subject: eventData.emailSubject,
      body: eventData.emailBody,
      under18: eventData.emailUnder18,
    });

    if (!rendered) {
      logger.warn("Email templates not configured, skipping email", { event: eventData.name });
      return;
    }

    const notification = formatRegistrationNotification(data, "- updatována registrace");
    await sendDiscordNotification(DISCORD_URL.value(), notification);

    await sendMail({
      clientId: GMAIL_CLIENT_ID.value(),
      clientSecret: GMAIL_CLIENT_SECRET.value(),
      refreshToken: GMAIL_REFRESH_TOKEN.value(),
      from: "Malenovský krmelec <krmelec@malenovska.cz>",
      to: newValue.email,
      replyTo: `${eventData.name} <${eventData.email}>`,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });
  },
);

export const notifyRegistrationToggle = onDocumentUpdated("events/{id}", async (event) => {
  const change = event.data;
  if (!change) return;

  const newValue = change.after.data() as { name: string; registrationAvailable: boolean };
  const previousValue = change.before.data() as { name: string; registrationAvailable: boolean };

  if (newValue.registrationAvailable && !previousValue.registrationAvailable) {
    await sendDiscordNotification(DISCORD_URL.value(), `**${newValue.name}**: Otevírám registraci`);
  }

  if (!newValue.registrationAvailable && previousValue.registrationAvailable) {
    await sendDiscordNotification(DISCORD_URL.value(), `**${newValue.name}**: Zavírám registraci`);
  }
});
