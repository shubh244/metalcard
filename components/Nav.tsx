"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/cards", label: "Cards" },
  { href: "/compare", label: "Compare" },
  { href: "/quiz", label: "Find my card" },
  { href: "/calculator", label: "Calculator" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 border-b border-white/5 bg-graphite/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ice transition group-hover:text-white">
            CardForge
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-silver/50 sm:inline">
            Metal offers
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                data-active={active ? "true" : "false"}
                className={`nav-link ${
                  active ? "text-ice" : "text-silver/60 hover:text-ice"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/quiz" className="btn-primary btn-lift !px-4 !py-2 text-xs">
            Get matched
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden text-silver"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-silver hover:text-ice"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
