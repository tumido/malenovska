import { logger } from "firebase-functions";

export interface DiscordNotificationResult {
  sent: boolean;
  error?: string;
}

export const sendDiscordNotification = async (
  webhookUrl: string,
  content: string,
): Promise<DiscordNotificationResult> => {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = `${response.status} ${response.statusText}`;
      logger.error("Discord webhook failed", {
        status: response.status,
        statusText: response.statusText,
      });
      return { sent: false, error };
    }

    return { sent: true };
  } catch (error) {
    logger.error("Discord webhook error", { error });
    return {
      sent: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
