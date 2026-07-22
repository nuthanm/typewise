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
- Company website (About, Careers, Products, Locations, Leadership)
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
- Service: `tcs`, `infosys`
- Hybrid: `flipkart`

## Quality checklist

- [ ] Category matches what the company **builds** vs **delivers for clients**
- [ ] Every URL loads and matches the cited field
- [ ] `headcountNote` added when numbers are approximate
- [ ] `onsitePolicy` phrased cautiously ("Hybrid — verify on careers page")
- [ ] No duplicate URLs across `sources` and quick links (app dedupes automatically)
- [ ] Slug is unique across catalog + pipeline

## Commands after edit

Run build or lint if JSON was changed significantly. Do not commit unless user asks.
