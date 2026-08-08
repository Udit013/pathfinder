import type { DailyQuestTemplate } from '@/types'

/**
 * Daily quests (§15).
 *
 * A quest is never "learn SQL". It is one concrete thing with a visible
 * outcome, an honest time estimate, and a smaller version for light days.
 *
 * Phase 1 seeds enough breadth for Today to work across the catalog; Phase 3
 * expands this to the full set and wires each quest to its roadmap node.
 */
export const dailyQuests: DailyQuestTemplate[] = [
  {
    id: 'q-sql-select',
    title: 'Ask a database its first question',
    objective: 'List every product in a table, then only the ones over $50.',
    kind: 'learn',
    skillIds: ['sql-basics'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst', 'business-analyst', 'marketing-analyst'],
    practises: ['SELECT', 'FROM', 'WHERE'],
    estimatedMinutes: 25,
    xp: 25,
    resourceIds: ['res-sqlbolt', 'res-mode-sql'],
    task:
      'Work through SQLBolt lessons 1–3. Then, without looking, write a query that returns product name and price for products priced above 50, sorted most expensive first.',
    lighterVariant: 'Just lesson 1. Write one SELECT statement from memory and stop there.',
  },
  {
    id: 'q-sql-groupby',
    title: 'Find the top 5 products by revenue',
    objective: 'Turn thousands of order rows into a five-row answer someone could act on.',
    kind: 'practice',
    skillIds: ['sql-basics', 'sql-joins'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst'],
    practises: ['SELECT', 'GROUP BY', 'ORDER BY', 'LIMIT'],
    estimatedMinutes: 25,
    xp: 25,
    resourceIds: ['res-sqlbolt', 'res-mode-sql'],
    task:
      'Given orders(product_id, quantity, unit_price), write one query returning the five products with the highest total revenue. Then write one sentence explaining what a business would do with that list.',
    lighterVariant: 'Write the query for total revenue per product. Skip the ranking and the sentence.',
  },
  {
    id: 'q-sql-joins',
    title: 'Answer a question that needs two tables',
    objective: 'Combine customers and orders to see which region actually spends the most.',
    kind: 'learn',
    skillIds: ['sql-joins'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'analytics-engineer', 'data-engineer'],
    practises: ['INNER JOIN', 'LEFT JOIN', 'GROUP BY', 'aliasing'],
    estimatedMinutes: 35,
    xp: 25,
    resourceIds: ['res-sqlbolt', 'res-mode-sql'],
    task:
      'Work through SQLBolt lessons 6–8. Then write a query joining customers to orders that returns total spend per region. Run it again with a LEFT JOIN and write down what changed and why.',
    lighterVariant: 'Read lesson 6 and write one INNER JOIN. The difference between join types can wait.',
  },
  {
    id: 'q-sheets-pivot',
    title: 'Make a messy sheet answer a question',
    objective: 'Build one pivot table that shows sales by month and category.',
    kind: 'practice',
    skillIds: ['spreadsheets'],
    careerPathIds: ['data-analyst', 'business-analyst', 'operations-analyst', 'financial-analyst'],
    practises: ['Pivot tables', 'Date grouping', 'SUMIFS'],
    estimatedMinutes: 25,
    xp: 25,
    resourceIds: ['res-excel-learn'],
    task:
      'Take any sales-style dataset. Build a pivot of revenue by month and category, then write the single most surprising thing you notice in it.',
    lighterVariant: 'Build the pivot. Skip the write-up.',
  },
  {
    id: 'q-python-first-analysis',
    title: 'Load a dataset and describe it in Python',
    objective: 'Get from a CSV file to five sentences about what is in it.',
    kind: 'learn',
    skillIds: ['python-basics', 'pandas'],
    careerPathIds: ['data-analyst', 'data-scientist', 'data-engineer', 'product-analyst'],
    practises: ['read_csv', 'head', 'info', 'describe', 'value_counts'],
    estimatedMinutes: 40,
    xp: 25,
    resourceIds: ['res-kaggle-pandas', 'res-python-docs'],
    task:
      'Load a CSV with pandas. Report its shape, which columns have missing values, and the distribution of one categorical column. Write five plain sentences describing the dataset to someone who has never seen it.',
    lighterVariant: 'Load the file and run .head() and .info(). That is a real start.',
  },
  {
    id: 'q-viz-one-chart',
    title: 'Make one chart that makes its point without explanation',
    objective: 'A chart a stranger could read correctly in five seconds.',
    kind: 'practice',
    skillIds: ['data-viz'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst', 'marketing-analyst'],
    practises: ['Chart choice', 'Labelling', 'Removing clutter', 'Titling for the takeaway'],
    estimatedMinutes: 30,
    xp: 25,
    resourceIds: ['res-ft-visual-vocabulary'],
    task:
      'Pick a finding you already have. Build one chart for it, then remove everything that is not helping. Title it with the takeaway rather than the contents — "Revenue fell in Q3" not "Revenue by quarter".',
    lighterVariant: 'Just retitle a chart you already made so the title states the takeaway.',
  },
  {
    id: 'q-git-first-repo',
    title: 'Put something of yours on GitHub',
    objective: 'One repository, one README, one commit that means something.',
    kind: 'build',
    skillIds: ['version-control'],
    careerPathIds: ['software-engineer', 'data-engineer', 'data-scientist', 'analytics-engineer', 'backend-engineer'],
    practises: ['git init', 'commit', 'push', 'Writing a README'],
    estimatedMinutes: 30,
    xp: 25,
    resourceIds: ['res-git-docs', 'res-yt-fcc-git'],
    task:
      'Create a repository for anything you have written — even a single script. Add a README that says what it does and why you made it, then push it.',
    lighterVariant: 'Create the repo and add a two-line README. Push it. Done.',
  },
  {
    id: 'q-resume-one-bullet',
    title: 'Rewrite one resume bullet so it says what happened',
    objective: 'One bullet with an action, a method, and a result.',
    kind: 'job_search',
    skillIds: ['resume-writing'],
    careerPathIds: [],
    practises: ['Specificity', 'Naming the method', 'Stating the outcome'],
    estimatedMinutes: 20,
    xp: 25,
    resourceIds: [],
    task:
      'Take your weakest resume bullet. Rewrite it as: what you did, how you did it, what changed as a result. If you do not know the result, say what it enabled instead. Do not invent a number.',
    lighterVariant: 'Read your bullets and mark the weakest one. Rewriting it can be tomorrow.',
  },
  {
    id: 'q-reflect-week',
    title: 'Notice what gave you energy this week',
    objective: 'Two sentences that will be useful to you in a month.',
    kind: 'reflect',
    skillIds: [],
    careerPathIds: [],
    practises: ['Noticing patterns in your own reactions'],
    estimatedMinutes: 10,
    xp: 15,
    resourceIds: [],
    task:
      'Write down one thing this week that you lost track of time doing, and one thing you avoided. No conclusions needed — just the observation.',
    lighterVariant: 'One sentence. Either one.',
  },
]

export function questById(id: string): DailyQuestTemplate | undefined {
  return dailyQuests.find((quest) => quest.id === id)
}
