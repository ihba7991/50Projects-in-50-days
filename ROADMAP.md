# 60-Day Backend Job-Switch Roadmap (Java / Spring Boot → Product Company)

Target profile: Backend SDE-2/SDE-3 at a product company. Current base: Java + services experience.
Prep pillars: **180 LeetCode · LLD (Shreyansh Jain playlist) · HLD · Java Concurrency · Spring Boot capstone with Postgres/Redis/Kafka**.

---

## Read This First: Breaking the Regret Cycle

Regret is your brain replaying decisions you can't change. You can't think your way out — only act your way out. This plan gives every day a small, finishable box. Finishing daily boxes is what rewires the loop.

1. **The past is data, not debt.** "I should have switched earlier" → translate to: "I want a product company. That's why I'm doing today's 3 problems." Then do them.
2. **One day = one green square.** Your only job is today's box, not your whole career.
3. **No zero days.** Worst day ever? One LeetCode easy. 15 minutes. The chain survives.
4. **Compare only to yesterday's you.** Not to ex-colleagues who switched earlier. Your tracker is the only scoreboard.
5. **Decide once.** 60 days, this plan. Re-deciding every night IS the regret cycle. Execute.

**When you spiral:** open `PROGRESS.md`, pick today's smallest task, 25-minute timer, start. Motion kills rumination.

---

## The Focus Rule (read before touching Go/Node/React/Python)

You listed Go, Node.js, React, Python, SQL. **In 60 days you cannot interview-prep five stacks — trying to is how people burn 60 days and land nothing.**

- **Primary (interview in this):** Java + Spring Boot. It matches your experience; depth here wins offers.
- **Must-have:** SQL — you'll be asked it everywhere. It's scheduled below.
- **Familiarity only:** Python (fine to use for LeetCode if faster for you), React/Node/Go — *after* you sign the offer, or a weekend skim if a specific target company demands it. Do not spend prep hours here.

---

## The Big Picture

| Phase | Days | DSA | LLD / HLD / Concurrency | Capstone & Job hunt |
|-------|------|-----|--------------------------|---------------------|
| 1. Foundations | 1–14 | 45 problems (arrays → trees) | Java concurrency basics | Resume + LinkedIn/Naukri live |
| 2. Depth | 15–30 | 50 problems (graphs, DP begins) | LLD playlist + 5 machine-coding problems | Capstone started; applications begin |
| 3. Systems | 31–45 | 50 problems (DP, hard patterns) | HLD + mock designs | Capstone done & deployed; 10 apps/week; interviews start |
| 4. Close | 46–60 | 35 problems (revision + company-tagged) | Mock interviews | Heavy interviewing; negotiate; sign |

**Total: 180 problems.** Average 3/day, front-loaded so interview weeks are lighter.

**Daily budget (weekdays ~3.5–4 h around your job, weekends ~6–7 h):**
- 90 min → LeetCode (3 problems; 1 can be a redo of a failed one)
- 60 min → rotating slot: LLD / HLD / concurrency (per phase below)
- 45–60 min → capstone project or job-hunt task
- 10 min → log the day in `PROGRESS.md`

---

## Phase 1 — Foundations (Days 1–14)

**DSA (45 problems):** Arrays & hashing → two pointers → sliding window → binary search → linked list → stacks/queues → binary trees. Use a curated list (NeetCode 150 order works well) — don't random-pick. Rule: 30 min stuck → read solution → re-code from scratch → mark for redo in 3 days.

**Concurrency (60-min slot, alternate days):** threads & lifecycle, `synchronized` vs `Lock`, `volatile`, wait/notify, thread pools & `ExecutorService`, `CompletableFuture`, atomic classes. **Implement from scratch:** producer-consumer, a thread-safe bounded queue, print-odd-even-with-two-threads. These are the actual interview questions.

**SQL (weekend slots):** joins, group by/having, window functions, indexes and why a query is slow. Do 15–20 SQL problems (LeetCode DB / pgexercises).

**Job hunt:**
- Day 1: Write your target in `PROGRESS.md`: role, company tier, salary floor (you're at ~16.7 LPA — a product-company switch at your level should target a meaningful jump; research levels on Levels.fyi/Grapevine and set the number).
- Days 2–5: Rewrite resume — one page, impact bullets (action + tech + measurable result). Spring Boot, microservices, and scale numbers up top.
- Days 6–7: LinkedIn + Naukri + Instahyre profiles live, recruiter-visible.
- Days 8–14: List 30 target companies; note one referral contact per company. Ping 5 former colleagues.

**Exit criteria:** 45 problems, concurrency basics implemented, resume done, profiles live.

---

## Phase 2 — Depth: LLD + Capstone (Days 15–30)

**DSA (50 problems, running total 95):** backtracking → heaps → intervals → greedy → graphs (BFS/DFS, topological sort, union-find) → 1-D DP begins.

**LLD (60-min slot, daily):** Work through the **Shreyansh Jain LLD playlist** — one concept video/day, but the learning is in coding, not watching. Alongside the playlist, **machine-code these 5 classics end-to-end in Java** (clean OOP, SOLID, design patterns where natural):
1. Parking lot
2. Elevator system
3. Splitwise
4. BookMyShow / movie booking
5. LRU + LFU cache (this doubles as a hot interview question)

Push each to this repo under `lld/`. A finished, runnable LLD repo is portfolio material.

**Capstone (45–60 min/day):** Start one Spring Boot system that exercises your key-tech list — e.g. an **order-processing / payments-style microservice**:
- Spring Boot REST APIs + **Postgres** (schema design, transactions, indexes)
- **Redis** for caching + rate limiting
- **Kafka** for async events between two services (order-service → notification/inventory-service)
- Dockerized, README with architecture diagram

One system, done well, beats five toys. Every piece of it becomes an interview story ("why Kafka here", "how you handled idempotency", "cache invalidation strategy").

**Job hunt:** From day 19, **apply to 5 jobs/week**, each with one referral/human ping. Track everything in `PROGRESS.md`.

**Exit criteria:** 95 problems total, 5 LLD systems coded, capstone skeleton running, 10+ applications out.

---

## Phase 3 — Systems: HLD + Interviews Begin (Days 31–45)

**DSA (50 problems, running total 145):** 2-D DP, DP on strings, tries, advanced graphs, a handful of hards in your strong topics. Start timing yourself: 25 min/medium.

**HLD (60-min slot, daily):**
- Week 1 fundamentals: scaling, load balancing, caching layers, DB sharding/replication, CAP, consistency models, message queues, idempotency, rate limiting. (Alex Xu Vol 1 / system design primer.)
- Week 2 mock designs — say them OUT LOUD, whiteboard-style, 45 min each: URL shortener, rate limiter, Instagram feed, WhatsApp, Uber, payment system. Your capstone gives you real talking points for half of these.

**Concurrency refresh (2×/week):** revisit implementations; add one distributed flavor — e.g., distributed lock with Redis in your capstone.

**Capstone:** finish and deploy (any free tier). Pin the repo.

**Job hunt:**
- Raise to **10 applications/week**; follow up on anything older than 7 days.
- Write 6 STAR stories: hard bug, conflict, failure, thing you led, learned fast, why switching. The "why switching" answer must be forward-looking, zero bitterness: *"I've built X at EdgeVerve and I want to work on Y-scale product problems"* — notice this answer is also the antidote to the regret loop.
- First interviews will land here. After each: 3 lines — went well / didn't / one fix.

**Exit criteria:** 145 problems, 6 HLD mocks done aloud, capstone deployed, 30+ total applications, interviews scheduled.

---

## Phase 4 — Close (Days 46–60)

**DSA (35 problems, total 180):** revision mode — redo every problem you failed the first time; company-tagged lists for scheduled interviews; one timed mock contest/week.

**Interviews are now the main job.** Prep slots convert to mock interviews (Pramp/peer/record yourself): 2 DSA mocks, 1 LLD mock, 1 HLD mock per week minimum.

**Job hunt:**
- Keep applying until you **sign** — a verbal yes is not an offer; an offer email is not a signed offer.
- **Negotiate.** Ask for 24–48 h, counter once with a specific number backed by competing processes / Levels.fyi data. In India switching, competing offers are the strongest lever — this is why you keep the pipeline full.
- No offer by day 60? You're not failing — you have 180 problems, an LLD repo, a deployed Kafka/Redis/Postgres system, and interview reps. Days 61+ are just more Phase 4. The system keeps working; keep feeding it.

**Exit criteria:** 180/180. Signed offer, or a late-stage pipeline.

---

## Weekly Review (every Sunday, 20 minutes)

1. Problems solved: __ / 21 · redos cleared: __
2. LLD/HLD/concurrency sessions done: __
3. Capstone progress: one sentence
4. Applications: __ · replies/interviews: __
5. One thing to change next week: __
6. One line of credit to past-you for this week's work. (This is the direct counter-programming to regret.)

---

## Anti-Regret Emergency Card

Spiraling right now? In order:
1. Close the tab where the spiral started.
2. Open `PROGRESS.md`.
3. One LeetCode problem, 25-minute timer.
4. Log it.
5. Look at the streak. The green is proof the loop is lying.

**You don't need to feel ready. You need today's 3 problems.**
