"use client";

import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

interface AffiliateLinkProps {
  href: string;
  slug: string;
  genre: string;
  placement: "ficha" | "catalogo" | "home" | "cesta";
  className?: string;
  children: ReactNode;
}

export function AffiliateLink({
  href,
  slug,
  genre,
  placement,
  className,
  children,
}: AffiliateLinkProps) {
  function handleClick() {
    track("affiliate_click", {
      product: slug,
      genre,
      placement,
      merchant: "amazon-es",
    });
  }

  return (
    <span className="affiliate-action">
      <a
        className={className}
        href={href}
        rel="sponsored nofollow"
        onClick={handleClick}
      >
        {children}
      </a>
      <small>Enlace pagado</small>
    </span>
  );
}
