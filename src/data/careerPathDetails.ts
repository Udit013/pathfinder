import type { CareerPath, CareerPathDetail } from '@/types'
import { pathById } from './careerPaths'

/**
 * Long-form career path write-ups (§10).
 *
 * Written to answer the question someone actually has — "what would I be doing
 * all day, and would I hate it?" — rather than to sell the role. Every path
 * includes real challenges and a genuine "who might dislike this", because a
 * page that only lists advantages is useless for deciding anything.
 *
 * Timelines describe a defined learning scope, never a hiring outcome (§4).
 *
 * Paths without an entry here render an honest "still being written" state.
 * Adding one is purely additive — nothing else needs to change.
 */
export const careerPathDetails: CareerPathDetail[] = [
  // ── Data Analyst ───────────────────────────────────────────────────────────
  {
    id: 'data-analyst',
    whatItIs: [
      'Someone in the business has a question — why did sales drop, which customers are worth keeping, is this campaign working — and you answer it with the data the company already has.',
      'The technical part is smaller than people expect. Most of the job is working out what is really being asked, deciding what would count as an answer, and then explaining what you found to someone who will not read past your first sentence.',
      'It is the most common way into data work, and the widest door: it opens onto product analytics, BI, analytics engineering, and data science, all of which share most of its foundations.',
    ],
    typicalDay: [
      'A stakeholder messages asking why a number moved. You spend forty minutes working out what they actually mean.',
      'You write SQL, get a surprising result, and discover it was a duplicate row rather than an insight.',
      'You rebuild a chart three times until it makes its point without a caption.',
      'You sit in a meeting where your analysis is discussed and someone asks a question you did not anticipate.',
      'You maintain a dashboard someone requested six months ago and now nobody opens.',
    ],
    deliverables: [
      'A short written analysis with a recommendation',
      'A dashboard that a team checks on a schedule',
      'A one-off query answering a specific question',
      'A metric definition everyone finally agrees on',
      'A slide or two inside someone else’s bigger deck',
    ],
    preparation: {
      estimatedMonthsMin: 3,
      estimatedMonthsMax: 6,
      scopeNote:
        'Estimated preparation period to cover SQL, spreadsheets, a BI tool, basic statistics, and two portfolio projects, at roughly 8–10 hours a week. This describes the learning scope only — actual hiring timelines vary substantially and depend on factors outside your preparation.',
    },
    interviewFormat: [
      'A SQL screen, often live — joins, aggregation, window functions',
      'A take-home or live case: here is a dataset, what do you find?',
      'Metric and product sense questions ("how would you measure this?")',
      'Behavioural questions about handling stakeholders and disagreement',
      'Sometimes a presentation of your case study to a small panel',
    ],
    portfolioExpectations: [
      'Two or three projects, each answering a real question rather than demonstrating a technique',
      'A written narrative — the finding first, the method second',
      'Visible SQL. Interviewers want to see how you think in queries',
      'At least one project using messy or genuinely public data, not a clean teaching dataset',
    ],
    advantages: [
      'The broadest entry point into data work, and it transfers in several directions',
      'You see how the business actually operates, quickly',
      'Feedback loops are short — you can answer a real question in an afternoon',
      'The core skills are learnable without a specific degree',
    ],
    challenges: [
      'A lot of the work is requests, not investigations. You are often reactive',
      'Data quality problems consume more of your time than analysis does',
      'Your best work can be ignored for reasons that have nothing to do with its quality',
      'The title is used for wildly different jobs — read the description, not the title',
      'It is a competitive entry point precisely because it is the most visible one',
    ],
    enjoyIf: [
      'You like being the person who finds out why',
      'You enjoy explaining things and are willing to rewrite until it is clear',
      'You are comfortable with an answer that is "it depends, and here is on what"',
      'You would rather be close to the business than deep in infrastructure',
    ],
    dislikeIf: [
      'You want to build systems rather than answer questions',
      'Being interrupted by requests would frustrate you',
      'You need your work to have a definitive right answer',
      'You would resent spending most of your time cleaning data',
    ],
    starterResourceIds: ['res-sqlbolt', 'res-mode-sql', 'res-roadmap-data-analyst', 'res-yt-ata-sql-basics'],
    experimentIds: ['exp-revenue-drop', 'exp-signup-funnel', 'exp-dashboard-that-answers'],
  },

  // ── Product Analyst ────────────────────────────────────────────────────────
  {
    id: 'product-analyst',
    whatItIs: [
      'You work out what people actually do inside a product — where they get stuck, what they ignore, what makes them come back — and what the team should change as a result.',
      'The distinguishing skill is not technical. It is knowing which question is worth answering, and being able to tell a real effect from a coincidence.',
      'It sits between analytics and product management, and it is a common route into either.',
    ],
    typicalDay: [
      'A PM asks whether a feature launch worked. You have to decide what "worked" means before you can answer.',
      'You build a funnel and find that the biggest drop-off has been there for a year and nobody noticed.',
      'You check an A/B test and have to explain that the result is not significant yet, to someone who wants to ship.',
      'You dig into a metric that moved and find it was a tracking change, not user behaviour.',
    ],
    deliverables: [
      'A funnel or retention analysis with a recommendation',
      'An experiment design, and later its read-out',
      'A definition of an activation or engagement metric',
      'A short written argument for or against a proposed change',
    ],
    preparation: {
      estimatedMonthsMin: 4,
      estimatedMonthsMax: 7,
      scopeNote:
        'Estimated preparation period to cover SQL, funnel and retention analysis, experimentation and statistical significance, plus product sense and two portfolio analyses, at roughly 8–10 hours a week. Learning scope only — hiring timelines vary substantially.',
    },
    interviewFormat: [
      'SQL screen, usually including window functions',
      'Product sense: "engagement dropped 10%, how do you investigate?"',
      'Experiment design and interpretation, including when not to trust a result',
      'Metric definition questions with deliberately ambiguous wording',
    ],
    portfolioExpectations: [
      'An analysis of a real product, ideally one you use',
      'Evidence you can define a metric and defend the definition',
      'One piece showing you understand statistical significance without overclaiming',
    ],
    advantages: [
      'Close to decisions — your work visibly changes what gets built',
      'A natural bridge into product management if that appeals',
      'Combines technical and judgement work, so it rarely gets monotonous',
    ],
    challenges: [
      'Your answer is frequently "we cannot tell yet", which is unpopular',
      'Tracking is often broken, and fixing it is your problem',
      'You need to hold a position against people more senior and more confident than you',
      'Fewer true entry-level openings than general analytics',
    ],
    enjoyIf: [
      'You are curious about why people behave the way they do',
      'You enjoy arguing carefully and changing your mind on evidence',
      'You like ambiguous questions more than well-specified ones',
    ],
    dislikeIf: [
      'You want clean problems with defined success criteria',
      'Pushing back on stakeholders would be draining',
      'You prefer building things to influencing what gets built',
    ],
    starterResourceIds: ['res-sqlbolt', 'res-kaggle-intro-sql', 'res-yt-statquest-stats'],
    experimentIds: ['exp-signup-funnel', 'exp-revenue-drop', 'exp-pm-prioritise'],
  },

  // ── Data Engineer ──────────────────────────────────────────────────────────
  {
    id: 'data-engineer',
    whatItIs: [
      'You build and maintain the systems that move data from where it is created to where it can be used — reliably, on schedule, and without anyone having to think about it.',
      'It is a software engineering job that happens to be about data. If the pipelines break, every analyst and every dashboard in the company is wrong, often silently.',
      'The best data engineers are judged on how little anyone notices them.',
    ],
    typicalDay: [
      'A pipeline failed overnight. You work out whether the upstream schema changed or the source system simply lied.',
      'You add a new data source, and spend most of that time on how it fails rather than how it works.',
      'You rewrite a job that takes four hours so it takes twenty minutes.',
      'An analyst reports a number looks wrong, and tracing it takes you through three systems.',
    ],
    deliverables: [
      'A scheduled pipeline that runs unattended',
      'A table others build on top of, with a documented schema',
      'Data quality tests and the alerting around them',
      'Infrastructure defined in code and reviewable',
    ],
    preparation: {
      estimatedMonthsMin: 6,
      estimatedMonthsMax: 12,
      scopeNote:
        'Estimated preparation period to cover Python, advanced SQL, data modelling, an orchestrator, cloud fundamentals, containers, and one end-to-end pipeline project, at roughly 8–10 hours a week. Learning scope only — this is a deeper technical foundation than analyst roles and hiring timelines vary substantially.',
    },
    interviewFormat: [
      'SQL, usually harder than for analyst roles',
      'Python coding, including data structures',
      'Data modelling: design the schema for this scenario',
      'System design: how would you build a pipeline that does X reliably?',
      'Debugging scenarios drawn from real failures',
    ],
    portfolioExpectations: [
      'One end-to-end pipeline: ingest, transform, load, scheduled',
      'Visible handling of failure — retries, validation, quarantining bad rows',
      'A README explaining your design decisions and what you traded off',
      'Code in version control with a real commit history',
    ],
    advantages: [
      'Consistently in demand, and less crowded at entry level than analytics',
      'Clear technical progression and strong transferability to backend engineering',
      'Your work has an obvious, verifiable definition of correct',
    ],
    challenges: [
      'Genuine entry-level roles are rarer — many postings expect prior engineering experience',
      'On-call and overnight failures are part of the job at many companies',
      'Much of the work is invisible until it breaks',
      'Steeper initial learning curve than analyst paths',
    ],
    enjoyIf: [
      'You like building things that keep working without you',
      'Debugging a hard failure is satisfying rather than stressful',
      'You would rather own a system than answer questions about it',
    ],
    dislikeIf: [
      'You want to be close to business decisions',
      'You would find invisible work unrewarding',
      'Being responsible for something breaking at 3am is unappealing',
    ],
    starterResourceIds: ['res-yt-corey-python', 'res-mode-sql', 'res-yt-fcc-git', 'res-roadmap-python'],
    experimentIds: ['exp-messy-pipeline', 'exp-one-source-of-truth'],
  },

  // ── Data Scientist ─────────────────────────────────────────────────────────
  {
    id: 'data-scientist',
    whatItIs: [
      'You answer questions that a query cannot — questions needing a model, an experiment, or a statistical argument. Will this customer churn? Did this change actually cause that lift?',
      'The title is used for two quite different jobs. At some companies it is heavy statistics and experimentation; at others it is machine learning engineering. Read the job description carefully, because the day-to-day differs enormously.',
      'Far more of the work is data cleaning and stakeholder communication than modelling. People are consistently surprised by this.',
    ],
    typicalDay: [
      'You spend most of a day getting a dataset into a usable state, and an hour modelling it.',
      'A model performs well in testing and you have to work out whether you leaked something.',
      'You explain to a stakeholder why "the model says so" is not a reason to act.',
      'You run an experiment analysis and find the result is not significant, then explain what that does and does not mean.',
    ],
    deliverables: [
      'A model, with an honest evaluation and stated limitations',
      'An experiment design and its analysis',
      'A written recommendation grounded in a statistical argument',
      'Occasionally, a model deployed into a product',
    ],
    preparation: {
      estimatedMonthsMin: 8,
      estimatedMonthsMax: 15,
      scopeNote:
        'Estimated preparation period to cover Python, pandas, statistics and inference, machine learning foundations, model evaluation, experimentation, and two substantial projects, at roughly 8–10 hours a week. Learning scope only. Entry-level competition in this field is significant and hiring timelines vary substantially.',
    },
    interviewFormat: [
      'Statistics and probability questions, often unforgiving',
      'A machine learning case: how would you approach this problem?',
      'Coding in Python, sometimes including algorithms',
      'Experiment design and interpretation',
      'A take-home modelling exercise, often several hours',
    ],
    portfolioExpectations: [
      'Projects where the modelling decisions are explained, not just the results',
      'Honest evaluation, including what did not work',
      'Evidence you understand baselines and why they matter',
      'Clear writing. This is weighted more heavily than candidates expect',
    ],
    advantages: [
      'Intellectually demanding work with real depth',
      'Strong compensation relative to other entry points into data',
      'Skills transfer to ML engineering and research',
    ],
    challenges: [
      'One of the most competitive entry points in the field',
      'Many postings expect a graduate degree or prior industry experience',
      'The reality is much less modelling than the job title implies',
      'It is easy to spend months on a model that is never used',
    ],
    enjoyIf: [
      'You genuinely enjoy statistics rather than tolerating it',
      'You are comfortable being uncertain and quantifying that uncertainty',
      'You like problems with no known correct answer',
    ],
    dislikeIf: [
      'You want to ship things quickly and see them used',
      'Ambiguity about whether your work mattered would frustrate you',
      'You would resent how much of it is data cleaning',
    ],
    starterResourceIds: ['res-kaggle-pandas', 'res-yt-statquest-stats', 'res-yt-corey-python'],
    experimentIds: ['exp-churn-model', 'exp-revenue-drop'],
  },

  // ── BI Analyst ─────────────────────────────────────────────────────────────
  {
    id: 'bi-analyst',
    whatItIs: [
      'You build and maintain the reporting a whole company relies on — the dashboards people check every morning and the metric definitions everyone quotes.',
      'The hard part is not the tool. It is getting an organisation to agree on what a number means, and then keeping that true as the business changes.',
      'It is one of the more accessible entry points into data, partly because the skills are concrete and demonstrable.',
    ],
    typicalDay: [
      'You add a filter to a dashboard, and discover the underlying metric was defined three ways.',
      'You investigate why two reports disagree. They are both right, for different definitions.',
      'You build a report someone urgently requested and will use twice.',
      'You rewrite a slow query so a dashboard loads before people give up on it.',
    ],
    deliverables: [
      'Dashboards used on a recurring schedule',
      'A documented metric layer or data dictionary',
      'Scheduled reports delivered to stakeholders',
      'Query and model optimisations behind the reporting',
    ],
    preparation: {
      estimatedMonthsMin: 3,
      estimatedMonthsMax: 6,
      scopeNote:
        'Estimated preparation period to cover SQL, a BI tool such as Power BI or Tableau, dimensional modelling basics, and two dashboard projects, at roughly 8–10 hours a week. Learning scope only — hiring timelines vary substantially.',
    },
    interviewFormat: [
      'SQL screen, with an emphasis on joins and aggregation',
      'A tool-specific exercise — build or critique a dashboard',
      'Metric definition and data modelling questions',
      'Stakeholder scenarios: what do you do when two teams disagree?',
    ],
    portfolioExpectations: [
      'Two dashboards built for a stated audience and decision',
      'Written metric definitions alongside them',
      'Evidence of restraint — a focused dashboard beats a busy one',
    ],
    advantages: [
      'Concrete, demonstrable skills that are quick to show in a portfolio',
      'Wide demand across industries, including outside tech',
      'A clear path into analytics engineering',
    ],
    challenges: [
      'A lot of maintenance, and requests that arrive faster than you can serve them',
      'Building things nobody ends up using is common and demoralising',
      'Tool-specific skills are less portable than SQL',
      'Can feel like service work rather than analysis at some companies',
    ],
    enjoyIf: [
      'You like making complicated things legible',
      'Precision and consistency appeal to you',
      'You enjoy being the person who knows where the numbers come from',
    ],
    dislikeIf: [
      'You want to investigate rather than report',
      'Recurring maintenance would bore you',
      'You would find request-driven work frustrating',
    ],
    starterResourceIds: ['res-mslearn-powerbi', 'res-sqlbolt', 'res-ft-visual-vocabulary'],
    experimentIds: ['exp-dashboard-that-answers', 'exp-one-source-of-truth', 'exp-revenue-drop'],
  },

  // ── Analytics Engineer ─────────────────────────────────────────────────────
  {
    id: 'analytics-engineer',
    whatItIs: [
      'You sit between data engineering and analytics: taking raw tables and turning them into clean, documented, tested datasets that analysts can trust without asking you first.',
      'It applies software engineering practice — version control, testing, code review, CI — to analytics work, which historically had none of those things.',
      'A relatively new role, and a strong option for analysts who find they like the building more than the answering.',
    ],
    typicalDay: [
      'You refactor a model that three dashboards depend on, and check what breaks.',
      'You add tests to a table that has been quietly wrong for a while.',
      'You review a colleague’s pull request and question a join you think will fan out.',
      'You document a model so the next person does not have to ask you what it means.',
    ],
    deliverables: [
      'Tested, documented data models',
      'A metric layer that is the single source of truth',
      'Data quality tests and their alerting',
      'Documentation others actually read',
    ],
    preparation: {
      estimatedMonthsMin: 5,
      estimatedMonthsMax: 10,
      scopeNote:
        'Estimated preparation period to cover advanced SQL, dimensional modelling, dbt, Git, and testing practice, plus one modelled project, at roughly 8–10 hours a week. Learning scope only — this role often recruits from people already working as analysts, and hiring timelines vary substantially.',
    },
    interviewFormat: [
      'Advanced SQL, including window functions and CTEs',
      'Data modelling design questions',
      'dbt-specific questions if the company uses it',
      'Code review scenarios and testing philosophy',
    ],
    portfolioExpectations: [
      'A modelled project in version control, with tests',
      'Documentation as a first-class part of the work',
      'Evidence you think about who consumes your tables',
    ],
    advantages: [
      'Growing demand and less crowded than general analytics',
      'Combines engineering rigour with business proximity',
      'Strong natural step up from a data analyst role',
    ],
    challenges: [
      'Rarely a true entry-level role — most people arrive from analytics or engineering',
      'Requires comfort with engineering practices that analytics training usually skips',
      'The role definition varies a lot between companies',
    ],
    enjoyIf: [
      'You like making things reliable and reusable',
      'Well-structured code and clear documentation appeal to you',
      'You would rather build the foundation than the presentation',
    ],
    dislikeIf: [
      'You want to be the one interpreting and presenting findings',
      'Refactoring and testing sound tedious rather than satisfying',
    ],
    starterResourceIds: ['res-mode-sql', 'res-roadmap-sql', 'res-yt-fcc-git'],
    experimentIds: ['exp-one-source-of-truth', 'exp-messy-pipeline'],
  },

  // ── Business Analyst ───────────────────────────────────────────────────────
  {
    id: 'business-analyst',
    whatItIs: [
      'You work out why something in a business is slow, expensive, or broken, and what should change. Sometimes the answer is software; often it is a process or a policy.',
      'It is the least technical of the analytical paths and the most dependent on communication — you spend a great deal of time talking to people who do the work.',
      'It exists in essentially every industry, which makes it unusually portable.',
    ],
    typicalDay: [
      'You interview people who do a process daily and find that the documented process is not the real one.',
      'You map the current state and discover a step that exists only because of a system limitation removed years ago.',
      'You write requirements, and spend the meeting discovering that two stakeholders meant different things.',
      'You quantify the cost of a problem so it can be prioritised against everything else.',
    ],
    deliverables: [
      'A current-state process map and a proposed future state',
      'A requirements document with acceptance criteria',
      'A cost or impact analysis supporting a recommendation',
      'A recommendation with its tradeoffs stated',
    ],
    preparation: {
      estimatedMonthsMin: 3,
      estimatedMonthsMax: 6,
      scopeNote:
        'Estimated preparation period to cover spreadsheets, basic SQL, process mapping, requirements gathering, and two case-style projects, at roughly 8–10 hours a week. Learning scope only — hiring timelines vary substantially.',
    },
    interviewFormat: [
      'Case questions: here is a business problem, how do you approach it?',
      'Behavioural questions about conflicting stakeholders',
      'Basic SQL or Excel exercises',
      'Sometimes a written requirements or process-mapping exercise',
    ],
    portfolioExpectations: [
      'A written case study: problem, analysis, recommendation, tradeoffs',
      'Evidence you can structure an ambiguous problem',
      'Clear, concise writing — this is the core artefact of the role',
    ],
    advantages: [
      'Lower technical barrier than other analytical paths',
      'Transferable across industries, including well outside tech',
      'Strong preparation for product and consulting roles',
    ],
    challenges: [
      'Influence without authority — you recommend, others decide',
      'The title covers very different jobs at different companies',
      'Can involve substantial documentation work',
      'Your recommendations may sit unimplemented for reasons beyond your control',
    ],
    enjoyIf: [
      'You like talking to people and finding out how things really work',
      'Untangling a messy situation is satisfying',
      'You would rather improve a system than build one',
    ],
    dislikeIf: [
      'You want deep technical work',
      'Meetings and stakeholder management would drain you',
      'You need to own the implementation of your ideas',
    ],
    starterResourceIds: ['res-excel-learn', 'res-sqlbolt'],
    experimentIds: ['exp-slow-process', 'exp-revenue-drop', 'exp-explain-to-a-human'],
  },

  // ── Software Engineer ──────────────────────────────────────────────────────
  {
    id: 'software-engineer',
    whatItIs: [
      'You build and maintain software other people depend on. Less of it is writing new code than most people imagine — much of the job is reading existing code, understanding why it is the way it is, and changing it without breaking anything.',
      'The range is enormous. A backend engineer at a bank and a frontend engineer at a startup share a title and little else.',
      'It remains one of the most accessible well-paid careers to enter without a specific credential, though the entry level has become more competitive.',
    ],
    typicalDay: [
      'You spend two hours reading code to make a ten-line change safely.',
      'You review a colleague’s pull request and learn something from it.',
      'A bug reported as one thing turns out to be something entirely different.',
      'You write tests and find a case you had not considered.',
      'You explain a technical constraint to someone non-technical, and it changes the plan.',
    ],
    deliverables: [
      'Features that ship and stay working',
      'Bug fixes with tests preventing recurrence',
      'Code review on other people’s work',
      'Technical design documents for larger changes',
    ],
    preparation: {
      estimatedMonthsMin: 6,
      estimatedMonthsMax: 12,
      scopeNote:
        'Estimated preparation period to cover programming fundamentals, data structures, version control, testing, one framework, and two substantial projects, at roughly 10–15 hours a week. Learning scope only — the entry-level market is competitive and hiring timelines vary substantially.',
    },
    interviewFormat: [
      'Coding screens, often algorithmic and timed',
      'A take-home project or live pairing exercise',
      'System design, usually lighter at entry level',
      'Behavioural rounds about collaboration and disagreement',
    ],
    portfolioExpectations: [
      'Two projects that do something real, deployed if possible',
      'Readable code with a real commit history',
      'A README explaining your decisions, not just setup instructions',
      'Tests — their presence is noticed and their absence more so',
    ],
    advantages: [
      'Very wide range of industries and problems',
      'Strong compensation and remote flexibility',
      'Skills are demonstrable without formal credentials',
      'Clear technical progression',
    ],
    challenges: [
      'Entry level is considerably more competitive than it was',
      'Interview processes are long and often test skills unlike the job',
      'Continuous learning is not optional',
      'Imposter syndrome is close to universal in the first year',
    ],
    enjoyIf: [
      'You like building things and seeing them used',
      'Debugging is a puzzle rather than a frustration',
      'You are comfortable not knowing and finding out',
    ],
    dislikeIf: [
      'You want to be close to business strategy',
      'Long stretches of focused solo work do not suit you',
      'You would find constant learning exhausting rather than energising',
    ],
    starterResourceIds: ['res-freecodecamp', 'res-yt-corey-python', 'res-yt-fcc-git'],
    experimentIds: ['exp-build-small-tool', 'exp-messy-pipeline'],
  },

  // ── Product Manager ────────────────────────────────────────────────────────
  {
    id: 'product-manager',
    whatItIs: [
      'You decide what gets built and why, then make that decision defensible to everyone affected by it. You have responsibility for the outcome and authority over almost nobody.',
      'Most of the job is communication: understanding problems, choosing between them, and keeping people aligned on a decision long after it was made.',
      'It is genuinely difficult to enter directly from graduation. Most people arrive from analytics, engineering, support, or operations.',
    ],
    typicalDay: [
      'You talk to three customers and hear three incompatible descriptions of the same problem.',
      'You cut scope on something the team is attached to, and explain why.',
      'You write a document that fails to land, then rewrite it.',
      'You check whether last month’s launch actually changed anything, and find it did not.',
    ],
    deliverables: [
      'A written product decision with its reasoning',
      'A prioritised roadmap and the tradeoffs behind it',
      'Requirements clear enough to be built from',
      'A launch read-out saying honestly whether it worked',
    ],
    preparation: {
      estimatedMonthsMin: 6,
      estimatedMonthsMax: 18,
      scopeNote:
        'Estimated preparation period to build product sense, user research basics, prioritisation frameworks, analytics literacy, and a portfolio of written product work, at roughly 8–10 hours a week. Learning scope only. Direct entry into product management from graduation is uncommon — most routes go through an adjacent role first, and timelines vary substantially.',
    },
    interviewFormat: [
      'Product sense: design or improve a product, live',
      'Prioritisation and tradeoff cases',
      'Analytical questions, including estimation',
      'Behavioural rounds focused on influence and conflict',
    ],
    portfolioExpectations: [
      'Written product analyses or teardowns showing your reasoning',
      'Evidence you can choose and defend one thing over another',
      'Any experience shipping something, in any capacity',
    ],
    advantages: [
      'Broad influence over what actually gets made',
      'Varied work spanning research, analysis, and communication',
      'Strong career progression and compensation',
    ],
    challenges: [
      'Very hard to enter directly at entry level',
      'Accountability without authority is genuinely difficult',
      'Success is diffuse — credit goes to the team, blame often does not',
      'Meeting-heavy, with fragmented time',
    ],
    enjoyIf: [
      'You like making decisions under uncertainty and living with them',
      'Persuading people is energising rather than draining',
      'You are comfortable being the least expert person in most rooms',
    ],
    dislikeIf: [
      'You want to build the thing yourself',
      'You need clear individual credit for your work',
      'Constant context switching would exhaust you',
    ],
    starterResourceIds: ['res-sqlbolt'],
    experimentIds: ['exp-pm-prioritise', 'exp-signup-funnel', 'exp-explain-to-a-human'],
  },

  // ── Technology Consultant ──────────────────────────────────────────────────
  {
    id: 'tech-consultant',
    whatItIs: [
      'You go into other organisations, work out what is wrong, and recommend what to change. You may also help implement it.',
      'Consulting firms are among the larger recruiters of recent graduates, and their training is structured — which makes this one of the more realistic direct-from-graduation routes on this list.',
      'The work is broad rather than deep, and it changes every few months.',
    ],
    typicalDay: [
      'You interview client staff to understand a process nobody has documented.',
      'You build a model in Excel that has to survive a partner’s questions.',
      'You rebuild a slide because the argument was not clear enough.',
      'You present to a client who disagrees with your conclusion.',
    ],
    deliverables: [
      'A diagnosis of the client’s problem, with evidence',
      'A recommendation and an implementation plan',
      'Financial or operational models',
      'Presentations to client leadership',
    ],
    preparation: {
      estimatedMonthsMin: 2,
      estimatedMonthsMax: 5,
      scopeNote:
        'Estimated preparation period to cover case interview practice, structured problem solving, Excel modelling, and presentation skills, at roughly 8–10 hours a week. Learning scope only — consulting recruitment runs on fixed annual cycles, which affects timing more than preparation does.',
    },
    interviewFormat: [
      'Case interviews, usually several rounds',
      'Estimation and mental arithmetic under time pressure',
      'Behavioural and fit interviews',
      'Occasionally a written case exercise',
    ],
    portfolioExpectations: [
      'Portfolios matter less here than case interview performance',
      'Evidence of structured thinking and leadership experience',
      'Any analysis where you drew a conclusion and defended it',
    ],
    advantages: [
      'One of the more accessible direct routes from graduation',
      'Structured training and rapid exposure to many industries',
      'Strong exit options after two to three years',
    ],
    challenges: [
      'Long hours are the norm rather than the exception',
      'Travel or client-site work at many firms',
      'You often leave before seeing whether your recommendation worked',
      'Recruitment is cycle-driven and highly competitive',
    ],
    enjoyIf: [
      'You like variety and get bored with the same problem',
      'You enjoy presenting and being questioned',
      'Structured problem solving appeals to you',
    ],
    dislikeIf: [
      'You want to own something long-term',
      'Work-life balance is a high priority right now',
      'You would rather go deep than broad',
    ],
    starterResourceIds: ['res-excel-learn'],
    experimentIds: ['exp-slow-process', 'exp-explain-to-a-human', 'exp-pm-prioritise'],
  },
]

const detailsById = new Map(careerPathDetails.map((detail) => [detail.id, detail]))

export function pathDetailById(id: string): CareerPathDetail | undefined {
  return detailsById.get(id)
}

/** The full path, when a write-up exists. Undefined means "not written yet". */
export function fullPathById(id: string): CareerPath | undefined {
  const summary = pathById(id)
  const detail = detailsById.get(id)
  if (!summary || !detail) return undefined
  return { ...summary, ...detail }
}

export function hasDetail(id: string): boolean {
  return detailsById.has(id)
}
