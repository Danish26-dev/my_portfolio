export const site = {
  name: "Md Danish Ali",
  shortName: "Danish",
  title: "Md Danish Ali | Software Engineer, Agentic AI, Web3",
  description:
    "Computer Science undergraduate and hackathon-winning software engineer focused on Agentic AI, Web3 and full-stack systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "mddanisha288@gmail.com",
  phone: "+91-6364637752",
  /** Form-to-email relay (Web3Forms). Messages from the contact form are delivered to the inbox the access key was created for. */
  contactEndpoint: "https://api.web3forms.com/submit",
  /** Public Web3Forms access key (safe to expose; it only allows sending to the owner's inbox). Get one at https://web3forms.com */
  contactKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
  phoneHref: "tel:+916364637752",
  github: "https://github.com/Danish26-dev",
  linkedin: "https://www.linkedin.com/in/md-danish-ali-dev",
  resume: "/Md-Danish-Ali-Resume.pdf",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "expertise", label: "Expertise" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId =
  | (typeof navItems)[number]["id"]
  | "education"
  | "beyond";

/** Sections without their own nav item are highlighted under a neighbour. */
export const navAlias: Record<string, string> = {
  education: "research",
  beyond: "research",
  outro: "contact",
};

export const sectionIds: SectionId[] = [
  "home",
  "about",
  "projects",
  "achievements",
  "expertise",
  "education",
  "research",
  "beyond",
  "contact",
];
