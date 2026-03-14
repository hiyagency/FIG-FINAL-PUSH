import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { businessInfo, navigationLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-[#07142f] text-white">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] font-semibold text-[#08152f]">
              FIG
            </div>
            <div>
              <p className="text-lg font-semibold">{businessInfo.name}</p>
              <p className="text-sm text-white/65">
                Structured investment planning in Burhar, Shahdol
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-white/72">
            FIG provides structured investment opportunities designed for
            regular income-oriented planning, transparent communication,
            savings guidance, and long-term financial growth conversations for
            Burhar, Shahdol, and nearby Madhya Pradesh clients.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f8dd89]">
            Quick links
          </p>
          <div className="mt-5 grid gap-3 text-sm text-white/72">
            {navigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f8dd89]">
            Contact
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-white/72">
            <p>{businessInfo.address}</p>
            <p>{businessInfo.phones.map((phone) => phone.raw).join(" / ")}</p>
            <p>{businessInfo.email}</p>
            <a
              href={businessInfo.instagramHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              @{businessInfo.instagramHandle}
            </a>
            <p>Udyam Registration: {businessInfo.registrationNumber}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={businessInfo.primaryPhone.href} className="button-secondary">
              <PhoneCall className="h-4 w-4" />
              Call
            </a>
            <a
              href={businessInfo.whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={`mailto:${businessInfo.email}`} className="button-secondary">
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href={businessInfo.mapHref}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              <MapPin className="h-4 w-4" />
              Directions
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </p>
          <p>Serving Burhar, Dist. Shahdol, Madhya Pradesh, India</p>
        </div>
      </div>
    </footer>
  );
}
