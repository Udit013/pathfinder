import type { InterviewQuestion } from '@/types'

/**
 * Interview questions (§19).
 *
 * `whatGoodLooksLike` is a list of things to reason about — never a model
 * answer. A memorised answer collapses under the first follow-up, and the
 * follow-ups are listed precisely so you practise the part that actually
 * decides the outcome.
 *
 * `stage` is the stage at which a question is worth attempting, not a
 * difficulty label.
 */
export const interviewQuestions: InterviewQuestion[] = [
  // ── SQL ────────────────────────────────────────────────────────────────────
  {
    id: 'q-sql-join-types',
    track: 'sql',
    stage: 'understand',
    prompt: 'What is the difference between an INNER JOIN and a LEFT JOIN, and when does it matter?',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Which rows survive each join, said plainly',
      'A concrete case where the choice changes the answer — customers with no orders is the classic',
      'Noticing that a LEFT JOIN produces NULLs you then have to handle',
      'Mentioning that a wrong join silently changes a number rather than erroring',
    ],
    followUps: [
      'What happens to your COUNT if you use the wrong one?',
      'How would you check which one you needed?',
      'When would a FULL OUTER JOIN be the right call?',
    ],
    skillIds: ['sql-joins'],
  },
  {
    id: 'q-sql-fanout',
    track: 'sql',
    stage: 'solve',
    prompt:
      'Your revenue total doubled after you joined in a second table. What happened, and how do you fix it?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Naming fan-out: the join key is not unique on one side',
      'Checking the grain of each table before joining',
      'Fixing it by aggregating first, or by joining on a genuinely unique key',
      'A way to catch it automatically next time — a uniqueness assertion',
    ],
    followUps: [
      'How would you prove the grain is what you think it is?',
      'Would a SELECT DISTINCT fix this? Why is that usually the wrong answer?',
    ],
    skillIds: ['sql-joins', 'testing-data'],
  },
  {
    id: 'q-sql-window',
    track: 'sql',
    stage: 'solve',
    prompt:
      'Write a query returning each customer’s most recent order, including the order amount.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'A window function — ROW_NUMBER partitioned by customer, ordered by date descending',
      'Filtering to row number 1 in an outer query or CTE',
      'Handling ties explicitly, or saying out loud that you are ignoring them',
      'Recognising that GROUP BY MAX(date) alone cannot bring the amount along',
    ],
    followUps: [
      'Why does the GROUP BY approach fail here?',
      'How would you get the most recent two orders instead?',
    ],
    skillIds: ['sql-advanced'],
  },
  {
    id: 'q-sql-explain-to-stakeholder',
    track: 'sql',
    stage: 'explain',
    prompt:
      'Walk me through a query you have written, as if I do not know SQL but do know the business.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Leading with the question the query answers, not its syntax',
      'Describing the logic as steps, not as clauses',
      'Naming the assumption you had to make',
      'Stopping before over-explaining',
    ],
    followUps: ['What would you change if the data were ten times bigger?', 'What could make this wrong?'],
    skillIds: ['sql-joins', 'stakeholder-comms'],
  },

  // ── Statistics ─────────────────────────────────────────────────────────────
  {
    id: 'q-stats-pvalue',
    track: 'statistics',
    stage: 'understand',
    prompt: 'Explain a p-value to someone non-technical.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Framing it as: how surprising this result would be if nothing were really going on',
      'Explicitly NOT saying "the probability the result is true"',
      'Mentioning that a threshold is a convention, not a law of nature',
      'Noting that significance and importance are different things',
    ],
    followUps: [
      'Is p = 0.049 meaningfully different from p = 0.051?',
      'What does a non-significant result actually tell you?',
    ],
    skillIds: ['inferential-stats'],
  },
  {
    id: 'q-stats-mean-median',
    track: 'statistics',
    stage: 'understand',
    prompt: 'When would you report a median instead of a mean?',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Skew and outliers, with a real example — income and salary are the obvious ones',
      'Recognising that the "right" one depends on the decision being made',
      'Willingness to report both when they disagree',
    ],
    followUps: ['What if someone insists on the mean because it is higher?'],
    skillIds: ['descriptive-stats'],
  },
  {
    id: 'q-stats-ab-early-stop',
    track: 'statistics',
    stage: 'explain',
    prompt:
      'Your A/B test hits significance on day two. The PM wants to ship. What do you say?',
    difficulty: 'advanced',
    whatGoodLooksLike: [
      'Peeking inflates false positives — checking repeatedly is not free',
      'Pre-committing to a sample size or duration before the test starts',
      'Novelty effects and weekday/weekend cycles',
      'Saying it in a way that does not sound like blocking for its own sake',
    ],
    followUps: [
      'What if they ship anyway — what would you monitor?',
      'How would you have set this up to avoid the argument?',
    ],
    skillIds: ['experimentation', 'stakeholder-comms'],
  },

  // ── Product analytics ──────────────────────────────────────────────────────
  {
    id: 'q-pa-metric-drop',
    track: 'product_analytics',
    stage: 'solve',
    prompt: 'Daily active users dropped 15% overnight. How do you investigate?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Checking whether it is real first — tracking breaks more often than products do',
      'Segmenting by platform, geography, version, and acquisition source',
      'Considering external causes: a holiday, an outage, a release',
      'Separating "who stopped coming" from "who never arrived"',
    ],
    followUps: [
      'What if only iOS dropped?',
      'What if it recovered by itself the next day — do you still investigate?',
    ],
    skillIds: ['funnel-analysis', 'product-sense'],
  },
  {
    id: 'q-pa-define-metric',
    track: 'product_analytics',
    stage: 'understand',
    prompt: 'How would you define "active user" for a note-taking app?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Asking what decision the metric will drive before defining it',
      'Choosing a window and justifying it against how often people would genuinely use it',
      'Distinguishing an action that signals value from merely opening the app',
      'Naming edge cases: background sync, a user with the app open all week',
    ],
    followUps: ['How would this differ for a payroll app used once a month?'],
    skillIds: ['metric-definition', 'product-sense'],
  },
  {
    id: 'q-pa-tradeoff',
    track: 'product_analytics',
    stage: 'explain',
    prompt:
      'A change increases signups by 10% and decreases 30-day retention by 5%. Ship it?',
    difficulty: 'advanced',
    whatGoodLooksLike: [
      'Working out the net effect on retained users, not just comparing percentages',
      'Asking who the extra signups are — worse-fit users would explain both numbers',
      'Considering which metric the business is actually optimising this quarter',
      'Giving an answer with its condition attached, rather than refusing to answer',
    ],
    followUps: ['What would you need to know to decide?', 'What would you measure after shipping?'],
    skillIds: ['product-sense', 'experimentation'],
  },

  // ── Data analysis ──────────────────────────────────────────────────────────
  {
    id: 'q-da-vague-request',
    track: 'data_analysis',
    stage: 'practice',
    prompt: 'A stakeholder asks: "Can you pull me the sales numbers?" What do you do?',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Asking what decision it is for — that determines everything else',
      'Clarifying period, grain, and which definition of sales',
      'Asking when they need it and how they will use it',
      'Offering a first version quickly rather than disappearing for two days',
    ],
    followUps: ['What if they say "just give me everything"?'],
    skillIds: ['stakeholder-comms', 'business-acumen'],
  },
  {
    id: 'q-da-suspicious-result',
    track: 'data_analysis',
    stage: 'solve',
    prompt: 'Your analysis says a small region drives 60% of revenue. Do you send it?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Treating a surprising result as suspicious before treating it as a finding',
      'Checking for duplicates, a bad join, a currency or unit mismatch',
      'Validating against a known total from another source',
      'Sending it with the caveat if it survives checking — not sitting on it',
    ],
    followUps: ['How long do you spend verifying before you say something?'],
    skillIds: ['descriptive-stats', 'business-acumen'],
  },

  // ── Machine learning ───────────────────────────────────────────────────────
  {
    id: 'q-ml-imbalanced',
    track: 'machine_learning',
    stage: 'understand',
    prompt: 'Your fraud model is 99% accurate. Is it any good?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Noting that with 1% fraud, predicting "never" also scores 99%',
      'Moving to precision, recall, and the cost of each error type',
      'Asking what the model is used for before choosing a metric',
      'Mentioning the threshold as a business decision, not a technical default',
    ],
    followUps: ['Which is worse here, a false positive or a false negative?'],
    skillIds: ['model-evaluation'],
  },
  {
    id: 'q-ml-leakage',
    track: 'machine_learning',
    stage: 'solve',
    prompt: 'Your model scores 0.99 AUC on the test set. What do you check first?',
    difficulty: 'advanced',
    whatGoodLooksLike: [
      'Suspecting leakage immediately rather than celebrating',
      'Looking for a feature that encodes the target or is only known afterwards',
      'Checking the split — especially time-based data split randomly',
      'Explaining why an unrealistically good score is bad news',
    ],
    followUps: ['How would you build the split for time-series data?'],
    skillIds: ['model-evaluation', 'ml-foundations'],
  },
  {
    id: 'q-ml-design',
    track: 'machine_learning',
    stage: 'explain',
    prompt: 'How would you build a system to recommend what a user reads next?',
    difficulty: 'advanced',
    whatGoodLooksLike: [
      'Asking what success means before designing anything',
      'Starting from a simple baseline — popularity, or most recent',
      'Naming the cold-start problem for new users and new items',
      'Saying how you would evaluate it offline and online',
    ],
    followUps: ['What if you have no interaction data yet?', 'How would you avoid a filter bubble?'],
    skillIds: ['ml-foundations', 'model-evaluation'],
  },

  // ── Data engineering ───────────────────────────────────────────────────────
  {
    id: 'q-de-idempotent',
    track: 'data_engineering',
    stage: 'understand',
    prompt: 'What does it mean for a pipeline to be idempotent, and why does it matter?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Running it twice produces the same result as running it once',
      'Why it matters: retries and backfills are normal, not exceptional',
      'How you achieve it — merge on a key, or delete-and-reinsert a partition',
      'What goes wrong without it: silent duplicates nobody notices for a month',
    ],
    followUps: ['How would you make an append-only load idempotent?'],
    skillIds: ['etl-pipelines'],
  },
  {
    id: 'q-de-bad-row',
    track: 'data_engineering',
    stage: 'explain',
    prompt: 'A daily file arrives with 3% malformed rows. What should the pipeline do?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Laying out the options: drop, fail the batch, or quarantine',
      'Choosing quarantine and saying why — the data is kept and someone finds out',
      'Alerting on the rate, not on every row',
      'Recognising it is a business decision as much as a technical one',
    ],
    followUps: ['What if it were 40% instead of 3%?', 'Who gets the alert, and what do they do?'],
    skillIds: ['etl-pipelines', 'testing-data'],
  },
  {
    id: 'q-de-schema',
    track: 'data_engineering',
    stage: 'solve',
    prompt: 'Design the schema for an online store’s order data.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Naming the fact table and stating its grain out loud',
      'Dimensions: customer, product, date, and why they are separate',
      'Handling a product whose price changes over time',
      'Choosing keys and saying what enforces uniqueness',
    ],
    followUps: ['What if a customer changes address — do you overwrite it?'],
    skillIds: ['data-modeling'],
  },

  // ── General technical ──────────────────────────────────────────────────────
  {
    id: 'q-gt-stuck',
    track: 'general_technical',
    stage: 'practice',
    prompt: 'You are stuck on a live coding problem with ten minutes left. What do you do?',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Saying out loud what you have tried and where the blockage is',
      'Falling back to a brute-force solution that works',
      'Asking a clarifying question rather than going silent',
      'Understanding that being stuck is expected — going quiet is what hurts',
    ],
    followUps: ['What would you do differently with more time?'],
    skillIds: ['debugging', 'interview-practice'],
  },
  {
    id: 'q-gt-complexity',
    track: 'general_technical',
    stage: 'solve',
    prompt: 'Find whether any two numbers in a list add to a target. Walk me through your approach.',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Stating the brute-force approach and its cost first',
      'Improving it with a hash set, and saying why that helps',
      'Naming the time and space complexity of both',
      'Handling duplicates and the empty list before being asked',
    ],
    followUps: ['What if the list does not fit in memory?', 'What if you needed three numbers?'],
    skillIds: ['data-structures'],
  },

  // ── Behavioural ────────────────────────────────────────────────────────────
  {
    id: 'q-bx-about-yourself',
    track: 'behavioral',
    stage: 'practice',
    prompt: 'Tell me about yourself.',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Ninety seconds, not five minutes',
      'A shape: where you came from, what you have been building, what you are looking for',
      'Pointing at one concrete thing you made rather than listing adjectives',
      'Ending somewhere that invites a follow-up',
    ],
    followUps: ['What made you move toward this field?', 'Which part of that did you enjoy most?'],
    skillIds: ['interview-practice'],
  },
  {
    id: 'q-bx-hard-problem',
    track: 'behavioral',
    stage: 'practice',
    prompt: 'Tell me about a difficult problem you solved.',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'A real situation with enough context to understand the difficulty',
      'What you specifically did — "we" hides you',
      'The outcome, stated honestly even if it was partial',
      'What you would do differently, without self-flagellation',
    ],
    followUps: ['What would you do differently?', 'What did you try that did not work?'],
    skillIds: ['interview-practice', 'writing-clearly'],
  },
  {
    id: 'q-bx-disagreement',
    track: 'behavioral',
    stage: 'solve',
    prompt: 'Tell me about a time you disagreed with someone.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'A genuine disagreement, not a fake one where you were obviously right',
      'How you established what you each actually believed',
      'Changing your mind, or not, for a stated reason',
      'Being fair to the other person in your telling of it',
    ],
    followUps: ['What if they had still disagreed?', 'How did the relationship end up?'],
    skillIds: ['stakeholder-comms', 'interview-practice'],
  },
  {
    id: 'q-bx-no-experience',
    track: 'behavioral',
    stage: 'practice',
    prompt: 'You have no industry experience. Why should we hire you?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Not apologising, and not overclaiming either',
      'Pointing at what you have actually done — projects, analyses, things that exist',
      'Evidence you learn fast, described concretely',
      'Genuine interest in this role rather than in any job',
    ],
    followUps: ['What is the hardest thing you have taught yourself?'],
    skillIds: ['interview-practice'],
  },
  {
    id: 'q-bx-failure',
    track: 'behavioral',
    stage: 'solve',
    prompt: 'Tell me about a time you failed.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'A real failure with real consequences — not "I care too much"',
      'Owning your part without theatrical self-blame',
      'What specifically changed in how you work afterwards',
      'Evidence the lesson stuck, ideally a later example',
    ],
    followUps: ['Has that situation come up again since?'],
    skillIds: ['interview-practice'],
  },
  {
    id: 'q-bx-questions-for-us',
    track: 'behavioral',
    stage: 'explain',
    prompt: 'What questions do you have for us?',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Having some — "no questions" reads as indifference',
      'Questions about the work: what the first project would be, how success is judged',
      'Something specific to this company that shows you looked',
      'At least one question you genuinely want the answer to',
    ],
    followUps: [],
    skillIds: ['interview-practice'],
  },

  // ── Case studies ───────────────────────────────────────────────────────────
  {
    id: 'q-cs-declining-margins',
    track: 'case_study',
    stage: 'solve',
    prompt: 'A retail client’s margins have fallen for three quarters. How would you approach it?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Clarifying questions before any analysis',
      'A structure: margin as revenue minus cost, then breaking each down',
      'Testing branches against data rather than guessing',
      'Saying where you would look first and why',
    ],
    followUps: ['What if costs are flat?', 'What data would you ask for on day one?'],
    skillIds: ['structured-problem-solving', 'business-acumen'],
  },
  {
    id: 'q-cs-estimate',
    track: 'case_study',
    stage: 'practice',
    prompt: 'How many coffee shops are there in a city of two million people?',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Building up from stated assumptions rather than guessing a number',
      'Saying each assumption aloud so it can be challenged',
      'Sanity-checking the result against something you know',
      'Being comfortable that the answer is approximate — that is the point',
    ],
    followUps: ['Which assumption is your answer most sensitive to?'],
    skillIds: ['structured-problem-solving'],
  },

  // ── Python ─────────────────────────────────────────────────────────────────
  {
    id: 'q-py-clean-column',
    track: 'python',
    stage: 'solve',
    prompt:
      'A price column contains "$1,299.00", " 45.5 ", and empty strings. Turn it into numbers.',
    difficulty: 'beginner',
    whatGoodLooksLike: [
      'Stripping whitespace and currency symbols before converting',
      'Deciding what an empty string becomes — and saying why',
      'Using a conversion that surfaces failures rather than hiding them',
      'Checking afterwards how many values failed to convert',
    ],
    followUps: ['What if some rows used a comma as the decimal separator?'],
    skillIds: ['pandas', 'python-basics'],
  },
  {
    id: 'q-py-groupby',
    track: 'python',
    stage: 'practice',
    prompt: 'Given a DataFrame of orders, find each region’s top product by revenue.',
    difficulty: 'intermediate',
    whatGoodLooksLike: [
      'Grouping by region and product to aggregate first',
      'Then sorting or ranking within region to take the top',
      'Handling ties, or naming that you are ignoring them',
      'Checking the output row count matches the number of regions',
    ],
    followUps: ['How would you get the top three per region?'],
    skillIds: ['pandas'],
  },
]

export function questionById(id: string): InterviewQuestion | undefined {
  return interviewQuestions.find((question) => question.id === id)
}

export function questionsForTrack(track: InterviewQuestion['track']): InterviewQuestion[] {
  return interviewQuestions.filter((question) => question.track === track)
}
