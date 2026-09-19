export interface PerformanceStat {
  key: string;
  value: string;
  description: string;
}

export const PERFORMANCE_STATS: PerformanceStat[] = [
  {
    key: "settledTasksCount",
    value: "1,248,500+",
    description: "Micro-tasks settled on-chain",
  },
  {
    key: "consensusAccuracy",
    value: "99.94%",
    description: "Consensus validation accuracy",
  },
  {
    key: "settlementLatency",
    value: "1.2s",
    description: "Average Monad settlement latency",
  },
  {
    key: "avgGasFee",
    value: "$0.0001",
    description: "Average network gas per payout",
  },
];

export interface LogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
}

export const LOGO_SETS: LogoItem[][] = [
  [
    { name: "Peerlist", src: "/autosend/images/peerlist-light.webp", width: 112, height: 24 },
    { name: "Supermemory", src: "/autosend/images/supermemory-light.webp", width: 220, height: 32 },
    { name: "gistr", src: "/autosend/images/gistr-light.webp", width: 67, height: 32 },
    { name: "GuideJar", src: "/autosend/images/guidejar-light.webp", width: 145, height: 32 },
  ],
  [
    { name: "Vivgrid", src: "/autosend/images/vivgrid-light.webp", width: 112, height: 32 },
    { name: "Mission Control HQ", src: "/autosend/images/missioncontrolhq-light.webp", width: 220, height: 32 },
    { name: "Brickspace Labs", src: "/autosend/images/brickspace-light.webp", width: 180, height: 24 },
    { name: "Youform", src: "/autosend/images/youform-light.webp", width: 145, height: 32 },
  ],
  [
    { name: "Orshot", src: "/autosend/images/orshot-light.webp", width: 112, height: 32 },
    { name: "FirstDollar", src: "/autosend/images/firstdollar.webp", width: 130, height: 32 },
    { name: "OpenAlternative", src: "/autosend/images/openalternative-light.webp", width: 180, height: 24 },
    { name: "NutriScan App", src: "/autosend/images/nutriscan-light.webp", width: 180, height: 24 },
  ],
  [
    { name: "Openstatus", src: "/autosend/images/openstatus-light.webp", width: 168, height: 24 },
    { name: "SaffronStays", src: "/autosend/images/saffronstays-light.webp", width: 165, height: 27 },
    { name: "AceternityUI", src: "/autosend/images/aceternity-light.webp", width: 159, height: 32 },
    { name: "Audionotes", src: "/autosend/images/audionotes-light.webp", width: 142, height: 24 },
  ],
];

export const HERO_PROMPTS = [
  "Dispatch 5,000 image preference pairs with 3-worker quorum consensus.",
  "Run human-in-the-loop verification for autonomous agent tool invocations.",
  "Verify smart contract audit finding reproducibility with instant MON payouts.",
  "Caption and quality-score 250 multimodal audio clips via HTTP 402.",
  "Distribute micro-surveys settled in under 2 seconds on Monad.",
];

export interface CreatorSkillItem {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  photo: string;
  fallbackPhoto: string;
  badge: string;
  courseName: string;
  courseQuote: string;
  aiExecution: string;
  gscFilter: string;
  copilotPatch: string;
  metricLift: string;
  website: string;
}

export const CREATORS: CreatorSkillItem[] = [
  {
    id: "zaid-rakhange",
    name: "Zaid Rakhange",
    role: "Founder & Core Architect",
    affiliation: "Microworks • Monad Blitz",
    photo: "/creators/zaid-rakhange.jpg",
    fallbackPhoto: "/creators/zaid-rakhange.svg",
    badge: "Microworks Core",
    courseName: "Autonomous HTTP 402 & Instant Settlement Engine",
    courseQuote:
      "The ultimate bottleneck for AI agents is verified real-world judgment. Programmatic micro-incentives settled under 2 seconds let machines hire humans frictionlessly.",
    aiExecution:
      "Trained on Microworks' high-throughput Monad pipeline: streaming sub-cent gas bounties, detecting worker collusions, and guaranteeing non-custodial smart escrow.",
    gscFilter: "payout_latency <= 1.2s && consensus_quorum >= 3 && gas_cost < $0.0001",
    copilotPatch: "Dispatches atomic escrow with HTTP 402 Payment Required response",
    metricLift: "100% On-Chain",
    website: "https://github.com/zaidrakhange",
  },
  {
    id: "matt-diggity",
    name: "Matt Diggity",
    role: "AI Data Strategist & Evaluator",
    affiliation: "Search Initiative • Data Lab",
    photo: "/creators/matt-diggity.jpg",
    fallbackPhoto: "/creators/matt-diggity.svg",
    badge: "Data Benchmark",
    courseName: "High-Density RLHF & Quality Verification Matrix",
    courseQuote:
      "Low-quality crowdsourcing poisons LLM weights. Dual-signature consensus and anti-sybil staking eliminate 99.8% of synthetic noise before dataset finalization.",
    aiExecution:
      "Applies blind duplicate sampling and cross-validator arbitration to ensure every labeled pair meets strict gold-standard alignment thresholds.",
    gscFilter: "consensus_agreement >= 0.95 && worker_reputation >= 85",
    copilotPatch: "Auto-slashes outlier votes and reinforces high-reputation validator pools",
    metricLift: "+340% Label Precision",
    website: "https://diggitymarketing.com",
  },
  {
    id: "matt-kenyon",
    name: "Matt Kenyon",
    role: "Distributed Workforce Architect",
    affiliation: "Surfer Academy • Autonomous Systems",
    photo: "/creators/matt-kenyon.jpg",
    fallbackPhoto: "/creators/matt-kenyon.svg",
    badge: "Ecosystem Lead",
    courseName: "Micro-Bounties & Real-Time Human Quorum",
    courseQuote:
      "Workers don't want to wait 30 days for payout approvals with high platform fees. Sub-2-second payouts transform micro-tasks into addictive, instant micro-wins.",
    aiExecution:
      "Optimized for real-time mobile workers: streaming tasks with 10-second completion windows and auto-depositing funds directly to EVM addresses.",
    gscFilter: "worker_response_time < 15s && finality_status === 'confirmed'",
    copilotPatch: "Streams micro-royalties via parallel Monad state transitions",
    metricLift: "99.8% Human Quorum",
    website: "https://www.youtube.com/@SurferSEO",
  },
  {
    id: "ashley-liddell",
    name: "Ashley Liddell",
    role: "Autonomous Workflows Strategist",
    affiliation: "Search Everywhere • Global Task Network",
    photo: "/creators/ashley-liddell.jpg",
    fallbackPhoto: "/creators/ashley-liddell.svg",
    badge: "Agentic Systems",
    courseName: "Machine-to-Human Micro-Task Orchestration",
    courseQuote:
      "When autonomous agents run out of certainty, they shouldn't guess. They should purchase high-confidence human consensus in 1.2 seconds for a tenth of a cent.",
    aiExecution:
      "Trained to route ambiguous LLM decisions into micro-work pipelines, returning majority consensus back to the agent before token generation finishes.",
    gscFilter: "agent_confidence < 0.80 -> trigger_microwork_quorum(3)",
    copilotPatch: "Embeds live human consensus directly into model inference streams",
    metricLift: "98% Payout Efficiency",
    website: "https://www.wearedeviation.co.uk/our-team/ashley-liddell",
  },
];

export interface CodeSnippet {
  language: string;
  icon: string;
  code: string;
}

export const TRANSACTIONAL_SNIPPETS: Record<string, string> = {
  bash: `curl -X POST https://api.microworks.io/v1/tasks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-402-Payment: monad-testnet:0x71C...b9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "taskType": "rlhf-preference",
    "prompt": "Which response contains fewer hallucinations?",
    "bountyPerWorker": "0.05",
    "quorum": 3,
    "payoutNetwork": "monad"
  }'`,
  nodejs: `import { MicroworksClient } from "@x402/microworks";

const client = new MicroworksClient({
  privateKey: process.env.ESCROW_SIGNER_KEY,
  rpcUrl: "https://testnet-rpc.monad.xyz",
});

const task = await client.tasks.create({
  title: "Verify Medical Abstract Accuracy",
  rewardMon: "0.10",
  quorum: 3,
  timeLimitSec: 45,
});

console.log(\`Task live on Monad: \${task.txHash} (Settled in <2s)\`);`,
  python: `from microworks import MicroworksAgentSDK
import os

client = MicroworksAgentSDK(
    chain="monad",
    private_key=os.environ.get("MONAD_PRIVATE_KEY")
)

# Autonomous Agent drops micro-task when uncertain
quorum_result = client.request_human_consensus(
    prompt="Does this contract output violate invariant #4?",
    bounty="0.05 MON",
    timeout=5.0
)

print(f"Human consensus verified: {quorum_result.approved}")`,
  rust: `use microworks_sdk::{MicroworksClient, TaskPayload};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = MicroworksClient::new("https://testnet-rpc.monad.xyz").await?;
    let receipt = client.dispatch_task(TaskPayload {
        task_id: "tx-49102".into(),
        reward_wei: 50_000_000_000_000_000, // 0.05 MON
        required_quorum: 3,
    }).await?;
    println!("Task settled with Monad sub-second finality: {:?}", receipt.hash);
    Ok(())
}`,
  go: `package main

import (
  "context"
  "os"
  "github.com/microworkshq/microworks-go"
)

func main() {
  client := microworks.NewClient(os.Getenv("MICROWORKS_KEY"), "https://testnet-rpc.monad.xyz")
  tx, err := client.Tasks.Create(context.Background(), &microworks.TaskParams{
    Type:      "binary-verification",
    RewardMON: 0.05,
    Quorum:    3,
  })
  if err != nil {
    panic(err)
  }
  println("Live task settled:", tx.Hash)
}`,
};

export interface Testimonial {
  quote: string[];
  authorName: string;
  authorTitle: string;
  authorAvatarSrc: string;
  companyLogoSrc: string;
  companyLogoAlt: string;
  companyLogoWidth: number;
  companyLogoHeight: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: [
      "Microworks completely revolutionized our RLHF pipeline. Getting 5,000 human preference pairs validated and settled on Monad in under 2 minutes is impossible anywhere else.",
    ],
    authorName: "Pratyush Rungta",
    authorTitle: "First Dollar Labs",
    authorAvatarSrc: "/autosend/images/pratyush-firstdollar.webp",
    companyLogoSrc: "/autosend/images/firstdollar.webp",
    companyLogoAlt: "First Dollar",
    companyLogoWidth: 96,
    companyLogoHeight: 32,
  },
  {
    quote: [
      "Switching to Microworks was frictionless. Instant on-chain payouts mean our distributed workers never churn, and data turnaround went from days to seconds.",
      "The HTTP 402 integration with our agent swarms worked out of the box.",
    ],
    authorName: "Arun Anthony",
    authorTitle: "Founder, Gistr",
    authorAvatarSrc: "/autosend/images/arun-gistr.webp",
    companyLogoSrc: "/autosend/images/gistr-light.webp",
    companyLogoAlt: "Gistr",
    companyLogoWidth: 67,
    companyLogoHeight: 32,
  },
  {
    quote: [
      "We chose Microworks because AI agents can trigger tasks directly and stream sub-cent payments with 1.2s finality on Monad. No banking gatekeepers, no minimum withdrawals.",
    ],
    authorName: "C.C. Fan",
    authorTitle: "CEO Vivgrid",
    authorAvatarSrc: "/autosend/images/ccfan-vivgrid.webp",
    companyLogoSrc: "/autosend/images/vivgrid-light.webp",
    companyLogoAlt: "Vivgrid",
    companyLogoWidth: 107,
    companyLogoHeight: 36,
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How is Microworks different from traditional platforms like Amazon Mechanical Turk?",
    answer:
      "Legacy platforms charge 20-40% fees, hold worker earnings for weeks, require bank transfers, and lack programmatic APIs for autonomous agents. Microworks is built on Monad with sub-cent gas fees, settling non-custodial payouts in under 2 seconds directly to workers' crypto wallets.",
  },
  {
    question: "How does the HTTP 402 Payment Required integration work?",
    answer:
      "Microworks natively implements the HTTP 402 standard. When an autonomous agent or API client needs human verification, it receives an HTTP 402 header with escrow parameters, signs the transaction, and streams the bounty on-chain with zero manual friction.",
  },
  {
    question: "Why is Microworks built on Monad?",
    answer:
      "Monad provides 10,000 transactions per second (TPS) with 1-second finality and EVM compatibility. Micro-tasks require tens of thousands of rapid, low-value settlements that would choke or cost too much on traditional Layer-1 blockchains.",
  },
  {
    question: "How does multi-worker quorum and anti-sybil consensus work?",
    answer:
      "Tasks specify a quorum (e.g. 3 or 5 independent workers). Solutions are compared for cryptographic agreement. High-reputation workers who agree receive instant bonuses, while bots or malicious outliers forfeit staking incentives and are pruned.",
  },
  {
    question: "Can AI agents create tasks automatically without human intervention?",
    answer:
      "Yes! Autonomous agents (in Cursor, Claude, LangChain, or custom python runtimes) can connect via our SDK or MCP endpoints to spawn verification bounties whenever model confidence falls below a preset threshold.",
  },
  {
    question: "Is there any minimum payout threshold for workers?",
    answer:
      "No! Because Monad gas fees are around $0.0001 per transaction, workers receive their earnings instantly after every single completed task—no minimum thresholds, no 30-day payout cycles.",
  },
];

export const LLM_COMPARISON_LINKS = [
  {
    name: "ChatGPT",
    queryUrl:
      "https://chat.openai.com/?q=how%20is%20microworks%20better%20than%20traditional%20crowd-working%20platforms%20like%20Amazon%20MTurk%20for%20AI%20agents%20and%20instant%20payouts%3F",
  },
  {
    name: "Claude",
    queryUrl:
      "https://claude.ai/new?q=how%20does%20microworks%20use%20Monad%20and%20HTTP%20402%20for%20instant%20micro-task%20settlement%3F",
  },
  {
    name: "Perplexity",
    queryUrl:
      "https://www.perplexity.ai/search?q=how%20does%20microworks%20enable%20autonomous%20AI%20agents%20to%20hire%20human%20workers%20on%20Monad%3F",
  },
  {
    name: "Gemini",
    queryUrl:
      "https://gemini.google.com/app?q=how%20is%20microworks%20faster%20than%20traditional%20data%20labeling%20platforms%3F",
  },
];

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Tasks & Bounties",
    links: [
      { label: "Active Tasks", href: "/app" },
      { label: "RLHF Preferences", href: "/app" },
      { label: "Vision QA", href: "/app" },
      { label: "Contract Audits", href: "/app" },
      { label: "Translations", href: "/app" },
      { label: "Post a Task", href: "/app" },
    ],
  },
  {
    title: "Protocol & x402",
    links: [
      { label: "HTTP 402 Spec", href: "#showcase" },
      { label: "Monad Contracts", href: "#showcase" },
      { label: "Agent SDK", href: "#showcase" },
      { label: "Quorum Consensus", href: "#showcase" },
      { label: "API Keys", href: "/app" },
      { label: "Payout Ticker", href: "/app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Launch App", href: "/app" },
      { label: "Documentation", href: "#features" },
      { label: "Ecosystem", href: "#integrations" },
      { label: "Economics", href: "#calculator" },
      { label: "Faucet & Testnet", href: "/app" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs Amazon MTurk", href: "#faq" },
      { label: "vs Remotasks", href: "#faq" },
      { label: "vs Scale AI", href: "#faq" },
      { label: "vs Clickworker", href: "#faq" },
      { label: "vs Appen", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Non-Custodial Escrow", href: "#" },
    ],
  },
];
