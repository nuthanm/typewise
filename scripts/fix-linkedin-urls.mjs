#!/usr/bin/env node
/**
 * Apply verified LinkedIn slug mapping and report mismatches.
 */
import { readFileSync, writeFileSync } from "node:fs";

/** slug -> verified LinkedIn company path (after /company/) */
export const LINKEDIN_BY_SLUG = {
  cognizant: "cognizant",
  "amazon-india": "amazon",
  "google-india": "google",
  "microsoft-india": "microsoft",
  postman: "postman-platform",
  policybazaar: "policybazaar-com",
  dream11: "dream11",
  bigbasket: "bigbasket-com",
  lenskart: "lenskart-com",
  unacademy: "unacademy",
  byjus: "byjus",
  oyo: "oyo-rooms",
  myntra: "myntra",
  snapdeal: "snapdeal",
  chargebee: "chargebee",
  browserstack: "browserstack",
  clevertap: "clevertap",
  hasura: "hasura",
  moengage: "moengage",
  darwinbox: "darwinbox",
  innovaccer: "innovaccer",
  leadsquared: "leadsquared",
  mphasis: "mphasis",
  "persistent-systems": "persistent-systems",
  hexaware: "hexaware-technologies",
  cyient: "cyient",
  "l-t-technology-services": "l&t-technology-services-limited",
  "accenture-india": "accenture",
  "ibm-india": "ibm",
  "oracle-india": "oracle",
  "sap-labs-india": "sap",
  "adobe-india": "adobe",
  "salesforce-india": "salesforce",
  "uber-india": "uber-com",
  sharechat: "sharechat",
  jupiter: "jupiter-money",
  slice: "sliceit",
  boat: "boat-lifestyle",
  mamaearth: "mamaearth",
  pharmeasy: "pharmeasy",
  "urban-company": "urban-company",
  rapido: "rapido-bike-taxi",
  blackbuck: "blackbuck",
  udaan: "udaan-com",
  inmobi: "inmobi",
  genpact: "genpact",
  "exl-service": "exl-service",
  coforge: "coforge-tech",
  "happiest-minds": "happiest-minds-technologies",
  birlasoft: "birlasoft",
  zensar: "zensar",
  "thoughtworks-india": "thoughtworks",
  "epam-india": "epam-systems",
  nagarro: "nagarro",
  druva: "druva",
  icertis: "icertis",
  practo: "practo",
  "info-edge": "info-edge-india-ltd",
  makemytrip: "makemytrip",
  zepto: "zepto-app",
  blinkit: "blinkit",
  coinswitch: "coinswitch",
  coindcx: "coindcx",
  bharatpe: "bharatpe",
  "pine-labs": "pine-labs",
  khatabook: "khatabook",
  apna: "apnahq",
  ninjacart: "ninjacart",
  "mu-sigma": "mu-sigma-business-analytics",
  "publicis-sapient": "publicis-sapient",
  "globant-india": "globant",
  "ramco-systems": "ramco-systems",
  "sonata-software": "sonata-software",
  mastek: "mastek",
  firstsource: "firstsource-solutions",
  wns: "wns-global-services",
  cardekho: "cardekho-com",
  redbus: "redbus-in",
  porter: "porter-in",
  "skyroot-aerospace": "skyroot-aerospace",
  "agnikul-cosmos": "agnikul-cosmos",
  razorpay: "razorpay",
  tcs: "tata-consultancy-services",
  zoho: "zoho",
  freshworks: "freshworks",
  infosys: "infosys",
  flipkart: "flipkart",
  kanini: "kanini",
  inoryasoft: "inoryasoft",
  capgemini: "capgemini",
  ces: "ces",
  deloitte: "deloitte",
  astrazeneca: "astrazeneca",
  phonepe: "phonepe",
  swiggy: "swiggy",
  wipro: "wipro",
  zomato: "zomato",
  paytm: "paytm",
  hcl: "hcltech",
  "tech-mahindra": "tech-mahindra",
  meesho: "meesho",
  cred: "credapp",
  ola: "olacabs-com",
  zerodha: "zerodha",
  groww: "groww.in",
  nykaa: "nykaa",
  delhivery: "delhivery",
  ltimindtree: "ltimindtree",
};

function linkedinUrl(slug) {
  const path = LINKEDIN_BY_SLUG[slug] ?? slug;
  return `https://www.linkedin.com/company/${path}`;
}

function linkedinPath(url) {
  const m = url?.match(/linkedin\.com\/company\/([^/?#]+)/i);
  return m?.[1] ?? null;
}

const filePath = "data/companies.json";
const data = JSON.parse(readFileSync(filePath, "utf8"));
const fixes = [];

for (const company of data.companies) {
  const expected = linkedinUrl(company.slug);
  const expectedPath = linkedinPath(expected);
  const currentPath = linkedinPath(company.linkedin);

  if (currentPath !== expectedPath) {
    fixes.push({
      slug: company.slug,
      from: company.linkedin,
      to: expected,
    });
    company.linkedin = expected;
  }
}

data.catalogUpdated = new Date().toISOString().slice(0, 10);
writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
console.log(JSON.stringify({ fixed: fixes.length, fixes }, null, 2));
