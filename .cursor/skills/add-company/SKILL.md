---
name: add-company
description: >-
  Research and add a new company profile to Typewise from official sources.
  Use when the user says "Add this company", "Add company", "Add <name> to Typewise",
  or asks to create, draft, or verify a company profile.
---

# Add Company to Typewise

## Trigger phrases

- "Add this company: PhonePe"
- "Add company Meesho"
- "Verify Swiggy" / "Publish the Wipro profile"

## Before starting

1. Check duplicates in `data/companies.json` and `data/pipeline.json` (by slug and name).
2. If already **verified**, tell the user and offer to update fields instead.
3. If in **pipeline**, continue research and build the full profile.

Slug: use `slugifyCompanyName()` from `lib/companies.ts` (lowercase, hyphens).

## Research rules

**Only use official or authoritative sources:**
- Company website (About, Careers, Products, Locations, **Leadership / Team**)
- Annual report / investor relations (headcount)
- LinkedIn company page (secondary — cross-check against official site)

**Never publish as fact:**
- Glassdoor, AmbitionBox, random blogs, Wikipedia alone
- Guessed headcount, work model, or category without a source URL

**Category classification** (`product` | `service` | `hybrid` | `unknown`):
- **product** — builds and sells own software/products (Razorpay, Zoho)
- **service** — client delivery, consulting, outsourcing (TCS, Infosys)
- **hybrid** — significant product AND services arms (Flipkart)
- **unknown** — only if official sources are ambiguous; explain in note

## Required fields (minimum draft)

| Field | Notes |
|-------|-------|
| `slug`, `name`, `category` | Required |
| `tagline` | One line, ≤120 chars |
| `description` | 1–2 sentences from official About copy |
| `website` | Official homepage |
| `hq` | City, country |
| `domains`, `tags` | At least 2 domains; tags like Unicorn, MNC |
| `sources` | Every fact must trace to a `{ label, url }` entry |
| `lastVerified` | Today's ISO date |
| `verificationStatus` | `"in_progress"` until user approves |

## Recommended fields (fill when available)

`founded`, `officeCities`, `officeCountries`, `totalOfficeLocations`, `locationsUrl`, `contactUrl`, `headcountIndia`, `headcountGlobal`, `headcountNote`, `products`, `services`, `onsitePolicy`, `careersUrl`, `linkedin`, `twitter`, `leadership`, `vision`

Optional Wikidata bootstrap: `node scripts/enrich-wikidata.mjs "Company Name" slug` — always replace draft fields with official sources.

## Profile UI — what renders where

The verified profile page (`features/company/company-detail.tsx`) uses a **3-column layout**:

| Column | Content |
|--------|---------|
| **Left sidebar** | Quick links (website, careers, LinkedIn, etc.) + **Leadership** panel |
| **Main column** | About, Locations, Domains & tags, Products, Services |
| **Right sidebar** | Headcount note, Sources, edit CTA |

There is **no "On this page" section nav** — do not expect or document anchor navigation in the sidebar.

### Leadership (left sidebar)

**Schema:**

```json
"leadership": [
  { "name": "Full Name", "role": "Founder & Chief Scientist" },
  { "name": "Full Name", "role": "Group CEO & Co-founder" },
  { "name": "Full Name", "role": "COO" }
]
```

**Research priority — add when officially published:**

1. **Main founder** — use role text that includes `Founder` but not `Co-founder` (e.g. `"Founder & CEO"`, `"Founder & Chief Scientist"`)
2. **Co-founders** — `"Co-founder"`, `"CEO & Co-founder"`, etc.
3. **CEO** — current group CEO if different from founder
4. **COO** — only if listed on official About / Leadership page
5. **CTO** — only if listed on official About / Leadership page

**Ordering:** The app sorts automatically via `sortLeadership()` in `lib/companies.ts` (founder → co-founder → CEO → COO → CTO → others). You may list entries in any order in JSON; sorting is applied at render time.

**Do not invent roles.** If a company has no public COO or CTO (common at large corps), omit them. Division heads (e.g. "CEO, ManageEngine") are acceptable when cited from the official About page — prefer group-level C-suite when available.

**Main founder highlight:** Entries where `role` contains `founder` but not `co-founder` get visual emphasis via `isMainFounder()`.

**Good examples in catalog:** `zoho` (founder + group CEO + co-founder), `razorpay` (CEO & Co-founder, CTO & Co-founder), `kanini` (CEO & Founder, COO).

### Locations (main column)

Shown when `shouldShowLocationsSection()` returns true — typically when there are multiple `officeCities`, `officeCountries`, or an official presence link.

| Field | UI behavior |
|-------|-------------|
| `hq` | Always shown in hero stats **and** as a highlighted HQ card inside Locations |
| `officeCities` | Rendered as city chips with map-pin icons (preview capped at 6 via `OFFICE_CITY_PREVIEW_LIMIT`) |
| `officeCountries` | Rendered as muted country chips |
| `locationsUrl` | Preferred outbound link ("Office locations" or "All offices (55 countries)") |
| `contactUrl` | Fallback outbound link ("Contact & locations") when no dedicated locations page |
| `totalOfficeLocations` | Used in the locations link label when set |

**Fill guidance:** Add `officeCities` for major hiring hubs (not every small office). Use `locationsUrl` when the company publishes an official worldwide/offices page; otherwise `contactUrl`.

### Domains & tags (main column)

Always shown. **Keep domains and tags separate** — they render in two distinct groups:

| Array | Purpose | UI |
|-------|---------|-----|
| `domains` | Industry / capability (SaaS, Fintech, IT Services) | Filled green chips |
| `tags` | Company traits (Unicorn, MNC, Bootstrapped) | Dashed outline chips |

Minimum: **2 domains**. Add **1–3 tags** when they help discovery (e.g. `"Public company"`, `"Global delivery"`).

### Products & services (main column)

| Field | UI |
|-------|-----|
| `products` | Responsive grid tiles with package icons — use official product names |
| `services` | Same bullet-list pattern as before (service companies) |

Use concise official names (e.g. `"Zoho CRM"`, not marketing blurbs). Omit the section entirely if the array is empty.

### About (main column)

- `description` — required; 1–2 factual sentences
- `vision` — optional sub-block when the official site states a mission/vision

## Leadership role cheat sheet

| Role in data | When to use |
|--------------|-------------|
| `"Founder & …"` | Original/main founder; must not say "Co-founder" |
| `"… & Co-founder"` | Any co-founder |
| `"CEO"`, `"CEO & MD"`, `"Group CEO"` | Current chief executive |
| `"COO"` | Chief Operating Officer — official source only |
| `"CTO"`, `"CTO & Co-founder"` | Chief Technology Officer — official source only |

Avoid stale titles. If leadership changed recently (e.g. founder stepped down to another role), use the **current** title from the official About page and cite the source.

## Where to write data

### Step 1 — Draft (default)

Add the **full profile** to `data/companies.json` → `companies[]` with:

```json
"verificationStatus": "in_progress"
```

If the company was in `data/pipeline.json`, **keep it there** until verified (or remove from `unverified` once draft exists).

Update `catalogUpdated` to today's date.

### Step 2 — Present for review

After editing JSON, show the user a **review table**:

| Field | Value | Source |
|-------|-------|--------|
| Category | product | About page |
| … | … | … |

End with:
- Link path: `/companies/{slug}` (shows pipeline placeholder until verified)
- Ask: **"Review the draft above. Reply 'verify {name}' when ready to publish."**

Do **not** set `verified` unless the user explicitly approves.

### Step 3 — Verify (user approves)

When user says "verify", "publish", "looks good", or similar:

1. Set `verificationStatus`: `"verified"`
2. Set `lastVerified` to today
3. Remove from `data/pipeline.json` (`inProgress` or `unverified`)
4. Update `catalogUpdated` in `data/companies.json`
5. Confirm: profile live at `/companies/{slug}` with Verified badge

## Reference profiles

Copy structure and tone from existing entries in `data/companies.json`:
- Product: `razorpay`, `zoho`, `freshworks`
- Service: `tcs`, `infosys`, `kanini` (leadership + multi-country locations)
- Hybrid: `flipkart`

**Leadership reference:** `zoho` (founder-first, multiple executives), `razorpay` (co-founder CEO/CTO), `kanini` (founder + COO).

**Locations reference:** `tcs` (`locationsUrl` + many cities), `zoho` (`officeCities` + `contactUrl`), `kanini` (`officeCountries` + `officeCities`).

## Quality checklist

- [ ] Category matches what the company **builds** vs **delivers for clients**
- [ ] Every URL loads and matches the cited field
- [ ] `headcountNote` added when numbers are approximate
- [ ] `onsitePolicy` phrased cautiously ("Hybrid — verify on careers page")
- [ ] No duplicate URLs across `sources` and quick links (app dedupes automatically)
- [ ] Slug is unique across catalog + pipeline
- [ ] **Leadership:** main founder role uses `"Founder"` (not `"Co-founder"`); CEO/COO/CTO only when officially listed
- [ ] **Leadership:** roles reflect current titles, not outdated press coverage
- [ ] **Locations:** `officeCities` lists hiring hubs; HQ stays in `hq` only (not duplicated in cities unless it's also a major office)
- [ ] **Domains & tags:** at least 2 domains; traits go in `tags`, not mixed into `domains`
- [ ] **Products/services:** official names only; omit empty arrays

## Commands after edit

Run build or lint if JSON was changed significantly. Do not commit unless user asks.

## Code helpers (for agents)

| Helper | File | Purpose |
|--------|------|---------|
| `sortLeadership()` | `lib/companies.ts` | Sorts leadership for display (founder → co-founder → CEO → COO → CTO) |
| `isMainFounder(role)` | `lib/companies.ts` | Detects main-founder roles for UI highlight |
| `shouldShowLocationsSection()` | `lib/companies.ts` | Whether Locations card appears |
| `getOfficeCityPreview()` | `lib/companies.ts` | Caps city list at 6 for preview |
| `getOfficialPresenceLink()` | `lib/companies.ts` | Picks `locationsUrl` or `contactUrl` for outbound link |
| `slugifyCompanyName()` | `lib/companies.ts` | Generates URL slug |
