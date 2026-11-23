import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Terminal } from "@/components/layout/Terminal";
import { ResumeProvider } from "@/components/layout/ResumeViewer";
import { site } from "@/lib/data/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [
    "Md Danish Ali",
    "Software Engineer",
    "Agentic AI",
    "Web3",
    "Full-Stack Developer",
    "Hackathon",
    "Portfolio",
  ],
  authors: [{ name: site.name, url: site.github }],
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: site.name,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#EDECE6",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Software Engineer",
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.github, site.linkedin],
  alumniOf: "Sambhram Institute of Technology",
  knowsAbout: ["Agentic AI", "Web3", "Full-stack development"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[120] -translate-y-24 bg-primary px-4 py-2 font-mono text-xs uppercase text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ResumeProvider>
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Terminal />
          <BackToTop />
        </ResumeProvider>
      </body>
    </html>
  );
}
