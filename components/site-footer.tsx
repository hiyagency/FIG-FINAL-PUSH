import Link from "next/link";

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
            regular income-oriented planning, transparent communication, and
            long-term financial growth conversations.
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
            <p>Udyam Registration: {businessInfo.registrationNumber}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </p>
          <p>Burhar, Dist. Shahdol, Madhya Pradesh, India</p>
        </div>
      </div>
    </footer>
  );
}
