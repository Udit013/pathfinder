import type { ProjectTemplate } from '@/types'

/**
 * The project library (§16).
 *
 * Deliberately small. Eight good projects, not fifty — because the failure mode
 * here is a library so large that choosing becomes the hard part, and because
 * one finished project genuinely does beat five abandoned tutorials.
 *
 * Every project follows the same rules:
 *   - It solves a problem someone would actually have. No "build a todo app".
 *   - Milestone 1 is small enough to finish in one sitting, because the gap
 *     between "started" and "abandoned" is almost always milestone 1.
 *   - Each milestone ends in something that exists — `youWillHave` is the point.
 *   - Resume guidance teaches the shape of a good bullet. It never writes a
 *     claim for you, and it never invents a number.
 */
export const projectTemplates: ProjectTemplate[] = [
  // ── Data Analyst ───────────────────────────────────────────────────────────
  {
    id: 'proj-revenue-story',
    title: 'The quarter that went wrong',
    whatYouWillBuild:
      'A short written analysis, backed by SQL and two charts, explaining a revenue drop and what to do about it.',
    careerPathIds: ['data-analyst', 'bi-analyst', 'business-analyst'],
    difficulty: 'beginner',
    estimatedHours: 8,
    problem:
      'A company\'s revenue fell and nobody knows why. Leadership does not want a dashboard — they want an answer and a recommendation, in something they can read in two minutes.',
    whyItMatters:
      'This is the single most common shape of real analyst work: a vague question, messy data, and an audience with no patience. Being able to show one of these end to end is worth more than three dashboards.',
    skillIds: ['sql-basics', 'sql-joins', 'descriptive-stats', 'data-viz', 'stakeholder-comms'],
    skillsDemonstrated: [
      'Segmenting a metric to isolate a cause',
      'Distinguishing volume, price, and mix effects',
      'Writing for an executive audience',
      'Charting for a takeaway rather than for completeness',
    ],
    datasetSuggestion:
      'Use the quarterly orders dataset from the Career Lab, or any public sales dataset with a date, a region, and an amount.',
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-sqlbolt', 'res-mode-sql', 'res-ft-visual-vocabulary'],
    architecture: [
      'Raw orders table → exploratory queries',
      'A small set of saved queries, one per question you asked',
      'Two charts built from those query results',
      'A one-page write-up that leads with the finding',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Confirm the drop is real',
        detail:
          'Load the data and compute revenue by quarter yourself. Do not take the reported number on trust — checking the premise is part of the job.',
        estimatedHours: 1,
        youWillHave: 'A query and a number you can defend, plus a note on how it differs from the number you were given.',
      },
      {
        id: 'm2',
        title: 'Find where it came from',
        detail:
          'Break revenue apart by every dimension you have, then by pairs of dimensions. Keep the queries — they become your evidence.',
        estimatedHours: 2,
        youWillHave: 'A named segment that behaved differently from the rest, with the query that shows it.',
      },
      {
        id: 'm3',
        title: 'Work out the mechanism',
        detail:
          'Fewer orders, smaller orders, or lower prices? These have different causes and different fixes.',
        estimatedHours: 1.5,
        youWillHave: 'A one-sentence causal story with numbers behind each part of it.',
      },
      {
        id: 'm4',
        title: 'Make two charts that carry the argument',
        detail:
          'One showing the overall drop, one isolating the cause. Title each with its takeaway, then delete everything not helping.',
        estimatedHours: 1.5,
        youWillHave: 'Two charts a stranger could read correctly without you in the room.',
      },
      {
        id: 'm5',
        title: 'Write the page',
        detail:
          'Finding first, method second, recommendation last. Under 400 words. Then cut it by a quarter.',
        estimatedHours: 2,
        youWillHave: 'A finished analysis you would be comfortable sending to a stranger.',
      },
    ],
    outcome:
      'A repository containing your queries, two charts, and a one-page analysis that names a cause and recommends an action.',
    deliverables: [
      'A written analysis (Markdown or PDF)',
      'The SQL that produced every number in it',
      'Two charts, exported',
      'A README explaining the question and your approach',
    ],
    readmeChecklist: [
      'What question were you answering, and who was asking?',
      'Where the data came from, and what it does and does not cover',
      'Your headline finding, in the first three lines',
      'How to reproduce your numbers',
      'What you would investigate next with more time',
      'What you would NOT claim from this data',
    ],
    resumeBulletGuidance: [
      'Shape: what you analysed → how → what you concluded. e.g. "Analysed 2,300 orders across nine months in SQL to isolate a channel-level revenue decline, and recommended a specific account-management intervention."',
      'Do not write "increased revenue by 12%". You did not — this is a portfolio project, and any interviewer will find that out in the first follow-up question.',
      'Naming the technique is fine; leading with it is not. "Segmented by channel and region" belongs after the finding, not before it.',
      'If someone asks "what happened next?", the honest answer is "this was a self-directed project" — say it plainly. It costs you nothing.',
    ],
    portfolioPresentation: [
      'Put the finding in the README\'s first paragraph. Most people will read nothing else.',
      'Embed the two charts directly in the README so nobody has to open a notebook.',
      'Link to the raw queries rather than pasting all of them inline.',
      'Say how long it took you. Honesty about scope makes the rest more credible.',
    ],
  },

  // ── BI Analyst ─────────────────────────────────────────────────────────────
  {
    id: 'proj-dashboard-three-questions',
    title: 'A dashboard someone actually opens',
    whatYouWillBuild:
      'A focused dashboard that answers three stated questions, with written metric definitions behind it.',
    careerPathIds: ['bi-analyst', 'data-analyst', 'analytics-engineer'],
    difficulty: 'beginner',
    estimatedHours: 10,
    problem:
      'Most dashboards get built, opened twice, and quietly abandoned — because nobody decided what decision they were for.',
    whyItMatters:
      'Anyone can add charts to a canvas. The scarce skill is restraint plus definitions, and this project demonstrates both in a way that is immediately visible.',
    skillIds: ['sql-basics', 'sql-joins', 'bi-tools', 'data-viz', 'metric-definition'],
    skillsDemonstrated: [
      'Turning a vague request into answerable questions',
      'Writing metric definitions precise enough to settle arguments',
      'Choosing charts from the question rather than from habit',
      'Designing for a glance rather than for completeness',
    ],
    datasetSuggestion:
      'The Career Lab orders dataset works well. Any public dataset with a date, a category, and a measure will do.',
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-mslearn-powerbi', 'res-ft-visual-vocabulary', 'res-sqlbolt'],
    architecture: [
      'Source tables → a small set of clean query results',
      'One chart per question, on a single screen',
      'A written data dictionary alongside it',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Write the three questions',
        detail:
          'Actual decisions someone makes, not topics. "Which region is behind target?" is a question; "revenue trends" is a shrug. Three is the limit, on purpose.',
        estimatedHours: 1,
        youWillHave: 'Three written questions, each with a decision attached to it.',
      },
      {
        id: 'm2',
        title: 'Define every metric in words and in SQL',
        detail:
          'Does revenue include discounts? Is the month calendar or fiscal? Write both versions side by side; where they disagree, the words are usually right.',
        estimatedHours: 2,
        youWillHave: 'A data dictionary with an unambiguous definition per metric.',
      },
      {
        id: 'm3',
        title: 'Build the smallest version',
        detail:
          'One chart per question. Most important number top-left. Sort things meaningfully and label the axes.',
        estimatedHours: 4,
        youWillHave: 'A working dashboard with exactly three charts and nothing else.',
      },
      {
        id: 'm4',
        title: 'Test it on a real person',
        detail:
          'Show it to someone and stay quiet. Ask what they would do based on it. If they need your narration, it has not worked yet.',
        estimatedHours: 1,
        youWillHave: 'Notes on what confused them, and a revised version.',
      },
      {
        id: 'm5',
        title: 'Write it up and publish',
        detail:
          'Screenshots, the questions, the definitions, and what you changed after testing it on someone.',
        estimatedHours: 2,
        youWillHave: 'A published dashboard with a README that explains the thinking.',
      },
    ],
    outcome:
      'A published dashboard answering three specific questions, plus a data dictionary and a note on what user testing changed.',
    deliverables: [
      'The dashboard (published link or screenshots)',
      'A written data dictionary',
      'The SQL behind each chart',
      'A short note on what you removed and why',
    ],
    readmeChecklist: [
      'The three questions, stated up front',
      'A screenshot, so nobody has to install anything',
      'Metric definitions including edge cases',
      'What you deliberately left out',
      'What changed after you tested it on a person',
    ],
    resumeBulletGuidance: [
      'Shape: who it was for → what they can now answer → the restraint you exercised. e.g. "Built a three-question sales dashboard in Power BI with documented metric definitions, after user-testing an earlier version and cutting it by half."',
      'Mentioning that you tested it on someone is unusual and lands well — most candidates never do this.',
      'Avoid "improved decision-making". It cannot be checked and reads as filler.',
      'Name the tool, since BI roles filter on it.',
    ],
    portfolioPresentation: [
      'Lead with a screenshot. A link nobody can open is worth nothing.',
      'Show the before and after if you cut things — the edit is the skill.',
      'Include one metric definition in full, as evidence of precision.',
    ],
  },

  // ── Data Engineer ──────────────────────────────────────────────────────────
  {
    id: 'proj-pipeline-that-survives',
    title: 'A pipeline that survives bad data',
    whatYouWillBuild:
      'A scheduled pipeline that ingests messy daily files, cleans them to a defined schema, and quarantines what it cannot fix.',
    careerPathIds: ['data-engineer', 'analytics-engineer'],
    difficulty: 'intermediate',
    estimatedHours: 20,
    problem:
      'Files arrive nightly in inconsistent formats. Someone currently fixes them by hand every morning, and occasionally gets it wrong.',
    whyItMatters:
      'Most portfolio pipelines only work on clean data, which is the easy half. Handling failure explicitly is what actually distinguishes a data engineer, and it is rare enough in a portfolio to be memorable.',
    skillIds: ['python-basics', 'python-intermediate', 'pandas', 'data-modeling', 'etl-pipelines', 'testing-data'],
    skillsDemonstrated: [
      'Designing a schema that rejects bad data',
      'Idempotent loads and duplicate handling',
      'Quarantining rather than silently dropping rows',
      'Scheduling and failure alerting',
    ],
    datasetSuggestion:
      'The Career Lab messy sales files are built for this. Alternatively, generate your own with deliberate inconsistencies.',
    datasetId: 'ds-messy-sales',
    resourceIds: ['res-kaggle-pandas', 'res-yt-corey-pandas', 'res-yt-fcc-git'],
    architecture: [
      'Landing area for raw files, untouched',
      'A cleaning step producing a typed, validated frame',
      'A quarantine table for rows that fail validation',
      'A load step into a database, safe to re-run',
      'A scheduler with a failure notification',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Inventory everything wrong with the data',
        detail:
          'Before any code, list the problems: date formats, amount formats, casing, duplicates, missing values. The list is the design.',
        estimatedHours: 1.5,
        youWillHave: 'A written list of every data problem, with a decision for each.',
      },
      {
        id: 'm2',
        title: 'Design the target schema',
        detail:
          'Columns, types, primary key, what must never be null. A schema that refuses bad data is the cheapest test you will write.',
        estimatedHours: 2,
        youWillHave: 'A CREATE TABLE statement with constraints that would catch the duplicates automatically.',
      },
      {
        id: 'm3',
        title: 'Write the cleaning step',
        detail:
          'One function per problem class. Test each on the rows you know are broken.',
        estimatedHours: 5,
        youWillHave: 'A script that turns the raw files into a clean, typed frame.',
      },
      {
        id: 'm4',
        title: 'Handle the rows you cannot fix',
        detail:
          'Quarantine them with the reason attached, and load the rest. Decide who finds out, and how.',
        estimatedHours: 3,
        youWillHave: 'A quarantine table you can query to see exactly what failed and why.',
      },
      {
        id: 'm5',
        title: 'Make the load safe to re-run',
        detail:
          'Running it twice must not double your data. This is the single most common bug in portfolio pipelines.',
        estimatedHours: 3,
        youWillHave: 'A load you can run three times with identical results.',
      },
      {
        id: 'm6',
        title: 'Schedule it and make it shout',
        detail:
          'A daily run, with a notification on failure. Break it deliberately and confirm you find out.',
        estimatedHours: 3,
        youWillHave: 'A scheduled job, and proof you get alerted when it fails.',
      },
      {
        id: 'm7',
        title: 'Document the design decisions',
        detail:
          'Especially the tradeoffs — why quarantine rather than fail the batch, why that primary key.',
        estimatedHours: 2.5,
        youWillHave: 'A README that explains your reasoning, not just your setup steps.',
      },
    ],
    outcome:
      'A scheduled, idempotent pipeline in version control that handles malformed input without losing data or silently corrupting it.',
    deliverables: [
      'The pipeline code, in a repository with real commit history',
      'Schema definition with constraints',
      'A quarantine mechanism you can demonstrate',
      'Tests for the cleaning functions',
      'A README covering the design tradeoffs',
    ],
    readmeChecklist: [
      'What the pipeline does, in two sentences',
      'The data problems it handles, listed explicitly',
      'What happens when a row cannot be fixed, and why you chose that',
      'How to run it locally',
      'How you made it safe to re-run',
      'What you would add before trusting it in production',
    ],
    resumeBulletGuidance: [
      'Shape: what you built → the hard part → the property that makes it trustworthy. e.g. "Built a scheduled Python pipeline ingesting inconsistently formatted daily sales files, with schema validation, row-level quarantining, and idempotent loads."',
      '"Idempotent" is worth using here — it is a real signal to anyone who has run pipelines, and it invites a good follow-up question you can answer.',
      'Do not claim production scale or throughput you never had. "Processes millions of rows daily" is checkable and you will be checked.',
      'Volume is fine to state if it is true and modest. Being specific about a small number reads as more honest than vagueness about a big one.',
    ],
    portfolioPresentation: [
      'An architecture diagram in the README does a lot of work here. Boxes and arrows are enough.',
      'Show the quarantine table with real failed rows in it — that is the part interviewers remember.',
      'Commit history matters more on this one. Small, meaningful commits are themselves evidence.',
    ],
  },

  // ── Product Analyst ────────────────────────────────────────────────────────
  {
    id: 'proj-funnel-teardown',
    title: 'Where the users go missing',
    whatYouWillBuild:
      'A funnel analysis that isolates who is dropping out and where, plus a designed experiment to fix it.',
    careerPathIds: ['product-analyst', 'data-analyst', 'product-manager', 'marketing-analyst'],
    difficulty: 'beginner',
    estimatedHours: 9,
    problem:
      'Signups are below target and nobody knows which step is losing people, or whether it affects everyone equally.',
    whyItMatters:
      'Funnel work plus a defensible experiment design is essentially the product analyst interview. Having done one end to end means you can answer those questions from experience rather than theory.',
    skillIds: ['sql-basics', 'sql-joins', 'funnel-analysis', 'experimentation', 'product-sense'],
    skillsDemonstrated: [
      'Building a funnel with step-to-step conversion',
      'Segmenting to find who is affected rather than just where',
      'Designing an experiment with a pre-stated success metric',
      'Being honest about what the data cannot establish',
    ],
    datasetSuggestion: 'The Career Lab signup funnel dataset, or any event data with a user id and a step.',
    datasetId: 'ds-signup-funnel',
    resourceIds: ['res-sqlbolt', 'res-kaggle-intro-sql', 'res-yt-statquest-stats'],
    architecture: [
      'Event table → funnel query with per-step conversion',
      'Segmented views of the worst step',
      'A written experiment design',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Build the funnel',
        detail:
          'Distinct users per step, in order, with step-to-step conversion rates. The rate matters more than the count.',
        estimatedHours: 2,
        youWillHave: 'A funnel table showing exactly where the largest proportional loss is.',
      },
      {
        id: 'm2',
        title: 'Find out who is affected',
        detail:
          'Split the worst step by each user attribute. Usually one explains almost everything and the rest explain nothing.',
        estimatedHours: 2,
        youWillHave: 'A segment that behaves dramatically differently, with the numbers to show it.',
      },
      {
        id: 'm3',
        title: 'Form a mechanism, not just a correlation',
        detail:
          'Why would that group behave differently? Think about what physically happens to them at that step.',
        estimatedHours: 1,
        youWillHave: 'A written hypothesis that explains the pattern rather than restating it.',
      },
      {
        id: 'm4',
        title: 'Design the experiment',
        detail:
          'One change, one primary metric stated before running, and what result would change your mind.',
        estimatedHours: 2,
        youWillHave: 'An experiment design a PM could actually run.',
      },
      {
        id: 'm5',
        title: 'Write it up',
        detail: 'Finding, mechanism, proposed test, and one thing this analysis cannot tell you.',
        estimatedHours: 2,
        youWillHave: 'A short document with a recommendation and its limits stated.',
      },
    ],
    outcome:
      'A funnel analysis identifying a specific affected segment, with an experiment design and an explicit statement of what the data cannot prove.',
    deliverables: [
      'The funnel queries',
      'A segmented breakdown of the failing step',
      'A written experiment design with a pre-stated metric',
      'A short write-up',
    ],
    readmeChecklist: [
      'The question, in one line',
      'The funnel, as a table or chart',
      'The segment you found, and how much worse it is',
      'Your hypothesis for why',
      'The experiment you would run, and the metric you would judge it on',
      'What this analysis cannot establish',
    ],
    resumeBulletGuidance: [
      'Shape: what you analysed → what you isolated → what you proposed. e.g. "Analysed a 1,200-user signup funnel in SQL, isolated a 47-point mobile-versus-desktop gap at email verification, and designed an A/B test with a pre-stated primary metric."',
      'A specific number describing your own analysis is fine and good. A number describing business impact you never had is not.',
      '"Pre-stated primary metric" signals you understand why post-hoc metric selection is a problem. That is a real differentiator at entry level.',
      'Being able to say what the analysis could not establish is worth mentioning in interviews even if it does not fit the bullet.',
    ],
    portfolioPresentation: [
      'One funnel chart with the failing step highlighted does most of the work.',
      'Put the segment comparison right next to it — the contrast is the finding.',
      'Keep the experiment design to half a page. Longer reads as inexperience.',
    ],
  },

  // ── Data Scientist ─────────────────────────────────────────────────────────
  {
    id: 'proj-churn-honest',
    title: 'A churn model you can defend',
    whatYouWillBuild:
      'A churn model with a proper baseline, an evaluation matched to how it would be used, and a written account of its limits.',
    careerPathIds: ['data-scientist', 'ml-engineer', 'product-analyst'],
    difficulty: 'intermediate',
    estimatedHours: 16,
    problem:
      'A business wants to spend a limited retention budget on the customers most likely to leave — so the model has to be good at ranking, not just accurate.',
    whyItMatters:
      'Most portfolio ML projects report accuracy on an imbalanced dataset and stop. Establishing a baseline first and evaluating against the actual decision is what separates someone who has read about modelling from someone who has done it.',
    skillIds: ['python-basics', 'pandas', 'inferential-stats', 'ml-foundations', 'model-evaluation'],
    skillsDemonstrated: [
      'Establishing baselines before modelling',
      'Avoiding leakage with a disciplined split',
      'Choosing metrics that match the decision',
      'Stating what a model cannot tell you',
    ],
    datasetSuggestion:
      'The Career Lab churn dataset, or any public churn dataset with engagement and tenure fields.',
    datasetId: 'ds-churn',
    resourceIds: ['res-kaggle-pandas', 'res-yt-statquest-stats', 'res-yt-corey-python'],
    architecture: [
      'Raw customers table → exploration',
      'A dumb baseline and a one-rule baseline',
      'Train/test split, then a simple model',
      'Evaluation at the budget threshold the business actually has',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Explore, and find the base rate',
        detail:
          'What fraction churned? Compare each feature between churned and retained. This number governs everything after it.',
        estimatedHours: 2,
        youWillHave: 'A base rate and a shortlist of features that actually separate the groups.',
      },
      {
        id: 'm2',
        title: 'Build baselines before you model',
        detail:
          '"Predict nobody churns", then a single-rule guess using your best feature. If your model cannot beat these, it adds nothing.',
        estimatedHours: 2,
        youWillHave: 'Two baseline scores your model has to beat to be worth anything.',
      },
      {
        id: 'm3',
        title: 'Split, then train something simple',
        detail:
          'Split before you touch anything else. Logistic regression or a shallow tree — on this much data, complexity will not help and you will not be able to explain it.',
        estimatedHours: 3,
        youWillHave: 'A trained model and a test set it has genuinely never seen.',
      },
      {
        id: 'm4',
        title: 'Evaluate the way the business would use it',
        detail:
          'Rank by predicted probability, take the top 15%, and check how many actually churned. Report precision and recall, not accuracy.',
        estimatedHours: 3,
        youWillHave: 'An evaluation that answers "if we spend the budget this way, what do we get?"',
      },
      {
        id: 'm5',
        title: 'Write down what it cannot do',
        detail:
          'The model learned that low engagement precedes churn. It cannot tell you that raising engagement prevents churn. Say so.',
        estimatedHours: 2,
        youWillHave: 'A limitations section that would survive a sceptical reader.',
      },
      {
        id: 'm6',
        title: 'Clean up the notebook and publish',
        detail:
          'Delete the dead ends, keep the reasoning. A notebook someone can follow top to bottom.',
        estimatedHours: 4,
        youWillHave: 'A readable notebook and a README with the headline result.',
      },
    ],
    outcome:
      'A documented churn model that beats stated baselines, evaluated at a realistic budget threshold, with its limitations written down.',
    deliverables: [
      'A clean, readable notebook',
      'Baseline comparisons',
      'Evaluation at the decision threshold',
      'A written limitations section',
    ],
    readmeChecklist: [
      'The business question and the constraint (limited budget)',
      'The base rate, stated early',
      'Your baselines and their scores',
      'Model choice and why you did not use something fancier',
      'Evaluation at the threshold that matters',
      'What the model cannot establish, and what you would need to establish it',
    ],
    resumeBulletGuidance: [
      'Shape: what you built → what you compared against → how you judged it. e.g. "Built a churn classifier on 900 customers, benchmarked against majority-class and single-rule baselines, and evaluated precision at the top-15% ranking threshold matching a retention budget."',
      'Mentioning baselines is a strong signal. Most candidates skip them, and interviewers notice when you do not.',
      'Never write "reduced churn by X%". You did not deploy anything, and the follow-up will expose it immediately.',
      'If you must give one number, give a model metric with its context, not a business outcome.',
    ],
    portfolioPresentation: [
      'Lead the README with the baseline comparison, not the model. It shows judgement before technique.',
      'One confusion matrix at the decision threshold beats four ROC curves.',
      'Keep the limitations section. Removing it makes the whole thing less credible, not more.',
    ],
  },

  // ── Software Engineer ──────────────────────────────────────────────────────
  {
    id: 'proj-tool-you-use',
    title: 'A small tool you actually use',
    whatYouWillBuild:
      'A working tool that solves a real annoyance of yours, with tests and a README, used at least weekly.',
    careerPathIds: ['software-engineer', 'backend-engineer', 'frontend-engineer'],
    difficulty: 'beginner',
    estimatedHours: 12,
    problem:
      'Something you currently do by hand, repeatedly. Renaming files, tracking something in a spreadsheet, a calculation you redo.',
    whyItMatters:
      'A small thing you genuinely use beats a large unfinished framework in every interview. It gives you real answers to "why did you build it?" and "what would you change?", which tutorial clones never do.',
    skillIds: ['programming-fundamentals', 'debugging', 'testing-code', 'version-control'],
    skillsDemonstrated: [
      'Scoping something to a finishable size',
      'Handling the failures that actually matter',
      'Writing tests for your own code',
      'Shipping rather than polishing',
    ],
    datasetSuggestion: 'None. This one uses your own real inputs, which is the point.',
    resourceIds: ['res-yt-corey-python', 'res-yt-fcc-git', 'res-python-docs'],
    architecture: [
      'A single entry point that does one thing',
      'Core logic separated from input/output so it can be tested',
      'Configuration for the parts that change',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Write down the annoyance in one sentence',
        detail:
          'And what "done" means. If the description contains "and", build only the first half. Scope is the skill here.',
        estimatedHours: 0.5,
        youWillHave: 'A one-sentence problem statement small enough to finish.',
      },
      {
        id: 'm2',
        title: 'Make the ugliest version that works',
        detail:
          'Hard-code everything. No error handling. Terminal output is fine. Get it working end to end first.',
        estimatedHours: 3,
        youWillHave: 'Something that runs and produces the right answer once.',
      },
      {
        id: 'm3',
        title: 'Use it for real',
        detail:
          'Actually use it for its purpose. You will immediately find three things wrong that you would never have predicted.',
        estimatedHours: 1,
        youWillHave: 'A list of real problems, discovered by use rather than by imagination.',
      },
      {
        id: 'm4',
        title: 'Break it on purpose',
        detail:
          'Missing file, empty input, wrong type. Decide which failures deserve handling — not all of them do.',
        estimatedHours: 2,
        youWillHave: 'Error handling for the failures that actually matter, and a note on the ones you skipped.',
      },
      {
        id: 'm5',
        title: 'Add tests',
        detail:
          'Test the core logic. You will find at least one case you had not considered — that is the tests working.',
        estimatedHours: 3,
        youWillHave: 'A test suite that passes, and one bug it caught.',
      },
      {
        id: 'm6',
        title: 'Write the README and push',
        detail: 'What it does, how to run it, why it exists. Three short sections.',
        estimatedHours: 2.5,
        youWillHave: 'A public repository with real commit history and a tool you keep using.',
      },
    ],
    outcome:
      'A small, tested, documented tool in version control that you genuinely use — and can talk about from experience.',
    deliverables: [
      'A repository with meaningful commit history',
      'A test suite',
      'A README with the why, not just the how',
      'Evidence you use it (a note on how often is enough)',
    ],
    readmeChecklist: [
      'What it does, in one line',
      'Why you built it — the actual annoyance',
      'How to run it',
      'What it deliberately does not handle',
      'What you would change if you rebuilt it',
    ],
    resumeBulletGuidance: [
      'Shape: what it does → for whom → the engineering property. e.g. "Built and maintain a command-line tool that automates a weekly reporting task, with a test suite covering its parsing logic."',
      '"Maintain" and "use weekly" are quietly strong. They mean the thing survived contact with reality.',
      'Do not inflate a personal tool into a "platform" or a "system". Interviewers can tell, and the correction is awkward.',
      'The best interview answer this gives you is "what would you change?" — have one ready.',
    ],
    portfolioPresentation: [
      'Pin it on your GitHub profile even though it is small. Small and finished beats large and abandoned.',
      'A short terminal recording or screenshot in the README helps more than paragraphs.',
      'Mention how long you have been using it. Longevity is the signal.',
    ],
  },

  // ── Analytics Engineer ─────────────────────────────────────────────────────
  {
    id: 'proj-single-source-truth',
    title: 'One number everyone agrees on',
    whatYouWillBuild:
      'A tested, documented data model that produces one canonical metric, replacing three conflicting versions.',
    careerPathIds: ['analytics-engineer', 'bi-analyst', 'data-engineer'],
    difficulty: 'intermediate',
    estimatedHours: 14,
    problem:
      'Three teams report three different revenue numbers. Nobody is wrong — they are each computing something slightly different, and no one wrote it down.',
    whyItMatters:
      'This is the actual job of analytics engineering, and it demonstrates something most portfolios never show: applying software practice — version control, testing, documentation — to analytics.',
    skillIds: ['sql-advanced', 'data-modeling', 'metric-definition', 'testing-data', 'version-control'],
    skillsDemonstrated: [
      'Reproducing a metric disagreement deliberately',
      'Writing a definition that settles it',
      'Modelling once so nobody recomputes',
      'Testing data rather than only code',
    ],
    datasetSuggestion: 'The Career Lab orders dataset works well, since it has enough dimensions to disagree about.',
    datasetId: 'ds-revenue-drop',
    resourceIds: ['res-mode-sql', 'res-roadmap-sql', 'res-yt-fcc-git'],
    architecture: [
      'Source tables → staging models with light cleaning',
      'One canonical metric model everything else selects from',
      'Tests asserting grain uniqueness and value sanity',
      'Generated documentation',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Produce three different answers on purpose',
        detail:
          'Same table, three defensible revenue figures — by changing which date governs, what counts, and what is excluded. Doing this deliberately teaches you to spot it accidentally.',
        estimatedHours: 2,
        youWillHave: 'Three queries with three different totals, and a note on what each assumes.',
      },
      {
        id: 'm2',
        title: 'Write the definition down',
        detail:
          'What counts, which date governs, what is excluded, at what grain — and why. The reasoning is what stops the argument restarting.',
        estimatedHours: 2,
        youWillHave: 'A written definition with its edge cases named explicitly.',
      },
      {
        id: 'm3',
        title: 'Build it once, in one place',
        detail:
          'A single model everything else reads from. Name columns so their meaning is unambiguous.',
        estimatedHours: 4,
        youWillHave: 'One canonical model, with no metric logic duplicated anywhere else.',
      },
      {
        id: 'm4',
        title: 'Add tests that catch it breaking',
        detail:
          'Uniqueness on the key catches accidental fan-out. A range test catches upstream sign flips.',
        estimatedHours: 3,
        youWillHave: 'A passing test suite, plus proof it fails when you break something on purpose.',
      },
      {
        id: 'm5',
        title: 'Document and publish',
        detail: 'The definition, the model, the tests, and the three original disagreeing queries as motivation.',
        estimatedHours: 3,
        youWillHave: 'A repository that tells the whole story from problem to resolution.',
      },
    ],
    outcome:
      'A version-controlled, tested data model with one documented metric definition, and a demonstration of the disagreement it resolves.',
    deliverables: [
      'The model code, in version control',
      'A written metric definition',
      'Data tests, and evidence they catch real failures',
      'A README framing the original problem',
    ],
    readmeChecklist: [
      'The three conflicting numbers, up front — that is the hook',
      'The definition you settled on, and why',
      'The model structure',
      'What the tests protect against',
      'Who would own this definition in a real company',
    ],
    resumeBulletGuidance: [
      'Shape: the problem → what you built → what protects it. e.g. "Modelled a canonical revenue metric in dbt with documented definitions and uniqueness/range tests, resolving three conflicting team-level figures."',
      'Leading with the conflict makes this memorable. "Built data models" does not.',
      'Naming the specific tests is worth the words — it shows you know data fails differently from code.',
      'Only name dbt if you actually used it. Saying "SQL and a testing framework" is fine and honest.',
    ],
    portfolioPresentation: [
      'Open the README with the three different numbers. It is an immediately understandable problem.',
      'Show one test failing before showing it passing.',
      'Include the definition in full — it is the artefact, more than the SQL is.',
    ],
  },

  // ── Business Analyst ───────────────────────────────────────────────────────
  {
    id: 'proj-process-teardown',
    title: 'The process that got slow',
    whatYouWillBuild:
      'A process analysis locating a bottleneck with data, plus a recommendation with its tradeoff stated.',
    careerPathIds: ['business-analyst', 'operations-analyst', 'tech-consultant', 'product-ops'],
    difficulty: 'beginner',
    estimatedHours: 8,
    problem:
      'Something that used to take days now takes weeks, and every team blames a different step.',
    whyItMatters:
      'Business analyst interviews are case-shaped, and this is a case you have actually done. A written recommendation with a named cost is exactly the artefact the role produces.',
    skillIds: ['process-mapping', 'spreadsheets', 'business-acumen', 'stakeholder-comms', 'writing-clearly'],
    skillsDemonstrated: [
      'Mapping a current state from data rather than from folklore',
      'Finding a conditional bottleneck rather than an average one',
      'Locating a policy threshold as a root cause',
      'Recommending with the downside named',
    ],
    datasetSuggestion: 'The Career Lab purchase-request cycle times, or any process data with stages and timestamps.',
    datasetId: 'ds-process-cycle-time',
    resourceIds: ['res-excel-learn', 'res-sqlbolt'],
    architecture: [
      'Stage timestamps → per-stage durations',
      'Distribution analysis per stage, not just averages',
      'A current-state map and a proposed future state',
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Turn timestamps into stage durations',
        detail:
          'Then look at median as well as mean. Where they diverge sharply, something conditional is happening.',
        estimatedHours: 1.5,
        youWillHave: 'A duration-per-stage table with both median and mean.',
      },
      {
        id: 'm2',
        title: 'Find the bottleneck and its shape',
        detail:
          'Which stage dominates? Is it uniformly slow, or slow only sometimes? A bimodal stage has a trigger you can find.',
        estimatedHours: 1.5,
        youWillHave: 'A named bottleneck stage and evidence its slowness is conditional.',
      },
      {
        id: 'm3',
        title: 'Find the trigger',
        detail:
          'Test the other variables against it. Look for a threshold rather than a gradient — policies create cliffs.',
        estimatedHours: 1.5,
        youWillHave: 'The specific condition that flips the process into its slow path.',
      },
      {
        id: 'm4',
        title: 'Map current and future state',
        detail: 'One diagram each. The difference between them is your recommendation, made visible.',
        estimatedHours: 1.5,
        youWillHave: 'Two process diagrams showing exactly what you would change.',
      },
      {
        id: 'm5',
        title: 'Write the recommendation with its cost',
        detail:
          'What you would change, the expected effect, and what you are giving up. A recommendation with no named downside reads as naive.',
        estimatedHours: 2,
        youWillHave: 'A one-page recommendation that would survive a sceptical executive.',
      },
    ],
    outcome:
      'A written case study locating a bottleneck with evidence, and recommending one change with its risk stated.',
    deliverables: [
      'Duration analysis (spreadsheet or SQL)',
      'Current-state and future-state process maps',
      'A one-page recommendation',
    ],
    readmeChecklist: [
      'The problem, as the business would state it',
      'What the data showed, including what surprised you',
      'The root cause and how you established it',
      'Your recommendation',
      'What it costs and what could go wrong',
    ],
    resumeBulletGuidance: [
      'Shape: what you analysed → what you found → what you recommended. e.g. "Analysed 260 purchase requests to isolate a review bottleneck triggered by an approval threshold, and recommended a policy change with its control tradeoff documented."',
      '"With its tradeoff documented" is a small phrase that signals maturity. Most candidates present recommendations as free.',
      'Do not claim you reduced cycle time. You produced an analysis; say that.',
      'Process mapping tools are worth naming if a job description mentions them.',
    ],
    portfolioPresentation: [
      'The two process maps side by side communicate faster than any paragraph.',
      'One chart showing the bimodal distribution proves the conditional story.',
      'Keep the recommendation to one page. Length reads as padding here.',
    ],
  },
]

const byId = new Map(projectTemplates.map((project) => [project.id, project]))

export function projectTemplateById(id: string): ProjectTemplate | undefined {
  return byId.get(id)
}

export function projectsForPath(pathId: string): ProjectTemplate[] {
  return projectTemplates.filter((project) => project.careerPathIds.includes(pathId))
}

export function totalMilestoneHours(project: ProjectTemplate): number {
  return project.milestones.reduce((sum, milestone) => sum + milestone.estimatedHours, 0)
}
