import type { CareerExperiment } from '@/types'

/**
 * Career experiments (§11) — the Career Lab.
 *
 * The premise: nobody can tell from reading a job description whether they'd
 * enjoy the work. So each experiment is a small, real piece of the job, sized to
 * one sitting, ending in a deliverable and an honest question about how it felt.
 *
 * Rules these follow:
 *   - The scenario is a request from a workplace, not a puzzle. Someone wants
 *     something, and they don't care which technique you use.
 *   - Hints are progressive. The first nudges, the last nearly tells you.
 *     Nothing reveals the answer up front.
 *   - `doneWhen` is deliberately achievable. The point is exposure, not mastery,
 *     and an experiment you abandon teaches you nothing about fit.
 *   - No experiment requires an install or a download. Datasets are in-app;
 *     doing the work in a spreadsheet is always a valid route.
 */
export const careerExperiments: CareerExperiment[] = [
  // ── Data Analyst ───────────────────────────────────────────────────────────
  {
    id: 'exp-revenue-drop',
    title: 'Revenue dropped 12% this quarter. Find out why.',
    careerPathIds: ['data-analyst', 'bi-analyst', 'business-analyst'],
    scenario:
      'Your head of sales forwards you a one-line email: "Q3 came in about 12% under Q2. Leadership is asking. Can you look at it today?" There is no more context, and nobody has told you where to look.',
    objective:
      'Find where the drop actually came from — specifically enough that someone could act on it — and say it in a sentence a busy person will read.',
    estimatedMinutes: 45,
    difficulty: 'beginner',
    skillIds: ['sql-basics', 'sql-joins', 'descriptive-stats', 'data-viz', 'business-acumen'],
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-sqlbolt', 'res-mode-sql', 'res-ft-visual-vocabulary'],
    doneWhen:
      'You can name where the drop came from, show one chart or table that makes it obvious, and state what you would do about it.',
    steps: [
      {
        id: 'look',
        title: 'Look at the data before you analyse it',
        detail:
          'Open the orders table. How many rows, what columns, what date range? Confirm the 12% drop is real before you go hunting for a cause — checking the premise is part of the job, and premises are wrong more often than you would like.',
        hints: [
          'Group revenue by quarter first. You need to see the number everyone is talking about with your own eyes.',
          'Q1 is months 1–3, Q2 is 4–6, Q3 is 7–9. Sum the revenue column for each and compare Q3 to Q2.',
          'If your figure does not exactly match the 12% you were quoted, that is normal — executives round, and they often use a slightly different definition. Say so in your answer rather than quietly adopting their number.',
        ],
      },
      {
        id: 'segment',
        title: 'Break the total apart',
        detail:
          'A company-wide total hides everything. Split revenue by each dimension you have — region, category, channel — and compare Q3 against Q2 within each. You are looking for the segment that moved differently from the rest.',
        hints: [
          'An average across four regions can look mildly bad when one region is catastrophic and three are fine. Look at each separately.',
          'Try two dimensions at once. A single dimension may look unremarkable while a specific combination is where everything happened.',
          'Compare region and channel together. One pairing dropped far more than the others.',
        ],
      },
      {
        id: 'mechanism',
        title: 'Work out the mechanism, not just the location',
        detail:
          'You have found where. Now: is it fewer orders, smaller orders, or lower prices? These have completely different causes and completely different fixes, and "revenue is down in the West" is not yet useful to anyone.',
        hints: [
          'Revenue = orders × units × price. Check each factor separately for the segment you found.',
          'Count the orders in that segment for Q2 and Q3, then compare the average unit price. Both moved.',
        ],
      },
      {
        id: 'communicate',
        title: 'Write the answer someone will actually read',
        detail:
          'Three sentences: what happened, what caused it, what you would do next. Then one chart that makes the point without needing the text. This step is the one that separates analysts people trust from analysts people avoid.',
        hints: [
          'Lead with the finding, not your method. Nobody wants "I joined the tables and grouped by region".',
          'Title the chart with the takeaway — "Partner sales in the West halved in Q3" — not with its contents.',
        ],
      },
    ],
  },

  // ── Product Analyst ────────────────────────────────────────────────────────
  {
    id: 'exp-signup-funnel',
    title: 'Users are abandoning the signup process.',
    careerPathIds: ['product-analyst', 'data-analyst', 'product-manager', 'marketing-analyst'],
    scenario:
      'A product manager drops into your channel: "Signups are way below target and we do not know where people are falling out. Can you find the leak, and tell me what to try?"',
    objective:
      'Find the step losing the most people, work out who specifically is being lost there, and propose one experiment worth running.',
    estimatedMinutes: 40,
    difficulty: 'beginner',
    skillIds: ['sql-basics', 'funnel-analysis', 'experimentation', 'product-sense'],
    datasetId: 'ds-signup-funnel',
    resourceIds: ['res-sqlbolt', 'res-kaggle-intro-sql'],
    doneWhen:
      'You can name the leaking step, name who it affects, and describe one experiment with what you would measure.',
    steps: [
      {
        id: 'build-funnel',
        title: 'Build the funnel',
        detail:
          'Count distinct users reaching each step, in order. Then compute the step-to-step conversion rate — not just the count, because a step that loses 60% of a small group is a different problem from one that loses 10% of everybody.',
        hints: [
          'Count distinct user_id per step, then divide each step by the one before it.',
          'The steps in order: landing_view → signup_start → email_verify → profile_setup → first_action.',
        ],
      },
      {
        id: 'find-drop',
        title: 'Find where it leaks',
        detail:
          'Which transition loses the largest share? Note that the biggest absolute loss and the worst conversion rate are often different steps, and it is the rate that tells you something is broken.',
        hints: ['Look at the rate, not the raw count.', 'Check the transition into email_verify.'],
      },
      {
        id: 'segment',
        title: 'Find out who is being lost',
        detail:
          '"The email step is bad" is not actionable. Split that step by device and by source. If one group behaves completely differently from the others, you have a cause rather than a symptom.',
        hints: [
          'Split the failing step by device, then by source. Only one of them explains anything.',
          'Compare mobile against desktop at that step. The gap is large enough that you will not need statistics to see it.',
        ],
      },
      {
        id: 'propose',
        title: 'Propose one experiment',
        detail:
          'Write it as: what you believe is happening, the one change you would make, what you would measure, and what result would change your mind. Resist proposing five things — a PM can act on one.',
        hints: [
          'Think about what physically happens on a phone when someone has to go to their email app and come back.',
          'State a success metric before you would run it. "Conversion from signup_start to email_verify on mobile" is specific enough to be falsifiable.',
        ],
      },
    ],
  },

  // ── Data Engineer ──────────────────────────────────────────────────────────
  {
    id: 'exp-messy-pipeline',
    title: 'Your company receives messy sales files every day.',
    careerPathIds: ['data-engineer', 'analytics-engineer', 'data-analyst'],
    scenario:
      'Every store emails a sales file each night. The formats disagree, some rows are broken, and occasionally a file arrives twice. Right now an analyst fixes it by hand each morning. You have been asked to make that stop.',
    objective:
      'Design the cleaning and loading rules that would let this run unattended — and decide what should happen when a row is unusable.',
    estimatedMinutes: 50,
    difficulty: 'intermediate',
    skillIds: ['python-basics', 'pandas', 'data-modeling', 'etl-pipelines', 'testing-data'],
    datasetId: 'ds-messy-sales',
    resourceIds: ['res-kaggle-pandas', 'res-yt-corey-pandas', 'res-pandas-10min'],
    doneWhen:
      'You have a written list of every problem in the data, a rule for each, and a decision about what happens to rows you cannot fix.',
    steps: [
      {
        id: 'inventory',
        title: 'Inventory everything wrong with it',
        detail:
          'Before writing any code, list the problems. Look at every column and ask what a machine would choke on. Be exhaustive — the ones you miss are the ones that page you at 3am.',
        hints: [
          'Check each column for format consistency, not just for missing values.',
          'There are at least four distinct classes of problem: dates, amounts, text casing, and duplicates.',
        ],
      },
      {
        id: 'rules',
        title: 'Write a rule for each problem',
        detail:
          'For every issue, decide the transformation. Dates to one format. Amounts to a number. Names to one canonical form. Write these as rules in plain language first — this list is the actual design, and code is just its translation.',
        hints: [
          'For text, decide on one canonical form and normalise toward it rather than special-casing each variant.',
          'Duplicate transaction ids: decide whether "keep the first" is safe here, and what would make it unsafe.',
        ],
      },
      {
        id: 'schema',
        title: 'Design the table it lands in',
        detail:
          'What are the columns and their types? What is the primary key? Which columns must never be null? A schema that refuses bad data is the cheapest test you will ever write.',
        hints: [
          'Types matter: a date column that accepts strings will accept "08/03/2026" forever and nobody will notice.',
          'Add a constraint that would have caught the duplicates automatically.',
        ],
      },
      {
        id: 'failure',
        title: 'Decide what happens when a row is unusable',
        detail:
          'Some rows cannot be saved. Do you drop them silently, fail the whole file, or quarantine them and load the rest? There is no universally right answer — but there is a wrong one, and it is deciding by accident.',
        hints: [
          'Consider who finds out, and how, under each option.',
          'Most production pipelines quarantine and alert. Think about why that beats both silent dropping and hard failure.',
        ],
      },
    ],
  },

  // ── Data Scientist ─────────────────────────────────────────────────────────
  {
    id: 'exp-churn-model',
    title: 'Predict which customers are about to leave.',
    careerPathIds: ['data-scientist', 'ml-engineer', 'product-analyst'],
    scenario:
      'Your VP wants to offer a retention discount to customers likely to cancel — but the budget only covers about 15% of the base. "Can you tell us who to target?"',
    objective:
      'Build a baseline model, work out whether it is any good, and be honest about what it cannot tell you.',
    estimatedMinutes: 60,
    difficulty: 'intermediate',
    skillIds: ['python-basics', 'pandas', 'inferential-stats', 'ml-foundations', 'model-evaluation'],
    datasetId: 'ds-churn',
    resourceIds: ['res-kaggle-pandas', 'res-yt-statquest-stats'],
    doneWhen:
      'You have a baseline, one model, an evaluation you can defend, and a clear statement of one thing this model cannot do.',
    steps: [
      {
        id: 'explore',
        title: 'Look at the data and the base rate',
        detail:
          'What fraction of customers churned? This number governs everything that follows. Then look at how each feature differs between churned and retained customers.',
        hints: [
          'Compute the churn rate first. If it is far from 50%, accuracy is about to mislead you.',
          'Compare the mean of each feature for churned vs retained. Two features separate the groups clearly; the rest barely move.',
        ],
      },
      {
        id: 'baseline',
        title: 'Establish a baseline before modelling',
        detail:
          'What score does "predict nobody churns" get? What about a single-rule guess using your best feature? If your model cannot beat these, it is not adding value — and skipping this step is how people ship models that are worse than an if-statement.',
        hints: [
          'With about 20% churn, always predicting "no churn" gets roughly 80% accuracy. Sit with that for a moment.',
          'Try a one-rule baseline: flag everyone with fewer than 5 logins in 30 days.',
        ],
      },
      {
        id: 'model',
        title: 'Train something simple',
        detail:
          'Logistic regression or a small decision tree. Split into train and test before you touch anything. Resist reaching for a complicated model — on 900 rows it will not help, and you will not be able to explain it to your VP.',
        hints: [
          'Split first, then fit. Fitting before splitting leaks the answer and makes your score a lie.',
          'A decision tree with limited depth is worth trying because you can read the rules it learned.',
        ],
      },
      {
        id: 'evaluate',
        title: 'Evaluate it the way the business will use it',
        detail:
          'The budget covers 15% of customers. So the real question is: of the 15% your model ranks riskiest, how many actually churn? Look at precision and recall, not accuracy, and explain the tradeoff in plain words.',
        hints: [
          'A false positive costs one unnecessary discount. A false negative loses a customer. They are not equally expensive.',
          'Rank customers by predicted probability, take the top 15%, and check what share of them actually churned.',
        ],
      },
      {
        id: 'limits',
        title: 'Say what this cannot tell you',
        detail:
          'Write down one thing the model does not know. Correlation is not cause — the model can tell you who is at risk, but not that a discount will change their mind. Being the person who says this out loud is a large part of the job.',
        hints: [
          'The model learned that low engagement precedes churn. Does raising engagement therefore prevent churn?',
          'To answer that you would need an experiment, not a better model.',
        ],
      },
    ],
  },

  // ── Business Analyst ───────────────────────────────────────────────────────
  {
    id: 'exp-slow-process',
    title: 'A business process has become slow and expensive.',
    careerPathIds: ['business-analyst', 'operations-analyst', 'tech-consultant', 'product-ops'],
    scenario:
      'Purchasing used to take a few days and now takes weeks. Everyone blames a different team. Your COO asks you to find out what is actually happening and recommend one change.',
    objective:
      'Locate the bottleneck with evidence, work out what triggers it, and recommend a change with its tradeoff stated.',
    estimatedMinutes: 40,
    difficulty: 'beginner',
    skillIds: ['process-mapping', 'spreadsheets', 'business-acumen', 'stakeholder-comms'],
    datasetId: 'ds-process-cycle-time',
    resourceIds: ['res-excel-learn', 'res-sqlbolt'],
    doneWhen:
      'You can name the bottleneck stage, name the condition that triggers it, and recommend one change while naming what it costs.',
    steps: [
      {
        id: 'map',
        title: 'Work out how long each stage takes',
        detail:
          'The data gives cumulative hours at each stage. Convert that into time spent in each stage, then look at the typical duration per stage. Use the median as well as the mean — one slow outlier can make a healthy stage look broken.',
        hints: [
          'Time in a stage = its cumulative_hours minus the previous stage\'s, per request.',
          'Compare median and mean per stage. Where they diverge sharply, something conditional is going on.',
        ],
      },
      {
        id: 'bottleneck',
        title: 'Find the bottleneck',
        detail:
          'Which stage consumes the most time? Then check whether it is uniformly slow or slow only sometimes — a stage that is fine 70% of the time and terrible 30% of the time has a trigger you can find.',
        hints: [
          'One stage dominates the total. Look at the spread of its durations, not just the average.',
          'The durations in that stage look bimodal — as if two different things are happening.',
        ],
      },
      {
        id: 'root-cause',
        title: 'Find what triggers the slow path',
        detail:
          'What distinguishes the slow requests from the fast ones? You only have one other variable, so test it. Look for a threshold rather than a smooth relationship — policies create cliffs, not gradients.',
        hints: [
          'Plot or bucket the bottleneck duration against amount.',
          'Try splitting at round numbers. Something changes sharply at one of them.',
        ],
      },
      {
        id: 'recommend',
        title: 'Recommend one change, with its cost',
        detail:
          'Write the recommendation, the expected effect, and what you are giving up. A recommendation with no stated downside reads as naive, and the person approving it will find the downside for you.',
        hints: [
          'If the threshold is the cause, the options are moving it, adding reviewers, or parallelising the review.',
          'That threshold exists for a reason. Name what raising it risks — that is the sentence that gets you taken seriously.',
        ],
      },
    ],
  },

  // ── Software Engineer ──────────────────────────────────────────────────────
  {
    id: 'exp-build-small-tool',
    title: 'Build a small tool that solves a real problem you have.',
    careerPathIds: ['software-engineer', 'backend-engineer', 'frontend-engineer'],
    scenario:
      'Not a tutorial. Pick something that genuinely annoys you — renaming files, tracking something in a spreadsheet, a calculation you redo by hand — and make the computer do it.',
    objective:
      'Get from "this annoys me" to something that runs and that you would use again.',
    estimatedMinutes: 60,
    difficulty: 'beginner',
    skillIds: ['programming-fundamentals', 'debugging', 'version-control'],
    resourceIds: ['res-yt-corey-python', 'res-python-docs', 'res-yt-fcc-git'],
    doneWhen: 'It runs, it does the thing, and you have used it once for real.',
    steps: [
      {
        id: 'choose',
        title: 'Pick something genuinely small and genuinely yours',
        detail:
          'Write down the annoyance in one sentence, and what "done" means. If you cannot describe it in a sentence, it is too big for a first pass. Scope is the skill being practised here.',
        hints: [
          'Good candidates are things you already do manually and repeatedly.',
          'If your description contains "and", consider building only the first half.',
        ],
      },
      {
        id: 'smallest',
        title: 'Make the smallest version that works',
        detail:
          'Hard-code things. Skip error handling. No interface — the terminal is fine. The goal is something running end to end that you can then improve, because improving a working thing is far easier than finishing a perfect one.',
        hints: [
          'Get output on screen before you make anything configurable.',
          'Hard-coded values are a legitimate first step, not a failure of craft.',
        ],
      },
      {
        id: 'break',
        title: 'Break it on purpose',
        detail:
          'Feed it something unexpected — a missing file, an empty input, the wrong type. Watch how it fails. Deciding which failures deserve handling is most of what engineering judgement actually is.',
        hints: [
          'Read the error message properly. It usually names the file and line.',
          'You do not have to handle every failure. Decide which ones matter and write that down.',
        ],
      },
      {
        id: 'ship',
        title: 'Use it for real, then commit it',
        detail:
          'Use it once for its actual purpose. Then put it in a repository with a README saying what it does and why you built it. Something small that you genuinely use is worth more in an interview than a large unfinished framework.',
        hints: [
          'The README only needs three lines: what it does, how to run it, why it exists.',
          'A real commit history of small improvements is itself evidence.',
        ],
      },
    ],
  },

  // ── BI Analyst ─────────────────────────────────────────────────────────────
  {
    id: 'exp-dashboard-that-answers',
    title: 'Build a dashboard the sales team would actually open.',
    careerPathIds: ['bi-analyst', 'data-analyst', 'analytics-engineer'],
    scenario:
      'Your sales director says: "I want a dashboard." That is the entire brief. Six months of dashboards nobody opened suggests taking a different approach this time.',
    objective:
      'Decide the questions first, then build the smallest dashboard that answers them at a glance.',
    estimatedMinutes: 45,
    difficulty: 'beginner',
    skillIds: ['sql-basics', 'bi-tools', 'data-viz', 'metric-definition', 'stakeholder-comms'],
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-mslearn-powerbi', 'res-ft-visual-vocabulary'],
    doneWhen:
      'You have three written questions, defined metrics for each, and a layout — built, or sketched with the queries behind it.',
    steps: [
      {
        id: 'questions',
        title: 'Write the three questions it must answer',
        detail:
          'Not "show revenue" — actual decisions someone makes on Monday morning. "Which region is behind target?" is a question. "Revenue trends" is a shrug. Dashboards fail here far more often than they fail technically.',
        hints: [
          'Ask what someone would do differently depending on the answer. If nothing, it is not a question worth a chart.',
          'Three is the limit on purpose. A dashboard answering ten questions answers none.',
        ],
      },
      {
        id: 'define',
        title: 'Define each metric precisely',
        detail:
          'For each question, write the exact definition. Does revenue include discounts? Is a month calendar or fiscal? Every dashboard argument in history has been about a definition nobody wrote down.',
        hints: [
          'Write the definition in words and as SQL side by side. If they disagree, the words are usually the truth.',
          'Decide and record what "current month" means when the month is not over.',
        ],
      },
      {
        id: 'build',
        title: 'Build the smallest version',
        detail:
          'One chart per question. Sort things meaningfully. Label axes. Then remove everything that is not helping — most dashboards are improved by deletion.',
        hints: [
          'Choose the chart from the question, not from what looks impressive.',
          'Put the most important number top-left. People read dashboards like pages.',
        ],
      },
      {
        id: 'test',
        title: 'Test it on a person',
        detail:
          'Show it to someone and ask what they conclude — without explaining it first. If they need your narration, the dashboard has not done its job. This is uncomfortable and it is the most useful five minutes of the whole exercise.',
        hints: [
          'Stay quiet while they look. The silence is the test.',
          'Ask "what would you do based on this?" rather than "does this make sense?"',
        ],
      },
    ],
  },

  // ── Analytics Engineer ────────────────────────────────────────────────────
  {
    id: 'exp-one-source-of-truth',
    title: 'Three teams report three different revenue numbers.',
    careerPathIds: ['analytics-engineer', 'bi-analyst', 'data-engineer'],
    scenario:
      'Finance, sales, and the product team each report revenue, and no two agree. Nobody is wrong, exactly — they are each computing something slightly different. You have been asked to fix it permanently.',
    objective:
      'Define one revenue metric everyone can live with, and design how it stays the only version.',
    estimatedMinutes: 45,
    difficulty: 'intermediate',
    skillIds: ['sql-advanced', 'data-modeling', 'metric-definition', 'testing-data', 'version-control'],
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-mode-sql', 'res-roadmap-sql'],
    doneWhen:
      'You have one written definition, the query that implements it, and two tests that would catch it breaking.',
    steps: [
      {
        id: 'diverge',
        title: 'Work out how three people get three answers',
        detail:
          'Using the same table, produce three defensible but different revenue figures — by changing what counts as revenue, which date is used, or which rows are included. Doing this deliberately is how you learn to spot it accidentally.',
        hints: [
          'Order date versus fulfilment date alone will produce two different monthly numbers.',
          'Decide whether cancelled or discounted orders count. Each choice is arguable.',
        ],
      },
      {
        id: 'define',
        title: 'Write the definition down',
        detail:
          'One paragraph: what counts, which date governs, what is excluded, and at what grain. Include why — the reasoning is what stops the argument restarting in six months.',
        hints: [
          'Name the edge cases explicitly. Undocumented edge cases are where the next disagreement comes from.',
          'Say who owns this definition and who can change it.',
        ],
      },
      {
        id: 'model',
        title: 'Build it once, in one place',
        detail:
          'Write the query as the single model everything else reads from. Nobody should be recomputing revenue in their own dashboard — that is precisely how you got three numbers.',
        hints: [
          'Aim for one clean table others can select from without re-deriving anything.',
          'Name columns so their meaning is unambiguous. `revenue_net_usd` beats `revenue`.',
        ],
      },
      {
        id: 'test',
        title: 'Write tests that catch it breaking',
        detail:
          'Two is enough to start: one that the grain is unique, one that a value stays within a sane range. Data quality is not a code review problem — it is an assertion problem, because the code does not change when the data goes wrong.',
        hints: [
          'A uniqueness test on your primary key catches accidental fan-out from a join.',
          'A "revenue is never negative" test catches upstream sign flips, which happen more than you would think.',
        ],
      },
    ],
  },

  // ── Product Manager ───────────────────────────────────────────────────────
  {
    id: 'exp-pm-prioritise',
    title: 'Five things to build, room for one.',
    careerPathIds: ['product-manager', 'product-ops', 'business-analyst', 'tpm'],
    scenario:
      'You have five requests: a loud customer wants an integration, support wants a bug fixed, sales wants a demo feature, an engineer wants to pay down debt, and the CEO mentioned an idea in passing. You can do one this cycle.',
    objective:
      'Choose one, defensibly — and write the note you would send to the four people you are disappointing.',
    estimatedMinutes: 35,
    difficulty: 'beginner',
    skillIds: ['product-sense', 'prioritization', 'writing-clearly', 'stakeholder-comms'],
    resourceIds: [],
    doneWhen:
      'You have a written decision with your reasoning, and a short note to the people you said no to.',
    steps: [
      {
        id: 'unpack',
        title: 'Find the actual problem behind each request',
        detail:
          'Each request is a proposed solution. Write the underlying problem for each. Sometimes two requests are the same problem, and sometimes the problem does not need the thing being asked for.',
        hints: [
          'Ask "what would be true if this were solved?" for each one.',
          'The CEO\'s passing idea deserves the same treatment as the others — no more, no less.',
        ],
      },
      {
        id: 'criteria',
        title: 'Write your criteria before you look at the options again',
        detail:
          'Decide what you are optimising for — reach, severity, strategic value, effort, risk of doing nothing. Writing criteria after choosing is just rationalising, and everyone can tell.',
        hints: [
          'Three or four criteria is plenty. More becomes theatre.',
          'Include "cost of not doing it" — for bugs and debt it is often the deciding factor.',
        ],
      },
      {
        id: 'decide',
        title: 'Decide, and write down what you traded away',
        detail:
          'Pick one. Then write what you are accepting as a consequence. A decision without a named cost is a decision you have not finished making.',
        hints: [
          'There is no correct answer here. There are only defended and undefended ones.',
          'If you cannot say what you are giving up, look at your criteria again.',
        ],
      },
      {
        id: 'communicate',
        title: 'Write the no',
        detail:
          'Short note to the four you did not pick: what you chose, why, and what would change your mind. Saying no well is most of the job, and doing it badly is how PMs lose the room.',
        hints: [
          'Do not hide behind "we lack capacity". Give the actual reason.',
          '"What would change my mind" turns a rejection into an ongoing conversation.',
        ],
      },
    ],
  },

  // ── Explore beyond tech ───────────────────────────────────────────────────
  {
    id: 'exp-explain-to-a-human',
    title: 'Explain something technical to someone who does not care about it.',
    careerPathIds: [
      'tech-consultant',
      'solutions-engineer',
      'business-analyst',
      'product-manager',
      'data-analyst',
    ],
    scenario:
      'This one is a test of a different skill. Take something you understand technically and explain it to someone who is busy, sceptical, and only cares about the outcome.',
    objective:
      'Find out whether you enjoy translating between technical and non-technical people — a large part of several careers, and the thing many technically strong people find draining.',
    estimatedMinutes: 30,
    difficulty: 'beginner',
    skillIds: ['stakeholder-comms', 'writing-clearly', 'presenting'],
    resourceIds: [],
    doneWhen:
      'You have written a version a non-technical person understood, and you know whether you enjoyed doing it.',
    steps: [
      {
        id: 'pick',
        title: 'Pick the thing and the person',
        detail:
          'Something you actually understand — a query you wrote, a model, a bug you fixed. Then pick a specific real person as your audience: a family member, a friend in a different field.',
        hints: [
          'Concrete beats general. "The join I wrote yesterday" works better than "databases".',
          'Picking a specific person matters — writing for "a non-technical audience" produces mush.',
        ],
      },
      {
        id: 'why',
        title: 'Start with why they should care',
        detail:
          'One sentence on what changes for them. No jargon, no mechanism. If you cannot say why it matters without technical words, you may not yet know why it matters.',
        hints: [
          'Try "this means you can now…" or "without this, we would…".',
          'Resist starting with how it works. That is your interest, not theirs.',
        ],
      },
      {
        id: 'explain',
        title: 'Explain it in under 150 words',
        detail:
          'Use an analogy if it helps, but check the analogy does not smuggle in something false. Then read it aloud — jargon is much easier to hear than to see.',
        hints: [
          'Every term you have to define is a term worth replacing.',
          'Reading aloud catches the sentences you would never say to a person.',
        ],
      },
      {
        id: 'notice',
        title: 'Notice how that felt',
        detail:
          'Genuinely ask yourself: was that satisfying, or was it a chore you were glad to finish? Both are useful answers. Several well-paid careers are mostly this, and several are mostly not — knowing which you are is worth more than being good at it.',
        hints: [
          'There is no right answer. Finding it draining rules some paths out, which is progress.',
          'If you enjoyed it more than the technical work itself, that is worth paying attention to.',
        ],
      },
    ],
  },
]

export function experimentById(id: string): CareerExperiment | undefined {
  return careerExperiments.find((experiment) => experiment.id === id)
}

export function experimentsForPath(pathId: string): CareerExperiment[] {
  return careerExperiments.filter((experiment) => experiment.careerPathIds.includes(pathId))
}
