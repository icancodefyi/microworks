export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is Microworks?",
    answer:
      "A micro-task marketplace on Monad. Teams post small paid tasks — label, vote, verify, caption — and anyone with a wallet completes them for an instant on-chain payout. Built at the Monad Blitz Mumbai hackathon.",
  },
  {
    question: "How does on-chain judging work?",
    answer:
      "When a task is created, its creator stores a golden answer key in the contract. Each submission is compared against that key on-chain: a match triggers an instant payout to the worker, a mismatch is rejected and the bounty stays in escrow. No middlemen, and every step is visible on the explorer.",
  },
  {
    question: "Why build on Monad?",
    answer:
      "Micro-tasks need micro-payouts. Monad's EVM-compatible testnet delivers sub-second finality and near-zero gas, so even a 0.01 MON payout is worth settling on-chain. Monad mainnet targets 10,000 TPS.",
  },
  {
    question: "Is there a minimum payout?",
    answer:
      "No. A bounty settles as soon as a correct answer is submitted and verified — there is no withdrawal threshold and no 30-day payout cycle. Workers hold their own earnings in their own wallet.",
  },
  {
    question: "What fees does Microworks take?",
    answer:
      "A flat 2% protocol fee per task payout. Creators set the bounty; workers receive it in full minus the fee. All funds move through the contract in escrow.",
  },
  {
    question: "Is this production software?",
    answer:
      "Not yet. This is a hackathon prototype live on the Monad testnet. Grab testnet MON from the faucet, create a task, and watch payouts settle in seconds. The contract and app are open source in the repo.",
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
    title: "Product",
    links: [
      { label: "Active Tasks", href: "/app" },
      { label: "Create a Task", href: "/app" },
      { label: "Payout Ticker", href: "/app" },
    ],
  },
  {
    title: "On Monad",
    links: [
      { label: "Faucet", href: "https://faucet.monad.xyz", external: true },
      { label: "Testnet Explorer", href: "https://testnet.monadexplorer.com", external: true },
      { label: "Monad Docs", href: "https://docs.monad.xyz", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "#showcase" },
      { label: "FAQ", href: "#faq" },
      { label: "GitHub", href: "https://github.com/icancodefyi/microworks", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];