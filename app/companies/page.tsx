import { AppShell } from "@/components/AppShell";
import { CompanyDirectory } from "@/features/companies/company-directory";

export const metadata = {
  title: "Companies — Typewise",
  description: "Browse verified product-based and service-based companies. Filter by name and location.",
};

export default function CompaniesPage() {
  return (
    <AppShell active="companies" wide>
      <div className="companies-page-header">
        <h1 className="page-title">Companies</h1>
        <p className="page-lead">
          Verified profiles only — filter by company name, location, or type. Switch between tiles
          and list view.
        </p>
      </div>
      <CompanyDirectory />
    </AppShell>
  );
}
