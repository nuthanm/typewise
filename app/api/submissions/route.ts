import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { submissionSchema } from "@/lib/validators";
import {
  buildAdminEmail,
  buildUserConfirmationEmail,
  buildSubscribeWelcomeEmail,
} from "@/lib/email-templates";
import { saveSubmission } from "@/lib/submissions";
import { saveSubscriber } from "@/lib/subscribers";
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

    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const ip = getRequestIp(req.headers.get("x-forwarded-for"));
    const rate = await checkRateLimitAsync(ip);
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

    const fields = [
      parsed.data.companyName,
      parsed.data.message,
      parsed.data.submitterName,
      parsed.data.submitterEmail,
    ];
    if (fields.some(hasSuspiciousInput)) {
      return NextResponse.json({ ok: false, error: "Invalid characters in submission." }, { status: 400 });
    }

    if (!isMailerConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured on the server. Set SMTP_* in environment." },
        { status: 503 },
      );
    }

    const adminTo = process.env.MAIL_TO || process.env.SMTP_USER;
    if (!adminTo) {
      return NextResponse.json({ ok: false, error: "MAIL_TO is not configured." }, { status: 503 });
    }

    const payload = {
      id: randomUUID(),
      requestType: parsed.data.requestType,
      companyName: sanitizeText(parsed.data.companyName),
      companySlug: sanitizeText(parsed.data.companySlug),
      website: sanitizeText(parsed.data.website),
      submitterName: sanitizeText(parsed.data.submitterName),
      submitterEmail: sanitizeText(parsed.data.submitterEmail),
      message: sanitizeMultiline(parsed.data.message),
      subscribeToUpdates: Boolean(parsed.data.subscribeToUpdates),
      acceptPolicy: true as const,
    };

    await saveSubmission(payload).catch((err) => {
      console.error("[submissions] db store failed:", err instanceof Error ? err.message : err);
    });

    if (payload.subscribeToUpdates) {
      await saveSubscriber({
        id: randomUUID(),
        email: payload.submitterEmail,
        name: payload.submitterName,
        source: "submit_form",
      }).catch((err) => {
        console.error("[subscribers] store failed:", err instanceof Error ? err.message : err);
      });
    }

    const adminMail = buildAdminEmail(payload);
    const userMail = buildUserConfirmationEmail(payload);

    await sendMail({ to: adminTo, subject: adminMail.subject, text: adminMail.text, html: adminMail.html });
    await sendMail({
      to: payload.submitterEmail,
      subject: userMail.subject,
      text: userMail.text,
      html: userMail.html,
    });

    if (payload.subscribeToUpdates) {
      const welcome = buildSubscribeWelcomeEmail({
        name: payload.submitterName,
        email: payload.submitterEmail,
      });
      await sendMail({
        to: payload.submitterEmail,
        subject: welcome.subject,
        text: welcome.text,
        html: welcome.html,
      });
    }

    return NextResponse.json({ ok: true, id: payload.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to submit request.";
    const safeMessage =
      process.env.NODE_ENV === "production" ? "Unable to submit request." : `Unable to submit request: ${message}`;
    return NextResponse.json({ ok: false, error: safeMessage }, { status: 500 });
  }
}
