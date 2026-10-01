import { readFile, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

// Compare existing pages without ever requesting their external affiliate URLs.
const [baselinePath, targetOrigin, outputPath] = process.argv.slice(2);
if (!baselinePath || !targetOrigin) throw new Error("Provide a baseline report and target origin.");
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const origin = new URL(targetOrigin).origin;
if (!["https://corukai.es", "http://127.0.0.1:3024"].includes(origin)) throw new Error("Unexpected target origin.");
const expectedChanges = new Set(["/libros/hacia-rutas-salvajes", "/libros/kalpa-imperial", "/libros/carta-desconocida", "/cuaderno/historias-breves-para-recuperar-el-habito"]);
const clean = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/&(?:amp|quot|lt|gt|#39|nbsp);/g, (entity) => ({ "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#39;": "'", "&nbsp;": " " })[entity]).replace(/\s+/g, " ").trim();
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), clean(m[2] ?? m[3])]));
const checks = [];
for (let i = 0; i < baseline.pages.length; i += 3) {
  checks.push(...await Promise.all(baseline.pages.slice(i, i + 3).map(async (page) => {
    const oldUrl = new URL(page.url);
    const path = oldUrl.pathname + oldUrl.search;
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
    const mainText = clean(main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ""));
    const affiliateLinks = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => attrs(m[0])).filter((a) => {
      try { return /(^|\.)(amazon\.es|amzn\.to)$/.test(new URL(a.href).hostname); } catch { return false; }
    }).map(({ href, rel, target }) => ({ href, rel, target }));
    return { path, status: response.status, statusUnchanged: response.status === page.status, textUnchanged: page.mainText === mainText, textChangeAllowed: expectedChanges.has(oldUrl.pathname), affiliateUnchanged: isDeepStrictEqual(affiliateLinks, page.affiliateLinks), paidDisclosurePreserved: !page.paidDisclosure || mainText.includes("Enlace pagado") };
  })));
}
const failures = checks.filter((check) => !check.statusUnchanged || (!check.textUnchanged && !check.textChangeAllowed) || !check.affiliateUnchanged || !check.paidDisclosurePreserved);
const result = { checkedAt: new Date().toISOString(), origin, scope: "HTTP comparison; no external affiliate requests", checks, failures };
if (outputPath) await writeFile(outputPath, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ pages: checks.length, changedText: checks.filter((check) => !check.textUnchanged).map((check) => check.path), failures }, null, 2));
if (failures.length) process.exitCode = 1;
