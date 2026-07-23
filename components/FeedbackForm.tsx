"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormActions } from "@/components/FormLayout";
import { feedbackSchema, type FeedbackInput } from "@/lib/validators";
import { getFeedbackApiUrl } from "@/lib/site-meta";
import { requiresTurnstile, TurnstileField } from "./TurnstileField";

const HELPED_OPTIONS: Array<{ value: FeedbackInput["helped"]; label: string }> = [
  { value: "yes", label: "Yes — helped me pick the right company type" },
  { value: "somewhat", label: "Somewhat — useful but I needed more detail" },
  { value: "no", label: "Not yet — still exploring" },
];

export function FeedbackForm() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { acceptPolicy: undefined },
  });

  useEffect(() => {
    setValue("formStartedAt", Date.now());
  }, [setValue]);

  async function onSubmit(values: FeedbackInput) {
    setStatus("loading");
    setErrorMessage("");

    if (requiresTurnstile() && !captchaToken) {
      setStatus("error");
      setErrorMessage("Complete the CAPTCHA before submitting.");
      return;
    }

    try {
      const res = await fetch(getFeedbackApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken: captchaToken || undefined,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Unable to submit feedback.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unable to submit feedback.");
      setCaptchaResetKey((k) => k + 1);
      setCaptchaToken("");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success">
        <h2>Thank you for your feedback</h2>
        <p>Your opinion helps us improve Typewise for other job seekers researching company types.</p>
        <Link href="/" className="app-btn primary">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <form className="app-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("formStartedAt")} />
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="feedbackWebsiteField">Website</label>
        <input id="feedbackWebsiteField" tabIndex={-1} autoComplete="off" {...register("websiteField")} />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="feedbackName">Your name *</label>
          <input id="feedbackName" type="text" {...register("name")} autoComplete="name" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="feedbackEmail">Your email *</label>
          <input id="feedbackEmail" type="email" {...register("email")} autoComplete="email" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
      </div>

      <fieldset className="form-field">
        <legend>Did this site help your career research? *</legend>
        <div className="radio-group">
          {HELPED_OPTIONS.map((opt) => (
            <label key={opt.value} className="radio-pill">
              <input type="radio" value={opt.value} {...register("helped")} />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.helped && <p className="form-error">{errors.helped.message}</p>}
      </fieldset>

      <div className="form-field">
        <label htmlFor="feedbackMessage">Anything else? (optional)</label>
        <textarea
          id="feedbackMessage"
          rows={5}
          {...register("message")}
          placeholder="What worked, what was missing, or which company you were researching…"
        />
      </div>

      <label className="checkbox-card">
        <input type="checkbox" {...register("acceptPolicy")} />
        <span>
          I accept the <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-and-conditions">Terms and Conditions</Link>.
        </span>
      </label>
      {errors.acceptPolicy && <p className="form-error">{errors.acceptPolicy.message}</p>}

      <TurnstileField
        resetKey={captchaResetKey}
        onToken={setCaptchaToken}
        onLoadError={(msg) => setErrorMessage(msg)}
      />

      {errorMessage && <p className="form-error banner">{errorMessage}</p>}

      <FormActions hint="We read every response. Report data issues anytime via Submit request.">
        <button type="submit" className="form-submit-btn" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send feedback"}
        </button>
      </FormActions>
    </form>
  );
}
