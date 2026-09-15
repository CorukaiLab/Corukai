import "server-only";

import type { AmazonOffer, Product } from "@/lib/products";

const TOKEN_ENDPOINT = "https://api.amazon.co.uk/auth/o2/token";
const API_ENDPOINT = "https://creatorsapi.amazon/catalog/v1/getItems";
const DEFAULT_MARKETPLACE = "www.amazon.es";
const OFFER_CACHE_SECONDS = 60 * 60;

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

interface CreatorsItem {
  asin?: string;
  offersV2?: {
    listings?: Array<{
      availability?: { message?: string; type?: string };
      price?: { money?: { amount?: number; currency?: string; displayAmount?: string } };
    }>;
  };
}

interface GetItemsResponse {
  itemsResult?: { items?: CreatorsItem[] };
}

let tokenCache: { value: string; expiresAt: number } | undefined;

function getConfiguration() {
  const clientId = process.env.AMAZON_CREATORS_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET;
  const partnerTag = process.env.AMAZON_ASSOCIATE_TAG;
  const marketplace = process.env.AMAZON_MARKETPLACE || DEFAULT_MARKETPLACE;
  if (!clientId || !clientSecret || !partnerTag) return null;
  return { clientId, clientSecret, partnerTag, marketplace };
}

async function getAccessToken(clientId: string, clientSecret: string) {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.value;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Amazon token request failed (${response.status})`);

  const token = (await response.json()) as TokenResponse;
  tokenCache = { value: token.access_token, expiresAt: Date.now() + token.expires_in * 1000 };
  return token.access_token;
}

function isbn13ToIsbn10(isbn: string) {
  const normalized = isbn.replace(/[^0-9X]/gi, "").toUpperCase();
  if (/^[0-9]{9}[0-9X]$/.test(normalized)) return normalized;
  if (!/^978[0-9]{10}$/.test(normalized)) return undefined;

  const base = normalized.slice(3, 12);
  const total = [...base].reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0);
  const check = (11 - (total % 11)) % 11;
  return `${base}${check === 10 ? "X" : check}`;
}

function getProductAsin(product: Product) {
  const explicitAsin = product.amazonAsin?.trim().toUpperCase();
  if (explicitAsin && /^[A-Z0-9]{10}$/.test(explicitAsin)) return explicitAsin;
  return product.isbn ? isbn13ToIsbn10(product.isbn) : undefined;
}

async function fetchOfferBatch(asins: string[], configuration: NonNullable<ReturnType<typeof getConfiguration>>) {
  const token = await getAccessToken(configuration.clientId, configuration.clientSecret);
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": configuration.marketplace,
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: "ASIN",
      marketplace: configuration.marketplace,
      partnerTag: configuration.partnerTag,
      resources: ["offersV2.listings.price", "offersV2.listings.availability"],
    }),
    next: { revalidate: OFFER_CACHE_SECONDS },
  });
  if (!response.ok) throw new Error(`Amazon GetItems request failed (${response.status})`);

  const payload = (await response.json()) as GetItemsResponse;
  const fetchedAt = new Date().toISOString();
  const offers = new Map<string, AmazonOffer>();
  for (const item of payload.itemsResult?.items || []) {
    const listing = item.offersV2?.listings?.[0];
    const money = listing?.price?.money;
    if (!item.asin || typeof money?.amount !== "number" || !money.currency || !money.displayAmount) continue;
    offers.set(item.asin, {
      amount: money.amount,
      currency: money.currency,
      displayAmount: money.displayAmount,
      availability: listing?.availability?.message || listing?.availability?.type,
      fetchedAt,
    });
  }
  return offers;
}

export async function attachAmazonOffers(products: Product[]) {
  const configuration = getConfiguration();
  if (!configuration) return products;

  const asinBySlug = new Map(products.flatMap((product) => {
    const asin = getProductAsin(product);
    return asin ? [[product.slug, asin] as const] : [];
  }));
  const uniqueAsins = [...new Set(asinBySlug.values())];
  if (uniqueAsins.length === 0) return products;

  try {
    const batches = Array.from({ length: Math.ceil(uniqueAsins.length / 10) }, (_, index) =>
      uniqueAsins.slice(index * 10, index * 10 + 10));
    const results = await Promise.all(batches.map((batch) => fetchOfferBatch(batch, configuration)));
    const offers = new Map(results.flatMap((result) => [...result.entries()]));
    return products.map((product) => {
      const asin = asinBySlug.get(product.slug);
      return asin && offers.has(asin)
        ? { ...product, amazonAsin: asin, amazonOffer: offers.get(asin) }
        : product;
    });
  } catch (error) {
    console.error("Amazon Creators API is unavailable; prices remain hidden.", error);
    return products;
  }
}
