/**
 * RESEARCH & ENGINEERING NOTES
 *
 * PrintX paper: intentionally NOT listed. Add an entry here only after the
 * final publication details and a link exist. Do not label anything
 * peer-reviewed / indexed / journal-published without evidence.
 *
 * Add a new note by appending to `researchNotes`. The /research/[slug] page
 * renders it with the shared article template.
 */
export type NoteType =
  | "Research publication"
  | "Technical paper"
  | "Engineering experiment"
  | "Architecture exploration"
  | "Technical article"
  | "Open-source contribution";

export interface NoteSection {
  heading: string;
  body: string[];
}

export interface ResearchNote {
  slug: string;
  title: string;
  type: NoteType;
  status: "Draft" | "Published";
  summary: string;
  tags: string[];
  relatedProject?: string;
  sections: NoteSection[];
  externalUrl?: string;
}

export const noteTypes: { type: NoteType; blurb: string }[] = [
  { type: "Research publication", blurb: "Papers with confirmed publication details." },
  { type: "Technical paper", blurb: "Longer written technical work." },
  { type: "Engineering experiment", blurb: "Small, focused builds and measurements." },
  { type: "Architecture exploration", blurb: "System designs and trade-off analysis." },
  { type: "Technical article", blurb: "Write-ups on things worth explaining." },
  { type: "Open-source contribution", blurb: "Upstream work and public tooling." },
];

export const researchNotes: ResearchNote[] = [
  {
    slug: "supervised-agents-for-fraud-investigation",
    title: "Supervisor-led agents for fraud investigation",
    type: "Architecture exploration",
    status: "Draft",
    summary:
      "How FRAB splits an investigation across Supervisor, Watchman, Detective, Jurist and Scribe agents, and why risk intelligence stays deterministic.",
    tags: ["Agentic AI", "Multi-agent", "FinTech"],
    relatedProject: "frab",
    sections: [
      {
        heading: "Context",
        body: [
          "FRAB is an agentic financial-security platform that investigates suspicious activity and produces evidence, risk analysis and explainable recommendations.",
        ],
      },
      {
        heading: "The agent roster",
        body: [
          "The investigation is coordinated by a Supervisor and carried out by Watchman, Detective, Jurist and Scribe agents, built with Google ADK on Gemini / Gemma models.",
        ],
      },
      {
        heading: "Deterministic risk intelligence",
        body: [
          "Risk intelligence is deterministic. Language models help investigate and explain, but the risk numbers behind a decision can be reproduced from the same evidence.",
        ],
      },
      {
        heading: "To complete",
        body: [
          "This is a draft shell. Add your own measurements, diagrams and lessons learned before publishing it.",
        ],
      },
    ],
  },
  {
    slug: "private-inference-with-tees",
    title: "Private inference with TEE-backed compute",
    type: "Architecture exploration",
    status: "Draft",
    summary:
      "Notes on using 0G Private Computer and GCP Confidential VM in FRAB and InkLink to keep sensitive data inside trusted execution environments.",
    tags: ["Privacy", "TEE", "Confidential Computing"],
    relatedProject: "inklink",
    sections: [
      {
        heading: "Why it matters",
        body: [
          "Both FRAB (financial investigations) and InkLink (private printing) handle data that should not be exposed to a general-purpose inference path.",
        ],
      },
      {
        heading: "Where it is used",
        body: [
          "FRAB uses private inference through TEE-backed execution on 0G Private Computer and is deployed on a GCP Confidential VM. InkLink uses 0G Private Computer for privacy-focused printing workflows.",
        ],
      },
      {
        heading: "To complete",
        body: [
          "Add the integration details, trade-offs and measurements from your own experience before publishing this note.",
        ],
      },
    ],
  },
];

export function getNote(slug: string) {
  return researchNotes.find((n) => n.slug === slug);
}
