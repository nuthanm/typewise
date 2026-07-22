import { AppShell } from "@/components/AppShell";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";

export const metadata = {
  title: "Feedback — Typewise",
  description: "Share whether Typewise helped you pick the right company for your career.",
};

export default function FeedbackPage() {
  return (
    <AppShell active="feedback">
      <div className="page-narrow">
        <FormPageHeader
          eyebrow="Your opinion matters"
          title="Site feedback"
          lead={
            <>
              Did Typewise help you understand whether a company is{" "}
              <strong>product-based or service-based</strong> before applying? We read every
              response.
            </>
          }
        />
        <FormPanel>
          <FeedbackForm />
        </FormPanel>
      </div>
    </AppShell>
  );
}
