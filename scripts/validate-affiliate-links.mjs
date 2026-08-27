import { createClient } from "@sanity/client";

const expectedProducts = 27;
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eig4gq4g",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-04",
  useCdn: false,
});

const products = await client.fetch(`*[
  _type == "book" && stockStatus in ["available", "affiliate"]
] | order(catalogOrder asc) { "slug": slug.current, "href": affiliateLink }`);

const sanityChecks = products.map((product) => ({
  slug: product.slug,
  href: product.href,
  hasLink: Boolean(product.href),
  approvedShortDomain: product.href
    ? new URL(product.href).hostname === "link.amazon"
    : false,
}));

const duplicateLinks = sanityChecks
  .filter((entry) => entry.href)
  .filter((entry, index, entries) => entries.findIndex((candidate) => candidate.href === entry.href) !== index)
  .map((entry) => entry.slug);

async function checkRedirect(entry) {
  if (!entry.href) return { ...entry, status: 0, destination: null, reachesAmazonEs: false };

  try {
    const response = await fetch(entry.href, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "CoruKai affiliate-link validation" },
      signal: AbortSignal.timeout(15_000),
    });
    const destination = new URL(response.url);
    return {
      ...entry,
      status: response.status,
      destination: response.url,
      reachesAmazonEs: destination.hostname === "amazon.es" || destination.hostname.endsWith(".amazon.es"),
    };
  } catch (error) {
    return {
      ...entry,
      status: 0,
      destination: null,
      reachesAmazonEs: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const remoteChecks = [];
for (let index = 0; index < sanityChecks.length; index += 4) {
  remoteChecks.push(...await Promise.all(sanityChecks.slice(index, index + 4).map(checkRedirect)));
}

const failures = remoteChecks.filter((entry) => (
  !entry.hasLink || !entry.approvedShortDomain || !entry.reachesAmazonEs || entry.status < 200 || entry.status >= 400
));

const report = {
  expectedProducts,
  products: products.length,
  configuredLinks: sanityChecks.filter((entry) => entry.hasLink).length,
  uniqueLinks: new Set(sanityChecks.map((entry) => entry.href).filter(Boolean)).size,
  duplicateLinks,
  successfulRedirects: remoteChecks.length - failures.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (
  products.length !== expectedProducts ||
  report.configuredLinks !== expectedProducts ||
  duplicateLinks.length > 0 ||
  failures.length > 0
) {
  process.exitCode = 1;
}
