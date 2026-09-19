# MicroWorks — Micro-tasks. Instant payouts. On-chain.

MicroWorks is a decentralized micro-task marketplace on **Monad Testnet** that pays workers **instantly and automatically** for completed micro-jobs (labelling, verification, rating, transcription) — judged entirely **on-chain** against a hidden "golden key", with no oracle, no judge, and no dispute window.

Built to feel like a game, not a gig board: every correct answer earns **+100 XP**, feeds your **win streak** and **daily streak**, and moves you up ranks from **Rookie → Grandmaster** on a live on-chain leaderboard.

---

## Quick links

| | |
|---|---|
| **Live demo** | **https://microworks.impiclabs.com** (custom domain, real users) |
| **Contract** | **`0x26e67271c65ac40d419dffe8d6ad7ffcb2755237`** on **Monad Testnet** (chain id `10143`) |
| **Explorer** | https://testnet.monadexplorer.com/address/0x26e67271c65ac40d419dffe8d6ad7ffcb2755237 |
| **Code** | https://github.com/icancodefyi/microworks |
| **RPC** | `https://testnet-rpc.monad.xyz` |

## Build in public — live posts & metrics

All four of these are cross-posted publicly and captured at submission time:

| Item | Link | Metric |
|---|---|---|
| **X post** (tagged `@monad` `@monad_dev` `@geeky_kartikey`) | https://x.com/icancodefyi/status/2101210679609037000 | **215 views** |
| **LinkedIn post** | https://www.linkedin.com/posts/rakhangezaid_guys-we-are-at-monad-blitz-v4-cooking-with-ugcPost-7506982984323940352-n-J9/ | **611 impressions** |
| **Demo video (30s+, product running)** | https://drive.google.com/file/d/1wVrRuScpC5Cc2nU_aieMjDjpBMNsFqW7/view?usp=drive_link | posted |
| **Creative ad video** | same drive folder as above (pick the ad cut) | posted |

> **If you're judging:** say these four out loud — **public repo, contract address, live URL, deployment**. Everything needed to reproduce the project is in this README, under [Run it yourself](#run-it-yourself-on-monad-testnet).

---

## What makes it special

- **Golden-key judging — zero middlemen.** The contract stores a `keccak256` hash of each frame's correct answer. Workers submit a hash; the contract verifies **and pays in the same transaction**. No oracle, no review queue, no dispute. A correct answer pays out in **~1.2 s** using Monad's finality.
- **Creators control accuracy.** Every quest deploys with a built-in answer key — machine-checkable, so even "speech quality" or "is this intersection safe?" tasks become auto-verifiable ground truth.
- **It's a game, not a gig board.** +100 XP per correct answer, win streaks, daily streaks, 5 ranked titles, 8 badge types, and a live leaderboard — designed so doing micro-work builds reputation, not just balance.
- **Four task classes ship today:** multi-choice labelling, yes/no verification, 1–5 rating, and free-text.
- **Live payout feed.** Every accepted/rejected answer streams to the screen in real time — the "hundreds of payouts landing" moment.

**Why Monad:** instant-finality payouts, high TPS headroom to stream hundreds of concurrent workers, and the 1:1 EVM compatibility that let us ship Solidity+Foundry+wagmi untouched.

---

## Feature checklist — every announced function is working

| Feature | Where | Status |
|---|---|---|
| Deploy a quest (escrow MON, set reward + golden keys) | `components/CreateTask.tsx` | Live |
| Four task classes (choice / yes-no / rating / text) | `MicroTask.sol` + `components/DoTask.tsx` | Live |
| Solve a task — instant verdict + payout on-chain | `contracts/src/MicroTask.sol` | Live |
| Automatic on-chain grading (golden-key `bytes32` hash) | `submitAnswer(...)` | Live |
| +100 XP, win streak, daily streak recorded on-chain | `XpEarned` event + contract state | Live |
| Rank titles (Rookie→Grandmaster) + badges | `lib/constants.ts` (`levelForXp`, `badgesFor`) | Live |
| Live on-chain leaderboard | `components/Leaderboard.tsx` | Live |
| Live payout feed (event watcher) | `components/PayoutTicker.tsx` | Live |
| Player HQ panel (your XP, streaks, earnings) | `components/PlayerHQ.tsx` | Live |
| Search + category + class filters | `components/TaskList.tsx` | Live |
| MetaMask connect (injected, no 3rd-party wallet SDK) | `components/Header.tsx` | Live |
| Game-feel audio + micro-interactions | `lib/sounds.ts`, `app/globals.css` | Live |
| Foundry test suite (12 tests passing) | `contracts/test/MicroTask.t.sol` | Passing |

---

## How it works

```
     CREATOR                                   CONTRACT (MicroTask.sol)                WORKERS
┌──────────────────┐   createTask(...)   ┌───────────────────────────────┐   submit(hash)  ┌──────────┐
│ title, category, │ ──────────────────▶ │  escrow = reward × frameCount │ ◀────────────── │  wallet  │
│ kind, options,   │   payable escrow    │  goldenAnswers[i] = keccak256 │     answer_hash │          │
│ reward, frames   │                     └───────────────────────────────┘──────────────── │          │
└──────────────────┘                               │    │                │               └──────────┘
                                                    ▼    ▼                ▼
                                     correct → send reward + 100 XP      wrong → rejected, streak resets
                                     (~1.2 s, same tx)                   (fee 2% stays, rest is refundable)
```

- **Creators** deposit the whole bounty up front (escrow) and earn a **2% protocol fee** on every payout via `withdrawFees()`.
- **Workers** browse quests, answer frames one at a time, and get paid instantly on each correct answer.
- **Everything is verifiable**: task, answers, streaks, and leaderboard are all public on-chain state.

---

## Tech stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 |
| Web3 | wagmi v2 · viem v2 (injected MetaMask only) |
| Motion/ui | framer-motion · @tabler/icons-react · @tanstack/react-query |
| Contracts | Solidity `^0.8.24` · Foundry (forge) |
| Tooling | Node scripts (`scripts/`) for deploy, seed, demo, ABI gen |
| Hosting | Ubuntu VPS · PM2 · Caddy (auto-Let's Encrypt) · custom domain |

> **Developers:** this repo pins **Next.js 16.3**, which has breaking changes vs. older versions. Read `AGENTS.md` at the repo root before editing (it points at the bundled docs in `node_modules/next/dist/docs/`).

---

## Repository layout

```
microworks/
├── app/                     # Next.js app (/, /app, providers, globals.css)
├── components/              # UI: Header, TaskList/Card, CreateTask, DoTask,
│                            #      Leaderboard, PayoutTicker, PlayerHQ
├── lib/                     # monad.ts (chains), constants.ts (task/XP/badges),
│                            # abi.ts (generated), answers.ts (answer hashing)
├── public/frames/           # demo SVG frames (empty / person / vehicle)
├── contracts/
│   ├── src/MicroTask.sol    # the protocol (single file, no imports)
│   ├── test/MicroTask.t.sol # 12 passing Foundry tests
│   └── .env.example         # copy to .env, fill PRIVATE_KEY + address
└── scripts/                 # deploy-live, seed-demo/extras, demo, leaderboard,
                             # gen-abi, list-tasks, check-balance, generate_demo_video
```

---

## The smart contract

**`contracts/src/MicroTask.sol`** — deployed at `0x26e67271c65ac40d419dffe8d6ad7ffcb2755237`.

### Task kinds
| value | name | worker input | options field |
|---|---|---|---|
| 0 | Multi-choice label | pick one option | `["Pedestrian","Vehicle","Empty"]`, … |
| 1 | Verify yes/no | Yes → `0`, No → `1` | yes/no |
| 2 | Rate 1–5 | one of 5 ratings | `["1",…,"5"]` |
| 3 | Free text | any string (hashed) | — |

### `Task` struct
```solidity
struct Task {
  uint256 id; string title; string description; string category;
  uint8 kind; uint8 optionCount; string[] options;
  uint256 reward; uint256 bounty; uint256 completed; uint256 rejected;
  uint256 frameCount; bool active;
}
```

### Functions
- View: `taskCount()`, `getTask(id)`, `getLeaderboard(limit) → (address[] addrs, uint256[] pts, uint32[] wins, uint32[] streakDays)`, `points(w)`, `winStreak(w)`, `dayStreak(w)`, `protocolFee`.
- Write: `createTask(title, description, category, kind, optionCount, options, rewardPerFrame, frameCount, goldenAnswers[])` (payable escrow), `submitAnswer(taskId, frameId, bytes32 answerHash)`, `closeTask(taskId)`, `withdrawFees()`.
- Events: `TaskCreated`, `AnswerAccepted(taskId, frameId, worker, amount)`, `AnswerRejected(taskId, frameId, worker, option)`, `XpEarned(worker, points, winStreak, dayStreak)`, `TaskClosed`.

### Gamification constants (on-chain)
- `XP_PER_CORRECT = 100`, protocol fee `FEE_BPS = 200` (2%), escrow = `reward × frameCount`.
- Win streak: +1 per consecutive correct, resets on a wrong answer.
- Daily streak: day = `block.timestamp / 86400`; +1 for first correct answer on a new consecutive day, resets to 1 after a skipped day.

### Tracking note
The Solidity **public mapping getter** `tasks(uint256)` is generated by the compiler and silently **drops the dynamic `options` field** (returns 13 values). Always prefer the full-struct view `getTask(uint256)` — the app uses `taskObjectToMicroTask` in `lib/constants.ts`.

---

## Run it yourself on Monad Testnet

> **Goal:** anyone with a browser + MetaMask can try the live product in ~3 minutes, and any dev can build/run the whole stack in ~10. No help needed.

### Prerequisites
- **Node.js 20+** (we build with 22+)
- **MetaMask** browser wallet
- (devs only) **Foundry** — `curl -L https://foundry.paradigm.xyz | bash && foundryup`

### 0. Try the live product (users & judges, no install)
1. Open **https://microworks.impiclabs.com**.
2. Click **Connect MetaMask**; MetaMask will prompt to add **Monad Testnet** (chain id `10143`) automatically.
3. Add testnet MON from the **Monad faucet** → https://faucet.monad.xyz (paste any address).
4. Go to the **/app** dashboard, pick a quest, click **Do a micro-task**, and answer. Correct answers pay **+0.01 MON and +100 XP instantly**, right in the demo feed.
5. Connect with a fresh wallet, enjoy the onboarding boost, leaderboard, and payout stream.

> If automatic chain switching doesn't prompt, add the network manually in MetaMask:

| Setting | Value |
|---|---|
| Network name | Monad Testnet |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| Currency symbol | `MON` |
| Explorer | `https://testnet.monadexplorer.com` |

### 1. Run the app locally
```bash
git clone https://github.com/icancodefyi/microworks.git
cd microworks
npm ci                 # reproducible install (lockfile committed + in sync)
npm run dev            # → http://localhost:3000  (the /app page is the dashboard)
```
Connected wallet, faucet MON, searchable quests, live feed, and leaderboard all work against the **already-deployed live contract** — no local chain, no env vars needed.

### 2. Win a frame (for the demo: this is your "live transaction on chain")
The demo frames cycle three images — **empty, person, vehicle** — by `frameId % 3`. Pre-seeded quests keyed to those images:

| Task | Answer when image is… |
|---|---|
| **#5** "Detect pedestrians" (choice: Pedestrian/Vehicle/Empty) | Pedestrian / Vehicle / Empty |
| **#6** "Audit sensor footage" (Human/Motor/None) | Human / Motor / None |
| **#7** "Label 60 dashcam frames" (Person/Vehicle/Empty) | Person / Vehicle / Empty |
| **#8** "Hazard check" (Yes/No) | **Yes** for vehicle, **No** otherwise |
| **#9** "Visibility score" (1–5) | `(frameId % 5) + 1` |
| **#10** "Describe the frame" (text) | type the word: `empty` / `person` / `vehicle` |

A correct answer instantly emits `AnswerAccepted` + `XpEarned` — watch your balance roll up in the ticker. A wrong answer shows the rejected state.

### 3. Run the contract tests (devs)
```bash
cd contracts
cp .env.example .env        # optional for tests
forge test -vvv             # 12 tests, all green
```

### 4. Deploy your own instance (devs)
```bash
cd contracts
cp .env.example .env        # fill PRIVATE_KEY (testnet wallet funded with MON)
forge build
node ../scripts/deploy-live.mjs    # deploys + writes CONTRACT_ADDRESS to .env + prints explorer link
node ../scripts/gen-abi.mjs        # regenerates lib/abi.ts from the forge artifact
```

### 5. Seed demo quests & generate activity (devs)
```bash
node scripts/seed-demo.mjs     # 4 quests: label / yes-no / rating / text
node scripts/seed-extras.mjs   # 6 more playable quests (incl. a 60-frame batch)
node scripts/demo.mjs          # spins a bot worker that answers frames → live payouts
node scripts/list-tasks.mjs    # audit every task's live/complete/reject counts
node scripts/check-balance.mjs # wallet balances
node scripts/generate_demo_video.py  # renders the product walkthrough video
```

### Dotenv contract variables (`contracts/.env`)
| Var | Meaning |
|---|---|
| `PRIVATE_KEY` | deployer / fee-recipient testnet wallet key (hex, no `0x`) |
| `CONTRACT_ADDRESS` | filled automatically by `deploy-live.mjs` |

---

## Production deployment (what's live)

- **Domain:** `microworks.impiclabs.com` — custom domain, **Let's Encrypt TLS via Caddy** (auto-renew).
- **App:** `next build` output hosted on an Ubuntu VPS behind **PM2** (`microworks`, port `3020`), reverse-proxied by Caddy.
- **Persistence:** PM2 saved + `pm2-root` boot service → survives reboots.

**Redeploy after a change:**
```bash
rsync -az --delete --exclude 'node_modules' --exclude '.next' --exclude 'contracts' \
  --exclude '.env*' -e ssh ./ root@72.60.99.68:/var/www/microworks.impiclabs.com/
ssh root@72.60.99.68 'cd /var/www/microworks.impiclabs.com && \
  npm ci && npm run build && pm2 restart microworks'
```
(swap in the host/key you use — these are the exact steps performed for this deployment.)

---

## Contract verification on the explorer

**Status:** the source is single-file (no imports) and compiler-ready — open your explorer "Verify" page and:

1. **Contract:** `0x26e67271c65ac40d419dffe8d6ad7ffcb2755237`.
2. **Details:** Solidity `^0.8.24`, compile with `solc 0.8.24+`, MIT license, **no constructor arguments**.
3. **Source:** upload `contracts/src/MicroTask.sol` verbatim and submit.

Verified contract = permanent "Source published" badge on MonadVision (rubric: **25 pts**).

---

## Judging checklist (how the project scores)

### Basic (100)
- [x] **Public GitHub repo** (`icancodefyi/microworks`) — 25
- [x] **README with live page + contract address** (this file) — 25
- [x] **Contracts deployed on Monad Testnet** — `0x26e6…7` — 25
- [x] **Publicly hosted** — `microworks.impiclabs.com` (+ custom domain bonus) — 25

### Advance — project working (100)
- [x] **All announced functions working** — feature checklist above, all live — 25
- [x] **Live transaction during the demo** — answer a seeded frame (cheat sheet above) and watch it payout — 25
- [ ] **Contract verified on explorer** (source published) — 3-step, see above — 25
- [x] **Someone else can run it from the README** — "Run it yourself" section is written for zero-handholding — 25

### Advance — build in public (100, off-repo)
- [x] **Posted on X** tagging `@monad` `@monad_dev` `@geeky_kartikey` — https://x.com/icancodefyi/status/2101210679609037000 — 215 views — 25
- [x] **Posted on LinkedIn** — https://www.linkedin.com/posts/rakhangezaid_guys-we-are-at-monad-blitz-v4-cooking-with-ugcPost-7506982984323940352-n-J9/ — 611 impressions — 25
- [x] **Demo video (30s+, product running)** — https://drive.google.com/file/d/1wVrRuScpC5Cc2nU_aieMjDjpBMNsFqW7/view?usp=drive_link — 25
- [x] **Creative ad video** — same drive folder (ad cut) — 25
- [~] **5K+ collective views** — currently **826 / 5,000** (X 215 + LinkedIn 611); keep posting until close of submission — 25

### Bonus (100)
- [x] **Custom domain** — `microworks.impiclabs.com` (Caddy + Let's Encrypt) — 15
- [ ] **Mainnet deployment** (organizer-verified) — planned, one-command after testnet EOL — 25
- **Pre-market fit** — see [Problem & market fit](#problem--market-fit)
- **Revenue potential** — see [Business model & revenue](#business-model--revenue)
- **Innovation & originality** — see [Why it's innovative](#why-its-innovative)

---

## Problem & market fit

Annotators, QA squads, and moderation teams lose hours to delayed, disputed, or manual payouts. Whoever holds the "key" controls who gets paid. MicroWorks flips that: **the answer key is committed on-chain**, so a worker who is right is paid in the same transaction as their answer — no HR ticket, no review board, no payroll run.

Who this serves (and can demo live **today**):
- **ML/dashcam/robotics** labelling squads (our seeding story)
- **Agent verification** — a second model or a human verifying agent output frame-by-frame
- **UGC moderation** / safety checks at scale
- **Transcript/OCR QA**, audits, and any "tiny, checkable, repeatable" work

---

## Business model & revenue

- **2% protocol fee** on every frame reward (protocol-level, withdrawable by the deployer via `withdrawFees()`). This is live on-chain.
- **Escrow take-rate**: creators pre-fund bounties; the protocol only earns when value is actually settled.
- **Near-term levers**: sponsored/deprioritized quest slotting, leaderboard sponsorships, verification-as-a-service for data marketplaces, and a paid "launchpad" for teams pushing high-volume labelling batches.
- **Loyalty moat**: XP/streaks/ranks make switching costly — retention growth, not just transactions.

---

## Why it's innovative

1. **Fully autonomous payment rails** — grading and payout are a single atomic transaction keyed to a hash. No oracle, no escrow service, no arbiter.
2. **Turns contention into consensus** — instead of majority-vote ("3 judges agree"), creators express ground truth once; every worker is graded against it deterministically.
3. **Earn-to-level as protocol UX** — gamification state lives on-chain, so reputation is portable, auditable, and composable with anything else on Monad.

---

## Roadmap

- Verify the contract on MonadVision (this weekend, before submission lock)
- **Mainnet deployment** (Monad mainnet, chain id `143`) — same bytecode path currently configured
- More task kinds (image selection, N-ary, sliding-scale annotations)
- Delegated/sponsored quests and a fee-treasury dashboard
- LP/worker reputation oracle across tasks (reuse `getLeaderboard`)

---

## License

MIT — see [LICENSE](LICENSE).