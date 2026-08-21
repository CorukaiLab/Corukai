import { ALL_PRODUCTS } from "../src/lib/catalog.ts";

const expectedProducts = 27;
const localChecks = ALL_PRODUCTS.map((product) => ({
  slug: product.slug,
  href: product.affiliateUrl,
  hasLink: Boolean(product.affiliateUrl),
  approvedShortDomain: product.affiliateUrl
    ? new URL(product.affiliateUrl).hostname === "link.amazon"
    : false,
}));

const duplicateLinks = localChecks
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
for (let index = 0; index < localChecks.length; index += 4) {
  remoteChecks.push(...await Promise.all(localChecks.slice(index, index + 4).map(checkRedirect)));
}

const failures = remoteChecks.filter((entry) => (
  !entry.hasLink || !entry.approvedShortDomain || !entry.reachesAmazonEs || entry.status < 200 || entry.status >= 400
));

const report = {
  expectedProducts,
  products: ALL_PRODUCTS.length,
  configuredLinks: localChecks.filter((entry) => entry.hasLink).length,
  uniqueLinks: new Set(localChecks.map((entry) => entry.href).filter(Boolean)).size,
  duplicateLinks,
  successfulRedirects: remoteChecks.length - failures.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (
  ALL_PRODUCTS.length !== expectedProducts ||
  report.configuredLinks !== expectedProducts ||
  duplicateLinks.length > 0 ||
  failures.length > 0
) {
  process.exitCode = 1;
}
