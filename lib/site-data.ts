import {
  formatPhoneHref,
  formatWhatsAppHref
} from "@/lib/fig-utils";

const primaryPhoneNumber = "+91 62612 06937";
const secondaryPhoneNumber = "+91 92021 01863";

export const businessInfo = {
  name: "Financial Investment Group",
  shortName: "FIG",
  chairperson: "Ashish Dwivedi",
  ceo: "Shivani Dwivedi",
  address:
    "1st Floor, SR Complex, Saraikanpa Road, Burhar, Dist. Shahdol, Madhya Pradesh, PIN - 484110",
  email: "ashishtradinginfo1714@gmail.com",
  registrationNumber: "UDYAM-MP-43-0021871",
  nicCode: "66309",
  enterpriseName: "Financial Investment Group",
  primaryPhone: {
    raw: primaryPhoneNumber,
    href: formatPhoneHref(primaryPhoneNumber)
  },
  secondaryPhone: {
    raw: secondaryPhoneNumber,
    href: formatPhoneHref(secondaryPhoneNumber)
  },
  phones: [
    {
      raw: primaryPhoneNumber,
      href: formatPhoneHref(primaryPhoneNumber)
    },
    {
      raw: secondaryPhoneNumber,
      href: formatPhoneHref(secondaryPhoneNumber)
    }
  ],
  whatsAppHref: formatWhatsAppHref(
    primaryPhoneNumber,
    "Hello FIG, I would like to know more about your investment plans."
  ),
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=1st+Floor,+SR+Complex,+Saraikanpa+Road,+Burhar,+Shahdol,+Madhya+Pradesh+484110",
  certificateHref: "/fig/documents/udyam-registration.pdf"
};

export const navigationLinks = [
  { label: "Home", href: "#top" },
  { label: "Why FIG", href: "#why-choose" },
  { label: "Plans", href: "#plans" },
  { label: "About", href: "#about" },
  { label: "Trust", href: "#trust" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" }
];

export const whyChooseFig = [
  {
    title: "Trusted Investment Structure",
    description:
      "Clear plan tiers, direct consultation, and an organised process help prospects understand FIG before they commit."
  },
  {
    title: "Regular Weekly / Monthly Income",
    description:
      "The plan schedule is structured for people who value predictable cash-flow oriented planning conversations."
  },
  {
    title: "Professional Financial Management",
    description:
      "FIG positions its work around disciplined handling, transparent communication, and long-term planning intent."
  },
  {
    title: "Easy Investment Process",
    description:
      "From initial enquiry to plan discussion and onboarding, the journey is designed to stay simple and approachable."
  },
  {
    title: "Secure Growth Opportunities",
    description:
      "FIG emphasises growth-focused planning with a careful, trust-led experience for individuals and families."
  }
];

export const planSchedule = [
  { label: "1 Lakh", weekly: 1500, monthly: 6250, yearly: 75000 },
  { label: "2 Lakh", weekly: 3000, monthly: 12500, yearly: 150000 },
  { label: "3 Lakh", weekly: 4500, monthly: 18750, yearly: 225000 },
  { label: "4 Lakh", weekly: 6000, monthly: 25000, yearly: 300000 },
  { label: "5 Lakh", weekly: 7500, monthly: 31250, yearly: 375000 },
  { label: "6 Lakh", weekly: 9000, monthly: 37500, yearly: 450000 },
  { label: "7 Lakh", weekly: 10500, monthly: 43750, yearly: 525000 },
  { label: "8 Lakh", weekly: 12000, monthly: 50000, yearly: 600000 },
  { label: "9 Lakh", weekly: 13500, monthly: 56250, yearly: 675000 },
  { label: "10 Lakh", weekly: 15000, monthly: 62500, yearly: 750000 }
];

export const leadershipTeam = [
  {
    name: "Ashish Dwivedi",
    role: "Chairperson & Managing Director",
    initials: "AD",
    description:
      "Ashish Dwivedi leads FIG with a direct, relationship-led approach that reinforces trust, disciplined communication, and local accessibility for clients."
  },
  {
    name: "Shivani Dwivedi",
    role: "CEO",
    initials: "SD",
    description:
      "Shivani Dwivedi supports FIG's service quality, client engagement, and operational consistency across the investment enquiry experience."
  }
];

export const galleryItems = [
  {
    src: "/fig/gallery/reception-lounge.jpeg",
    alt: "Reception and consultation lounge inside Financial Investment Group office",
    kicker: "Office interior",
    caption: "A polished consultation space designed for client meetings and planning discussions."
  },
  {
    src: "/fig/gallery/storefront-street.jpeg",
    alt: "Financial Investment Group storefront visible from the road in Burhar",
    kicker: "Street view",
    caption: "Visible local presence on Saraikanpa Road in Burhar, Dist. Shahdol."
  },
  {
    src: "/fig/gallery/storefront-signage.jpeg",
    alt: "Financial Investment Group exterior signage mounted on the office building",
    kicker: "Business signage",
    caption: "Strong on-building branding that helps visitors identify the FIG office quickly."
  },
  {
    src: "/fig/gallery/bookshelf.jpeg",
    alt: "Bookshelf detail inside the FIG office",
    kicker: "Workspace detail",
    caption: "Interior details that support a thoughtful and premium business environment."
  },
  {
    src: "/fig/gallery/business-card-back.jpeg",
    alt: "Business card displaying Ashish Dwivedi title and contact details",
    kicker: "Identity card",
    caption: "Real contact credentials presented through FIG's printed business material."
  },
  {
    src: "/fig/gallery/business-card-front.jpeg",
    alt: "Front side of Financial Investment Group business card",
    kicker: "Brand asset",
    caption: "Brand identity material that reinforces the business name in offline interactions."
  }
];

export const seoKeywords = [
  "Financial Investment Group",
  "FIG",
  "investment plans in India",
  "investment plans in Shahdol",
  "investment plans in Burhar",
  "investment company in Shahdol",
  "investment firm in Burhar",
  "financial services in Shahdol",
  "local investment group in Madhya Pradesh",
  "regular income investment plans",
  "structured investment opportunities"
];
