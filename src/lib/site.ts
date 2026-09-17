const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://corukai.es";

export const SITE_URL = configuredSiteUrl.replace(/\/$/u, "");
export const SITE_NAME = "CoruKai";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
