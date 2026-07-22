import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CompanyDetail } from "@/features/company/company-detail";
import { CompanyPipelineDetail } from "@/features/company/company-pipeline-detail";
import { getCompanyBySlug, getCompanyEntryBySlug, ALL_COMPANY_SLUGS } from "@/lib/companies";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ALL_COMPANY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getCompanyEntryBySlug(slug);
  if (!entry) return { title: "Company not found — Typewise" };

  const company = getCompanyBySlug(slug);
  return {
    title: `${entry.name} — Typewise`,
    description: company?.tagline ?? entry.note ?? `${entry.name} on Typewise`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const entry = getCompanyEntryBySlug(slug);
  if (!entry) notFound();

  const company = getCompanyBySlug(slug);

  return (
    <AppShell active="companies" wide>
      {company ? <CompanyDetail company={company} /> : <CompanyPipelineDetail entry={entry} />}
    </AppShell>
  );
}
