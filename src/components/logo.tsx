"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

/**
 * App logo — flame icon + wordmark, identical size across every page.
 * Always links to the homepage and scrolls to the very top on click.
 */
export function Logo() {
  return (
    <Link
      href="/"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center gap-2"
    >
      <Flame className="h-5 w-5 text-orange-500" />
      <span className="text-lg font-semibold tracking-tight">Avtomatic.AI</span>
    </Link>
  );
}
