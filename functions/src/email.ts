import nodemailer from "nodemailer";
import { google } from "googleapis";
import { logger } from "firebase-functions";

const OAuth2 = google.auth.OAuth2;

interface SendMailOptions {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async (options: SendMailOptions): Promise<void> => {
  try {
    const oauth2Client = new OAuth2(
      options.clientId,
      options.clientSecret,
      "https://developers.google.com/oauthplayground",
    );

    oauth2Client.setCredentials({ refresh_token: options.refreshToken });
    const tokens = await oauth2Client.getAccessToken();
    const accessToken = tokens.token;

    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "krmelec@malenovska.cz",
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        refreshToken: options.refreshToken,
        accessToken,
      },
    });

    await transport.sendMail({
      from: options.from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info("Email sent", { to: options.to, subject: options.subject });
  } catch (error) {
    logger.error("Failed to send email", { to: options.to, error });
  }
};
