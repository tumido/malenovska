import { marked } from "marked";

export interface TemplateData {
  fullName: string;
  group?: string;
  race: string;
  age: number;
}

export interface TemplateEvent {
  name: string;
  year: number;
  date: string;
  email: string;
  id: string;
}

export interface EmailTemplateConfig {
  subject?: string;
  body?: string;
  under18?: string;
}

export interface RenderResult {
  subject: string;
  html: string;
  text: string;
}

const substituteVariables = (template: string, variables: Record<string, string>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => variables[key] ?? match);

const buildVariables = (event: TemplateEvent, data: TemplateData): Record<string, string> => ({
  name: data.fullName,
  group: data.group ?? "",
  race: data.race,
  age: String(data.age),
  event: event.name,
  year: String(event.year),
  date: event.date,
  event_email: event.email,
  confirmation_url: `https://www.malenovska.cz/${event.id}/confirmation`,
});

export const renderEmail = (
  event: TemplateEvent,
  data: TemplateData,
  config: EmailTemplateConfig,
): RenderResult | null => {
  if (!config.subject || !config.body) {
    return null;
  }

  const variables = buildVariables(event, data);

  const subject = substituteVariables(config.subject, variables);

  let bodyMarkdown = substituteVariables(config.body, variables);

  if (data.age < 18 && config.under18) {
    bodyMarkdown += "\n\n" + substituteVariables(config.under18, variables);
  }

  const html = marked.parse(bodyMarkdown, { async: false }) as string;
  const text = bodyMarkdown;

  return { subject, html, text };
};
