# The 5-Day Launch Sprint

**What this is:** the first 5 days of the 60-day roadmap, compressed into the highest-leverage actions.
**What this is NOT:** 60 days of prep in 5 days. That is not possible and chasing it is how you lose another month.

## Why launch first, prep second

Applications have **2–4 week latency**. You apply today, you interview in three weeks.
So the correct order is: **get the pipeline running in week 1, be interview-ready by week 4** — not "prep for 8 weeks, then start applying."

Every day the pipeline isn't running is a wasted day of waiting. That's what these 5 days fix.

## What you will actually have on Day 5 night

- [ ] A finished one-page backend resume
- [ ] LinkedIn + Naukri + Instahyre live and recruiter-visible
- [ ] **20 applications submitted**
- [ ] **10 referral messages sent** to real humans
- [ ] 15 LeetCode problems solved
- [ ] 1 LLD system machine-coded and pushed (Parking Lot)
- [ ] A Spring Boot + Postgres + Redis capstone running locally, pushed to GitHub with a README
- [ ] Your "why are you switching" answer rehearsed out loud

That's a real, live job search. In 5 days. From a standing start.

---

## Daily shape (~4–5 hrs around your job)

| Block | Time | What |
|-------|------|------|
| Morning, before work | 45 min | LeetCode: 3 problems |
| Lunch / commute | 20 min | Applications + referral pings (phone is fine) |
| Evening, 2 blocks | 2.5–3 hr | The day's main build task |
| Before bed | 10 min | Log it in PROGRESS.md |

**If a day collapses:** do the 20-minute applications block and 1 LeetCode problem. That's the no-zero-day floor. Never skip the applications block — it's the one with latency.

---

## Day 0 — Tonight (30 minutes)

Don't start tomorrow. Start in the next 30 minutes, because starting is the thing you're stuck on.

1. Open `PROGRESS.md`, fill in the target block: role, salary number, 3 must-haves. **Write an actual number.** (You're at ~16.7 LPA. Check Levels.fyi + Grapevine for your YOE at target companies and set the floor.)
2. Create accounts if missing: LeetCode, Instahyre, Naukri (refresh it if it's stale).
3. Solve **one LeetCode easy**. Two Sum counts. The point is the streak starts tonight, not Monday.
4. Log Day 0.

---

## Day 1 — Resume (the unblocker)

Nothing ships until the resume exists. This is the whole day's main task.

**Morning (45 min):** LC 3 problems — arrays & hashing. (Two Sum, Contains Duplicate, Group Anagrams.)

**Evening (2.5 hr): Write the resume.**
- One page. No photo, no objective statement, no "hardworking team player."
- Format per bullet: **action verb + what you built + technology + measurable result.**
  - Weak: "Worked on backend microservices."
  - Strong: "Built order-processing microservice in Spring Boot handling 50K req/day; cut p99 latency 40% by adding Redis caching layer."
- Order: Name/contact → Skills (Java, Spring Boot, Postgres, Kafka, Redis, SQL, REST, microservices) → Experience (EdgeVerve, most impact-heavy bullets first) → Projects → Education.
- **You need numbers.** Go dig through your last year of work: request volumes, latency, data sizes, team size, cost or time saved. Approximate honestly if you must — "~50K req/day" is fine, inventing "reduced costs 90%" is not.
- Export as PDF named `Abhimanyu_Shekhawat_Backend_SDE.pdf`.

**20 min:** Draft your referral message template (save it in PROGRESS.md):
> Hi [Name] — Abhimanyu here, we worked together on [X] at [Y]. I'm exploring backend SDE roles right now (Java/Spring Boot, ~4 yrs). Saw [Company] has an opening for [Role] — would you be open to referring me? Happy to send my resume. Totally fine if not!

**Log it.**

---

## Day 2 — Profiles live + target list

**Morning (45 min):** LC 3 — two pointers + sliding window.

**Evening (2.5 hr):**
1. **LinkedIn (60 min):** Headline = the role you *want* ("Backend Engineer | Java, Spring Boot, Kafka, Microservices"). About section = 4 lines, first person. Experience bullets = paste from resume. Turn on **Open to Work (recruiters only)**.
2. **Naukri (30 min):** Upload resume, update skills and current CTC/expected CTC. Naukri is where Indian recruiters actually search — a stale profile is invisible. Log in daily during the sprint; recency ranks you.
3. **Instahyre + Cutshort (20 min):** Profile up, preferences set.
4. **Target list (40 min):** 25 companies in `PROGRESS.md`. Mix three tiers so you're not betting on one: **product companies** (Atlassian, Zeta, Razorpay, PhonePe, Groww, Navi, Swiggy, Flipkart, Uber, Salesforce…), **funded startups** (Series B+), **GCCs** (global capability centres — huge Java/Spring hiring in Bangalore/Hyderabad/Pune). For each row: careers link + name of one person you might know there or a 2nd-degree connection.

**Log it.**

---

## Day 3 — Pipeline day (the highest-ROI day of the sprint)

Today you stop preparing and start being in the market.

**Morning (45 min):** LC 3 — binary search + stack.

**Lunch block (30 min): Send 10 referral messages.** LinkedIn DMs, WhatsApp, old work Slack — whatever reaches them. Ex-colleagues, college batchmates, anyone at your 25 companies. Use the template. Send all 10 today; do not agonize over wording. Referrals convert roughly **10x** better than cold applications, and this is the single highest-value hour of the whole sprint.

**Evening (2.5 hr): Submit 10 applications.**
- Tailor only the top 3 resume bullets per application to match the JD's language. Don't rewrite the whole resume — that's the trap that turns 10 applications into 2.
- Log every one in the tracker: company, role, date, referral pinged y/n.
- Target the tier mix from Day 2.

**Log it.**

---

## Day 4 — Proof: LLD + capstone core

Now you build the evidence that carries your interviews.

**Morning (45 min):** LC 3 — linked list + trees intro.

**Evening (3 hr): Two builds.**

1. **Parking Lot LLD (90 min)** — push to `lld/parking-lot/` in this repo. Plain Java, runnable `main`. Classes: `ParkingLot`, `ParkingFloor`, `ParkingSpot` (Small/Medium/Large), `Vehicle` (Car/Bike/Truck), `Ticket`, `PaymentStrategy` interface (hourly/flat). Demonstrate: **Strategy** for pricing, **Factory** for spot allocation, clean interfaces. Interviewers ask this constantly and it's a 90-minute win.

2. **Capstone skeleton (90 min)** — new repo `order-service`:
   - Spring Boot + Spring Web + Spring Data JPA + **Postgres** (Docker Compose it)
   - Entities: `Order`, `OrderItem`, `Customer`. Real schema, real indexes, a transactional order-placement method.
   - REST: `POST /orders`, `GET /orders/{id}`, `GET /orders?customerId=`
   - Commit and push.

**Log it.**

---

## Day 5 — Redis, README, and 10 more applications

**Morning (45 min):** LC 3 — trees + a redo of anything you failed this week.

**Evening (3 hr):**

1. **Capstone: add Redis (60 min).** Cache `GET /orders/{id}` with `@Cacheable`, add TTL, and handle invalidation on update. Be able to explain *why* you cache reads and what your invalidation strategy is — that's the interview question, not the annotation.
2. **Capstone: README (45 min).** Architecture diagram (Mermaid is fine), how to run it, why you chose Postgres/Redis, what's next (Kafka event flow between order-service and inventory-service — coming in the 60-day plan's Phase 2). Push it. Pin the repo on GitHub.
3. **10 more applications (45 min).** Total now 20.
4. **"Why are you switching?" out loud (20 min).** Record yourself on your phone, play it back. Target:
   > "I've spent ~4 years at EdgeVerve building [X] in Java and Spring Boot. I've learned a lot, but the problems I want to work on now are higher-scale product problems — distributed systems, real traffic, ownership of a service end to end. That's why I'm looking at product companies specifically."

   Forward-looking. Zero bitterness. No badmouthing. Notice this answer is also the cure for the regret loop: **the past wasn't wasted, it's the thing that told you what you want.**

**Weekly review + log it.**

---

## Day 6 onward

You're now in the 60-day roadmap at Phase 1, Day 6 — except your pipeline is already live and your first recruiter calls will start landing in week 2–3 while you're still building depth. That's exactly the right shape.

Keep: 3 LeetCode/day, one slot task/day, **5 applications/week minimum**, follow up on anything older than 7 days.

---

## Read this on the day you want to quit (probably Day 3)

Day 3 is when the referral messages go out and nobody replies within the hour, and the loop comes back: *"see, it's too late, I should have done this two years ago."*

Two years ago is not available. **Today is available.** The only question that matters is whether 20 applications are in the market by Friday night. That question is entirely inside your control, and it has nothing to do with anything you did or didn't do before today.

Do the 20-minute block. Log the day. That's the whole job.
