import { randomUUID } from "node:crypto";
import type { z, ZodType } from "zod";
import { jsonResponse } from "@/lib/api/cors";
import { buildAdminEmail, buildUserConfirmationEmail, saveSubmission } from "@/lib/submissions";
import { isBotLikeSubmission } from "@/lib/security/anti-bot";
import { sendMail, isMailerConfigured } from "@/lib/security/mailer";
import { checkRateLimitAsync, getRequestIp } from "@/lib/security/rate-limit";
import { hasSuspiciousInput, sanitizeMultiline, sanitizeText } from "@/lib/security/sanitize";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

type SubmitOptions<T extends ZodType> = {
  request: Request;
  schema: T;
  buildAdmin: (input: z.infer<T> & { id: string }) => { subject: string; text: string; html: string };
  buildUser: (input: z.infer<T> & { id: string }) => { subject: string; text: string; html: string };
  save: (input: z.infer<T> & { id: string }) => Promise<{ stored: boolean }>;
  requireStorage?: boolean;
};

function sanitizeSubmissionBody<T extends Record<string, unknown>>(body: T) {
  const next = { ...body } as Record<string, unknown>;
  for (const key of Object.keys(next)) {
    const value = next[key];
    if (typeof value === "string") {
      next[key] = key === "message" ? sanitizeMultiline(value) : sanitizeText(value);
    }
  }
  return next as T;
}

export async function handleFormSubmit<T extends ZodType>(options: SubmitOptions<T>) {
  const ip = getRequestIp(options.request.headers.get("x-forwarded-for"));
  const rate = await checkRateLimitAsync(ip);
  if (rate.blocked) {
    return jsonResponse(
      { ok: false, error: "Too many requests. Please try again later." },
      options.request,
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await options.request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body." }, options.request, { status: 400 });
  }

  const parsed = options.schema.safeParse(sanitizeSubmissionBody(body as Record<string, unknown>));
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid form data.";
    return jsonResponse({ ok: false, error: message }, options.request, { status: 400 });
  }

  const input = parsed.data as z.infer<T> & {
    websiteField?: string;
    formStartedAt?: number;
    turnstileToken?: string;
    message?: string;
    submitterEmail?: string;
  };

  if (isBotLikeSubmission(input.websiteField, input.formStartedAt)) {
    return jsonResponse({ ok: false, error: "Unable to submit request." }, options.request, { status: 400 });
  }

  const turnstile = await verifyTurnstileToken(input.turnstileToken, ip);
  if (!turnstile.ok) {
    return jsonResponse({ ok: false, error: "CAPTCHA verification failed." }, options.request, { status: 400 });
  }

  const textFields = Object.values(input).filter((v) => typeof v === "string") as string[];
  if (textFields.some(hasSuspiciousInput)) {
    return jsonResponse({ ok: false, error: "Invalid characters in submission." }, options.request, { status: 400 });
  }

  const id = randomUUID();
  const record = { ...input, id };
  const stored = await options.save(record);

  if (options.requireStorage && !stored.stored) {
    return jsonResponse(
      { ok: false, error: "Submissions are temporarily unavailable. Please try again later." },
      options.request,
      { status: 503 },
    );
  }

  if (isMailerConfigured()) {
    const adminTo = process.env.MAIL_TO?.trim();
    if (adminTo) {
      const adminEmail = options.buildAdmin(record);
      await sendMail({ to: adminTo, ...adminEmail });
    }
    if (input.submitterEmail) {
      const userEmail = options.buildUser(record);
      await sendMail({ to: input.submitterEmail, ...userEmail });
    }
  }

  return jsonResponse({ ok: true, id }, options.request);
}

export async function handleSubmissionPost(request: Request) {
  const { submissionSchema } = await import("@/lib/validators");
  return handleFormSubmit({
    request,
    schema: submissionSchema,
    buildAdmin: buildAdminEmail,
    buildUser: buildUserConfirmationEmail,
    save: saveSubmission,
    requireStorage: false,
  });
}
