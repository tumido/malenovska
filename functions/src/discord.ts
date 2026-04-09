import { logger } from "firebase-functions";

export const sendDiscordNotification = async (webhookUrl: string, content: string): Promise<void> => {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      logger.error("Discord webhook failed", { status: response.status, statusText: response.statusText });
    }
  } catch (error) {
    logger.error("Discord webhook error", { error });
  }
};
