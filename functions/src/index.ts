import { onDocumentCreated, onDocumentUpdated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { defineSecret, defineString } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

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

interface RegistrationNotificationOptions {
  data: Awaited<ReturnType<typeof fetchParticipantData>>;
  eventData: Awaited<ReturnType<typeof fetchEvent>>;
  email: string;
  discordAction: string;
  secrets: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
}

const sendRegistrationNotification = async ({
  data,
  eventData,
  email,
  discordAction,
  secrets,
}: RegistrationNotificationOptions) => {
  const rendered = renderEmail(eventData, data, {
    subject: eventData.emailSubject,
    body: eventData.emailBody,
    under18: eventData.emailUnder18,
  });

  if (!rendered) {
    logger.warn("Email templates not configured, skipping email", { event: eventData.name });
    return;
  }

  const notification = formatRegistrationNotification(data, discordAction);
  await sendDiscordNotification(DISCORD_URL.value(), notification);

  await sendMail({
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    refreshToken: secrets.refreshToken,
    from: "Malenovský krmelec <krmelec@malenovska.cz>",
    to: email,
    replyTo: `${eventData.name} <${eventData.email}>`,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  });
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

    // Track group name in config.knownGroups for autocomplete suggestions
    if (data.group?.trim()) {
      const configRef = db.collection("config").doc("config");
      const configSnap = await configRef.get();
      const known: string[] = (configSnap.data()?.knownGroups as string[]) ?? [];
      const normalized = data.group.trim();
      if (!known.some((g) => g.toLowerCase() === normalized.toLowerCase())) {
        await configRef.update({ knownGroups: FieldValue.arrayUnion(normalized) });
      }
    }

    logger.info("New registration", { participant: data.fullName, event: eventData.name });

    await sendRegistrationNotification({
      data,
      eventData,
      email,
      discordAction: "se právě registroval",
      secrets: {
        clientId: GMAIL_CLIENT_ID.value(),
        clientSecret: GMAIL_CLIENT_SECRET.value(),
        refreshToken: GMAIL_REFRESH_TOKEN.value(),
      },
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

    await sendRegistrationNotification({
      data,
      eventData,
      email: newValue.email,
      discordAction: "- updatována registrace",
      secrets: {
        clientId: GMAIL_CLIENT_ID.value(),
        clientSecret: GMAIL_CLIENT_SECRET.value(),
        refreshToken: GMAIL_REFRESH_TOKEN.value(),
      },
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

// --- Admin RBAC ---

interface AdminUser {
  email: string;
  role: "admin" | "writer" | "staff";
}

const updateUserClaims = async (
  auth: ReturnType<typeof getAuth>,
  email: string,
  claims: Record<string, string>,
) => {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, claims);
    logger.info(Object.keys(claims).length ? "Set admin claim" : "Cleared admin claim", {
      email,
      ...claims,
    });
  } catch {
    logger.warn("Auth user not found, skipping claim update", { email });
  }
};

export const syncAdminClaims = onDocumentWritten("config/admins", async (event) => {
  const beforeUsers: AdminUser[] = event.data?.before?.data()?.users ?? [];
  const afterUsers: AdminUser[] = event.data?.after?.data()?.users ?? [];

  const beforeMap = new Map(beforeUsers.map((u) => [u.email.toLowerCase(), u.role]));
  const afterMap = new Map(afterUsers.map((u) => [u.email.toLowerCase(), u.role]));

  const auth = getAuth();

  // Users added or role changed
  for (const [email, role] of afterMap) {
    if (beforeMap.get(email) !== role) {
      await updateUserClaims(auth, email, { role });
    }
  }

  // Users removed
  for (const [email] of beforeMap) {
    if (!afterMap.has(email)) {
      await updateUserClaims(auth, email, {});
    }
  }
});

export const checkAdminEligibility = onCall(async (request) => {
  const email = request.auth?.token?.email;
  if (!email) return { role: null };

  const snap = await db.collection("config").doc("admins").get();
  const users: AdminUser[] = (snap.data()?.users as AdminUser[]) ?? [];

  const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!match) return { role: null };

  const auth = getAuth();
  await auth.setCustomUserClaims(request.auth!.uid, { role: match.role });
  logger.info("Assigned admin claim via eligibility check", { email, role: match.role });

  return { role: match.role };
});
