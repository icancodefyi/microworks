# Microworks — /app Gamified Redesign Brief

> Hand this file to any engineer or AI coding agent **with zero context**. It contains everything they need to redesign the `/app` dashboard into a gamified experience without breaking anything.

---

## 1. What this product is

**Microworks** is a decentralised micro-task marketplace running on the **Monad testnet** (parallel EVM, ~1.2s finality). Think: paid-by-the-task human labelling, judged automatically on-chain.

- A **creator** deploys a "task" (a job with N "frames" = units of work) and escrows MON.
- A **worker** opens a task, answers each frame, and the smart contract grades the answer **instantly against a stored "golden key"** (a hash). Correct = payout lands in ~1.2s. Wrong = rejected, no payout.
- No middlemen, no pending phase, everything is verifiable on the explorer.

The app has two pages:
- `/` — landing/marketing page.
- `/app` — the working dashboard (THIS is what you are redesigning).

The product is being built for a **hackathon** (Monad). The demo story is "put the room to work labelling frames; hundreds of live payouts scroll on screen." A polished, **gamified, arcade-like UI** is the #1 differentiator.

---

## 2. Environment & how to run

- Framework: **Next.js (App Router)**, React 19, TypeScript, **Tailwind CSS**.
- Web3: **wagmi v2 + viem v2**. Wallet connect is a **custom MetaMask button using the injected connector** (NO RainbowKit / NO WalletConnect — do not reintroduce them).
- Icons: `@tabler/icons-react`.
- Chain: **Monad Testnet**, chain id `10143`, RPC `https://testnet-rpc.monad.xyz`, explorer `https://testnet.monadexplorer.com`.
- Live contract: `0x26e67271c65ac40d419dffe8d6ad7ffcb2755237` (ABI is bundled in the repo — do not re-fetch).
- Run the dev server: `npm run dev` → `http://localhost:3000` (the `/app` page is the target).
- Verify your work:
  - `npx tsc --noEmit` (must exit 0)
  - `npm run build` (must succeed)
  - Manual check at `/app`.

**IMPORTANT for AI agents:** `AGENTS.md` in the repo root says this Next.js version has breaking changes vs older versions. **Read `node_modules/next/dist/docs/` before writing Next.js code** and heed deprecation notices.

---

## 3. Project structure — read these files first

```
app/app/page.tsx          → the /app page (composes all UI below) ← REDESIGN THIS COMPOSITION
app/providers.tsx         → wagmi + react-query providers (client config)
app/layout.tsx             → root layout
components/
  Header.tsx               → top bar incl. custom "Connect MetaMask" button (wagmi injected)
  CreateTask.tsx           → modal: creator deploys a task (4 task types supported)
  TaskList.tsx             → task search + category filter + auto-poll (5s)
  TaskCard.tsx             → one task row in the list
  DoTask.tsx               → modal: worker solves frames for a task (all 4 types)
  PayoutTicker.tsx         → LIVE real-time event stream (watches contract events)
  Leaderboard.tsx          → live on-chain LP leaderboard (polls every 4s)
  brand/microworks-logo.tsx → the logo
lib/
  monad.ts                 → chain definitions + wagmi config (injected connector only)
  constants.ts             → CONTRACT_ADDRESS, task kinds, levels/badges helpers, MicroTask type
  abi.ts                   → the contract ABI (GENERATED from the Solidity build — do not hand-edit)
  answers.ts               → answer-hashing helpers (optionAnswerHash, textAnswerHash)
public/frames/             → 3 demo SVG "frame" images (empty/person/vehicle)
```

The contract Solidity lives in `contracts/` (Foundry tests, `MicroTask.sol`). **Only the app UI is in scope; do not modify `contracts/` or `scripts/`.**

---

## 4. The smart contract — all the data your UI reads (read-only)

Current address `0x26e67271c65ac40d419dffe8d6ad7ffcb2755237`.

### Task kinds (`task.kind`, uint8)
| value | name | worker input |
|---|---|---|
| 0 | `KIND_OPTIONS` | pick one of `task.options` |
| 1 | `KIND_YESNO` | Yes / No |
| 2 | `KIND_RATING` | 1–5 |
| 3 | `KIND_TEXT` | free text (hashed) |

### `Task` struct (tuple order is fixed)
`id, creator, title, description, category, kind, optionCount, options (string[]), reward (wei), bounty (wei), completed, rejected, frameCount, active`

### View functions you can call
- `taskCount() → uint256`
- `tasks(uint256) → Task` (full struct getter) — also `getTask(uint256) → Task`
- `getLeaderboard(uint256 limit) → (address[] addrs, uint256[] pts, uint32[] wins, uint32[] streakDays)`
- `points(address) → uint256`
- `winStreak(address) → uint32` (consecutive correct answers)
- `dayStreak(address) → uint32`
- `protocolFee → uint256` (200 = 2%)

### Write functions (already wired in the UI)
- `createTask(title, description, category, kind, optionCount, options[], rewardPerFrame, frameCount, goldenAnswers[])` (payable, escrow = reward × frameCount)
- `submitAnswer(taskId, frameId, bytes32 answerHash)`

### Contract events (already watched by `PayoutTicker`, used by `DoTask` for results)
- `AnswerAccepted(ui taskId, frameId, address worker, uint256 amount)`
- `AnswerRejected(ui taskId, frameId, address worker, uint8 option)`
- `AnswerPending(ui taskId, frameId, address worker, uint8 option)` (legacy, never emitted in v2)
- `TaskCreated(ui id, address creator, string category, uint256 reward)`
- `TaskClosed(ui taskId)`
- `XpEarned(address worker, uint256 points, uint32 winStreak, uint32 dayStreak)`

### Gamification rules (immutable, on-chain)
- **+100 XP per correct answer** (`XP_PER_CORRECT = 100`).
- **Win streak**: increments on consecutive corrects, resets to 0 on a wrong answer.
- **Daily streak**: day index = `block.timestamp / 86400`; +1 when you answer correctly on a new consecutive day, resets to 1 if you skip a day.
- Protocol keeps **2%** of each reward; rest pays the worker instantly.

---

## 5. Current UI inventory (behaviour contracts to keep or upgrade)

- **Header** — brand logo, Landing/Explorer links, network badge, wallet button. Keep the wallet button wiring.
- **Hero terminal chrome** — a fake terminal bar (`microworks://terminal.monad-testnet`) + headline "Micro-tasks. Instant payouts. On-chain." + **Deploy Micro-Task** button + **Contract** explorer link + 4 metric tiles (Finality 1.2s / 10,000 TPS / Fee 2.0% / Verification Golden Key).
- **TaskList** — search box, category pills (All/Labeling/Polls/Verification/Captioning/Transcription/QA), "Open micro-tasks" heading with count, empty state, auto-sync 5s note, then the task cards.
- **TaskCard** — category chip, task ID, Live/Closed badge, title, description clamp, reward `+X MON`, frames `done/total` + progress bar, vault remaining, "Do a micro-task" button. (Has a bug issue: `pending` field was removed from the struct — TaskCard no longer shows pending.)
- **PayoutTicker** (right rail) — live streaming feed of AnswerAccepted/Rejected/TaskCreated events, filters (All / Payouts / Mine), rows fade out after ~60s, footer explorer link. **This is the "hundreds of live payouts on screen" moment** — keep it prominent.
- **Leaderboard** (below task list) — live top-8 by XP, polling every 4s, rank medals (crown/gold/silver/bronze), short address → explorer link, "YOU" chip if it's the connected wallet, `level title · badges`, day-streak 🔥 + win-streak pills, XP column. Footer "settled on-chain every answer".
- **CreateTask modal** — full task-deploy form with the 4-type selector (kind pills), options editor, golden-key auto-generator, escrow estimator.
- **DoTask modal** — per-kind solver: frame image (from `/frames/*.svg` cycled by frameId), frame stepper, kind-specific inputs, and result feedback (green "Correct! +MON · +XP · streak", red "Incorrect — win streak reset").

**Client gamification helpers already exported from `lib/constants.ts`** (use them):
- `levelForXp(xp: number) → "Rookie" | "Helper" | … | "Grandmaster"`
- `badgesFor(winStreak, dayStreak, xp) → string[]` (e.g. "On Fire", "Sharpshooter", "Unstoppable", "Day Streak", "Weekly Warrior", "Rising Star", "Veteran", "Grandmaster")
- `taskTupleToObject(tuple) → MicroTask` (convert the struct getter tuple)
- `KIND_LABELS`, `KIND_OPTIONS/YESNO/RATING/TEXT`, `CONTRACT_ADDRESS`, `EXPLORER`, `CATEGORIES`, `OPTION_LABELS`

---

## 6. Design language (current)

- Palette: **stone neutrals** (stone-50 → stone-950) with a single accent **`#2977ff`** (blue). Success = emerald, danger = rose, warning = amber.
- Rounded corners `rounded-xl / rounded-2xl`, hairline `border-stone-200`, soft shadows.
- Heavy use of **`font-mono` micro-labels** in small caps / uppercase tracking, terminal/"hacker" chrome motifs (`microworks://`, fake window dots, `● LIVE`, `1.2s Finality`).
- Modals reuse a fake **window chrome** header (three dots + `microworks://` path).
- Motion is subtle: `animate-ping` dots, `animate-spin` spinners, `active:scale-95` on buttons.

---

## 7. THE TASK — redesign `/app` into a gamified experience

### Goal
Turn the dashboard from "a plain task feed" into an **arcade / game dashboard** that makes doing micro-tasks feel like playing, while keeping every existing behaviour working (deploying tasks, solving frames, payouts, leaderboard).

### You have freedom to redesign the whole page, but the following MUST survive:
1. **Deploy Micro-Task** entry point (opens `CreateTask`).
2. **Task browsing** (search + category filter + task cards, all four kinds visually distinct).
3. **Start button** on each task → opens `DoTask` (the solver). Do not change its wiring.
4. **Wallet connect** (Header's Connect MetaMask button + balance/address display).
5. **Live activity feed** (PayoutTicker events — the "hundreds of payouts on screen" energy).
6. **On-chain Leaderboard** (XP, win streak, day streak, badges, levels).
7. Read the real contract data — do **not** mock or hardcode fake data.

### Ideas to inspire you (pick/combine — you don't need all)
- **Player HQ panel**: when a wallet connects, show an avatar/rank card — level title, XP, level progress bar, total earnings, win streak 🔥, daily streak, badges earned.
- **Quest board / grind framing**: treat the task list as "quest cards" with difficulty/type icons, XP-per-frame, and progress.
- **Ranks & promotions**: level titles as ranks (Rookie → Grandmaster) with thresholds from `levelForXp`; celebrate level-up with a confetti/modal when `XpEarned` crosses a threshold.
- **Gamified feed**: make the payout ticker feel like arcade points — coin stackups, streak combos, your own payouts highlighted with a bigger burst.
- **Leaderboard as a podium**: top-3 podium layout, live rank shift animations, "live" shimmer.
- **Sound/haptics-lite motion**: punchy micro-interactions, count-up numbers, subtle scanning/glow on polish.
- **Kinds as classes**: Label / Verify / Rate / Text shown as icons + colors so a scannable game-card grid reads instantly.
- **Progress & streaks everywhere**: per-task completion rings, per-task "already done" state so workers don't re-click paid frames.

### Constraints for the agent
- Keep the **same contract address, ABI, hooks, and polling patterns** (react-query `refetchInterval`, `useWatchContractEvent`, wagmi `useReadContract`/`useWriteContract`). Change component *presentation*, not the data calls.
- New components allowed, but keep the existing prop contracts (`TaskList onDoTask`, `CreateTask open/onClose`, `DoTask task/onClose`, etc.) compatible, or update composer `app/app/page.tsx` accordingly that you do.
- **Tailwind only** — no new CSS frameworks. Avoid adding npm packages unless genuinely necessary (justify it).
- Sun: readability/contrast, focus states, disabled states; keep it professional enough for judges while clearly "game-y".
- Do not touch `contracts/`, `scripts/`, `lib/abi.ts` (generated), or the wallet/provider setup.

---

## 8. Non-goals (explicit NO)
- No changes to the smart contract, scripts, or on-chain logic.
- No Reown/WalletConnect/RainbowKit.
- No fabricating fake data for the leaderboard/tasks/feed — show real on-chain state.
- No new "game mechanics" that require contract changes (XP/streaks/badges surface is fixed; invent client-side UI around it).
- No scope creep into the `/` landing page (this brief is `/app` only).

---

## 9. Definition of done
- `/app` is visually a gamified arcade dashboard, original design, cohesive with the existing stone/blue/mono language.
- All 7 MUST features above work end-to-end with a connected wallet on Monad testnet.
- `npx tsc --noEmit` exits 0 and `npm run build` passes.
- The live feed + leaderboard visibly animate with real on-chain events (task #0 has golden frames whose answers match the images shown — you can verify green "Correct!" payouts there).