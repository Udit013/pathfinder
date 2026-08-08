import type { Skill } from '@/types'

/**
 * The skill library (§13, §27).
 *
 * `whyItMatters` is written in the user's terms — what this unlocks for them —
 * rather than as a definition. Someone deciding whether to spend six hours on a
 * skill needs a reason, not a description.
 *
 * `estimatedHours` is time to working competence, not mastery: enough to use it
 * on a real task and look things up as you go. Always shown with a "~".
 *
 * `practiceTask` is deliberately one concrete thing. It exists so you can tell
 * whether it stuck, which is otherwise almost impossible to judge from inside.
 *
 * Resources are NOT duplicated here — they're derived from `resource.skillIds`
 * so there's one source of truth. `resourceIds` pins any that should always
 * lead for this skill regardless of the default ordering.
 */
export const skills: Skill[] = [
  // ── Foundations ────────────────────────────────────────────────────────────
  {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    category: 'foundation',
    whyItMatters:
      'Still where most business data actually lives. Being fast here means you can answer small questions immediately instead of waiting on a data pull.',
    difficulty: 'beginner',
    estimatedHours: 12,
    prerequisiteSkillIds: [],
    resourceIds: ['res-excel-learn'],
    practiceTask:
      'Take any sales-style dataset and build a pivot showing revenue by month and category. Then write the one thing it tells you.',
  },
  {
    id: 'business-acumen',
    name: 'Business sense',
    category: 'business',
    whyItMatters:
      'The difference between an analyst who answers the question asked and one who answers the question meant. It is what makes technical work useful to anyone.',
    difficulty: 'beginner',
    estimatedHours: 20,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Pick a company you use. Write down how it makes money, what its biggest cost is, and which single number its leadership probably watches weekly.',
  },
  {
    id: 'stakeholder-comms',
    name: 'Working with stakeholders',
    category: 'communication',
    whyItMatters:
      'Most analysis fails at the handover, not the analysis. Being able to extract the real question and deliver an answer someone acts on is the whole job at senior level.',
    difficulty: 'intermediate',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Take an analysis you did. Rewrite the summary for someone who will read only the first sentence, then for someone who will ask three follow-ups.',
  },
  {
    id: 'writing-clearly',
    name: 'Writing clearly',
    category: 'communication',
    whyItMatters:
      'The most undervalued technical skill. Remote work runs on writing, and a clear document persuades people who were never in the room.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Write a 150-word summary of something technical you did. Cut it to 75 words without losing the point.',
  },
  {
    id: 'presenting',
    name: 'Presenting',
    category: 'communication',
    whyItMatters:
      'Being questioned live is a different skill from writing, and it is how most senior people first form an impression of you.',
    difficulty: 'intermediate',
    estimatedHours: 12,
    prerequisiteSkillIds: ['writing-clearly'],
    resourceIds: [],
    practiceTask:
      'Present a finding in three minutes to one person. Have them interrupt with a hard question halfway through.',
  },
  {
    id: 'structured-problem-solving',
    name: 'Structured problem solving',
    category: 'business',
    whyItMatters:
      'Breaking an ambiguous problem into parts you can actually attack. It is what case interviews test and what consulting is largely made of.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Take "why are our costs rising?" and break it into a tree of sub-questions where each branch is separately checkable.',
  },

  // ── SQL & data ─────────────────────────────────────────────────────────────
  {
    id: 'sql-basics',
    name: 'SQL fundamentals',
    category: 'data',
    whyItMatters:
      'The single highest-leverage skill for almost every data role. It is the one thing that appears in essentially every job description and every interview.',
    difficulty: 'beginner',
    estimatedHours: 20,
    prerequisiteSkillIds: [],
    resourceIds: ['res-sqlbolt', 'res-kaggle-intro-sql'],
    practiceTask:
      'Write a query returning the top 5 products by revenue, from memory, without looking up the syntax.',
  },
  {
    id: 'sql-joins',
    name: 'SQL joins & aggregation',
    category: 'data',
    whyItMatters:
      'Real answers almost always need more than one table. This is the point where SQL stops being a lookup tool and starts being an analysis tool.',
    difficulty: 'beginner',
    estimatedHours: 20,
    prerequisiteSkillIds: ['sql-basics'],
    resourceIds: ['res-sqlbolt', 'res-yt-ata-sql-basics'],
    practiceTask:
      'Join two tables, then run it again as a LEFT JOIN. Write down exactly which rows changed and why.',
  },
  {
    id: 'sql-advanced',
    name: 'Advanced SQL',
    category: 'data',
    whyItMatters:
      'Window functions and CTEs are where SQL screens separate candidates. They also turn multi-step analyses into one readable query.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: ['res-mode-sql'],
    practiceTask:
      'Use a window function to rank customers by spend within each region, then compute a running total.',
  },
  {
    id: 'databases',
    name: 'How databases work',
    category: 'data',
    whyItMatters:
      'Understanding indexes, keys, and query planning is what lets you fix a slow query rather than just wait for it.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: ['res-yt-fcc-sql'],
    practiceTask:
      'Take a slow query, read its execution plan, add an index, and measure the difference.',
  },
  {
    id: 'data-modeling',
    name: 'Data modelling',
    category: 'data',
    whyItMatters:
      'Deciding how data should be structured before it arrives. A good model makes later questions easy; a bad one makes them impossible.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: [],
    practiceTask:
      'Design a star schema for an online store: name the fact table, its grain, and three dimensions.',
  },
  {
    id: 'metric-definition',
    name: 'Defining metrics',
    category: 'analytics',
    whyItMatters:
      'Almost every argument about numbers is really an argument about definitions. Being the person who writes them down settles those arguments permanently.',
    difficulty: 'intermediate',
    estimatedHours: 10,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: [],
    practiceTask:
      'Define "active user" precisely enough that two people would compute the same number. Include the edge cases.',
  },
  {
    id: 'testing-data',
    name: 'Data quality & testing',
    category: 'engineering',
    whyItMatters:
      'Code fails loudly; data fails silently. Assertions are the only thing standing between a bad upstream change and a wrong decision.',
    difficulty: 'intermediate',
    estimatedHours: 12,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: [],
    practiceTask:
      'Add two tests to a table you built: one for uniqueness of the key, one for a value staying in a sane range.',
  },
  {
    id: 'dbt',
    name: 'dbt',
    category: 'engineering',
    whyItMatters:
      'The standard tool for treating analytics SQL like real software — version controlled, tested, documented. It defines the analytics engineering role.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['sql-advanced', 'version-control'],
    resourceIds: [],
    practiceTask:
      'Build a two-model dbt project where one model references the other, and add a uniqueness test.',
  },
  {
    id: 'etl-pipelines',
    name: 'Building pipelines',
    category: 'engineering',
    whyItMatters:
      'Moving data reliably from where it is created to where it is used. This is the core deliverable of data engineering.',
    difficulty: 'intermediate',
    estimatedHours: 35,
    prerequisiteSkillIds: ['python-basics', 'sql-joins'],
    resourceIds: [],
    practiceTask:
      'Write a script that reads a messy CSV, cleans it to a defined schema, loads it into a database, and quarantines rows it cannot fix.',
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    category: 'engineering',
    whyItMatters:
      'Scheduling, dependencies, retries, and alerting. It is the difference between a script you run and a pipeline a company depends on.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['etl-pipelines'],
    resourceIds: [],
    practiceTask:
      'Schedule a two-step job where the second step only runs if the first succeeds, and make a failure notify you.',
  },

  // ── Statistics & analysis ──────────────────────────────────────────────────
  {
    id: 'descriptive-stats',
    name: 'Descriptive statistics',
    category: 'analytics',
    whyItMatters:
      'Knowing when the mean lies to you. Most analytical mistakes at entry level are a median that should have been used instead of an average.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: ['res-yt-statquest-stats'],
    practiceTask:
      'Find a dataset where the mean and median differ substantially. Explain in two sentences which is more honest and why.',
  },
  {
    id: 'inferential-stats',
    name: 'Inference & significance',
    category: 'analytics',
    whyItMatters:
      'Telling a real effect from a coincidence. Without it you will eventually tell a room full of people that something worked when it did not.',
    difficulty: 'intermediate',
    estimatedHours: 30,
    prerequisiteSkillIds: ['descriptive-stats'],
    resourceIds: ['res-yt-statquest-stats'],
    practiceTask:
      'Explain a p-value to someone non-technical in three sentences, without using the phrase "probability the result is true".',
  },
  {
    id: 'experimentation',
    name: 'A/B testing',
    category: 'analytics',
    whyItMatters:
      'The only reliable way to establish that a change caused an outcome. Every product company runs on this, and most people interpret it wrong.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['inferential-stats'],
    resourceIds: [],
    practiceTask:
      'Design an experiment for a change you would make to an app you use. State the metric, the hypothesis, and what result would change your mind.',
  },
  {
    id: 'funnel-analysis',
    name: 'Funnel & retention analysis',
    category: 'analytics',
    whyItMatters:
      'The two questions every product team asks: where do people fall out, and do they come back? These techniques answer both.',
    difficulty: 'intermediate',
    estimatedHours: 15,
    prerequisiteSkillIds: ['sql-joins'],
    resourceIds: [],
    practiceTask:
      'Build a funnel with step-to-step conversion rates, then split the worst step by one user attribute.',
  },
  {
    id: 'data-viz',
    name: 'Data visualisation',
    category: 'analytics',
    whyItMatters:
      'A chart that needs explaining has failed. This is how your analysis survives contact with people who did not do it.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: ['res-ft-visual-vocabulary', 'res-kaggle-dataviz'],
    practiceTask:
      'Take a chart you made and retitle it with the takeaway rather than its contents. Then delete everything not helping.',
  },
  {
    id: 'bi-tools',
    name: 'A BI tool',
    category: 'analytics',
    whyItMatters:
      'Power BI, Tableau, or Looker. Named explicitly in a large share of analyst job descriptions, and quick to show in a portfolio.',
    difficulty: 'beginner',
    estimatedHours: 25,
    prerequisiteSkillIds: ['sql-basics', 'data-viz'],
    resourceIds: ['res-mslearn-powerbi'],
    practiceTask:
      'Build a three-chart dashboard answering three stated questions. Show it to someone without explaining it first.',
  },
  {
    id: 'product-sense',
    name: 'Product sense',
    category: 'business',
    whyItMatters:
      'Judgement about what is worth building and why. It is the thing product interviews actually test, and it is learnable despite sounding innate.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Pick a feature in an app you use. Write what problem it solves, who for, and one way you would improve it.',
  },
  {
    id: 'user-research',
    name: 'User research basics',
    category: 'business',
    whyItMatters:
      'Learning to ask questions that do not lead the witness. Most "we asked users" work is invalidated by how the questions were phrased.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Interview one person about a tool they use daily. Ask only about past behaviour, never about what they would want.',
  },
  {
    id: 'prioritization',
    name: 'Prioritisation',
    category: 'business',
    whyItMatters:
      'Choosing one thing and defending the choice. It is most of what product and program roles actually involve.',
    difficulty: 'intermediate',
    estimatedHours: 10,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Take five competing requests, write your criteria first, then choose one and name what you gave up.',
  },
  {
    id: 'requirements-gathering',
    name: 'Gathering requirements',
    category: 'business',
    whyItMatters:
      'Turning "we need a report" into something someone could actually build. Ambiguity here is where projects quietly fail.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: ['stakeholder-comms'],
    resourceIds: [],
    practiceTask:
      'Write requirements for a feature with acceptance criteria specific enough that two developers would build the same thing.',
  },
  {
    id: 'process-mapping',
    name: 'Process mapping',
    category: 'business',
    whyItMatters:
      'Making an invisible process visible. The documented process and the real one almost never match, and the gap is usually the problem.',
    difficulty: 'beginner',
    estimatedHours: 12,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Map a process you do regularly, step by step with timings. Find the step that costs the most and is least necessary.',
  },
  {
    id: 'project-management',
    name: 'Running projects',
    category: 'business',
    whyItMatters:
      'Keeping work moving across people who do not report to you, and being honest about risk before it becomes a surprise.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['stakeholder-comms'],
    resourceIds: [],
    practiceTask:
      'Take a multi-step goal, break it into dependencies, and identify the one thing most likely to slip.',
  },
  {
    id: 'risk-communication',
    name: 'Communicating risk',
    category: 'communication',
    whyItMatters:
      'Saying "this will probably slip" early and being believed. Doing this well is what separates trusted program managers from unlucky ones.',
    difficulty: 'intermediate',
    estimatedHours: 10,
    prerequisiteSkillIds: ['writing-clearly'],
    resourceIds: [],
    practiceTask:
      'Write a status update that flags a real risk without hedging and without alarm. Include what you need from whom.',
  },
  {
    id: 'financial-modeling',
    name: 'Financial modelling',
    category: 'business',
    whyItMatters:
      'Projecting what money will do, and making the assumptions visible enough to argue with.',
    difficulty: 'intermediate',
    estimatedHours: 30,
    prerequisiteSkillIds: ['spreadsheets'],
    resourceIds: ['res-excel-learn'],
    practiceTask:
      'Build a three-year revenue projection where every assumption is its own labelled, editable cell.',
  },

  // ── Programming ────────────────────────────────────────────────────────────
  {
    id: 'python-basics',
    name: 'Python fundamentals',
    category: 'programming',
    whyItMatters:
      'The default language of data work. Enough Python to load, clean, and inspect a file unlocks nearly everything else.',
    difficulty: 'beginner',
    estimatedHours: 30,
    prerequisiteSkillIds: [],
    resourceIds: ['res-yt-corey-python', 'res-python-docs'],
    practiceTask:
      'Write a script that reads a CSV, filters it, and prints a summary — without copying from a tutorial.',
  },
  {
    id: 'python-intermediate',
    name: 'Intermediate Python',
    category: 'programming',
    whyItMatters:
      'Where scripts become software: modules, error handling, virtual environments, and code someone else can run.',
    difficulty: 'intermediate',
    estimatedHours: 35,
    prerequisiteSkillIds: ['python-basics'],
    resourceIds: ['res-yt-corey-python'],
    practiceTask:
      'Refactor a script into functions across two files, with real error handling and a requirements file.',
  },
  {
    id: 'pandas',
    name: 'pandas',
    category: 'data',
    whyItMatters:
      'The workhorse for analysis in Python. Once it clicks, exploring a new dataset takes minutes instead of an afternoon.',
    difficulty: 'beginner',
    estimatedHours: 25,
    prerequisiteSkillIds: ['python-basics'],
    resourceIds: ['res-kaggle-pandas', 'res-yt-corey-pandas', 'res-pandas-10min'],
    practiceTask:
      'Load a CSV, report its shape, missing values, and the distribution of one column — then describe it in five plain sentences.',
  },
  {
    id: 'programming-fundamentals',
    name: 'Programming fundamentals',
    category: 'programming',
    whyItMatters:
      'Variables, control flow, functions, and how to read an error message. Everything else is built on this and nothing substitutes for it.',
    difficulty: 'beginner',
    estimatedHours: 40,
    prerequisiteSkillIds: [],
    resourceIds: ['res-freecodecamp'],
    practiceTask:
      'Build something small that solves a problem you actually have, and use it once for real.',
  },
  {
    id: 'data-structures',
    name: 'Data structures & algorithms',
    category: 'programming',
    whyItMatters:
      'Mostly an interview requirement, partly a real one. Knowing when a dictionary beats a list is the practical half.',
    difficulty: 'intermediate',
    estimatedHours: 50,
    prerequisiteSkillIds: ['programming-fundamentals'],
    resourceIds: [],
    practiceTask:
      'Solve one array and one hash-map problem, then explain your solution aloud, including its complexity.',
  },
  {
    id: 'version-control',
    name: 'Git & GitHub',
    category: 'programming',
    whyItMatters:
      'Non-negotiable for any technical role, and your GitHub is often the first thing anyone looks at.',
    difficulty: 'beginner',
    estimatedHours: 12,
    prerequisiteSkillIds: [],
    resourceIds: ['res-yt-fcc-git', 'res-git-docs'],
    practiceTask:
      'Create a repo, make three meaningful commits on a branch, and merge it via a pull request.',
  },
  {
    id: 'debugging',
    name: 'Debugging',
    category: 'programming',
    whyItMatters:
      'The skill that most separates people who enjoy this work from people who find it agonising. It is a method, not a talent.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: ['programming-fundamentals'],
    resourceIds: [],
    practiceTask:
      'Break something on purpose, then find it using only the error message and print statements before reaching for anything else.',
  },
  {
    id: 'testing-code',
    name: 'Testing',
    category: 'programming',
    whyItMatters:
      'Tests are how you change code without fear. Their absence in a portfolio project is noticed more than their presence.',
    difficulty: 'intermediate',
    estimatedHours: 18,
    prerequisiteSkillIds: ['programming-fundamentals'],
    resourceIds: [],
    practiceTask:
      'Write tests for a function you already wrote. Find at least one case you had not considered.',
  },
  {
    id: 'apis',
    name: 'APIs',
    category: 'engineering',
    whyItMatters:
      'How software talks to other software. Consuming one is a day-one skill; designing one is most of backend work.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['programming-fundamentals'],
    resourceIds: [],
    practiceTask:
      'Pull data from a public API, handle its errors and rate limits, and save the result.',
  },
  {
    id: 'system-design-intro',
    name: 'System design basics',
    category: 'engineering',
    whyItMatters:
      'Reasoning about how pieces fit together and where they break. Appears in interviews earlier than most people expect.',
    difficulty: 'advanced',
    estimatedHours: 30,
    prerequisiteSkillIds: ['apis', 'databases'],
    resourceIds: [],
    practiceTask:
      'Sketch the architecture for a URL shortener. Name the single component whose failure takes everything down.',
  },
  {
    id: 'html-css',
    name: 'HTML & CSS',
    category: 'programming',
    whyItMatters:
      'The foundation of everything on the web, and the fastest route to something visible you can show people.',
    difficulty: 'beginner',
    estimatedHours: 25,
    prerequisiteSkillIds: [],
    resourceIds: ['res-freecodecamp'],
    practiceTask: 'Rebuild a simple page you like from scratch, and make it work on a phone.',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'programming',
    whyItMatters: 'The language of the browser. Nothing interactive on the web happens without it.',
    difficulty: 'beginner',
    estimatedHours: 40,
    prerequisiteSkillIds: ['html-css'],
    resourceIds: ['res-freecodecamp'],
    practiceTask: 'Build a page that fetches data from an API and renders it, handling the error case.',
  },
  {
    id: 'react',
    name: 'React',
    category: 'programming',
    whyItMatters:
      'The most commonly required frontend framework. Learning it well transfers to the others.',
    difficulty: 'intermediate',
    estimatedHours: 40,
    prerequisiteSkillIds: ['javascript'],
    resourceIds: [],
    practiceTask:
      'Build a small app with two components that share state, and explain why the state lives where it does.',
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    category: 'programming',
    whyItMatters:
      'Frequently a legal requirement and always the right call. Also a fast way to stand out at entry level, because most candidates skip it.',
    difficulty: 'intermediate',
    estimatedHours: 15,
    prerequisiteSkillIds: ['html-css'],
    resourceIds: [],
    practiceTask:
      'Navigate something you built using only the keyboard. Fix everything you cannot reach.',
  },
  {
    id: 'scripting',
    name: 'Scripting & automation',
    category: 'programming',
    whyItMatters:
      'Automating the thing you do by hand every week. Compounds faster than almost any other skill on this list.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: ['programming-fundamentals'],
    resourceIds: [],
    practiceTask: 'Automate one repetitive task you currently do manually. Use it three times.',
  },

  // ── Infrastructure & ML ────────────────────────────────────────────────────
  {
    id: 'linux-cli',
    name: 'Command line',
    category: 'engineering',
    whyItMatters:
      'Servers have no interface. Comfort here removes a constant low-level friction from every technical job.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Find every file over 10MB modified in the last week, using one command chain.',
  },
  {
    id: 'networking-basics',
    name: 'Networking basics',
    category: 'engineering',
    whyItMatters:
      'DNS, HTTP, ports, TLS. Half of all "it works on my machine" problems are one of these four.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Trace what happens between typing a URL and the page appearing. Name each step.',
  },
  {
    id: 'cloud-basics',
    name: 'Cloud fundamentals',
    category: 'engineering',
    whyItMatters:
      'Nearly everything runs on AWS, Azure, or GCP. The concepts transfer between them, so pick one and learn it properly.',
    difficulty: 'intermediate',
    estimatedHours: 30,
    prerequisiteSkillIds: ['linux-cli'],
    resourceIds: ['res-mslearn-powerbi'],
    practiceTask: 'Deploy something small and reach it from a browser. Then work out what it costs.',
  },
  {
    id: 'docker',
    name: 'Containers',
    category: 'engineering',
    whyItMatters:
      'The standard answer to "it works on my machine". Expected knowledge for engineering roles.',
    difficulty: 'intermediate',
    estimatedHours: 18,
    prerequisiteSkillIds: ['linux-cli'],
    resourceIds: [],
    practiceTask: 'Containerise a script you wrote and run it on a machine that has none of its dependencies.',
  },
  {
    id: 'ci-cd',
    name: 'CI/CD',
    category: 'engineering',
    whyItMatters:
      'Automated testing and deployment. It is what makes shipping frequently safe rather than terrifying.',
    difficulty: 'intermediate',
    estimatedHours: 18,
    prerequisiteSkillIds: ['version-control', 'testing-code'],
    resourceIds: [],
    practiceTask: 'Set up a pipeline that runs your tests on every push and blocks a merge when they fail.',
  },
  {
    id: 'infrastructure-as-code',
    name: 'Infrastructure as code',
    category: 'engineering',
    whyItMatters:
      'Infrastructure you can review, version, and rebuild. Clicking through a console does not scale and cannot be audited.',
    difficulty: 'advanced',
    estimatedHours: 30,
    prerequisiteSkillIds: ['cloud-basics', 'version-control'],
    resourceIds: [],
    practiceTask: 'Define a small piece of cloud infrastructure in code, destroy it, and recreate it identically.',
  },
  {
    id: 'observability',
    name: 'Monitoring & alerting',
    category: 'engineering',
    whyItMatters:
      'Knowing something broke before your users tell you. Also knowing which alerts are worth waking up for.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['cloud-basics'],
    resourceIds: [],
    practiceTask: 'Add logging and one alert to something you built. Make the alert fire on purpose.',
  },
  {
    id: 'security-fundamentals',
    name: 'Security fundamentals',
    category: 'engineering',
    whyItMatters:
      'Authentication, authorisation, secrets, and the common vulnerability classes. Relevant far beyond security-titled roles.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: ['networking-basics'],
    resourceIds: [],
    practiceTask: 'Audit a project of yours for hardcoded secrets and unvalidated input. Fix what you find.',
  },
  {
    id: 'threat-detection',
    name: 'Threat detection',
    category: 'engineering',
    whyItMatters:
      'Spotting the signal in a flood of logs, and knowing what to do next. The core of a SOC analyst role.',
    difficulty: 'advanced',
    estimatedHours: 30,
    prerequisiteSkillIds: ['security-fundamentals'],
    resourceIds: [],
    practiceTask: 'Take a sample log set and write a detection rule for one suspicious pattern.',
  },
  {
    id: 'ml-foundations',
    name: 'Machine learning foundations',
    category: 'ml',
    whyItMatters:
      'What the main model families do and when each is appropriate. Knowing when not to use ML is part of it.',
    difficulty: 'intermediate',
    estimatedHours: 45,
    prerequisiteSkillIds: ['pandas', 'inferential-stats'],
    resourceIds: ['res-yt-statquest-stats'],
    practiceTask:
      'Train a baseline and one model on the same data. Explain in plain words why the model beat the baseline, or did not.',
  },
  {
    id: 'model-evaluation',
    name: 'Evaluating models',
    category: 'ml',
    whyItMatters:
      'Where most beginners go wrong. Accuracy on imbalanced data is close to meaningless, and leakage is easy to cause by accident.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['ml-foundations'],
    resourceIds: [],
    practiceTask:
      'Take a model on imbalanced data and explain why its accuracy is misleading, using precision and recall.',
  },
  {
    id: 'mlops',
    name: 'MLOps',
    category: 'ml',
    whyItMatters:
      'Getting a model out of a notebook and keeping it working. Most models never make this transition.',
    difficulty: 'advanced',
    estimatedHours: 35,
    prerequisiteSkillIds: ['model-evaluation', 'docker', 'apis'],
    resourceIds: [],
    practiceTask: 'Serve a trained model behind an API and log every prediction it makes.',
  },
  {
    id: 'prompt-engineering',
    name: 'Working with model APIs',
    category: 'ml',
    whyItMatters:
      'Getting reliable behaviour out of a model you did not train — structure, constraints, and failure handling.',
    difficulty: 'beginner',
    estimatedHours: 15,
    prerequisiteSkillIds: ['apis'],
    resourceIds: [],
    practiceTask:
      'Build something that calls a model API and returns structured output, and handle the case where it does not.',
  },
  {
    id: 'rag-systems',
    name: 'Retrieval systems',
    category: 'ml',
    whyItMatters:
      'Grounding a model in your own data. The most common architecture in applied AI work right now.',
    difficulty: 'intermediate',
    estimatedHours: 30,
    prerequisiteSkillIds: ['prompt-engineering'],
    resourceIds: [],
    practiceTask: 'Build a retrieval system over documents you own, and check what it does when nothing is relevant.',
  },
  {
    id: 'eval-design',
    name: 'Evaluating AI systems',
    category: 'ml',
    whyItMatters:
      'Without an eval set you are guessing whether changes helped. This is the skill that separates shipped AI features from demos.',
    difficulty: 'intermediate',
    estimatedHours: 20,
    prerequisiteSkillIds: ['prompt-engineering'],
    resourceIds: [],
    practiceTask: 'Write 20 test cases for an AI feature, including the ones you expect it to fail.',
  },

  // ── Job search ─────────────────────────────────────────────────────────────
  {
    id: 'resume-writing',
    name: 'Writing a resume that survives',
    category: 'job_search',
    whyItMatters:
      'Your resume gets under a minute of attention. Specific beats impressive, and vague bullets are the most common reason strong candidates get filtered.',
    difficulty: 'beginner',
    estimatedHours: 8,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Rewrite your weakest bullet as: what you did, how, and what changed. Do not invent a number.',
  },
  {
    id: 'interview-practice',
    name: 'Interviewing',
    category: 'job_search',
    whyItMatters:
      'A separate skill from doing the job, and one that improves fast with deliberate practice. Being good at the work is not enough on its own.',
    difficulty: 'intermediate',
    estimatedHours: 25,
    prerequisiteSkillIds: [],
    resourceIds: [],
    practiceTask:
      'Answer a question out loud, recorded. Watch it back once — uncomfortable, and the fastest improvement available.',
  },
]

const skillsById = new Map(skills.map((skill) => [skill.id, skill]))

export function skillById(id: string): Skill | undefined {
  return skillsById.get(id)
}

export function skillName(id: string): string {
  return skillsById.get(id)?.name ?? id
}

export function skillsByIds(ids: string[]): Skill[] {
  return ids.map((id) => skillsById.get(id)).filter((skill): skill is Skill => Boolean(skill))
}
