import type {
  ChecklistGroup,
  ContinuousTrack,
  InterviewType,
  RoleSpecialization,
} from './types'

// ─── Overview ────────────────────────────────────────────────────────────────

export const roadmapTitle = 'The Engineer’s Roadmap'
export const roadmapSubtitle =
  'SWE/SDE · Backend & Full-stack · Forward Deployed Engineer · AI Engineer — free resources only.'

export const principles: { title: string; body: string }[] = [
  {
    title: 'Build from week one',
    body: 'Every phase ends in something you built. Watching tutorials without building is how people lose a year. Roughly 40% learning, 40% building and practising, 20% explaining out loud.',
  },
  {
    title: 'Deep core, light periphery',
    body: 'Master the fundamentals that every tool is built on — networking, databases, concurrency, design — then learn individual tools quickly as jobs ask for them. Mastery labels on every topic tell you how deep to go.',
  },
  {
    title: 'AI multiplies what you understand',
    body: 'AI makes a strong engineer faster and a weak one confidently wrong. Each phase says how to use AI there, and when not to.',
  },
  {
    title: 'Interview prep is continuous',
    body: 'DSA starts in week 3, behavioural stories in week 12, mocks in week 16 and system design in week 22. Nothing is crammed at the end.',
  },
  {
    title: 'Skip what you already know',
    body: 'Each phase’s "ready when" list is a placement test. If you can honestly tick it, do that phase’s project and move on.',
  },
  {
    title: 'Projects over certificates',
    body: 'One deployed project you can defend beats many certificates. Free certificates are noted where they exist; paid exams are labelled as paid and are optional.',
  },
]

export const primaryStack: { layer: string; choice: string; why: string; later: string }[] = [
  {
    layer: 'Languages',
    choice: 'Python + TypeScript',
    why: 'Python covers backend, scripting, data and nearly all AI work. TypeScript covers the frontend. Two languages, deeply, beat four shallowly.',
    later: 'Go for infrastructure-heavy backends; Java or C++ if your target companies ask for them.',
  },
  {
    layer: 'Frontend',
    choice: 'React + TypeScript + Vite, with TanStack Query',
    why: 'The most-hired frontend stack, and fast to build AI and internal-tool UIs with.',
    later: 'Next.js for server rendering when a role needs it.',
  },
  {
    layer: 'Backend',
    choice: 'FastAPI (Python)',
    why: 'Modern, async, typed, and the same language as your AI work — one mental model across both.',
    later: 'Node/Express for all-TypeScript teams.',
  },
  {
    layer: 'Data',
    choice: 'PostgreSQL (with pgvector) + Redis',
    why: 'Postgres handles relational data, JSON and vectors in one database. Redis handles caching, rate limiting and simple queues.',
    later: 'DynamoDB or MongoDB when access patterns call for them.',
  },
  {
    layer: 'Messaging',
    choice: 'RabbitMQ first, then Kafka concepts',
    why: 'RabbitMQ teaches queue patterns clearly. Kafka’s log model is what you need to explain in design interviews.',
    later: 'SQS and other managed queues in the cloud.',
  },
  {
    layer: 'Infrastructure',
    choice: 'Docker + Compose, GitHub Actions, Terraform, AWS',
    why: 'Compose runs everything locally for free. AWS is the most-requested cloud. Terraform keeps it reproducible and easy to tear down.',
    later: 'Kubernetes in depth, GCP or Azure.',
  },
  {
    layer: 'Observability',
    choice: 'OpenTelemetry + Prometheus + Grafana, run locally',
    why: 'Vendor-neutral, free, and the same concepts as any paid tool.',
    later: 'Hosted observability platforms.',
  },
  {
    layer: 'AI',
    choice: 'Raw model SDK calls, Ollama for free local models, pgvector',
    why: 'Learn what frameworks hide before using them. Ollama means building costs nothing.',
    later: 'LangGraph or LlamaIndex, vLLM, fine-tuning.',
  },
  {
    layer: 'Testing',
    choice: 'pytest, Playwright, k6',
    why: 'Unit and integration, end-to-end, and load — one good tool for each.',
    later: 'Contract testing and property-based testing.',
  },
]

export const schedules: { pace: string; hours: string; fullPath: string; sweReady: string; note: string }[] = [
  {
    pace: 'Alongside a full-time job',
    hours: '10 h/week',
    fullPath: '~20 months',
    sweReady: '~13 months',
    note: 'Keep the DSA track and the projects; read the deeper books selectively.',
  },
  {
    pace: 'Default',
    hours: '20 h/week',
    fullPath: '~11 months (46 weeks)',
    sweReady: '~7 months',
    note: 'The week numbers on this page assume this pace.',
  },
  {
    pace: 'Full-time study',
    hours: '35 h/week',
    fullPath: '~6½ months',
    sweReady: '~4 months',
    note: 'Above about 35 hours, retention drops. Keep one day a week fully off.',
  },
]

export const weeklyShape: { block: string; hours: string; what: string }[] = [
  { block: 'Current phase — learn', hours: '6 h', what: 'Courses, docs and books for this phase’s topics' },
  { block: 'Current phase — build', hours: '6 h', what: 'The phase project and mini-exercises' },
  { block: 'DSA track', hours: '5 h', what: 'Pattern practice with spaced re-solves' },
  { block: 'Interview practice', hours: '2 h', what: 'Behavioural stories, design practice or a mock, depending on the week' },
  { block: 'Revision', hours: '1 h + 15 min/day', what: 'Weekly review, plus daily Anki' },
]

export const fastLane =
  'If you have a CS degree (or an MS in a related field), you can probably compress Phases 1 and 2 into two or three weeks. Take each phase’s "ready when" list as a test — anything you can’t honestly tick is where to spend time.'

// ─── Using AI without depending on it ────────────────────────────────────────

export const aiModes: { mode: string; when: string; rule: string }[] = [
  {
    mode: 'Learn mode',
    when: 'Exercises, DSA practice, and the first time you meet any concept',
    rule: 'AI as tutor only: it explains, quizzes and reviews — it never writes the solution. You attempt first, for 20–30 minutes.',
  },
  {
    mode: 'Build mode',
    when: 'Project work once you understand the concept',
    rule: 'AI may draft code. You read every line, you can explain every line, and tests prove it works.',
  },
  {
    mode: 'Ship mode',
    when: 'Polishing, reviewing and documenting',
    rule: 'AI widens your coverage: edge-case tests, threat models, reviews, docs. You own every decision.',
  },
]

export const aiRules: string[] = [
  'Your first attempt is always yours. Twenty to thirty minutes before you ask.',
  'Never commit code you can’t explain line by line.',
  'Read AI-written tests carefully — they often assert the bug instead of the behaviour.',
  'Check facts — API names, configuration flags, versions — against the official docs.',
  'Never paste secrets, credentials, customer data or proprietary code into an AI tool.',
  'Do one session a week with AI switched off, to measure what you can do unaided.',
  'Use AI to cover more ground (edge cases, threats, reviews), not to skip understanding.',
]

export const doNotTrustAiFor: string[] = [
  'Authentication, authorisation and cryptography code',
  'Concurrency and locking',
  'Database migrations, especially destructive ones',
  'IAM and other permission policies',
  'Version-specific APIs and configuration',
  'Performance claims it hasn’t measured',
  'Anything it hasn’t run, and you haven’t either',
]

export const reviewingAiCode: string[] = [
  'Does it handle edge cases: empty input, nulls, large input, concurrent calls?',
  'Is error handling real, or are errors swallowed?',
  'Any injection, missing authorisation check, or secret in the code?',
  'Any N+1 queries, unbounded loops, or loading everything into memory?',
  'Does it follow the codebase’s existing conventions and abstractions?',
  'Would the tests fail if the code were wrong?',
  'Is there a simpler version a teammate would understand faster?',
]

// ─── Revision and assessment ─────────────────────────────────────────────────

export const revisionSystem: { cadence: string; what: string[] }[] = [
  {
    cadence: 'Daily — 15 minutes',
    what: [
      'Anki reviews of cards you wrote yourself: complexities, protocol details, isolation levels, latency numbers, patterns.',
    ],
  },
  {
    cadence: 'Weekly — Friday, 60 minutes',
    what: [
      'Re-solve three DSA problems from a week ago, without notes.',
      'Explain one concept out loud as if teaching it (the Feynman technique). Where you stumble is where to review.',
      'Write the week’s entry in your learning log.',
    ],
  },
  {
    cadence: 'Monthly',
    what: [
      'The blank-page test: draw a past project’s architecture from memory, and explain each decision.',
      'One timed mock interview.',
      'Review the checklist in the Progress tab, honestly.',
    ],
  },
]

// ─── Continuous tracks ───────────────────────────────────────────────────────

export const tracks: ContinuousTrack[] = [
  {
    id: 'track-dsa',
    title: 'Data structures, algorithms and coding interviews',
    weekStart: 3,
    weekEnd: 46,
    hours: '5–6 h/week, then 3–4 h/week of maintenance from week 30',
    summary: 'Pattern-based practice with spaced re-solves. The aim is recognising patterns quickly and writing bug-free code while talking — not a problem count. Around 150–200 problems, done properly, is enough.',
    steps: [
      { weeks: 'Weeks 3–8', focus: 'Arrays, hashing, two pointers, sliding window, stacks', milestone: 'Easy problems in under 15 minutes' },
      { weeks: 'Weeks 9–14', focus: 'Binary search (including on the answer), linked lists, trees, tries', milestone: 'Tree recursion feels natural' },
      { weeks: 'Weeks 15–20', focus: 'Heaps and top-k, graphs (BFS, DFS, topological sort), backtracking, intervals', milestone: 'Graph problems recognised as graphs' },
      { weeks: 'Weeks 21–26', focus: 'Dynamic programming (1D, then 2D), greedy, union-find', milestone: 'Medium problems in about 30 minutes' },
      { weeks: 'Weeks 27–46', focus: 'Mixed timed practice, LeetCode Top Interview 150, mocks', milestone: 'Mediums in 30 minutes, talking throughout' },
    ],
    method: [
      'Follow the NeetCode roadmap’s order of patterns, then work through LeetCode Top Interview 150.',
      'Give each problem 25 minutes. Stuck? Take one hint, then try again. Still stuck? Study the solution until you could teach it.',
      'Re-solve it from scratch the next day, and again a week later. That’s where the learning happens.',
      'Write an Anki card for the pattern, not the problem: "when I see X, try Y because Z".',
      'Every few sessions, solve out loud, by hand or in a plain editor, timed.',
    ],
    resourceIds: ['res-neetcode', 'res-neetcode-practice', 'res-leetcode-150', 'res-tech-interview-handbook', 'res-visualgo', 'res-coding-interview-university', 'res-the-algorithms', 'res-anki'],
  },
  {
    id: 'track-interview',
    title: 'Behavioural, mocks and system design practice',
    weekStart: 12,
    weekEnd: 46,
    hours: '1–2 h/week, rising to ~10 h/week in Phase 8',
    summary: 'Small, steady practice so interviewing is a skill you have rather than an event you dread.',
    steps: [
      { weeks: 'From week 12', focus: 'Start the STAR story bank; add a story whenever something real happens', milestone: 'Eight stories by week 30' },
      { weeks: 'From week 16', focus: 'First peer mock interview, then one a month', milestone: 'First mock done' },
      { weeks: 'From week 22', focus: 'One timed system design a week', milestone: 'Five classic designs completed' },
      { weeks: 'From week 28', focus: 'Mocks every two weeks; resume draft one', milestone: 'Resume reviewed by someone else' },
      { weeks: 'From week 38', focus: 'Weekly mocks; two designs a week; role-specific rounds', milestone: 'Job-readiness checklist complete' },
    ],
    method: [
      'After every mock, write down the single change that would most improve the next one.',
      'Record yourself. Listening back is uncomfortable and works.',
    ],
    resourceIds: ['res-tih-behavioral', 'res-tih-behavioral-questions', 'res-pramp', 'res-interviewing-io', 'res-hello-interview-sd', 'res-system-design-primer'],
  },
]

// ─── Role specialisations ────────────────────────────────────────────────────

export const specializations: RoleSpecialization[] = [
  {
    id: 'swe',
    title: 'Software Engineer / SDE',
    oneLiner: 'Strong fundamentals, clean code, and system design at scale.',
    whatsDifferent: 'The most DSA-heavy loop. Deeper CS fundamentals (concurrency, OS) and object-oriented design matter more here than for the other roles. Breadth across the stack matters less than depth and code quality.',
    extraTopics: [
      { name: 'Advanced DSA: DP variants, Dijkstra, union-find, segment trees (recognise only)', mastery: 'must', note: 'Big-tech loops include at least one hard problem.' },
      { name: 'Low-level / object-oriented design (LRU cache, parking lot, elevator)', mastery: 'must', note: 'Amazon and others run a dedicated round for it.' },
      { name: 'Concurrency in depth: thread pools, producer–consumer, read–write locks', mastery: 'must', note: 'A common follow-up question for backend SDE roles.' },
      { name: 'A second compiled language (Java, Go or C++)', mastery: 'optional', note: 'Only if your target companies ask. Python is accepted almost everywhere for coding rounds.' },
      { name: 'Distributed systems theory (Raft, consensus)', mastery: 'optional', note: 'Valuable for infrastructure teams.' },
    ],
    capstone: {
      id: 'cap-swe',
      title: 'Capstone — a replicated key-value store, plus one merged open-source PR',
      level: 'Advanced',
      summary: 'A key-value store with a write-ahead log, crash recovery and leader–follower replication — or the Raft labs from MIT 6.5840 — alongside one merged pull request on an open-source project you use.',
      stack: ['Python or Go', 'TCP sockets', 'pytest'],
      flow: ['Client', 'Leader', 'Write-ahead log (fsync)', 'Apply to in-memory store', 'Replicate to followers', 'Acknowledge'],
      mustDemonstrate: [
        'Crash recovery from the write-ahead log, proved by a test that kills the process',
        'Replication with a stated consistency guarantee',
        'Concurrency handled correctly under a multi-client load test',
        'One merged open-source pull request',
      ],
      talkingPoints: ['Your consistency guarantee and its cost', 'What fsync costs in latency, and why you need it'],
      resourceIds: ['res-mit-6-5840', 'res-kleppmann-distsys', 'res-good-first-issue'],
    },
    interviewLoop: [
      { round: 'Coding (×2–3)', whatTheyTest: 'DSA patterns, clean code, complexity, testing your own solution', howToPrepare: 'DSA track, timed and out loud' },
      { round: 'System design', whatTheyTest: 'Scale, trade-offs, failure modes', howToPrepare: 'Phase 5, plus two timed designs a week' },
      { round: 'Low-level design (at some companies)', whatTheyTest: 'Classes, interfaces, patterns, extensibility', howToPrepare: 'Refactoring.Guru, plus five classic object-oriented design problems' },
      { round: 'Behavioural', whatTheyTest: 'Ownership, conflict, impact', howToPrepare: 'Your story bank, mapped to the company’s stated values' },
    ],
    resourceIds: ['res-leetcode-150', 'res-refactoring-guru', 'res-ostep', 'res-hello-interview-sd'],
  },
  {
    id: 'fullstack',
    title: 'Backend / Full-stack Engineer',
    oneLiner: 'Ship complete products: APIs, data, auth, async work and the UI on top.',
    whatsDifferent: 'More practical rounds — build an endpoint, debug a codebase, extend an app — and fewer puzzle-style problems. API design, data modelling, caching and messaging carry the most weight; full-stack adds UI coding.',
    extraTopics: [
      { name: 'API design depth: versioning, pagination, idempotency, webhooks', mastery: 'must', note: 'Comes up in every backend system design round.' },
      { name: 'Background jobs, queues and the outbox pattern', mastery: 'must', note: 'The everyday reality of production backends.' },
      { name: 'Multi-tenancy and authorisation models', mastery: 'must', note: 'Every B2B SaaS has to get this right.' },
      { name: 'Frontend performance and accessibility', mastery: 'working', note: 'For full-stack roles: Core Web Vitals and keyboard and screen-reader support.' },
      { name: 'Payments and webhooks (in test mode)', mastery: 'optional', note: 'A realistic integration that costs nothing.' },
    ],
    capstone: {
      id: 'cap-fullstack',
      title: 'Capstone — a multi-tenant SaaS application',
      level: 'Production',
      summary: 'Organisations and teams with role-based access, background jobs, payments in Stripe test mode with webhooks and idempotency, emails sent through a queue, an audit log, feature flags, observability and CI/CD.',
      stack: ['React + TypeScript', 'FastAPI', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Stripe test mode', 'GitHub Actions', 'OpenTelemetry'],
      flow: ['React app', 'API + tenant-scoped auth', 'Postgres (row-level tenant isolation)', 'Outbox', 'Queue', 'Workers: email, webhooks', 'Audit log'],
      mustDemonstrate: [
        'Tenant isolation, with tests proving one organisation can’t read another’s data',
        'Webhook handling that is idempotent and verifies signatures',
        'Background jobs with retries and a dead-letter queue',
        'An audit log of who did what',
        'Feature flags used for one real rollout',
      ],
      talkingPoints: ['How tenant isolation is enforced, and where it could leak', 'How you handle a webhook delivered twice'],
      resourceIds: ['res-stripe-testing', 'res-owasp-cheatsheets', 'res-rabbitmq-tutorials', 'res-fastapi-tutorial'],
    },
    interviewLoop: [
      { round: 'Practical coding', whatTheyTest: 'Building or extending an API or feature in a realistic codebase', howToPrepare: 'Rebuild Project 3 features against a timer' },
      { round: 'System design', whatTheyTest: 'APIs, data models, caching, queues', howToPrepare: 'Phases 4 and 5' },
      { round: 'Debugging (at some companies)', whatTheyTest: 'Finding and fixing bugs in unfamiliar code', howToPrepare: 'Read and fix issues in open-source projects' },
      { round: 'Frontend / UI coding (full-stack)', whatTheyTest: 'Building a component, state, accessibility', howToPrepare: 'Front End Interview Handbook' },
      { round: 'SQL (at some companies)', whatTheyTest: 'Joins, aggregates, window functions', howToPrepare: 'LeetCode SQL 50' },
      { round: 'Behavioural', whatTheyTest: 'Product sense, ownership', howToPrepare: 'Your story bank' },
    ],
    resourceIds: ['res-fullstackopen', 'res-google-aip', 'res-frontend-interview-handbook', 'res-leetcode-sql50'],
  },
  {
    id: 'fde',
    title: 'Forward Deployed Engineer (FDE)',
    oneLiner: 'An engineer embedded with customers, turning their messy real problem into deployed software — fast.',
    whatsDifferent: 'Breadth and speed matter more than depth in any one area. You decompose ambiguous problems, integrate with systems you didn’t build (messy data, legacy APIs, strict security), build quickly, and communicate constantly with non-engineers. At AI companies, FDEs deploy LLM solutions inside customer environments.',
    extraTopics: [
      { name: 'Problem decomposition and requirements discovery', mastery: 'must', note: 'The core FDE interview: "a customer has this problem — what do you build?"' },
      { name: 'Data integration: ETL, messy CSV and API data, SQL', mastery: 'must', note: 'Most customer work begins with getting at their data.' },
      { name: 'Rapid prototyping and demos', mastery: 'must', note: 'Working software in days, then iterate based on feedback.' },
      { name: 'Writing: discovery docs, stakeholder updates, runbooks', mastery: 'must', note: 'Written communication is a large part of the job.' },
      { name: 'Enterprise constraints: SSO, data residency, audit, on-premises', mastery: 'working', note: 'Customers’ security teams will ask.' },
      { name: 'LLM integration, RAG, agents and MCP', mastery: 'must', note: 'For FDE roles at AI companies — most new FDE openings.' },
    ],
    capstone: {
      id: 'cap-fde',
      title: 'Capstone — a two-week customer deployment simulation',
      level: 'Production',
      summary: 'Choose a real public dataset and an imagined stakeholder (for example, a city operations team using open service-request data). Write a discovery document, build the data pipeline, an app and an AI assistant in two weeks, then deliver a demo, a runbook and a stakeholder update — as if to a real customer.',
      stack: ['Python', 'SQL', 'FastAPI', 'React', 'pgvector', 'A local or hosted LLM', 'Docker Compose'],
      flow: ['Discovery doc', 'Ingest messy public data', 'Clean + model in Postgres', 'API + simple UI', 'AI assistant over the data (RAG + tools)', 'Demo + runbook + update email'],
      mustDemonstrate: [
        'A one-page discovery document: stakeholders, goals, constraints and success metrics',
        'Messy data cleaned, with the data-quality issues documented',
        'A working app and AI assistant delivered within the two-week box',
        'A five-minute demo video aimed at a non-technical stakeholder',
        'A runbook, and a "what I’d do next" plan with prioritisation',
      ],
      talkingPoints: [
        'How you decided what to build first, and what you cut',
        'A data problem you found, and how you explained it to the stakeholder',
        'How you would deploy this inside a customer’s locked-down environment',
      ],
      resourceIds: ['res-palantir-dev-vs-delta', 'res-yt-av-fde-roadmap', 'res-google-tech-writing', 'res-mcp-docs'],
    },
    interviewLoop: [
      { round: 'Decomposition / case', whatTheyTest: 'Turning an ambiguous customer problem into a scoped technical plan, live', howToPrepare: 'Practise with an AI mock interviewer; clarify, scope, prioritise, then design' },
      { round: 'Practical coding', whatTheyTest: 'Building something working quickly, often with data or APIs', howToPrepare: 'Timed builds of small integrations' },
      { round: 'Debugging / unfamiliar code', whatTheyTest: 'Getting productive in someone else’s system', howToPrepare: 'Open-source contributions' },
      { round: 'SQL / data', whatTheyTest: 'Querying and cleaning real-world data', howToPrepare: 'Phase 4, plus messy public datasets' },
      { round: 'Behavioural', whatTheyTest: 'Customer empathy, ambiguity, pushing back, ownership', howToPrepare: 'Stories about difficult stakeholders and changed requirements' },
    ],
    resourceIds: ['res-palantir-dev-vs-delta', 'res-yt-av-fde-roadmap', 'res-google-tech-writing', 'res-pg-exercises'],
  },
  {
    id: 'ai',
    title: 'AI Engineer',
    oneLiner: 'Build reliable products on top of models: RAG, agents, evals, and the architecture around them.',
    whatsDifferent: 'Software engineering first, applied to LLM systems. Evaluation, cost and latency trade-offs, and failure analysis matter most. You need ML fundamentals at working depth, and the ability to explain model behaviour — not to train frontier models.',
    extraTopics: [
      { name: 'Eval design and failure analysis', mastery: 'must', note: 'The clearest separator in AI engineering interviews.' },
      { name: 'AI system design (support agents, copilots, search)', mastery: 'must', note: 'A standard round at AI-forward companies.' },
      { name: 'Inference cost, latency and model routing', mastery: 'must', note: 'Every production AI feature is a cost conversation.' },
      { name: 'Fine-tuning with LoRA', mastery: 'working', note: 'Know when it beats prompting and RAG — and when it doesn’t.' },
      { name: 'ML fundamentals in depth', mastery: 'working', note: 'More if the role is ML-heavy; less if it’s product-focused.' },
    ],
    capstone: {
      id: 'cap-ai',
      title: 'Capstone — a production AI system, improved by evals',
      level: 'Production',
      summary: 'Extend Project 7 into a domain assistant with routing between a small and a large model, semantic caching, guardrails, full tracing, and one fine-tuning experiment compared honestly against prompting. Publish an eval report.',
      stack: ['Python', 'FastAPI', 'pgvector', 'Ollama / a hosted API', 'Unsloth on Colab', 'MLflow', 'OpenTelemetry'],
      flow: ['Request', 'Guardrails (input)', 'Router: small or large model', 'Retrieve + tools', 'Generate (stream)', 'Guardrails (output)', 'Trace + cost', 'Eval suite in CI'],
      mustDemonstrate: [
        'Routing that cuts cost with a measured quality impact',
        'Semantic caching with hit rate and quality measured',
        'A fine-tuned model compared against prompting on the same evals — and an honest conclusion',
        'Every request traced, with cost and latency dashboards',
        'An eval report showing the iteration history',
      ],
      talkingPoints: ['The cost, latency and quality trade-off you chose', 'Why fine-tuning did or didn’t win'],
      resourceIds: ['res-hamel-evals', 'res-chip-genai-platform', 'res-unsloth-docs', 'res-mlflow-docs', 'res-ml-interviews-book'],
    },
    interviewLoop: [
      { round: 'Coding', whatTheyTest: 'LeetCode-medium or practical Python', howToPrepare: 'DSA track' },
      { round: 'AI system design', whatTheyTest: 'Designing an LLM product: retrieval, evals, guardrails, cost', howToPrepare: 'Phase 7, plus Chip Huyen’s platform article' },
      { round: 'LLM and ML concepts', whatTheyTest: 'Attention, embeddings, fine-tuning trade-offs, metrics', howToPrepare: 'ML Interviews Book; Karpathy’s GPT video' },
      { round: 'Take-home or live build', whatTheyTest: 'Building an LLM feature with evals', howToPrepare: 'Project 7, run against a timer' },
      { round: 'Behavioural', whatTheyTest: 'Judgement under uncertainty, shipping', howToPrepare: 'Stories about evaluation-driven decisions' },
    ],
    resourceIds: ['res-hamel-evals', 'res-chip-genai-platform', 'res-ml-interviews-book', 'res-anthropic-effective-agents'],
  },
]

// ─── Interview types ─────────────────────────────────────────────────────────

export const interviewTypes: InterviewType[] = [
  {
    id: 'int-coding',
    name: 'Coding / DSA',
    roles: ['swe', 'fullstack', 'fde', 'ai'],
    startsWeek: 3,
    whatItTests: 'Recognising patterns, writing correct code, analysing complexity, and communicating while you think.',
    method: [
      'Restate the problem and confirm the inputs and edge cases.',
      'Say the brute-force approach and its complexity, then optimise.',
      'Code it while narrating, then test with your own examples, including edge cases.',
    ],
    sampleQuestions: ['Two Sum, then Three Sum', 'Longest substring without repeating characters', 'Course schedule (topological sort)', 'LRU cache', 'Merge k sorted lists'],
    resourceIds: ['res-neetcode', 'res-leetcode-150', 'res-tech-interview-handbook'],
  },
  {
    id: 'int-system-design',
    name: 'System design',
    roles: ['swe', 'fullstack', 'fde', 'ai'],
    startsWeek: 22,
    whatItTests: 'Turning vague requirements into an architecture, estimating scale, and reasoning about trade-offs and failure.',
    method: [
      'Requirements: functional and non-functional. Then estimates.',
      'Core entities, the API, the data model.',
      'High-level design, then deep dives into the hardest one or two parts.',
      'Name trade-offs and failure modes before you’re asked.',
    ],
    sampleQuestions: ['URL shortener', 'Rate limiter', 'Chat application', 'News feed', 'Notification system', 'Ride-hailing'],
    resourceIds: ['res-hello-interview-sd', 'res-system-design-primer', 'res-bytebytego-101'],
  },
  {
    id: 'int-lld',
    name: 'Low-level / object-oriented design',
    roles: ['swe'],
    startsWeek: 14,
    whatItTests: 'Class design, interfaces, patterns and extensibility.',
    method: ['Clarify the use cases.', 'Identify the core objects and their responsibilities.', 'Define interfaces, then implement the core path.', 'Show how a new requirement fits in without rewriting everything.'],
    sampleQuestions: ['Parking lot', 'LRU cache with TTL', 'Elevator system', 'Rate-limiter class', 'In-memory file system'],
    resourceIds: ['res-refactoring-guru'],
  },
  {
    id: 'int-debugging',
    name: 'Debugging / unfamiliar codebase',
    roles: ['swe', 'fullstack', 'fde'],
    startsWeek: 16,
    whatItTests: 'Reading code you didn’t write, forming hypotheses, and fixing the bug without breaking anything else.',
    method: ['Reproduce the bug first.', 'Read the failing test or the stack trace.', 'Narrow it down — bisect, add logging, use a debugger.', 'Fix it, then add a test that would have caught it.'],
    sampleQuestions: ['A failing test in an unfamiliar repository', 'An intermittent failure under concurrency', 'An endpoint that is slow for some users only'],
    resourceIds: ['res-vscode-debugging', 'res-good-first-issue'],
  },
  {
    id: 'int-sql',
    name: 'SQL',
    roles: ['fullstack', 'fde', 'ai'],
    startsWeek: 17,
    whatItTests: 'Joins, aggregates, window functions, and reasoning about the data.',
    method: ['Clarify the schema and the grain of each table.', 'Build the query step by step using CTEs.', 'Check it against nulls, duplicates and ties.'],
    sampleQuestions: ['Each customer’s most recent order', 'Seven-day rolling average', 'Users active on three consecutive days', 'Month-over-month retention'],
    resourceIds: ['res-leetcode-sql50', 'res-pg-exercises', 'res-datalemur'],
  },
  {
    id: 'int-frontend',
    name: 'Frontend',
    roles: ['fullstack'],
    startsWeek: 14,
    whatItTests: 'JavaScript depth, building UI components, accessibility and browser fundamentals.',
    method: ['Build the component with accessible markup first.', 'Manage state deliberately.', 'Discuss performance and edge cases.'],
    sampleQuestions: ['Build an autocomplete', 'Implement debounce and throttle', 'Explain the event loop', 'What happens when you type a URL?'],
    resourceIds: ['res-frontend-interview-handbook', 'res-javascript-info'],
  },
  {
    id: 'int-ai',
    name: 'AI / ML',
    roles: ['ai', 'fde'],
    startsWeek: 34,
    whatItTests: 'How LLMs work, RAG and agent design, evals, and cost and latency trade-offs.',
    method: ['Explain concepts simply, then go one level deeper.', 'For design questions, lead with evals and failure modes.', 'Use numbers from your own projects.'],
    sampleQuestions: ['Design a RAG system for internal docs', 'How would you evaluate a summarisation feature?', 'Fine-tune or use RAG?', 'Defend against prompt injection'],
    resourceIds: ['res-ml-interviews-book', 'res-chip-genai-platform', 'res-hamel-evals'],
  },
  {
    id: 'int-fde',
    name: 'FDE decomposition',
    roles: ['fde'],
    startsWeek: 34,
    whatItTests: 'Taking an ambiguous customer problem to a scoped plan: what to build first, what to ask, what could go wrong.',
    method: ['Ask about users, goals and constraints before solutioning.', 'Define success metrics.', 'Propose the smallest valuable first version, then a roadmap.', 'Name the data, security and adoption risks.'],
    sampleQuestions: ['A hospital wants to reduce no-show appointments', 'A logistics company wants an AI assistant over shipment data', 'A bank’s analysts spend days reconciling reports'],
    resourceIds: ['res-palantir-dev-vs-delta', 'res-yt-av-fde-roadmap'],
  },
  {
    id: 'int-behavioral',
    name: 'Behavioural',
    roles: ['swe', 'fullstack', 'fde', 'ai'],
    startsWeek: 12,
    whatItTests: 'Ownership, collaboration, conflict, learning, and judgement.',
    method: ['Use STAR, and spend most of the time on your actions.', 'End with a measurable result and what you learned.', 'Keep it under two minutes, and let them probe.'],
    sampleQuestions: ['Tell me about a conflict', 'A time you failed', 'A time you dealt with ambiguity', 'Your proudest project', 'Why this company?'],
    resourceIds: ['res-tih-behavioral', 'res-tih-behavioral-questions'],
  },
]

// ─── Job readiness ───────────────────────────────────────────────────────────

/**
 * Persisted as ticks in the Progress tab. Ids are stable: never renumber
 * them, or people lose their ticks.
 */
export const jobReadiness: ChecklistGroup[] = [
  {
    id: 'ready-build',
    title: 'Build',
    hint: 'Shipped, public, and runnable by a stranger from the README.',
    items: [
      { id: 'j-build-fullstack', text: 'A deployed full-stack app with auth, a relational database, tests and CI/CD' },
      { id: 'j-build-async', text: 'An event-driven service with a queue, idempotent workers, retries and a dead-letter queue' },
      { id: 'j-build-ai', text: 'A RAG or agent feature with an eval suite and tracing' },
      { id: 'j-build-capstone', text: 'A capstone for your primary role' },
      { id: 'j-build-demo', text: 'One project you can demo in under five minutes' },
    ],
  },
  {
    id: 'ready-implement',
    title: 'Implement from a blank file, without AI',
    hint: 'Timed, in a plain editor, with tests.',
    items: [
      { id: 'j-impl-lru', text: 'An LRU cache' },
      { id: 'j-impl-rate-limiter', text: 'A token-bucket rate limiter' },
      { id: 'j-impl-graph', text: 'BFS, DFS and topological sort' },
      { id: 'j-impl-binary-search', text: 'Binary search, including search on the answer' },
      { id: 'j-impl-threadsafe', text: 'A thread-safe counter, plus a producer–consumer queue' },
      { id: 'j-impl-crud', text: 'A REST CRUD endpoint with validation and tests' },
      { id: 'j-impl-sql', text: 'Top-N-per-group SQL with a window function' },
      { id: 'j-impl-retry', text: 'Retry with exponential backoff and jitter' },
      { id: 'j-impl-debounce', text: 'Debounce and throttle in TypeScript' },
      { id: 'j-impl-cosine', text: 'Cosine similarity and top-k retrieval' },
    ],
  },
  {
    id: 'ready-explain',
    title: 'Explain, clearly and out loud',
    hint: 'To a technical interviewer, and again to a non-technical person.',
    items: [
      { id: 'j-exp-url', text: 'What happens when you type a URL' },
      { id: 'j-exp-https', text: 'How HTTPS protects data in transit' },
      { id: 'j-exp-concurrency', text: 'Processes versus threads versus async, and when to use each' },
      { id: 'j-exp-db', text: 'How indexes work, and what isolation levels prevent' },
      { id: 'j-exp-cap', text: 'CAP and consistency models, with real examples' },
      { id: 'j-exp-scale', text: 'How each of your projects would scale ten times and a hundred times' },
      { id: 'j-exp-rag', text: 'Your RAG pipeline and its failure modes, with eval numbers' },
      { id: 'j-exp-tradeoffs', text: 'The main trade-off in each project, and why you chose your stack' },
    ],
  },
  {
    id: 'ready-debug',
    title: 'Debug',
    hint: 'Methodically, starting from the evidence.',
    items: [
      { id: 'j-dbg-ci', text: 'A failing CI build, from its logs' },
      { id: 'j-dbg-slow', text: 'A slow endpoint: profile it, run EXPLAIN, fix it, measure again' },
      { id: 'j-dbg-race', text: 'A race condition' },
      { id: 'j-dbg-incident', text: 'A production incident, from logs, metrics and traces' },
      { id: 'j-dbg-ai', text: 'An AI feature that regressed, using your evals' },
    ],
  },
  {
    id: 'ready-career',
    title: 'Career materials and practice',
    hint: 'The things that get you into, and through, the room.',
    items: [
      { id: 'j-car-resume', text: 'A one-page resume with quantified bullets, reviewed by someone else' },
      { id: 'j-car-github', text: 'Three pinned repositories with READMEs, diagrams and a demo' },
      { id: 'j-car-stories', text: 'Eight STAR stories, each under two minutes' },
      { id: 'j-car-mocks', text: 'At least five mock interviews done' },
      { id: 'j-car-dsa', text: 'LeetCode medium problems in about 30 minutes, talking throughout' },
      { id: 'j-car-design', text: 'Five classic system designs done under time pressure' },
      { id: 'j-car-oss', text: 'One merged open-source pull request (stretch)' },
    ],
  },
]
