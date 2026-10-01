import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

interface SocialMetadataOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "book";
  image?: { url: string; alt: string };
}

export function createSocialMetadata({
  title,
  description,
  path,
  type = "website",
  image = { url: "/opengraph-image", alt: "CoruKai, leer debería sentirse bien" },
}: SocialMetadataOptions): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type,
      locale: "es_ES",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
