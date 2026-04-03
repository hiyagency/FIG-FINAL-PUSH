import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BanknoteArrowUp,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileBadge2,
  FileText,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn, formatCurrency, getSiteUrl } from "@/lib/fig-utils";
import {
  businessInfo,
  consultationSteps,
  faqItems,
  galleryItems,
  leadershipTeam,
  mouDocumentPoints,
  mouOverviewCards,
  planSchedule,
  whyChooseFig
} from "@/lib/site-data";

const featureIcons = [
  ShieldCheck,
  BanknoteArrowUp,
  BriefcaseBusiness,
  CheckCircle2,
  Landmark
] as const;

const consultationIcons = [
  MessageCircle,
  PhoneCall,
  BadgeCheck,
  ShieldCheck
] as const;

const mouIcons = [FileText, Building2, BadgeCheck, ShieldCheck] as const;

const galleryLayout = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-4 md:row-span-2",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-6 md:row-span-1",
  "md:col-span-6 md:row-span-1"
] as const;

export default function HomePage() {
  const siteUrl = getSiteUrl();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessInfo.name,
    alternateName: businessInfo.shortName,
    url: siteUrl,
    email: businessInfo.email,
    logo: `${siteUrl}/fig/brand/emblem.jpeg`,
    foundingDate: "2024",
    founder: businessInfo.chairperson,
    identifier: businessInfo.registrationNumber,
    sameAs: [businessInfo.instagramHref],
    address: {
      "@type": "PostalAddress",
      streetAddress: "1st Floor, SR Complex, Saraikampa Road, Burhar",
      addressLocality: "Burhar",
      addressRegion: "Madhya Pradesh",
      postalCode: "484110",
      addressCountry: "IN"
    },
    contactPoint: businessInfo.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone.raw,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "hi"]
    }))
  };

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: businessInfo.name,
    image: [
      `${siteUrl}/fig/gallery/storefront-signage.jpeg`,
      `${siteUrl}/fig/gallery/reception-lounge.jpeg`
    ],
    url: siteUrl,
    sameAs: [businessInfo.instagramHref],
    telephone: businessInfo.primaryPhone.raw,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1st Floor, SR Complex, Saraikampa Road, Burhar",
      addressLocality: "Burhar",
      addressRegion: "Madhya Pradesh",
      postalCode: "484110",
      addressCountry: "IN"
    },
    areaServed: ["Burhar", "Shahdol", "Madhya Pradesh", "India"],
    hasMap: businessInfo.mapHref,
    serviceType: [
      "Structured investment planning guidance",
      "Savings planning consultation",
      "Regular income plan discussions"
    ],
    slogan: "Structured investment plans designed for regular income and long-term financial growth.",
    description:
      "Financial Investment Group (FIG) provides structured investment opportunities designed to support long-term financial growth and regular income-oriented planning.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Structured Income Plans",
      itemListElement: planSchedule.map((plan) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${plan.label} structured income plan`,
          description: `Illustrative schedule with weekly ${formatCurrency(plan.weekly)}, monthly ${formatCurrency(plan.monthly)}, and yearly ${formatCurrency(plan.yearly)} figures.`
        }
      }))
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessInfo.name,
    alternateName: `${businessInfo.shortName} Burhar`,
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: businessInfo.name
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative overflow-hidden pb-24 md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema,
              financialServiceSchema,
              websiteSchema,
              faqSchema
            ])
          }}
        />

        <section id="top" className="relative isolate overflow-hidden pt-6 sm:pt-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="soft-grid absolute inset-x-0 top-0 h-[34rem] opacity-55" />
            <div className="absolute left-1/2 top-8 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#D4AF37]/12 blur-3xl" />
            <div className="absolute right-0 top-20 h-[22rem] w-[22rem] rounded-full bg-[#0B1F4B]/10 blur-3xl" />
          </div>

          <div className="container-shell relative">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <Reveal className="relative z-10">
                <div className="max-w-3xl">
                  <span className="eyebrow">
                    <BadgeCheck className="h-4 w-4" />
                    Financial Investment Group
                  </span>

                  <div className="relative mt-6">
                    <div className="pointer-events-none absolute -top-16 left-0 hidden text-[8rem] font-semibold uppercase tracking-[0.38em] text-[#0B1F4B]/[0.055] lg:block">
                      FIG
                    </div>
                    <h1 className="balance-text relative max-w-3xl text-4xl font-semibold leading-[1.02] text-[#08152f] sm:text-5xl lg:text-[4.2rem]">
                      Financial Investment Group (FIG) offers structured
                      investment planning guidance in Burhar, Shahdol.
                    </h1>
                  </div>

                  <p className="muted-copy mt-6 max-w-2xl text-base sm:text-lg">
                    Consultation-led investment planning, savings conversations,
                    and regular income-oriented plan discussions for individuals
                    and families across Burhar, Shahdol, and nearby areas of
                    Madhya Pradesh.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href="#plans" className="button-primary">
                      View Investment Plans
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="#contact" className="button-secondary">
                      Contact FIG
                    </Link>
                    <a
                      href={businessInfo.primaryPhone.href}
                      className="button-secondary"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Call Now
                    </a>
                    <a
                      href={businessInfo.whatsAppHref}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary"
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

                  <div className="mt-8 grid gap-4 rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur sm:grid-cols-3">
                    <TrustPill
                      title="MSME Registered Enterprise"
                      value="Verified registration identity"
                    />
                    <TrustPill
                      title="Udyam Registration"
                      value={businessInfo.registrationNumber}
                    />
                    <TrustPill title="Local presence" value="Burhar, Shahdol" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="relative">
                <div className="grid gap-4">
                  <div className="panel-dark relative overflow-hidden">
                    <div className="absolute inset-0">
                      <Image
                        src="/fig/gallery/storefront-signage.jpeg"
                        alt="Financial Investment Group storefront in Burhar, Shahdol"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.16),rgba(5,11,24,0.78))]" />
                    </div>

                    <div className="relative flex min-h-[25rem] flex-col justify-between p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white/90">
                          Burhar, Shahdol
                        </span>
                        <span className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-3 py-1.5 text-[#f8dd89]">
                          Consultation-led onboarding
                        </span>
                      </div>

                      <div className="max-w-xl space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                              Local presence
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              Ground-level client support from FIG&apos;s office in
                              Burhar.
                            </p>
                          </div>
                          <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                              Focus
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              Regular income planning with long-term growth
                              intent.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-[#09152d]/70 p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-[#f8dd89]/80">
                            Trust indicator
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/75">
                            FIG presents a transparent consultation process,
                            professional financial management, and structured plan
                            schedules that can be discussed directly with the team
                            before participation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="panel p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6a10]">
                        Why clients enquire
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <MetricCard value="2024" label="Operating since" />
                        <MetricCard value="NIC 66309" label="Business classification" />
                        <MetricCard value="Burhar" label="Office location" />
                      </div>
                    </div>

                    <div className="panel overflow-hidden border-[#D4AF37]/20 bg-[#fffaf0] p-5">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#08152f]">
                          <Image
                            src="/fig/brand/emblem.jpeg"
                            alt="FIG emblem artwork"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#08152f]">
                            FIG identity
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            A premium visual identity paired with an on-ground
                            office presence in Shahdol district.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="why-choose" className="section-shell">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Why choose FIG"
              title="Designed to feel dependable, professional, and easy to begin."
              description="Each part of the FIG experience is positioned to reinforce trust, clarity, and smooth onboarding for first-time and repeat investors alike."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {whyChooseFig.map((feature, index) => {
                const Icon = featureIcons[index];

                return (
                  <Reveal key={feature.title} delay={index * 0.05}>
                    <div className="panel group h-full p-6">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F4B] text-white shadow-[0_18px_38px_-24px_rgba(11,31,75,0.85)] transition duration-200 group-hover:bg-[#10285f]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-[#08152f]">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="plans" className="section-shell bg-[linear-gradient(180deg,rgba(11,31,75,0.035),transparent)]">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Investment plans"
              title="A Structured Income Plan for Everyone"
              description="The plan schedule below is presented from the information shared by FIG. Clients should review eligibility, documentation, and suitability directly with the team before proceeding."
            />

            <div className="mt-10 overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_32px_80px_-46px_rgba(15,23,42,0.45)]">
              <div className="border-b border-slate-200 bg-[#0B1F4B] px-5 py-5 text-white sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f8dd89]">
                      Current schedule
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Investment plan comparison
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-white/75">
                    Weekly, monthly, and yearly figures are shown as plan
                    illustrations for consultation purposes.
                  </p>
                </div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-[#fff8e5] text-sm font-semibold text-[#08152f]">
                    <tr>
                      <th className="px-8 py-4">Investment</th>
                      <th className="px-8 py-4">Weekly</th>
                      <th className="px-8 py-4">Monthly</th>
                      <th className="px-8 py-4">Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planSchedule.map((plan, index) => (
                      <tr
                        key={plan.label}
                        className={cn(
                          "text-[15px] text-slate-700",
                          index % 2 === 0 ? "bg-white" : "bg-[#fcfaf4]"
                        )}
                      >
                        <td className="px-8 py-5 font-semibold text-[#08152f]">
                          {plan.label}
                        </td>
                        <td className="px-8 py-5">{formatCurrency(plan.weekly)}</td>
                        <td className="px-8 py-5">{formatCurrency(plan.monthly)}</td>
                        <td className="px-8 py-5">{formatCurrency(plan.yearly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {planSchedule.map((plan) => (
                  <div key={plan.label} className="rounded-[24px] border border-slate-200 bg-[#fcfaf4] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6a10]">
                          Plan amount
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold text-[#08152f]">
                          {plan.label}
                        </h3>
                      </div>
                      <span className="rounded-full border border-[#D4AF37]/35 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6a10]">
                        FIG
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <PlanRow label="Weekly schedule" value={formatCurrency(plan.weekly)} />
                      <PlanRow label="Monthly schedule" value={formatCurrency(plan.monthly)} />
                      <PlanRow label="Yearly schedule" value={formatCurrency(plan.yearly)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell">
          <div className="container-shell">
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <div className="panel p-6 sm:p-8">
                  <SectionHeading
                    eyebrow="About FIG"
                    title="A local financial services brand built around disciplined, transparent plan communication."
                    description="FIG - Financial Investment Group is an investment group in which individuals invest funds and receive structured earning opportunities while their money works for them. The firm has been operating since 2024 and serves Burhar and Shahdol clients who value a direct, relationship-led consultation experience."
                    centered={false}
                    className="max-w-none"
                  />

                  <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <InfoTile title="Financial consultation in Burhar" value="Serving Shahdol district with on-ground conversations, local accessibility, and direct support." />
                    <InfoTile title="Savings and plan guidance" value="Simple investment slabs with clear schedule illustrations for people comparing structured plans." />
                    <InfoTile title="NIC classification" value="Registered under NIC Code 66309 for management of other investment funds." />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel-dark p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f8dd89]">
                    Mission
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                    To help individuals and families build sustainable wealth
                    and financial independence through disciplined investment
                    strategies.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    FIG positions its service around consistent communication,
                    structured plan choices, and long-term financial planning
                    intent rather than high-pressure selling.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.14}>
              <div
                id="leadership"
                className="mx-auto mt-12 w-full max-w-[1200px] rounded-[36px] border border-[#D4AF37]/20 bg-white px-5 py-10 shadow-[0_24px_70px_rgba(8,21,47,0.08)] sm:px-8 lg:px-12 lg:py-14"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6a10]">
                  Leadership
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#08152f] sm:text-4xl">
                  Meet the People Behind FIG
                </h3>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  Trusted guidance and local accessibility shape how FIG supports every
                  client conversation with clarity and consistency.
                </p>

                <div className="mt-10 space-y-10 sm:space-y-14">
                  {leadershipTeam.map((leader, index) => (
                    <article
                      key={leader.name}
                      className={`group flex items-center gap-6 rounded-[30px] bg-[#fffdf8] p-4 shadow-[0_12px_40px_rgba(8,21,47,0.08)] sm:p-6 lg:gap-12 lg:p-8 ${
                        index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                      } flex-col`}
                    >
                      <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(8,21,47,0.15)] lg:w-[320px] xl:w-[350px]">
                        <div className="relative aspect-[4/5]">
                          <Image
                            src={leader.imageSrc}
                            alt={leader.imageAlt}
                            fill
                            sizes="(min-width: 1280px) 350px, (min-width: 1024px) 320px, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>

                      <div className="flex-1 px-1 sm:px-2 lg:px-4">
                        <p className="text-3xl font-semibold leading-tight text-[#08152f] sm:text-[2rem]">
                          {leader.name}
                        </p>
                        <p className="mt-2 text-base font-medium text-[#8c6a10]">
                          {leader.role}
                        </p>
                        <p className="mt-5 max-w-[60ch] text-base leading-8 text-slate-600">
                          {leader.description}
                        </p>

                        <ul className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                          {leader.trustPoints.map((point) => (
                            <li key={point} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="guidance" className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <Reveal>
                <div className="panel p-6 sm:p-8">
                  <SectionHeading
                    eyebrow="Investment planning guidance"
                    title="A clear consultation process for Burhar and Shahdol enquiries."
                    description="Whether someone is exploring investment plans in Burhar, looking for savings planning in Shahdol, or wants local financial guidance with a premium experience, FIG keeps the process approachable and direct."
                    centered={false}
                    className="max-w-none"
                  />

                  <div className="mt-8 rounded-[24px] border border-[#D4AF37]/25 bg-[#fffaf0] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6a10]">
                      Local presence
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      FIG operates from its Burhar office and supports
                      conversations for local clients who want plan clarity,
                      structured guidance, and easy contact access across Shahdol
                      district.
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a
                        href={businessInfo.mapHref}
                        target="_blank"
                        rel="noreferrer"
                        className="button-primary"
                      >
                        <MapPin className="h-4 w-4" />
                        Open directions
                      </a>
                      <a
                        href={businessInfo.instagramHref}
                        target="_blank"
                        rel="noreferrer"
                        className="button-secondary"
                      >
                        <Instagram className="h-4 w-4" />
                        Follow on Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="grid gap-5 md:grid-cols-2">
                  {consultationSteps.map((step, index) => {
                    const Icon = consultationIcons[index];

                    return (
                      <div key={step.title} className="panel h-full p-6">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F4B] text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Step 0{index + 1}
                          </span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-[#08152f]">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="mou"
          className="section-shell bg-[linear-gradient(180deg,rgba(11,31,75,0.03),transparent)] pt-0"
        >
          <div className="container-shell">
            <div className="grid gap-8 xl:grid-cols-[1fr_0.96fr]">
              <Reveal>
                <div className="panel p-6 sm:p-8">
                  <SectionHeading
                    eyebrow="Client MOU"
                    title="A clean view of how the client agreement works before signing."
                    description="FIG has provided a Memorandum of Understanding (MOU) template that records investor information, investment details, nominee details, and the written terms clients are expected to review before joining."
                    centered={false}
                    className="max-w-none"
                  />

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {mouOverviewCards.map((item, index) => {
                      const Icon = mouIcons[index];

                      return (
                        <div key={item.title} className="rounded-[24px] border border-slate-200 bg-[#fcfaf4] p-5">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F4B] text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <h3 className="mt-5 text-xl font-semibold text-[#08152f]">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 rounded-[24px] border border-[#D4AF37]/25 bg-[#fffaf0] p-5 text-sm leading-7 text-slate-600">
                    This section is a plain-language guide to the client-provided
                    MOU document. Clients should read the full MOU and clarify any
                    clause, especially dividend, withdrawal, and responsibility
                    wording, directly with FIG before signing.
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel-dark overflow-hidden">
                  <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f8dd89]">
                      Document preview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      What clients see in the MOU
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      The full document is available below, and this preview helps
                      visitors understand the structure before they open it.
                    </p>
                  </div>

                  <div className="grid gap-6 p-6 sm:p-8">
                    <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f8dd89]">
                        Included sections
                      </p>
                      <div className="mt-4 grid gap-3">
                        {mouDocumentPoints.map((point) => (
                          <div
                            key={point}
                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#09152d]/70 px-4 py-3"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f8dd89]" />
                            <p className="text-sm leading-6 text-white/80">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-[#09152d]/70 p-5">
                      <p className="text-sm font-semibold text-white">
                        Client-friendly summary
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/75">
                        The MOU first records the client identity and investment
                        details, then lists the written clauses the client is
                        expected to review. It ends with a declaration that the
                        client has read the terms and agreed to proceed.
                      </p>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <a
                          href={businessInfo.mouHref}
                          download
                          className="button-primary"
                        >
                          <Download className="h-4 w-4" />
                          Download MOU
                        </a>
                        <Link href="#contact" className="button-secondary">
                          Ask About the MOU
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="trust" className="section-shell bg-[linear-gradient(180deg,rgba(212,175,55,0.08),transparent)]">
          <div className="container-shell">
            <div className="grid gap-8 xl:grid-cols-[0.96fr_1.04fr]">
              <Reveal>
                <div className="panel p-6 sm:p-8">
                  <SectionHeading
                    eyebrow="Legal and trust"
                    title="Presented responsibly, with clear registration context."
                    description="FIG is described as a Government registered MSME enterprise and has shared its Udyam registration details for trust and verification."
                    centered={false}
                    className="max-w-none"
                  />

                  <div className="mt-8 space-y-4">
                    <LegalRow icon={Building2} label="Enterprise" value={businessInfo.name} />
                    <LegalRow
                      icon={FileBadge2}
                      label="Udyam Registration Number"
                      value={businessInfo.registrationNumber}
                    />
                    <LegalRow icon={Landmark} label="NIC Code" value={businessInfo.nicCode} />
                    <LegalRow
                      icon={ShieldCheck}
                      label="Business classification"
                      value="Management of other investment funds"
                    />
                  </div>

                  <div className="mt-8 rounded-[24px] border border-[#D4AF37]/25 bg-[#fffaf0] p-5 text-sm leading-7 text-slate-600">
                    FIG does not present fake certifications or unverifiable
                    approvals here. Prospective clients should review plan terms,
                    documentation, and suitability directly with the business
                    before making a financial decision.
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="grid gap-6">
                  <div className="panel overflow-hidden p-0">
                    <div className="border-b border-slate-200 bg-[#08152f] px-6 py-5 text-white sm:px-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f8dd89]">
                        Udyam registration proof
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold">
                        Client-provided certificate support
                      </h2>
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-[0.9fr_1.1fr] sm:p-8">
                      <div className="rounded-[24px] border border-dashed border-[#D4AF37]/40 bg-[#fffaf0] p-5">
                        <div className="flex h-full flex-col justify-between gap-6">
                          <div>
                            <p className="text-sm font-semibold text-[#08152f]">
                              Udyam certificate PDF
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              The website is ready to display the client&apos;s
                              registration certificate and already includes the
                              supplied PDF for viewing or download.
                            </p>
                          </div>
                          <a
                            href={businessInfo.certificateHref}
                            target="_blank"
                            rel="noreferrer"
                            className="button-primary"
                          >
                            View registration PDF
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08152f] text-white">
                            <BadgeCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[#08152f]">
                              Registration summary
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              Udyam Registration Number{" "}
                              <strong>{businessInfo.registrationNumber}</strong>
                              , enterprise name{" "}
                              <strong>{businessInfo.name}</strong>, and NIC Code{" "}
                              <strong>{businessInfo.nicCode}</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 rounded-[22px] border border-slate-200 bg-[#fcfaf4] p-4 text-sm leading-7 text-slate-600">
                          This section is intentionally designed so a future
                          certificate preview image can be added without changing
                          the page structure or layout.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="gallery" className="section-shell">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Gallery"
              title="A polished business presence, ready to build trust at a glance."
              description="Real office, signage, and brand material from Financial Investment Group are used throughout this section so visitors see a tangible business footprint."
            />

            <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-12">
              {galleryItems.map((item, index) => (
                <Reveal
                  key={item.src}
                  delay={index * 0.04}
                  className={cn("relative overflow-hidden rounded-[28px]", galleryLayout[index])}
                >
                  <div className="panel absolute inset-0 overflow-hidden border-white/55 p-0">
                    <div className="relative h-full w-full">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,21,47,0.02),rgba(8,21,47,0.72))]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                        {item.kicker}
                      </p>
                      <p className="mt-2 text-lg font-semibold leading-snug">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section-shell pt-0">
          <div className="container-shell">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions from local investment and savings enquiries."
              description="These answers are designed to support local search intent naturally while keeping the website responsible, clear, and trust-first."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {faqItems.map((item, index) => (
                <Reveal key={item.question} delay={index * 0.04}>
                  <details className="panel group p-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                      <span className="text-lg font-semibold text-[#08152f]">
                        {item.question}
                      </span>
                      <span className="rounded-full border border-[#D4AF37]/25 bg-[#fffaf0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6a10]">
                        FIG
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="container-shell">
            <div className="panel-dark flex flex-col gap-6 overflow-hidden p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f8dd89]">
                  Need a direct conversation?
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Speak to FIG for plan details, local consultation guidance,
                  and office directions.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Call, WhatsApp, connect on Instagram, or send an enquiry and
                  the FIG team can walk you through the current plan structure
                  and next steps.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={businessInfo.primaryPhone.href} className="button-primary">
                  <PhoneCall className="h-4 w-4" />
                  Call FIG
                </a>
                <a
                  href={businessInfo.whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp FIG
                </a>
                <a
                  href={businessInfo.mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  <MapPin className="h-4 w-4" />
                  Open directions
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
        </section>

        <section id="contact" className="section-shell pt-0">
          <div className="container-shell">
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <Reveal>
                <div className="panel h-full p-6 sm:p-8">
                  <SectionHeading
                    eyebrow="Contact and enquiry"
                    title="Reach the FIG team through the channel that feels easiest."
                    description="Use the enquiry form for a guided follow-up, or connect directly by phone, email, WhatsApp, Instagram, or office directions."
                    centered={false}
                    className="max-w-none"
                  />

                  <div className="mt-8 grid gap-4">
                    <ContactCard
                      icon={MapPin}
                      title="Office address"
                      value={businessInfo.address}
                      actionLabel="Open directions"
                      actionHref={businessInfo.mapHref}
                    />
                    <ContactCard
                      icon={PhoneCall}
                      title="Phone numbers"
                      value={businessInfo.phones.map((phone) => phone.raw).join(" / ")}
                      actionLabel="Call now"
                      actionHref={businessInfo.primaryPhone.href}
                    />
                    <ContactCard
                      icon={Mail}
                      title="Email address"
                      value={businessInfo.email}
                      actionLabel="Send email"
                      actionHref={`mailto:${businessInfo.email}`}
                    />
                    <ContactCard
                      icon={Instagram}
                      title="Instagram"
                      value={`@${businessInfo.instagramHandle}`}
                      actionLabel="Open Instagram"
                      actionHref={businessInfo.instagramHref}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={businessInfo.primaryPhone.href} className="button-secondary">
                      <PhoneCall className="h-4 w-4" />
                      Call
                    </a>
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="button-secondary"
                    >
                      <Mail className="h-4 w-4" />
                      Email
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
                    <a
                      href={businessInfo.instagramHref}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
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
              </Reveal>

              <Reveal delay={0.08}>
                <div className="panel p-6 sm:p-8">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c6a10]">
                      Enquiry form
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#08152f]">
                      Request a consultation
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      The form validates key details before submission and sends
                      your enquiry directly into FIG&apos;s Google Sheets follow-up
                      workflow.
                    </p>
                  </div>

                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileActionBar />
    </>
  );
}

function TrustPill({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-[#08152f]">{value}</p>
    </div>
  );
}

function MetricCard({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-[#fcfaf4] p-4">
      <p className="text-lg font-semibold text-[#08152f]">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{label}</p>
    </div>
  );
}

function PlanRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-[#08152f]">{value}</span>
    </div>
  );
}

function InfoTile({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fcfaf4] p-5">
      <p className="text-lg font-semibold text-[#08152f]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{value}</p>
    </div>
  );
}

function LegalRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-[#fcfaf4] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B1F4B]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#08152f]">{value}</p>
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  actionLabel,
  actionHref
}: {
  icon: typeof MapPin;
  title: string;
  value: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#fcfaf4] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B1F4B]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
          <a
            href={actionHref}
            target={actionHref.startsWith("http") ? "_blank" : undefined}
            rel={actionHref.startsWith("http") ? "noreferrer" : undefined}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#8c6a10]"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
