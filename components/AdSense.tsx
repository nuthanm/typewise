"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getAdConsent } from "./CookieConsent";

function isConfiguredClient(value?: string) {
  if (!value) return false;
  return !value.toLowerCase().includes("replace") && !value.includes("0000000000000000");
}

export function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      setEnabled(getAdConsent() === "accepted" && isConfiguredClient(client));
    }
    sync();
    window.addEventListener("typewise-consent-change", sync);
    return () => window.removeEventListener("typewise-consent-change", sync);
  }, [client]);

  if (!enabled || !client) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

export function AdSlot({ slot, format = "auto" }: { slot?: string; format?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      setEnabled(getAdConsent() === "accepted" && isConfiguredClient(client));
    }
    sync();
    window.addEventListener("typewise-consent-change", sync);
    return () => window.removeEventListener("typewise-consent-change", sync);
  }, [client]);

  useEffect(() => {
    if (!enabled) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore ad push failures
    }
  }, [enabled]);

  if (!enabled || !client) return null;

  return (
    <ins
      className="adsbygoogle ad-slot"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot || undefined}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
