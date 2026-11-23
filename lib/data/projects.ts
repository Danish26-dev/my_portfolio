/**
 * PROJECT DATA
 * ------------------------------------------------------------------
 * Single source of truth for the project showcase and case studies.
 *
 * Rules followed here:
 *  - Only facts supplied by the owner are stated as facts.
 *  - Anything not yet supplied is marked with `pending` (rendered as a
 *    "TO COMPLETE" placeholder) instead of being invented.
 *  - `links.github` / `links.demo` are intentionally empty until real URLs
 *    are added. The UI hides or disables them automatically.
 *  - Architecture diagrams are DRAFTS derived from the stated components.
 *    Verify them against the final architecture.
 */

export type ProjectFilter =
  | "Agentic AI"
  | "Web3"
  | "AI & Automation"
  | "FinTech"
  | "Full-Stack";

export const projectFilters: ProjectFilter[] = [
  "Agentic AI",
  "Web3",
  "AI & Automation",
  "FinTech",
  "Full-Stack",
];

export type VisualKind =
  | "frab"
  | "inklink"
  | "automaton"
  | "identipi"
  | "yuktidoot"
  | "odyssey"
  | "lactiq"
  | "klaim"
  | "guruko";

export interface DiagramNode {
  id: string;
  label: string;
  /** Column / row on the desktop grid. Mobile layout is the transpose. */
  col: number;
  row: number;
  kind?: "core" | "agent" | "service" | "io";
  detail: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CaseStudy {
  overview: string[];
  problem: string[];
  solution: string[];
  architecture: {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    note: string;
  };
  stackGroups: { label: string; items: string[] }[];
  contributions: { items: string[]; pending?: string };
  decisions: { title: string; body: string }[];
  challenges: { items: { challenge: string; solution: string }[]; pending?: string };
  outcomes: string[];
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  fullName?: string;
  tagline: string;
  description: string;
  category: string;
  filters: ProjectFilter[];
  status: string;
  featured: boolean;
  badge?: string;
  stack: string[];
  /** Ids from lib/data/skills.ts used to power the expertise explorer. */
  skills: string[];
  links: { github?: string; demo?: string };
  visual: VisualKind;
  caseStudy?: CaseStudy;
}

const PENDING_DIAGRAM_NOTE =
  "Draft diagram built from the components named in the project brief. Flow order and groupings should be verified against the final architecture.";

export const projects: Project[] = [
  {
    slug: "frab",
    index: "01",
    name: "FRAB",
    fullName: "Fraud Response & Autonomous Backbone",
    tagline: "Agents that investigate fraud alerts before an analyst has to.",
    description:
      "An agentic financial-security platform that proactively investigates suspicious activity and transforms alerts into evidence, risk analysis and explainable recommendations.",
    category: "Agentic AI | FinTech | Financial Security",
    filters: ["Agentic AI", "FinTech"],
    status: "Hackathon project",
    featured: true,
    badge: "2nd Runner-Up · COLOSSUS 3.0  |  3rd Place · Smart Horizon",
    stack: [
      "Google ADK",
      "Gemini / Gemma",
      "0G Private Computer",
      "React",
      "FastAPI",
      "Firestore",
      "GCP Confidential VM",
    ],
    skills: [
      "google-adk",
      "gemini",
      "multi-agent",
      "0g-tee",
      "react",
      "fastapi",
      "firestore",
      "gcp",
      "confidential-computing",
    ],
    links: {},
    visual: "frab",
    caseStudy: {
      overview: [
        "FRAB, short for Fraud Response & Autonomous Backbone, is an agentic financial-security platform. It proactively investigates suspicious activity and turns raw alerts into evidence, risk analysis and explainable recommendations.",
        "It was built for hackathon competition and placed as 2nd Runner-Up in the FinTech domain at the COLOSSUS 3.0 National Hackathon 2026 and 3rd at the Smart Horizon International Hackathon 2026.",
      ],
      problem: [
        "Fraud and security alerts arrive faster than people can investigate them. Each alert needs evidence gathered, context assembled and a risk judgement made before anyone can act.",
        "Black-box scoring makes the last step harder. An analyst who cannot see why a case was flagged cannot trust or defend the recommendation, and sending sensitive financial data to an inference service raises its own privacy question.",
      ],
      solution: [
        "FRAB puts a supervisor-led team of specialised agents in front of the alert queue. The agents (Supervisor, Watchman, Detective, Jurist and Scribe) investigate a case, collect the evidence and produce a recommendation that carries its own justification.",
        "Risk intelligence is deterministic, so the numbers behind a decision can be reproduced. Inference that touches sensitive data runs through TEE-backed execution on 0G Private Computer.",
      ],
      architecture: {
        note: PENDING_DIAGRAM_NOTE,
        nodes: [
          {
            id: "alerts",
            label: "Suspicious activity",
            col: 0,
            row: 1,
            kind: "io",
            detail:
              "Entry point. Alerts and suspicious activity are what FRAB investigates proactively instead of waiting for manual triage.",
          },
          {
            id: "supervisor",
            label: "Supervisor",
            col: 1,
            row: 1,
            kind: "core",
            detail:
              "Orchestrates the investigation and coordinates the other agents. Multi-agent investigation orchestration is built on Google ADK.",
          },
          {
            id: "watchman",
            label: "Watchman",
            col: 2,
            row: 0,
            kind: "agent",
            detail:
              "One of the five agents in the FRAB team. Its detailed responsibilities should be documented here by the project author.",
          },
          {
            id: "detective",
            label: "Detective",
            col: 2,
            row: 1,
            kind: "agent",
            detail:
              "Investigation agent. FRAB's investigations are evidence-based, so evidence gathering sits at the centre of this workflow.",
          },
          {
            id: "jurist",
            label: "Jurist",
            col: 2,
            row: 2,
            kind: "agent",
            detail:
              "Agent in the investigation team. Recommendations from FRAB are explainable, so reasoning is surfaced alongside the verdict.",
          },
          {
            id: "scribe",
            label: "Scribe",
            col: 3,
            row: 1,
            kind: "agent",
            detail:
              "Records the outcome. Alerts become evidence, risk analysis and explainable recommendations that an analyst can read.",
          },
          {
            id: "tee",
            label: "0G Private Computer (TEE)",
            col: 1,
            row: 2,
            kind: "service",
            detail:
              "Private inference through TEE-backed execution. Deployed alongside GCP Confidential VM for confidential compute.",
          },
        ],
        edges: [
          { from: "alerts", to: "supervisor" },
          { from: "supervisor", to: "watchman" },
          { from: "supervisor", to: "detective" },
          { from: "supervisor", to: "jurist" },
          { from: "watchman", to: "scribe" },
          { from: "detective", to: "scribe" },
          { from: "jurist", to: "scribe" },
          { from: "supervisor", to: "tee", label: "private inference" },
        ],
      },
      stackGroups: [
        { label: "Agents & models", items: ["Google ADK", "Gemini / Gemma"] },
        { label: "Privacy & compute", items: ["0G Private Computer", "GCP Confidential VM"] },
        { label: "Application", items: ["React", "FastAPI", "Firestore"] },
      ],
      contributions: {
        items: [],
        pending:
          "Describe your personal contributions to FRAB here (for example: which agents you designed, which services you owned, what you shipped during the hackathon).",
      },
      decisions: [
        {
          title: "A team of specialised agents, coordinated by a supervisor",
          body: "The investigation is split across five named agents under one Supervisor instead of a single prompt. Each agent has a narrow job and the orchestration is explicit.",
        },
        {
          title: "Deterministic risk intelligence",
          body: "Risk scoring is deterministic rather than left to model judgement. The same evidence yields the same score, which supports reproducibility and explanation.",
        },
        {
          title: "TEE-backed private inference",
          body: "Inference runs through 0G Private Computer, a trusted execution environment, so sensitive financial data is not exposed to a general-purpose inference path.",
        },
        {
          title: "Evidence first, recommendation second",
          body: "Every recommendation is tied to evidence collected during the investigation, so it can be explained to a human reviewer.",
        },
      ],
      challenges: {
        items: [],
        pending:
          "Add the real engineering challenges you hit (integration, latency, agent coordination, confidential compute setup) and how you solved them.",
      },
      outcomes: [
        "2nd Runner-Up, FinTech Domain, COLOSSUS 3.0 National Hackathon 2026. Prize: ₹15,000.",
        "3rd Place, Smart Horizon International Hackathon 2026. Prize: ₹75,000.",
      ],
    },
  },
  {
    slug: "inklink",
    index: "02",
    name: "InkLink",
    tagline: "Private printing, paid per use, executed on real hardware.",
    description:
      "A decentralized, privacy-first printing network built around CROPS principles, connecting customers with local print shops through secure document processing.",
    category: "Web3 | Hedera | Decentralized Infrastructure",
    filters: ["Web3"],
    status: "Hackathon project",
    featured: true,
    badge: "3rd Prize · Hedera Track · ETHGlobal Mumbai 2026",
    stack: [
      "Hedera",
      "x402",
      "0G Private Computer",
      "Local AI agents",
      "ESP32",
    ],
    skills: ["hedera", "x402", "0g-tee", "esp32"],
    links: {},
    visual: "inklink",
    caseStudy: {
      overview: [
        "InkLink is a decentralized, privacy-first printing network built around CROPS principles. It connects customers with local print shops and processes documents securely.",
        "It won 3rd Prize in the Hedera Track at ETHGlobal Mumbai 2026 ($1,500).",
      ],
      problem: [
        "Printing a sensitive document usually means handing the file to a shop or a service you have to trust completely. The customer has little control over what happens to it afterwards.",
        "Small local print shops also lack a simple way to accept automated, pay-per-use jobs from strangers.",
      ],
      solution: [
        "InkLink connects customers with local print shops through a network where documents are processed privately. Local AI agents handle the workflow, 0G Private Computer provides private processing, and Hedera x402 payments settle each job autonomously on a pay-per-use basis.",
        "The workflow reaches the physical world. An ESP32-powered device executes the print job.",
      ],
      architecture: {
        note: PENDING_DIAGRAM_NOTE,
        nodes: [
          {
            id: "customer",
            label: "Customer",
            col: 0,
            row: 1,
            kind: "io",
            detail: "Submits a document for printing through InkLink.",
          },
          {
            id: "agent",
            label: "Local AI agent",
            col: 1,
            row: 1,
            kind: "core",
            detail:
              "Local AI agents drive the printing workflow on behalf of the participants.",
          },
          {
            id: "tee",
            label: "0G Private Computer",
            col: 2,
            row: 0,
            kind: "service",
            detail:
              "Private computation for document processing, backing the privacy-focused printing workflow.",
          },
          {
            id: "x402",
            label: "Hedera x402 payment",
            col: 2,
            row: 2,
            kind: "service",
            detail:
              "Autonomous pay-per-use payments over Hedera using x402.",
          },
          {
            id: "shop",
            label: "Local print shop",
            col: 3,
            row: 1,
            kind: "io",
            detail: "Local print shops are the supply side of the network.",
          },
          {
            id: "esp32",
            label: "ESP32 execution",
            col: 4,
            row: 1,
            kind: "service",
            detail:
              "ESP32-powered hardware performs the physical execution of the job.",
          },
        ],
        edges: [
          { from: "customer", to: "agent" },
          { from: "agent", to: "tee", label: "private processing" },
          { from: "agent", to: "x402", label: "pay per use" },
          { from: "tee", to: "shop" },
          { from: "x402", to: "shop" },
          { from: "shop", to: "esp32" },
        ],
      },
      stackGroups: [
        { label: "Payments & network", items: ["Hedera", "x402"] },
        { label: "Privacy & intelligence", items: ["0G Private Computer", "Local AI agents"] },
        { label: "Hardware", items: ["ESP32"] },
      ],
      contributions: {
        items: [],
        pending:
          "Describe your personal contributions to InkLink (for example: the x402 integration, the ESP32 firmware, the agent workflow).",
      },
      decisions: [
        {
          title: "CROPS principles as the design frame",
          body: "The network is built around CROPS principles, which shapes the privacy and decentralization choices below.",
        },
        {
          title: "Autonomous pay-per-use payments with Hedera x402",
          body: "Each print job is paid for per use, with no accounts or subscriptions between a customer and a shop.",
        },
        {
          title: "Private processing before printing",
          body: "Documents are handled through 0G Private Computer so the printing workflow stays privacy-focused.",
        },
        {
          title: "Software that ends in a physical action",
          body: "An ESP32 device closes the loop between the digital workflow and the printer.",
        },
      ],
      challenges: {
        items: [],
        pending:
          "Add the real challenges (hardware integration, payment flow, privacy trade-offs) and how they were resolved.",
      },
      outcomes: [
        "3rd Prize, Hedera Track, ETHGlobal Mumbai 2026. Prize: $1,500.",
      ],
    },
  },
  {
    slug: "automaton-nexus",
    index: "03",
    name: "Automaton Nexus",
    tagline: "Multilingual voice agents that confirm orders at scale.",
    description:
      "A multilingual AI voice-agent platform designed to automate customer order-confirmation workflows.",
    category: "AI | Voice Agents | Automation",
    filters: ["AI & Automation", "Agentic AI"],
    status: "Hackathon project",
    featured: true,
    badge: "1st Place · Automaton.ai Track · Athernex Hackathon",
    stack: [
      "Voice agents",
      "AI inference",
      "Rule-based logic",
      "Modular backend",
    ],
    skills: [],
    links: {},
    visual: "automaton",
    caseStudy: {
      overview: [
        "Automaton Nexus is a multilingual AI voice-agent platform designed to automate customer order-confirmation workflows.",
        "It won 1st Place in the Automaton.ai Track at the Athernex Hackathon (₹20,000).",
      ],
      problem: [
        "Confirming orders by phone is repetitive, time-sensitive and has to work in the language the customer speaks. Doing it by hand does not scale across a campaign.",
      ],
      solution: [
        "A voice agent runs the confirmation call. A low-latency decision pipeline combines rule-based logic with AI inference, so predictable cases follow rules and open-ended turns use the model.",
        "The backend is modular, campaigns can be executed at scale, and monitoring capabilities show what the system is doing.",
      ],
      architecture: {
        note: PENDING_DIAGRAM_NOTE,
        nodes: [
          {
            id: "campaign",
            label: "Campaign",
            col: 0,
            row: 1,
            kind: "io",
            detail: "Scalable campaign execution drives batches of confirmation calls.",
          },
          {
            id: "pipeline",
            label: "Decision pipeline",
            col: 1,
            row: 1,
            kind: "core",
            detail:
              "Low-latency decision pipeline that decides what the agent does at each step of the call.",
          },
          {
            id: "rules",
            label: "Rule-based logic",
            col: 2,
            row: 0,
            kind: "service",
            detail: "Deterministic rules handle the predictable parts of the flow.",
          },
          {
            id: "ai",
            label: "AI inference",
            col: 2,
            row: 2,
            kind: "service",
            detail: "Model inference handles the parts that rules cannot.",
          },
          {
            id: "voice",
            label: "Multilingual voice agent",
            col: 3,
            row: 1,
            kind: "agent",
            detail: "Speaks with the customer in their language.",
          },
          {
            id: "confirm",
            label: "Order confirmation",
            col: 4,
            row: 1,
            kind: "io",
            detail: "The outcome of the workflow: a confirmed (or not) order.",
          },
          {
            id: "monitor",
            label: "Monitoring",
            col: 3,
            row: 2,
            kind: "service",
            detail: "Monitoring capabilities provide visibility into running campaigns.",
          },
        ],
        edges: [
          { from: "campaign", to: "pipeline" },
          { from: "pipeline", to: "rules" },
          { from: "pipeline", to: "ai" },
          { from: "rules", to: "voice" },
          { from: "ai", to: "voice" },
          { from: "voice", to: "confirm" },
          { from: "voice", to: "monitor" },
        ],
      },
      stackGroups: [
        { label: "Core capabilities", items: ["Multilingual voice agent", "Rule-based logic", "AI inference"] },
        { label: "Platform", items: ["Modular backend", "Campaign execution", "Monitoring"] },
      ],
      contributions: {
        items: [],
        pending:
          "Describe your contributions to Automaton Nexus and list the concrete tools used (telephony, speech, LLM provider, backend framework).",
      },
      decisions: [
        {
          title: "Rules plus AI instead of AI alone",
          body: "Rule-based logic is combined with AI inference in a single decision pipeline, keeping predictable paths fast and deterministic.",
        },
        {
          title: "Low-latency pipeline",
          body: "Voice conversation is unforgiving about delay, so the decision pipeline is designed for low latency.",
        },
        {
          title: "Modular backend",
          body: "A modular backend keeps campaign execution, decisions and monitoring separate and extensible.",
        },
      ],
      challenges: {
        items: [],
        pending:
          "Add the real challenges (latency, multilingual handling, scaling campaigns) and the solutions you implemented.",
      },
      outcomes: [
        "1st Place, Automaton.ai Track, Athernex Hackathon. Prize: ₹20,000.",
      ],
    },
  },
  {
    slug: "identipi",
    index: "04",
    name: "IdentiPI",
    tagline: "One identifier. Many credentials. Proof without disclosure.",
    description:
      "A privacy-first decentralized identity platform that unifies Verifiable Credentials under a single Decentralized Identifier.",
    category: "Web3 | Decentralized Identity | ZKP",
    filters: ["Web3"],
    status: "Hackathon project",
    featured: true,
    badge: "Finalist · Cardano Hackathon · India Blockchain Week 2025",
    stack: [
      "Decentralized Identifiers",
      "Verifiable Credentials",
      "Zero-Knowledge Proofs",
      "Smart contracts",
    ],
    skills: ["dids", "vcs", "zkp", "cardano"],
    links: {},
    visual: "identipi",
    caseStudy: {
      overview: [
        "IdentiPI is a privacy-first decentralized identity platform. It unifies Verifiable Credentials under a single Decentralized Identifier (DID).",
        "It was a Finalist at the Cardano Hackathon during India Blockchain Week 2025.",
      ],
      problem: [
        "Identity credentials are scattered across institutions, and proving a single fact usually means revealing the whole document. The user has little say over who sees what.",
      ],
      solution: [
        "IdentiPI anchors identity in one DID and attaches Verifiable Credentials to it. Claims are verified with Zero-Knowledge Proofs, so a verifier learns that a claim is true without seeing the underlying data.",
        "Access stays under user control, and smart contract interaction models connect the identity layer to on-chain logic.",
      ],
      architecture: {
        note: PENDING_DIAGRAM_NOTE,
        nodes: [
          {
            id: "issuer",
            label: "Credential issuer",
            col: 0,
            row: 0,
            kind: "io",
            detail: "Issues Verifiable Credentials to a user's DID.",
          },
          {
            id: "holder",
            label: "User DID + credentials",
            col: 1,
            row: 1,
            kind: "core",
            detail:
              "A single Decentralized Identifier unifies the user's Verifiable Credentials. The user controls access.",
          },
          {
            id: "zkp",
            label: "ZKP claim proof",
            col: 2,
            row: 1,
            kind: "service",
            detail:
              "Zero-Knowledge Proof verification enables privacy-preserving claim verification.",
          },
          {
            id: "verifier",
            label: "Verifier",
            col: 3,
            row: 1,
            kind: "io",
            detail: "Checks a claim without seeing the underlying credential data.",
          },
          {
            id: "contract",
            label: "Smart contract",
            col: 2,
            row: 2,
            kind: "service",
            detail: "Smart contract interaction models link identity checks to on-chain logic.",
          },
        ],
        edges: [
          { from: "issuer", to: "holder", label: "issues VC" },
          { from: "holder", to: "zkp" },
          { from: "zkp", to: "verifier" },
          { from: "verifier", to: "contract" },
          { from: "holder", to: "contract" },
        ],
      },
      stackGroups: [
        { label: "Identity", items: ["DIDs", "Verifiable Credentials"] },
        { label: "Privacy", items: ["Zero-Knowledge Proofs"] },
        { label: "Chain", items: ["Cardano", "Smart contracts"] },
      ],
      contributions: {
        items: [],
        pending:
          "Describe your contributions to IdentiPI and list the exact contracts, ZKP tooling and frontend stack used.",
      },
      decisions: [
        {
          title: "One DID as the root of identity",
          body: "Credentials are unified under a single Decentralized Identifier instead of being siloed per issuer.",
        },
        {
          title: "Verify claims with zero-knowledge proofs",
          body: "A verifier gets a yes/no answer for a claim and no more, which keeps verification privacy-preserving.",
        },
        {
          title: "User-controlled access",
          body: "The user decides who can verify what. The platform does not act as a central gatekeeper.",
        },
      ],
      challenges: {
        items: [],
        pending:
          "Add the real challenges (ZKP integration, DID design, contract interaction) and how they were resolved.",
      },
      outcomes: ["Finalist, Cardano Hackathon, India Blockchain Week 2025."],
    },
  },
  /* ---------------------------- Additional projects --------------------------- */
  {
    slug: "yuktidoot",
    index: "05",
    name: "Yuktidoot",
    tagline: "Agentic AI workforce for Indian MSMEs.",
    description: "Agentic AI Workforce for Indian MSMEs.",
    category: "Agentic AI",
    filters: ["Agentic AI"],
    status: "Details pending",
    featured: false,
    stack: [],
    skills: [],
    links: {},
    visual: "yuktidoot",
  },
  {
    slug: "odyssey",
    index: "06",
    name: "Odyssey",
    tagline: "B2B travel orchestration platform.",
    description: "B2B Travel Orchestration Platform.",
    category: "Platform",
    filters: ["Full-Stack"],
    status: "Details pending",
    featured: false,
    stack: [],
    skills: [],
    links: {},
    visual: "odyssey",
  },
  {
    slug: "lactiq",
    index: "07",
    name: "LactIQ",
    tagline: "AI-powered dairy integrity intelligence.",
    description: "AI-Powered Dairy Integrity Intelligence.",
    category: "AI",
    filters: ["AI & Automation"],
    status: "Details pending",
    featured: false,
    stack: [],
    skills: [],
    links: {},
    visual: "lactiq",
  },
  {
    slug: "klaim",
    index: "08",
    name: "Klaim",
    tagline: "Pay-per-use identity verification infrastructure.",
    description: "Pay-per-use Identity Verification Infrastructure.",
    category: "Infrastructure",
    filters: ["Web3"],
    status: "Details pending",
    featured: false,
    stack: [],
    skills: [],
    links: {},
    visual: "klaim",
  },
  {
    slug: "guruko",
    index: "09",
    name: "Guruko",
    tagline: "AI classroom agent.",
    description: "AI Classroom Agent.",
    category: "Agentic AI",
    filters: ["Agentic AI"],
    status: "Details pending",
    featured: false,
    stack: [],
    skills: [],
    links: {},
    visual: "guruko",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const additionalProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentFeatured(slug: string) {
  const list = featuredProjects;
  const i = list.findIndex((p) => p.slug === slug);
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}
