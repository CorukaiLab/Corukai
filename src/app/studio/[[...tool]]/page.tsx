import type { Metadata } from "next";
import { SanityStudio } from "@/components/sanity-studio";

export const dynamic = "force-static";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  return <SanityStudio />;
}
