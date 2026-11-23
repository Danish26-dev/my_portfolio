/**
 * ACHIEVEMENT DATA
 * Titles, placements, prizes and project associations are exact.
 * Do not edit them without the owner's confirmation.
 *
 * To add an official logo or certificate, drop the file in /public/logos or
 * /public/certificates and set `logo` / `certificate` / `photo` (e.g. "/logos/ethglobal.svg").
 */
export interface Achievement {
  id: string;
  index: string;
  title: string;
  /** Short placement label for the medal. */
  placement: string;
  event: string;
  project: string;
  projectSlug: string;
  prize?: string;
  tier: "gold" | "silver" | "bronze" | "finalist";
  logo?: string;
  certificate?: string;
  photo?: string;
}

export const achievements: Achievement[] = [
  {
    id: "ethglobal-mumbai",
    index: "01",
    title: "3rd Prize — Hedera Track",
    placement: "3rd",
    event: "ETHGlobal Mumbai 2026",
    project: "InkLink",
    projectSlug: "inklink",
    prize: "$1,500",
    tier: "bronze",
  },
  {
    id: "colossus",
    index: "02",
    title: "2nd Runner-Up — FinTech Domain",
    placement: "2nd RU",
    event: "COLOSSUS 3.0 National Hackathon 2026",
    project: "FRAB",
    projectSlug: "frab",
    prize: "₹15,000",
    tier: "silver",
  },
  {
    id: "smart-horizon",
    index: "03",
    title: "3rd Place",
    placement: "3rd",
    event: "Smart Horizon International Hackathon 2026",
    project: "FRAB",
    projectSlug: "frab",
    prize: "₹75,000",
    tier: "bronze",
  },
  {
    id: "athernex",
    index: "04",
    title: "1st Place — Automaton.ai Track",
    placement: "1st",
    event: "Athernex Hackathon",
    project: "Automaton Nexus",
    projectSlug: "automaton-nexus",
    prize: "₹20,000",
    tier: "gold",
  },
  {
    id: "cardano-ibw",
    index: "05",
    title: "Finalist",
    placement: "Finalist",
    event: "Cardano Hackathon — India Blockchain Week 2025",
    project: "IdentiPI",
    projectSlug: "identipi",
    tier: "finalist",
  },
];

export const podiumCount = achievements.filter((a) => a.tier !== "finalist").length;
