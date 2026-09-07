import { onDocumentCreated, onDocumentUpdated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

import { sendDiscordNotification } from "./discord.js";
import { sendMail } from "./email.js";
import { renderEmail } from "./templates.js";

initializeApp();
const db = getFirestore();

const DISCORD_URL = defineSecret("DISCORD_WEBHOOK");
const GMAIL_CLIENT_ID = defineSecret("GMAIL_CLIENT_ID");
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

type NotificationChannelStatus = "pending" | "sent" | "failed" | "skipped";
type NotificationStatus = "pending" | "sent" | "partial" | "failed" | "skipped";

interface NotificationResult {
  status: NotificationStatus;
  email: NotificationChannelStatus;
  discord: NotificationChannelStatus;
  error?: string;
}

const getErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.length > 500 ? `${message.slice(0, 497)}...` : message;
};

const fetchParticipantData = async (participantId: string, email: string, age: number) => {
  const snap = await db.collection("participants").doc(participantId).get();
  if (!snap.exists) {
    throw new Error(`Participant "${participantId}" was not found`);
  }

  const rawParticipant = snap.data();
  if (!rawParticipant) {
    throw new Error(`Participant "${participantId}" has no data`);
  }

  const participant = rawParticipant as ParticipantData;
  if (!participant.race) {
    throw new Error(`Participant "${participantId}" has no race`);
  }

  const raceSnap = await db.collection("races").doc(participant.race).get();
  if (!raceSnap.exists) {
    throw new Error(`Race "${participant.race}" was not found for participant "${participantId}"`);
  }

  const race = raceSnap.data() as { name?: string } | undefined;
  if (!race?.name) {
    throw new Error(`Race "${participant.race}" has no name`);
  }

  const fullName = `${participant.firstName}${
    participant.nickName ? ` (${participant.nickName}) ` : " "
  }${participant.lastName}`;

  return {
    ...participant,
    email,
    age,
    race: race.name,
    fullName,
  };
};

const fetchEvent = async (eventId: string) => {
  const snap = await db.collection("events").doc(eventId).get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Událost nebyla nalezena.");
  }

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

const updateNotificationStatus = async (
  participantId: string,
  result: NotificationResult,
) => {
  const now = Timestamp.now();
  const notification: Record<string, unknown> = {
    status: result.status,
    email: result.email,
    discord: result.discord,
    attemptedAt: now,
  };

  if (result.status !== "pending") {
    notification.completedAt = now;
  }
  if (result.error) {
    notification.error = result.error;
  }

  try {
    // Update rather than set so a deleted participant is not recreated by the
    // notification bookkeeping.
    await db
      .collection("participants")
      .doc(participantId)
      .collection("private")
      .doc("_")
      .update({ notification });
  } catch (error) {
    logger.warn("Could not save notification status", {
      participantId,
      error: getErrorMessage(error),
    });
  }
};

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
    return {
      status: "skipped",
      email: "skipped",
      discord: "skipped",
      error: "Email templates are not configured",
    } satisfies NotificationResult;
  }

  const notification = formatRegistrationNotification(data, discordAction);
  let discordStatus: NotificationChannelStatus = "failed";
  let discordError: string | undefined;

  try {
    const discordResult = await sendDiscordNotification(DISCORD_URL.value(), notification);
    discordStatus = discordResult.sent ? "sent" : "failed";
    discordError = discordResult.error;
  } catch (error) {
    discordError = getErrorMessage(error);
    logger.error("Could not send Discord registration notification", {
      event: eventData.name,
      error: discordError,
    });
  }

  let emailStatus: NotificationChannelStatus = "failed";
  let emailError: string | undefined;

  try {
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
    emailStatus = "sent";
  } catch (error) {
    emailError = getErrorMessage(error);
  }

  const errors = [
    discordError ? `Discord: ${discordError}` : "",
    emailError ? `E-mail: ${emailError}` : "",
  ].filter(Boolean);
  const failedChannels = [discordStatus, emailStatus].filter((status) => status === "failed").length;
  const status: NotificationStatus =
    failedChannels === 0 ? "sent" : failedChannels === 2 ? "failed" : "partial";

  return {
    status,
    email: emailStatus,
    discord: discordStatus,
    ...(errors.length > 0 ? { error: errors.join("; ") } : {}),
  } satisfies NotificationResult;
};

interface ProcessParticipantNotificationOptions {
  participantId: string;
  email: string;
  age: number;
  discordAction: string;
  trackGroup?: boolean;
}

const processParticipantNotification = async ({
  participantId,
  email,
  age,
  discordAction,
  trackGroup = false,
}: ProcessParticipantNotificationOptions): Promise<NotificationResult> => {
  await updateNotificationStatus(participantId, {
    status: "pending",
    email: "pending",
    discord: "pending",
  });

  try {
    const data = await fetchParticipantData(participantId, email, age);
    const eventData = await fetchEvent(data.event);

    if (trackGroup && data.group?.trim()) {
      try {
        const configRef = db.collection("config").doc("config");
        const configSnap = await configRef.get();
        const known: string[] = (configSnap.data()?.knownGroups as string[]) ?? [];
        const normalized = data.group.trim();
        if (!known.some((g) => g.toLowerCase() === normalized.toLowerCase())) {
          await configRef.update({ knownGroups: FieldValue.arrayUnion(normalized) });
        }
      } catch (error) {
        logger.warn("Could not update known groups", {
          participantId,
          error: getErrorMessage(error),
        });
      }
    }

    const result = await sendRegistrationNotification({
      data,
      eventData,
      email,
      discordAction,
      secrets: {
        clientId: GMAIL_CLIENT_ID.value(),
        clientSecret: GMAIL_CLIENT_SECRET.value(),
        refreshToken: GMAIL_REFRESH_TOKEN.value(),
      },
    });

    await updateNotificationStatus(participantId, result);
    logger.info("Registration notification processed", {
      participant: data.fullName,
      event: eventData.name,
      status: result.status,
      email: result.email,
      discord: result.discord,
    });
    return result;
  } catch (error) {
    const result: NotificationResult = {
      status: "failed",
      email: "skipped",
      discord: "skipped",
      error: getErrorMessage(error),
    };
    await updateNotificationStatus(participantId, result);
    logger.error("Registration notification failed", {
      participantId,
      error: result.error,
    });
    return result;
  }
};

export const sendTestEmail = onCall(
  {
    secrets: [GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Pro odeslání testovacího e-mailu se přihlaste.");
    }

    if (request.auth.token.role !== "admin") {
      throw new HttpsError("permission-denied", "Testovací e-mail mohou odesílat pouze administrátoři.");
    }

    const recipient = request.auth.token.email;
    if (typeof recipient !== "string" || !recipient.trim()) {
      throw new HttpsError("failed-precondition", "Přihlášený účet nemá e-mailovou adresu.");
    }

    const data = (request.data ?? {}) as Record<string, unknown>;
    const eventId = data.eventId;
    if (typeof eventId !== "string" || !eventId.trim()) {
      throw new HttpsError("invalid-argument", "Chybí ID události.");
    }

    const eventData = await fetchEvent(eventId);
    const testEvent = {
      ...eventData,
      name: typeof data.eventName === "string" ? data.eventName : eventData.name,
      year:
        typeof data.eventYear === "number" && Number.isFinite(data.eventYear)
          ? data.eventYear
          : eventData.year,
      date: typeof data.eventDate === "string" ? data.eventDate : eventData.date,
    };

    const rendered = renderEmail(
      testEvent,
      {
        fullName: "Mirek (Mirek) Dušín",
        group: "Rychlé Šípy",
        race: "Lidé",
        age: 15,
      },
      {
        subject:
          typeof data.emailSubject === "string"
            ? data.emailSubject
            : eventData.emailSubject,
        body: typeof data.emailBody === "string" ? data.emailBody : eventData.emailBody,
        under18:
          typeof data.emailUnder18 === "string"
            ? data.emailUnder18
            : eventData.emailUnder18,
      },
    );

    if (!rendered) {
      throw new HttpsError(
        "failed-precondition",
        "Před odesláním vyplňte předmět a tělo e-mailu.",
      );
    }

    const recipientEmail = recipient.trim();
    await sendMail({
      clientId: GMAIL_CLIENT_ID.value(),
      clientSecret: GMAIL_CLIENT_SECRET.value(),
      refreshToken: GMAIL_REFRESH_TOKEN.value(),
      from: "Malenovský krmelec <krmelec@malenovska.cz>",
      to: recipientEmail,
      replyTo: `${testEvent.name} <${testEvent.email}>`,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });

    logger.info("Test email sent", { event: testEvent.name, to: recipientEmail });
    return { recipient: recipientEmail };
  },
);

export const emailAttendee = onDocumentCreated(
  {
    document: "participants/{id}/private/_",
    secrets: [DISCORD_URL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const value = snapshot.data() as { email?: unknown; age?: unknown } | undefined;
    if (
      typeof value?.email !== "string" ||
      !value.email.trim() ||
      typeof value.age !== "number" ||
      !Number.isFinite(value.age)
    ) {
      const result: NotificationResult = {
        status: "failed",
        email: "skipped",
        discord: "skipped",
        error: "Private participant data is missing a valid email or age",
      };
      await updateNotificationStatus(event.params.id, result);
      logger.error("Registration notification skipped invalid private data", {
        participantId: event.params.id,
      });
      return;
    }

    await processParticipantNotification({
      participantId: event.params.id,
      email: value.email.trim(),
      age: value.age,
      discordAction: "se právě registroval",
      trackGroup: true,
    });
  },
);

export const emailAttendeeOnUpdate = onDocumentUpdated(
  {
    document: "participants/{id}/private/_",
    secrets: [DISCORD_URL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (event) => {
    const change = event.data;
    if (!change) return;

    const newValue = change.after.data() as { email?: unknown; age?: unknown };
    const previousValue = change.before.data() as { email?: unknown };

    if (newValue.email === previousValue.email) return;

    if (
      typeof newValue.email !== "string" ||
      !newValue.email.trim() ||
      typeof newValue.age !== "number" ||
      !Number.isFinite(newValue.age)
    ) {
      const result: NotificationResult = {
        status: "failed",
        email: "skipped",
        discord: "skipped",
        error: "Private participant data is missing a valid email or age",
      };
      await updateNotificationStatus(event.params.id, result);
      logger.error("Registration update notification skipped invalid private data", {
        participantId: event.params.id,
      });
      return;
    }

    await processParticipantNotification({
      participantId: event.params.id,
      email: newValue.email.trim(),
      age: newValue.age,
      discordAction: "- updatována registrace",
    });
  },
);

export const retryAttendeeNotification = onCall(
  {
    secrets: [DISCORD_URL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  },
  async (request) => {
    const role = request.auth?.token.role;
    if (role !== "admin" && role !== "staff") {
      throw new HttpsError(
        request.auth ? "permission-denied" : "unauthenticated",
        "Oznámení mohou znovu odesílat pouze členové štábu.",
      );
    }

    const participantId = (request.data as { participantId?: unknown } | null)?.participantId;
    if (typeof participantId !== "string" || !participantId.trim()) {
      throw new HttpsError("invalid-argument", "Chybí ID účastníka.");
    }

    const privateSnap = await db
      .collection("participants")
      .doc(participantId)
      .collection("private")
      .doc("_")
      .get();
    if (!privateSnap.exists) {
      throw new HttpsError("not-found", "Soukromé údaje účastníka nebyly nalezeny.");
    }

    const privateData = privateSnap.data() as { email?: unknown; age?: unknown } | undefined;
    if (
      typeof privateData?.email !== "string" ||
      !privateData.email.trim() ||
      typeof privateData.age !== "number" ||
      !Number.isFinite(privateData.age)
    ) {
      throw new HttpsError("failed-precondition", "Účastník nemá platný e-mail nebo věk.");
    }

    return processParticipantNotification({
      participantId,
      email: privateData.email.trim(),
      age: privateData.age,
      discordAction: "- znovu odeslána registrace",
    });
  },
);

export const notifyRegistrationToggle = onDocumentUpdated(
  {
    document: "events/{id}",
    secrets: [DISCORD_URL],
  },
  async (event) => {
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
  },
);

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
