import { readFileSync } from "node:fs";
const companies = JSON.parse(readFileSync("data/companies.json","utf8")).companies;
const TIMEOUT = 8000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchStatus(url, attempt = 1) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TypewiseBot/1.0)", Accept: "text/html" },
    });
    if (res.status === 429 && attempt < 4) {
      clearTimeout(t);
      await sleep(3000 * attempt);
      return fetchStatus(url, attempt + 1);
    }
    return { status: res.status, url: res.url };
  } catch (e) {
    return { status: null, error: e.name === "AbortError" ? "timeout" : String(e.message) };
  } finally {
    clearTimeout(t);
  }
}

const results = { not404: [], four04: [], other: [] };
for (const co of companies) {
  if (!co.linkedin) continue;
  const r = await fetchStatus(co.linkedin);
  const entry = { slug: co.slug, linkedin: co.linkedin, ...r };
  if (r.status === 404) results.four04.push(entry);
  else if (r.error || r.status >= 400) results.other.push(entry);
  else results.not404.push(entry);
  await sleep(1500);
  process.stderr.write(".");
}
console.error("");
console.log("LINKEDIN CONFIRMED 404:", results.four04.length);
for (const x of results.four04) console.log(`${x.slug}: ${x.status} ${x.linkedin}`);
console.log("\nLINKEDIN OTHER ISSUES (non-2xx after retries, not 404):");
for (const x of results.other) console.log(`${x.slug}: ${x.status ?? x.error} ${x.linkedin}`);
