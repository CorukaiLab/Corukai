import { writeFile } from "node:fs/promises";

// Read-only public crawl. Never follows affiliate, API or Studio URLs.
const base = new URL(process.argv[2] || "https://corukai.es");
const output = process.argv[3];
const clean = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/&(?:amp|quot|lt|gt|#39|nbsp);/g, (entity) => ({ "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#39;": "'", "&nbsp;": " " })[entity]).replace(/\s+/g, " ").trim();
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), clean(m[2] ?? m[3])]));

async function read(url, redirect = "follow") {
  const start = performance.now();
  try {
    const response = await fetch(url, { redirect, signal: AbortSignal.timeout(20000), headers: { "User-Agent": "CoruKai-SEO-Audit/1.0" } });
    return { url: String(url), finalUrl: response.url, status: response.status, milliseconds: Math.round(performance.now() - start), headers: Object.fromEntries(response.headers), html: await response.text() };
  } catch (error) {
    return { url: String(url), error: error.message };
  }
}

function inspect(result) {
  if (result.error) return result;
  const { html, ...page } = result;
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const plain = clean(main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ""));
  const images = [...main.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const data = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => { try { return JSON.parse(m[1]); } catch { return { parseError: true }; } });
  return { ...page, bytes: Buffer.byteLength(html), title: clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]), description: metas.find((m) => m.name === "description")?.content, robots: metas.filter((m) => ["robots", "googlebot"].includes(m.name)), canonical: links.find((l) => l.rel === "canonical")?.href, lang: attrs(html.match(/<html\b[^>]*>/i)?.[0] || "").lang, social: metas.filter((m) => m.property?.startsWith("og:") || m.name?.startsWith("twitter:")), headings: [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: clean(m[2]) })), mainWords: plain ? plain.split(/\s+/).length : 0, mainText: plain, images: images.map(({ alt, src, width, height, loading, fetchpriority }) => ({ alt, src, width, height, loading, fetchpriority })), structuredData: data, internalLinks: [...new Set(anchors.flatMap((a) => { try { const url = new URL(a.href, result.finalUrl); return url.origin === base.origin && !/^\/(api|studio)(\/|$)/.test(url.pathname) ? [url.pathname + url.search] : []; } catch { return []; } }))], affiliateLinks: anchors.filter((a) => { try { return /(^|\.)(amazon\.es|amzn\.to)$/.test(new URL(a.href).hostname); } catch { return false; } }).map(({ href, rel, target }) => ({ href, rel, target })), paidDisclosure: plain.includes("Enlace pagado"), preloadImages: links.filter((l) => l.rel === "preload" && l.as === "image") };
}

const sitemap = await read(new URL("/sitemap.xml", base));
const urls = sitemap.html ? [...sitemap.html.matchAll(/<url>\s*<loc>(.*?)<\/loc>/g)].map((m) => clean(m[1])) : [];
if (!urls.length) throw new Error("No sitemap URLs found; crawl stopped.");
if (urls.some((url) => new URL(url).origin !== base.origin)) throw new Error("Unexpected sitemap origin; crawl stopped.");
const paths = [...new Set([...urls, ...["/aviso-legal", "/privacidad", "/cookies", "/cesta", "/libros", "/descubrir?camino=guiado", "/descubrir?camino=directo", "/tienda?genre=Fantas%C3%ADa", "/seo-audit-not-found"].map((path) => new URL(path, base).href)])];
const pages = [];
for (let i = 0; i < paths.length; i += 3) {
  pages.push(...await Promise.all(paths.slice(i, i + 3).map(async (url) => inspect(await read(url)))));
}
const known = new Set(pages.map((p) => new URL(p.url).pathname + new URL(p.url).search));
const additionalLinks = [...new Set(pages.flatMap((p) => p.internalLinks || []))].filter((path) => !known.has(path));
const linkChecks = [];
for (let i = 0; i < additionalLinks.length; i += 3) {
  linkChecks.push(...await Promise.all(additionalLinks.slice(i, i + 3).map(async (path) => {
    const result = await read(new URL(path, base));
    return { url: result.url, finalUrl: result.finalUrl, status: result.status, error: result.error, milliseconds: result.milliseconds };
  })));
}
const controls = await Promise.all([new URL("/robots.txt", base), "http://corukai.es/libros/seda?audit=1", "https://www.corukai.es/libros/seda?audit=1", "https://corukai.vercel.app/libros/seda?audit=1"].map(async (url) => { const result = await read(url, "manual"); return { ...result, html: String(url).endsWith("robots.txt") ? result.html : undefined }; }));
const result = { checkedAt: new Date().toISOString(), origin: base.origin, scope: "Public HTTP HTML only; no affiliate requests, no private metrics, no browser CWV measurement.", sitemap: { status: sitemap.status, count: urls.length, urls }, pages, linkChecks, controls };
if (output) await writeFile(output, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ checkedAt: result.checkedAt, sitemapCount: urls.length, crawled: pages.length, additionalLinks: linkChecks.length, errors: pages.filter((p) => p.error || p.status >= 400).map(({ url, status, error }) => ({ url, status, error })), output }, null, 2));
