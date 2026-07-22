import nodemailer from "nodemailer";

type SendInput = { to: string; subject: string; text: string; html: string };

function isPlaceholder(value?: string) {
  if (!value) return true;
  const n = value.trim().toLowerCase();
  return !n || n.includes("replace_with") || n === "smtp.example.com" || n.includes("your@gmail.com");
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (isPlaceholder(host) || isPlaceholder(user) || isPlaceholder(pass)) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

export function isMailerConfigured() {
  return !isPlaceholder(process.env.SMTP_HOST)
    && !isPlaceholder(process.env.SMTP_USER)
    && !isPlaceholder(process.env.SMTP_PASS);
}

export async function sendMail(input: SendInput) {
  const transport = getTransport();
  if (!transport) {
    throw new Error("Mailer not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (Gmail App Password works).");
  }
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}
