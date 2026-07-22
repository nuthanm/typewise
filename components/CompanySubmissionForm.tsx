"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormActions } from "@/components/FormLayout";
import { COMPANIES, slugifyCompanyName } from "@/lib/companies";
import { getSubmitApiUrl } from "@/lib/site-meta";
import { submissionSchema, type SubmissionInput } from "@/lib/validators";
import { requiresTurnstile, TurnstileField } from "./TurnstileField";

type FormValues = SubmissionInput;

export function CompanySubmissionForm({ initialSlug }: { initialSlug?: string }) {
  const formStartedAt = useMemo(() => Date.now(), []);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      requestType: initialSlug ? "edit" : "add",
      companySlug: initialSlug ?? "",
      acceptPolicy: undefined,
    },
  });

  const requestType = watch("requestType");

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setErrorMessage("");

    if (requiresTurnstile() && !captchaToken) {
      setStatus("error");
      setErrorMessage("Complete the CAPTCHA before submitting.");
      return;
    }

    try {
      const res = await fetch(getSubmitApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken: captchaToken || undefined,
          websiteField: values.websiteField,
          formStartedAt,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Unable to submit request.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unable to submit request.");
      setCaptchaResetKey((k) => k + 1);
      setCaptchaToken("");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success">
        <h2>Request received</h2>
        <p>
          Thanks — we received your {requestType === "add" ? "add" : "edit"} request. No sign-in is
          required. We will email you if we need more details.
        </p>
        <Link href="/" className="app-btn primary">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <form className="app-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("formStartedAt", { value: formStartedAt })} />
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="websiteField">Website</label>
        <input id="websiteField" tabIndex={-1} autoComplete="off" {...register("websiteField")} />
      </div>

      <fieldset className="form-field">
        <legend>Request type</legend>
        <div className="radio-group">
          <label className="radio-pill">
            <input type="radio" value="add" {...register("requestType")} />
            Add a new company
          </label>
          <label className="radio-pill">
            <input type="radio" value="edit" {...register("requestType")} />
            Edit an existing company
          </label>
        </div>
      </fieldset>

      <div className="form-field">
        <label htmlFor="companyName">Company name *</label>
        <input
          id="companyName"
          type="text"
          {...register("companyName")}
          placeholder="e.g. Razorpay"
          autoComplete="organization"
        />
        {errors.companyName && <p className="form-error">{errors.companyName.message}</p>}
      </div>

      {requestType === "edit" && (
        <div className="form-field">
          <label htmlFor="companySlug">Existing company (optional)</label>
          <select id="companySlug" {...register("companySlug")}>
            <option value="">Select from catalog…</option>
            {COMPANIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="form-hint">
            Or type a slug: {slugifyCompanyName(watch("companyName") || "company-name")}
          </p>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="website">Company website</label>
        <input
          id="website"
          type="url"
          {...register("website")}
          placeholder="https://example.com"
          autoComplete="url"
        />
        {errors.website && <p className="form-error">{errors.website.message}</p>}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="submitterName">Your name *</label>
          <input
            id="submitterName"
            type="text"
            {...register("submitterName")}
            autoComplete="name"
          />
          {errors.submitterName && <p className="form-error">{errors.submitterName.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="submitterEmail">Your email *</label>
          <input
            id="submitterEmail"
            type="email"
            {...register("submitterEmail")}
            autoComplete="email"
          />
          {errors.submitterEmail && <p className="form-error">{errors.submitterEmail.message}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="message">What should we add or change? *</label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          placeholder="Describe category (product/service), headcount, domains, interview patterns, careers link, etc."
        />
        {errors.message && <p className="form-error">{errors.message.message}</p>}
      </div>

      <label className="checkbox-card">
        <input type="checkbox" {...register("subscribeToUpdates")} />
        <span>
          Email me when new companies are verified or profiles are updated (what we added / changed).
          Update alerts — coming soon.
        </span>
      </label>

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

      <FormActions hint="No account needed. Every submission is reviewed against official sources before we update the catalog.">
        <button type="submit" className="form-submit-btn" disabled={status === "loading"}>
          {status === "loading" ? "Submitting…" : "Submit request"}
        </button>
      </FormActions>
    </form>
  );
}
