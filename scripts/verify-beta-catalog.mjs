import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });

const result = await client.fetch(`{
  "active": count(*[_type == "book" && stockStatus != "retired"]),
  "retired": count(*[_type == "book" && stockStatus == "retired"]),
  "withCoruNote": count(*[_type == "book" && stockStatus != "retired" && defined(coruNote)]),
  "withCover": count(*[_type == "book" && stockStatus != "retired" && defined(coverImage.asset)]),
  "withAffiliateLink": count(*[_type == "book" && stockStatus != "retired" && defined(affiliateLink)])
}`);

const incomplete = await client.fetch(`*[
  _type == "book" && stockStatus != "retired" && !defined(coruNote)
] | order(title asc) { _id, title, "slug": slug.current, stockStatus }`);

console.log(JSON.stringify(result, null, 2));
if (incomplete.length > 0) console.log(JSON.stringify({ incomplete }, null, 2));

if (result.active !== 24 || result.withCoruNote !== 24 || result.withCover !== 24) {
  throw new Error("The beta catalog is incomplete.");
}
