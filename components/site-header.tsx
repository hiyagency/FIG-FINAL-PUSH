"use client";

import Link from "next/link";
import { Instagram, Menu, MessageCircle, PhoneCall, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/fig-utils";
import { businessInfo, navigationLinks } from "@/lib/site-data";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fbf8f2]/85 backdrop-blur-xl">
      <div className="container-shell">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B1F4B] text-sm font-semibold tracking-[0.16em] text-white">
              FIG
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#08152f]">
                Financial Investment Group
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Burhar, Shahdol
              </p>
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-[#08152f]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={businessInfo.primaryPhone.href} className="button-secondary">
              <PhoneCall className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={businessInfo.instagramHref}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
              aria-label={`Open FIG Instagram profile @${businessInfo.instagramHandle}`}
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <Link href="#contact" className="button-primary">
              Enquire
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#08152f] lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-slate-200 bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container-shell flex flex-col gap-4 py-5">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <a href={businessInfo.primaryPhone.href} className="button-secondary">
              <PhoneCall className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={businessInfo.whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="button-primary"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <a
              href={businessInfo.instagramHref}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
