import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SubscriberPill } from "@/components/SubscriberPill";

type AppShellProps = {
  children: React.ReactNode;
  active?: "home" | "companies" | "brief" | "submit" | "feedback";
  wide?: boolean;
};

export function AppShell({ children, active, wide }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-nav">
        <AppHeader active={active} trailing={<SubscriberPill />} />
      </header>
      <main className={`app-main ${wide ? "app-main-wide" : ""}`.trim()}>{children}</main>
      <footer className="app-footer">
        <p>
          Know your company type before you apply — manually verified profiles from official sources.
        </p>
        <div className="app-footer-links">
          <Link href="/companies">Companies</Link>
          <Link href="/brief">The Brief</Link>
          <Link href="/submit">Submit add / edit</Link>
          <Link href="/feedback">Feedback</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms</Link>
        </div>
        <SubscriberPill />
        <p className="app-footer-note">Community directory. Not affiliated with listed companies.</p>
      </footer>
    </div>
  );
}
