import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { SubmitPageContent } from "@/components/SubmitPageContent";

export const metadata = {
  title: "Submit add or edit — Typewise",
  description: "Request a new company or suggest edits. No sign-in required.",
};

export default function SubmitPage() {
  return (
    <AppShell active="submit">
      <Suspense fallback={<p className="page-lead">Loading form…</p>}>
        <SubmitPageContent />
      </Suspense>
    </AppShell>
  );
}
