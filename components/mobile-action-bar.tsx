import { Instagram, Mail, MessageCircle, PhoneCall } from "lucide-react";

import { businessInfo } from "@/lib/site-data";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#08152f]/96 px-3 py-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        <a
          href={businessInfo.primaryPhone.href}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 px-3 py-3 text-xs font-semibold text-white"
        >
          <PhoneCall className="h-4 w-4" />
          Call
        </a>
        <a
          href={businessInfo.whatsAppHref}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#D4AF37] px-3 py-3 text-xs font-semibold text-[#08152f]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={businessInfo.instagramHref}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-[11px] font-semibold text-white"
        >
          <Instagram className="h-4 w-4" />
          Insta
        </a>
        <a
          href={`mailto:${businessInfo.email}`}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-[11px] font-semibold text-white"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </div>
    </div>
  );
}
