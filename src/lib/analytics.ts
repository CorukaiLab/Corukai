"use client";

import { track } from "@vercel/analytics";

type AnalyticsValue = string | number | boolean | null;

export function trackCoruEvent(
  name: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  track(name, properties);
}
