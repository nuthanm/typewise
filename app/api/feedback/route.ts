import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { feedbackSchema } from "@/lib/validators";
import {
  buildFeedbackAdminEmail,
  buildFeedbackUserEmail,
} from "@/lib/email-templates";
import { saveFeedback } from "@/lib/feedback-store";
import { isBotLikeSubmission } from "@/lib/security/anti-bot";
import { isMailerConfigured, sendMail } from "@/lib/security/mailer";
import { checkRateLimitAsync, getRequestIp } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { hasSuspiciousInput, sanitizeMultiline, sanitizeText } from "@/lib/security/sanitize";

export const runtime = "nodejs";

function parseBody(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as unknown;
  }
  return Object.fromEntries(new URLSearchParams(trimmed).entries());
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = parseBody(await req.text());
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
    }

    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const ip = getRequestIp(req.headers.get("x-forwarded-for"));
    const rate = await checkRateLimitAsync(ip, 6, 10 * 60 * 1000);
    if (rate.blocked) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try later." }, { status: 429 });
    }

    const captcha = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
    if (!captcha.ok) {
      return NextResponse.json({ ok: false, error: "CAPTCHA verification failed" }, { status: 400 });
    }

    if (captcha.skipped && isBotLikeSubmission(parsed.data.websiteField, parsed.data.formStartedAt)) {
      return NextResponse.json({ ok: false, error: "Spam detection triggered. Please try again." }, { status: 400 });
    }

    const fields = [parsed.data.name, parsed.data.email, parsed.data.message ?? ""];
    if (fields.some(hasSuspiciousInput)) {
      return NextResponse.json({ ok: false, error: "Invalid characters in submission." }, { status: 400 });
    }

    if (!isMailerConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured on the server." },
        { status: 503 },
      );
    }

    const adminTo = process.env.MAIL_TO || process.env.SMTP_USER;
    if (!adminTo) {
      return NextResponse.json({ ok: false, error: "MAIL_TO is not configured." }, { status: 503 });
    }

    const payload = {
      id: randomUUID(),
      name: sanitizeText(parsed.data.name),
      email: sanitizeText(parsed.data.email),
      helped: parsed.data.helped,
      message: parsed.data.message ? sanitizeMultiline(parsed.data.message) : undefined,
      acceptPolicy: true as const,
    };

    await saveFeedback(payload).catch((err) => {
      console.error("[feedback] db store failed:", err instanceof Error ? err.message : err);
    });

    const adminMail = buildFeedbackAdminEmail(payload);
    const userMail = buildFeedbackUserEmail(payload);

    await sendMail({ to: adminTo, subject: adminMail.subject, text: adminMail.text, html: adminMail.html });
    await sendMail({ to: payload.email, subject: userMail.subject, text: userMail.text, html: userMail.html });

    return NextResponse.json({ ok: true, id: payload.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to submit feedback.";
    const safeMessage =
      process.env.NODE_ENV === "production" ? "Unable to submit feedback." : `Unable to submit feedback: ${message}`;
    return NextResponse.json({ ok: false, error: safeMessage }, { status: 500 });
  }
}
