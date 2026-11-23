/**
 * Each principle is paired with something that is true of a project on this site.
 * Keep it that way: no principle without a receipt.
 */
export const philosophy = [
  {
    title: "Build before overthinking.",
    proof: "Every featured project here started as a working prototype built against a hackathon clock.",
  },
  {
    title: "Understand systems beyond abstractions.",
    proof: "FRAB's risk intelligence is deterministic, so a number in a report can be traced back to the evidence behind it.",
  },
  {
    title: "Experiment with emerging technologies.",
    proof: "x402 payments, TEE-backed inference and zero-knowledge proofs all appear in the projects listed here.",
  },
  {
    title: "Prioritize practical engineering.",
    proof: "InkLink ends in a physical print job on an ESP32, not in a demo video.",
  },
  {
    title: "Learn through shipping.",
    proof: "Four hackathon awards and one finalist place came from submitting working builds.",
  },
];

export const explore = [
  "Agentic AI and multi-agent orchestration",
  "AI infrastructure and RAG",
  "Blockchain and decentralized identity",
  "Privacy-preserving computation",
  "Full-stack engineering",
  "Intelligent automation",
];

/**
 * Journey timeline. Only dated facts supplied by the owner are used.
 * The Athernex Hackathon year has not been provided, so it is shown as
 * "Date to confirm" rather than guessed. Add `year` when known.
 */
export interface TimelineEntry {
  when: string;
  title: string;
  body: string;
  kind: "academic" | "milestone" | "pending";
}

export const journey: TimelineEntry[] = [
  {
    when: "Sep 2023",
    title: "Starts B.E. in Computer Science and Engineering",
    body: "Sambhram Institute of Technology.",
    kind: "academic",
  },
  {
    when: "2025",
    title: "Finalist, Cardano Hackathon",
    body: "IdentiPI reaches the final round at India Blockchain Week 2025.",
    kind: "milestone",
  },
  {
    when: "2026",
    title: "Three podium finishes",
    body: "COLOSSUS 3.0 (2nd Runner-Up, FRAB), Smart Horizon (3rd, FRAB) and ETHGlobal Mumbai (3rd Prize, Hedera Track, InkLink).",
    kind: "milestone",
  },
  {
    when: "Date to confirm",
    title: "1st Place, Athernex Hackathon",
    body: "Automaton Nexus wins the Automaton.ai Track.",
    kind: "pending",
  },
  {
    when: "Sep 2027",
    title: "Expected graduation",
    body: "End of the B.E. program.",
    kind: "academic",
  },
];

export const education = {
  institution: "Sambhram Institute of Technology",
  degree: "Bachelor of Engineering — Computer Science and Engineering",
  start: "September 2023",
  end: "September 2027",
  cgpa: "8.3/10",
  coursework: [
    "Object-Oriented Programming",
    "Databases",
    "Discrete Mathematics",
    "Data Structures and Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning",
    "Data Mining",
    "Advanced Data Structures and Algorithms",
    "Information Retrieval",
    "Image Processing",
  ],
};

export const hobbies = [
  {
    id: "aquascaping",
    title: "Aquascaping",
    body: "Designing and maintaining planted aquarium ecosystems.",
  },
  {
    id: "chess",
    title: "Chess",
    body: "Strategic gameplay and problem-solving.",
  },
];
