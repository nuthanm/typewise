import Link from "next/link";

export function PrivacyContent() {
  return (
    <section className="policy-page">
      <h1>Privacy Policy</h1>
      <p>
        This policy explains what information Typewise collects, how it is used, and the choices you
        have. By using the site, you agree to this policy.
      </p>
      <h2>Data we collect</h2>
      <p>
        When you submit an add or edit request, we collect your name, email address, company details,
        message content, and technical metadata (such as IP address for abuse prevention).
      </p>
      <h2>How we use data</h2>
      <p>
        Submitted data is used to review catalog changes, respond to you, improve the directory, and
        prevent spam or abuse. Feedback you share on the feedback form helps us improve the site for
        other job seekers.
      </p>
      <h2>Catalog update emails</h2>
      <p>
        If you opt in on Submit request, we may email you when companies are verified or updated, with
        details of what was added or changed. Contact us via Submit request to opt out.
      </p>
      <h2>Cookies and similar technologies</h2>
      <p>
        We use cookies and local storage for essential site features (for example, cookie preferences)
        and abuse prevention (such as CAPTCHA). When advertising is enabled, third-party cookies may
        be used for ads and measurement.
      </p>
      <h2>Advertising (Google AdSense)</h2>
      <p>
        This site may display ads served by Google AdSense. Google and its partners may use cookies to
        show personalized or non-personalized ads. Learn more at{" "}
        <Link href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
          Google&apos;s Advertising policies
        </Link>{" "}
        and{" "}
        <Link href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
          Google Ad Settings
        </Link>
        .
      </p>
      <p>
        If you choose <strong>Essential only</strong> in our cookie banner, we will not treat that as
        consent for non-essential advertising cookies.
      </p>
      <h2>Third parties</h2>
      <p>
        We use providers as needed to operate the service: SMTP (Gmail-compatible) for email, Cloudflare
        Turnstile for CAPTCHA, hosting infrastructure, PostgreSQL for optional request storage, and —
        when enabled — Google advertising services.
      </p>
      <h2>Your rights</h2>
      <p>
        For access or deletion requests related to your submission, email the address listed in{" "}
        <Link href="/brief">The Brief</Link> or submit another request via{" "}
        <Link href="/submit">Submit request</Link> with your details.
      </p>
      <p className="policy-nav-links">
        <Link href="/">Back to home</Link> · <Link href="/terms-and-conditions">Terms and Conditions</Link>
      </p>
    </section>
  );
}

export function TermsContent() {
  return (
    <section className="policy-page">
      <h1>Terms and Conditions</h1>
      <p>
        Typewise is a community-maintained company directory for job seekers and researchers. It is not
        official company documentation and is not affiliated with listed employers.
      </p>
      <h2>Acceptable use</h2>
      <p>
        You agree not to abuse submission forms, attempt unauthorized access, scrape aggressively, or
        use this service for harmful activity.
      </p>
      <h2>Accuracy</h2>
      <p>
        Company profiles use public sources and reflect the catalog year stated on each page. Details
        change — always verify on official company sites before applying. Report issues via{" "}
        <Link href="/submit">Submit request</Link>.
      </p>
      <h2>Submissions</h2>
      <p>
        By submitting an add or edit request, you confirm the information is good-faith and that you
        accept this policy. We may reject or edit submissions at our discretion.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Trademarks and company names belong to their respective owners and are referenced for
        identification only.
      </p>
      <h2>Liability</h2>
      <p>
        The service is provided as-is without warranties. Operators are not liable for hiring decisions
        or losses resulting from outdated catalog data.
      </p>
      <p className="policy-nav-links">
        <Link href="/">Back to home</Link> · <Link href="/privacy-policy">Privacy Policy</Link>
      </p>
    </section>
  );
}
