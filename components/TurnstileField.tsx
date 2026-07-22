"use client";

import { useEffect, useRef } from "react";

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function isConfiguredTurnstileSiteKey(value?: string) {
  if (!value) return false;
  return !value.toLowerCase().includes("replace_with");
}

function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load CAPTCHA script.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load CAPTCHA script."));
    document.head.appendChild(script);
  });
}

export function TurnstileField({
  resetKey,
  onToken,
  onLoadError,
}: {
  resetKey: number;
  onToken: (token: string) => void;
  onLoadError: (message: string) => void;
}) {
  const rawSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const siteKey = isConfiguredTurnstileSiteKey(rawSiteKey) ? rawSiteKey : undefined;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let active = true;

    void loadTurnstileScript()
      .then(() => {
        if (!active || !window.turnstile || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "light",
          callback: (token) => onToken(token),
          "error-callback": () => {
            onToken("");
            onLoadError("CAPTCHA verification failed. Please try again.");
          },
          "expired-callback": () => onToken(""),
        });
      })
      .catch(() => onLoadError("Unable to load CAPTCHA. Please refresh and try again."));

    return () => {
      active = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [onLoadError, onToken, resetKey, siteKey]);

  if (!siteKey) {
    return (
      <p className="form-hint">
        CAPTCHA is not configured in this environment. Honeypot and timing checks still apply.
      </p>
    );
  }

  return <div ref={containerRef} className="turnstile-wrap" />;
}

export function requiresTurnstile() {
  return isConfiguredTurnstileSiteKey(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
