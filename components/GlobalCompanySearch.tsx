"use client";

import { useState } from "react";
import { CompanySearchInput } from "@/components/CompanySearchInput";
import { IconSearch } from "@/components/PortalIcons";

type GlobalCompanySearchProps = {
  variant?: "nav" | "inline";
  inputId?: string;
};

export function GlobalCompanySearch({
  variant = "inline",
  inputId = "global-company-search",
}: GlobalCompanySearchProps) {
  const [query, setQuery] = useState("");

  return (
    <div className={`global-company-search global-company-search-${variant}`}>
      <IconSearch className="global-company-search-icon" size={17} />
      <CompanySearchInput
        value={query}
        onChange={setQuery}
        inputId={inputId}
        variant={variant}
      />
    </div>
  );
}
