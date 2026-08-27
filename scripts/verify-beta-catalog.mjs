import { getCliClient } from "sanity/cli";
import { ALL_PRODUCTS } from "../src/lib/catalog.ts";

const client = getCliClient({ apiVersion: "2026-07-04" });

const result = await client.fetch(`{
  "active": count(*[_type == "book" && stockStatus in ["available", "affiliate"]]),
  "catalogue": count(*[_type == "book" && stockStatus in ["available", "affiliate"] && coalesce(isCoruPick, false) == false]),
  "coruPicks": count(*[_type == "book" && stockStatus in ["available", "affiliate"] && isCoruPick == true]),
  "retired": count(*[_type == "book" && stockStatus == "retired"]),
  "withCoruNote": count(*[_type == "book" && stockStatus in ["available", "affiliate"] && defined(coruNote)]),
  "withCover": count(*[_type == "book" && stockStatus in ["available", "affiliate"] && defined(coverImage.asset)]),
  "withAffiliateLink": count(*[_type == "book" && stockStatus in ["available", "affiliate"] && defined(affiliateLink)])
}`);

const incomplete = await client.fetch(`*[
  _type == "book" &&
  stockStatus in ["available", "affiliate"] &&
  (!defined(title) || !defined(slug.current) || !defined(author->name) ||
   !defined(genre->title) || !defined(primaryEmotion->title) ||
   !defined(coverImage.asset) || !defined(priceCents) || !defined(format) ||
   !defined(publicationYear) || !defined(vibe) || !defined(shortDescription) ||
   !defined(idealMoment) || !defined(coruNote) || !defined(readingTime) ||
   !defined(readingPace) || !defined(storyEntry) || !defined(creativeSpark) ||
   !defined(affiliateLink) || !defined(catalogOrder))
] | order(title asc) { _id, title, "slug": slug.current, stockStatus }`);

const remoteProducts = await client.fetch(`*[
  _type == "book" && stockStatus in ["available", "affiliate"]
] { "slug": slug.current, affiliateLink }`);

const remoteBySlug = new Map(remoteProducts.map((book) => [book.slug, book.affiliateLink]));
const mismatchedLinks = ALL_PRODUCTS.flatMap((book) => {
  const remoteLink = remoteBySlug.get(book.slug);
  return remoteLink === book.affiliateUrl
    ? []
    : [{ slug: book.slug, expected: book.affiliateUrl, actual: remoteLink ?? null }];
});

console.log(JSON.stringify(result, null, 2));
if (incomplete.length > 0) console.log(JSON.stringify({ incomplete }, null, 2));
if (mismatchedLinks.length > 0) console.log(JSON.stringify({ mismatchedLinks }, null, 2));

if (
  result.active !== 27 ||
  result.catalogue !== 24 ||
  result.coruPicks !== 3 ||
  result.withCoruNote !== 27 ||
  result.withCover !== 27 ||
  result.withAffiliateLink !== 27 ||
  incomplete.length > 0 ||
  mismatchedLinks.length > 0
) {
  throw new Error("The beta catalog is incomplete.");
}
