/**
 * SKILL DATA
 * No proficiency percentages on purpose. Project usage is derived from
 * `projects[].skills` so adding a skill id to a project updates the explorer.
 */
export interface Skill {
  id: string;
  name: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  blurb: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "fullstack",
    label: "Full-Stack Development",
    blurb: "Application layers from data to interface.",
    skills: [
      { id: "mongodb", name: "MongoDB" },
      { id: "express", name: "Express.js" },
      { id: "react", name: "React.js" },
      { id: "node", name: "Node.js" },
      { id: "typescript", name: "TypeScript" },
      { id: "fastapi", name: "FastAPI" },
      { id: "rest", name: "REST APIs" },
      { id: "firebase", name: "Firebase" },
      { id: "firestore", name: "Firestore" },
    ],
  },
  {
    id: "languages",
    label: "Programming Languages",
    blurb: "The languages I build with.",
    skills: [
      { id: "java", name: "Java" },
      { id: "javascript", name: "JavaScript" },
      { id: "python", name: "Python" },
    ],
  },
  {
    id: "ai",
    label: "AI & Agentic Systems",
    blurb: "Agents, models and the orchestration between them.",
    skills: [
      { id: "google-adk", name: "Google ADK" },
      { id: "gemini", name: "Gemini" },
      { id: "vertex", name: "Vertex AI" },
      { id: "bedrock", name: "AWS Bedrock" },
      { id: "multi-agent", name: "Multi-Agent Orchestration" },
      { id: "llm", name: "LLM Integration" },
      { id: "rag", name: "RAG" },
    ],
  },
  {
    id: "web3",
    label: "Blockchain & Web3",
    blurb: "Decentralized identity, payments and private compute.",
    skills: [
      { id: "hedera", name: "Hedera" },
      { id: "x402", name: "x402 Payments" },
      { id: "0g-tee", name: "0G Private Computer (TEE)" },
      { id: "cardano", name: "Cardano" },
      { id: "aiken", name: "Aiken" },
      { id: "dids", name: "DIDs" },
      { id: "vcs", name: "Verifiable Credentials" },
      { id: "zkp", name: "Zero-Knowledge Proofs" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Cloud",
    blurb: "Infrastructure, hardware and workflow tooling.",
    skills: [
      { id: "git", name: "Git" },
      { id: "github", name: "GitHub" },
      { id: "docker", name: "Docker" },
      { id: "gcp", name: "Google Cloud Platform" },
      { id: "confidential-computing", name: "Confidential Computing" },
      { id: "esp32", name: "ESP32" },
      { id: "n8n", name: "n8n" },
      { id: "figma", name: "Figma" },
    ],
  },
];
