"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { trackCoruEvent } from "@/lib/analytics";

interface TrackedBookLinkProps {
  slug: string;
  genre: string;
  placement: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function TrackedBookLink({
  slug,
  genre,
  placement,
  className,
  style,
  children,
}: TrackedBookLinkProps) {
  return (
    <Link
      className={className}
      href={`/libros/${slug}`}
      style={style}
      onClick={() => trackCoruEvent("product_open", { product: slug, genre, placement })}
    >
      {children}
    </Link>
  );
}
