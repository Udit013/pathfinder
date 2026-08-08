# PathFinder

A calm, local-first companion for working out your next career step.

PathFinder is for someone early in their career who is overwhelmed by the
question "what should I actually do?" — not another job board or productivity
dashboard. It answers one question at a time:

> **What direction should I explore, what should I do next, and how do I make
> progress without burning myself out?**

The guiding idea:

> You don't need to figure out your whole life. You only need to figure out your
> next step.

---

## The problem it solves

Career advice tends to arrive as either endless information (job boards, course
catalogues, roadmaps with 200 nodes) or as pseudoscience (personality quizzes
that tell you what you are). Neither helps someone who is tired and uncertain.

PathFinder takes a different approach:

- **Try before you commit.** Short, hands-on experiments let you feel what a job
  is actually like before you spend six months preparing for it.
- **Evidence, not prediction.** Career Signals are built from what you did and
  how you said it felt — and every signal shows its working.
- **One thing at a time.** The whole product is designed to reduce decision
  fatigue rather than add to it.
- **No pressure.** Nothing is ever framed as being behind, and a low-energy day
  is a valid day.

---

## Features

| Area | What it does |
| --- | --- |
| **Today** | One quest, one exploration, one interview question — sized to the energy you actually have |
| **Explore** | 23 career paths, 10 in-depth write-ups, and a Career Lab of hands-on experiments |
| **Roadmap** | Skill trees for 8 directions, with honest core / useful / optional labels |
| **Build** | 8 real projects with milestones, README checklists, and honest resume guidance |
| **Interview Prep** | 10 topics, 27 questions on a five-rung ladder, plus a cold mock interview |
| **Progress** | XP, milestones, and Career Signals — all traceable to a specific thing you did |
| **AI Companion** | Generates context-rich prompts to paste into ChatGPT or Claude |

### Design decisions worth knowing

- **Energy-adaptive.** A low-energy day hides the rest of the day rather than
  shrinking it. One thing, and permission to stop.
- **No invented data.** Salary and market figures are structured but deliberately
  unsourced — the app shows an honest gap rather than a plausible number.
- **Curated, not catalogued.** The library holds ~150 verified free resources;
  a skill page shows three, with the rest behind "see more".
- **Streaks can't be lost.** Progress only ever counts up.

---

## Tech stack

- **React 19** + **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Vite 8** for build and dev
- **Tailwind CSS v4** (CSS-first `@theme`, no config file)
- **React Router 8** with route-level code splitting
- **Zustand** for state, behind a storage adapter
- **Inter** + **Fraunces** (self-hosted via Fontsource)

No backend. No database. No authentication. No AI API.

---

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | Lint with oxlint |
| `npm run verify:resources` | Re-check every external resource URL |

---

## Deploying to Vercel

PathFinder is a static single-page app. Vercel needs no special setup beyond
the included `vercel.json`.

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Vercel detects Vite automatically. Confirm:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

`vercel.json` provides:

- **SPA rewrites** so `/roadmap`, `/explore/data-analyst` and friends work on
  direct navigation and refresh
- **Immutable caching** for fingerprinted assets
- **Security headers**, including a Content Security Policy with
  `connect-src 'self'` — the browser itself will block any outbound request,
  which enforces the privacy guarantee below rather than merely promising it

Pushes to the production branch redeploy automatically.

---

## Privacy and your data

**Everything stays in your browser.** PathFinder has no server, no account, and
no analytics. Your name, direction, progress, projects, interview practice,
reflections and preferences live in your browser's `localStorage` under a single
key, and are never transmitted anywhere.

This means:

- Two people using the same deployed URL have completely separate data. Nothing
  is shared between browsers, profiles, or devices.
- Clearing your browser data clears PathFinder. Use **Export** first.
- Your data does not follow you to another device unless you export and import
  it yourself.

### The AI Companion

The AI Companion **generates prompts** — it does not talk to any AI service.
There is no API key and no network call. It assembles what PathFinder knows
about where you are into a prompt, shows it to you, lets you edit it, and copies
it to your clipboard. You take it to ChatGPT or Claude yourself.

Prompts deliberately exclude your work-authorisation notes, your location, and
your private reflections. You can add anything you like by editing the prompt
before copying it.

### Export and import

**Settings → Your data** offers:

- **Export** — downloads everything as a JSON file
- **Import** — restores from that file, replacing what's currently there
- **Reset** — deletes everything, behind a typed confirmation

Malformed or unrelated files are rejected with a clear message. If saved data
ever becomes unreadable, PathFinder moves it aside rather than deleting it and
tells you what happened.

---

## Project structure

```
src/
  app/         routing, layout shell, navigation
  features/    one folder per product area
  ui/          design-system primitives (no domain knowledge)
  domain/      pure logic — signals, roadmap state, prompts (no React)
  data/        static content: careers, skills, projects, resources
  lib/         storage adapter, store, utilities
  types/       the whole data model
```

Two rules keep it navigable: `ui/` never imports from `features/`, and
`domain/` never imports React.

---

## A note on the content

Career write-ups, projects, experiments and interview questions were written for
this project. External learning resources are curated links — each verified to
resolve, with its cost and any credential stated honestly. "The course is free"
and "the certificate is free" are tracked as separate facts, because they are
frequently different.

Nothing here is legal, immigration, financial, or mental-health advice.

---

## Licence

Not yet licensed. Add a `LICENSE` file before making the repository public if
you want others to be able to reuse it.
