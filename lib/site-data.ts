import {
  formatPhoneHref,
  formatWhatsAppHref
} from "@/lib/fig-utils";

const primaryPhoneNumber = "+91 62612 06937";
const secondaryPhoneNumber = "+91 92021 01863";
const instagramHandle = "financial_investment_group";

export const businessInfo = {
  name: "Financial Investment Group",
  shortName: "FIG",
  chairperson: "Ashish Dwivedi",
  ceo: "Shivani Dubey",
  address:
    "1st Floor, SR Complex, Saraikampa Road, Burhar, Dist. Shahdol, Madhya Pradesh, PIN - 484110",
  email: "ashishtradinginfo1714@gmail.com",
  registrationNumber: "UDYAM-MP-43-0021871",
  nicCode: "66309",
  enterpriseName: "Financial Investment Group",
  instagramHandle,
  instagramHref: `https://www.instagram.com/${instagramHandle}/`,
  mouHref: "/fig/documents/financial-investment-group-mou.docx",
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
    "https://www.google.com/maps/search/?api=1&query=1st+Floor,+SR+Complex,+Saraikampa+Road,+Burhar,+Shahdol,+Madhya+Pradesh+484110",
  certificateHref: "/fig/documents/udyam-registration.pdf"
};

export const navigationLinks = [
  { label: "Home", href: "#top" },
  { label: "Why FIG", href: "#why-choose" },
  { label: "Plans", href: "#plans" },
  { label: "About", href: "#about" },
  { label: "MOU", href: "#mou" },
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
    role: "Chairman & Managing Director",
    imageSrc: "/fig/leadership/ashish-dwivedi.jpeg",
    imageAlt: "Ashish Dwivedi, Chairman and Managing Director of Financial Investment Group",
    description:
      "Ashish Dwivedi leads FIG with a relationship-first style focused on trust, disciplined communication, and dependable local support.",
    trustPoints: [
      "Client-first communication",
      "Local accessibility",
      "Structured guidance"
    ]
  },
  {
    name: "Shivani Dubey",
    role: "CEO",
    imageSrc: "/fig/leadership/hivani-dubey.jpeg",
    imageAlt: "Shivani Dubey, CEO of Financial Investment Group",
    description:
      "Shivani Dubey ensures service quality through responsive client engagement and consistent follow-through across each enquiry journey.",
    trustPoints: [
      "Service consistency",
      "Responsive engagement",
      "Transparent support"
    ]
  }
];

export const consultationSteps = [
  {
    title: "Start with a simple enquiry",
    description:
      "Reach FIG through the website form, phone call, WhatsApp, or Instagram to share your interest and preferred investment range."
  },
  {
    title: "Discuss the right plan clearly",
    description:
      "The team explains available structured plan slabs, answers questions, and helps you understand the schedule illustrations before any next step."
  },
  {
    title: "Review process and documentation",
    description:
      "FIG keeps the onboarding conversation direct and transparent so Burhar and Shahdol clients know what information and process details will be needed."
  },
  {
    title: "Receive follow-up from the team",
    description:
      "Each enquiry is reviewed for a practical follow-up conversation by the most suitable contact route, including call or WhatsApp where appropriate."
  }
];

export const mouOverviewCards = [
  {
    title: "Agreement details",
    description:
      "The MOU captures the agreement date, the business party, and the investor details before any onboarding is finalized."
  },
  {
    title: "Investor information",
    description:
      "Clients fill in name, address, city, district, state, Aadhaar number, and PAN number so the document records who is participating."
  },
  {
    title: "Investment and nominee",
    description:
      "The document includes the invested amount, dividend wording, start date references, and nominee details with relationship information."
  },
  {
    title: "Terms review",
    description:
      "Withdrawal, holding-period, and acknowledgement clauses are written into the MOU and should be read carefully with FIG before signing."
  }
];

export const mouDocumentPoints = [
  "Agreement date and parties involved",
  "Investor identity and address details",
  "Aadhaar and PAN information fields",
  "Investment amount and written amount fields",
  "Dividend and start-date wording as written in the document",
  "Nominee name and relationship details",
  "Withdrawal and holding-period clauses",
  "Client acknowledgement before joining FIG"
];

export const faqItems = [
  {
    question: "What does Financial Investment Group (FIG) do?",
    answer:
      "FIG provides structured investment planning conversations, plan illustrations, and direct client guidance for people seeking regular income-oriented and long-term financial growth discussions."
  },
  {
    question: "Does FIG guarantee returns or ranking-style promises?",
    answer:
      "No. The website is intentionally written without fake guarantees or unrealistic claims. Prospective clients should review suitability, documentation, and plan details directly with FIG before making a financial decision."
  },
  {
    question: "Can I enquire if I am based in Burhar or Shahdol?",
    answer:
      "Yes. FIG is based in Burhar and serves enquiries from Burhar, Shahdol, and nearby areas of Madhya Pradesh through phone, WhatsApp, Instagram, email, and in-person office conversations."
  },
  {
    question: "How can I contact FIG quickly?",
    answer:
      "You can submit the enquiry form, call the listed phone numbers, send a WhatsApp message, email the team, or connect on Instagram using the handle financial_investment_group."
  },
  {
    question: "What should I include in my enquiry?",
    answer:
      "Your name, phone number, preferred investment amount, and any questions about the consultation process are enough to help FIG prepare an appropriate follow-up."
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
    caption: "Visible local presence on Saraikampa Road in Burhar, Dist. Shahdol."
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
  "Financial Investment Group Burhar",
  "FIG Burhar",
  "investment plans in Shahdol",
  "investment plans in Burhar",
  "financial consultant Burhar",
  "financial consultant Shahdol",
  "savings plans Burhar",
  "investment guidance Shahdol",
  "financial services in Shahdol",
  "local investment group in Madhya Pradesh",
  "regular income investment plans",
  "structured investment opportunities"
];
