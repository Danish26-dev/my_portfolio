/**
 * Generates public/Md-Danish-Ali-Resume.pdf using only facts from the portfolio brief.
 * It is a stand-in so the Download Resume buttons work from day one.
 * Replace the PDF with your official resume (keep the same filename) when ready.
 *
 * Usage: npm run resume
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../public/Md-Danish-Ali-Resume.pdf");

const content = [
  { t: "MD DANISH ALI", s: 22, b: true, gap: 6 },
  { t: "Software Engineer | Agentic AI | Web3 | Full-Stack Development", s: 10.5, gap: 4 },
  { t: "mddanisha288@gmail.com | +91-6364637752", s: 10, gap: 2 },
  { t: "github.com/Danish26-dev | linkedin.com/in/md-danish-ali-dev", s: 10, gap: 14 },

  { t: "SUMMARY", s: 11, b: true, gap: 4 },
  {
    t: "Computer Science undergraduate and hackathon-winning software engineer focused on Agentic AI, Web3 and full-stack systems. Experienced in building multi-agent investigation workflows, privacy-aware document infrastructure, decentralized applications and API-driven systems.",
    s: 10,
    gap: 14,
  },

  { t: "EDUCATION", s: 11, b: true, gap: 4 },
  { t: "Sambhram Institute of Technology", s: 10.5, b: true, gap: 1 },
  { t: "Bachelor of Engineering, Computer Science and Engineering | Sep 2023 - Sep 2027 | CGPA 8.3/10", s: 10, gap: 3 },
  {
    t: "Coursework: Object-Oriented Programming, Databases, Discrete Mathematics, Data Structures and Algorithms, Operating Systems, Computer Networks, Machine Learning, Data Mining, Advanced Data Structures and Algorithms, Information Retrieval, Image Processing.",
    s: 9.5,
    gap: 14,
  },

  { t: "ACHIEVEMENTS", s: 11, b: true, gap: 4 },
  { t: "3rd Prize, Hedera Track | ETHGlobal Mumbai 2026 | InkLink | USD 1,500", s: 10, gap: 2 },
  { t: "2nd Runner-Up, FinTech Domain | COLOSSUS 3.0 National Hackathon 2026 | FRAB | INR 15,000", s: 10, gap: 2 },
  { t: "3rd Place | Smart Horizon International Hackathon 2026 | FRAB | INR 75,000", s: 10, gap: 2 },
  { t: "1st Place, Automaton.ai Track | Athernex Hackathon | Automaton Nexus | INR 20,000", s: 10, gap: 2 },
  { t: "Finalist | Cardano Hackathon, India Blockchain Week 2025 | IdentiPI", s: 10, gap: 14 },

  { t: "FEATURED PROJECTS", s: 11, b: true, gap: 4 },
  { t: "FRAB - Fraud Response & Autonomous Backbone", s: 10.5, b: true, gap: 1 },
  {
    t: "Agentic financial-security platform that investigates suspicious activity and produces evidence, risk analysis and explainable recommendations. Agents: Supervisor, Watchman, Detective, Jurist, Scribe. Google ADK, Gemini / Gemma, 0G Private Computer, React, FastAPI, Firestore, GCP Confidential VM.",
    s: 9.5,
    gap: 5,
  },
  { t: "InkLink", s: 10.5, b: true, gap: 1 },
  {
    t: "Decentralized, privacy-first printing network built around CROPS principles. Hedera x402 pay-per-use payments, local AI agents, 0G Private Computer, ESP32-powered physical execution.",
    s: 9.5,
    gap: 5,
  },
  { t: "Automaton Nexus", s: 10.5, b: true, gap: 1 },
  {
    t: "Multilingual AI voice-agent platform that automates customer order-confirmation workflows with a low-latency decision pipeline combining rule-based logic and AI inference.",
    s: 9.5,
    gap: 5,
  },
  { t: "IdentiPI", s: 10.5, b: true, gap: 1 },
  {
    t: "Privacy-first decentralized identity platform unifying Verifiable Credentials under a single DID, with Zero-Knowledge Proof verification.",
    s: 9.5,
    gap: 5,
  },
  {
    t: "Additional: Yuktidoot, Odyssey, LactIQ, Klaim, Guruko.",
    s: 9.5,
    gap: 14,
  },

  { t: "TECHNICAL SKILLS", s: 11, b: true, gap: 4 },
  { t: "Full-stack: MongoDB, Express.js, React.js, Node.js, TypeScript, FastAPI, REST APIs, Firebase, Firestore", s: 9.5, gap: 2 },
  { t: "Languages: Java, JavaScript, Python", s: 9.5, gap: 2 },
  { t: "AI & agentic systems: Google ADK, Gemini, Vertex AI, AWS Bedrock, Multi-Agent Orchestration, LLM Integration, RAG", s: 9.5, gap: 2 },
  { t: "Blockchain & Web3: Hedera, x402 Payments, 0G Private Computer (TEE), Cardano, Aiken, DIDs, Verifiable Credentials, Zero-Knowledge Proofs", s: 9.5, gap: 2 },
  { t: "Tools & cloud: Git, GitHub, Docker, Google Cloud Platform, Confidential Computing, ESP32, n8n, Figma", s: 9.5, gap: 2 },
];

const W = 595;
const H = 842;
const M = 50;
const usable = W - M * 2;

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function wrap(text, size, bold) {
  const avg = size * (bold ? 0.56 : 0.5);
  const max = Math.floor(usable / avg);
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

let y = H - 56;
const ops = [];
for (const item of content) {
  for (const line of wrap(item.t, item.s, item.b)) {
    ops.push(`BT /${item.b ? "F2" : "F1"} ${item.s} Tf ${M} ${y.toFixed(1)} Td (${esc(line)}) Tj ET`);
    y -= item.s * 1.32;
  }
  y -= item.gap;
}
if (y < 40) throw new Error("Resume content overflows one page; shorten it.");

const stream = ops.join("\n");
const objs = [];
objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
objs[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
objs[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`;
objs[4] = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;
objs[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
objs[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

let pdf = "%PDF-1.4\n";
const offsets = [];
for (let i = 1; i < objs.length; i++) {
  offsets[i] = Buffer.byteLength(pdf);
  pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
}
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
for (let i = 1; i < objs.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
pdf += `trailer\n<< /Size ${objs.length} /Root 1 0 R /Info << /Title (Md Danish Ali - Resume) >> >>\nstartxref\n${xref}\n%%EOF`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pdf, "latin1");
console.log("Wrote", out);
