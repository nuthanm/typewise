"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "typewise-cookie-consent";

type ConsentValue = "accepted" | "essential";

function readConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "essential") return value;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

function writeConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("typewise-consent-change", { detail: value }));
  } catch {
    // ignore write failures
  }
}

export function getAdConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  return readConsent();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          We use cookies and similar technologies for essential site features, abuse prevention, and
          — when enabled — advertising and measurement (including Google AdSense). See our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> for details.
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="cookie-consent-btn secondary" onClick={() => { writeConsent("essential"); setVisible(false); }}>
            Essential only
          </button>
          <button type="button" className="cookie-consent-btn primary" onClick={() => { writeConsent("accepted"); setVisible(false); }}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
