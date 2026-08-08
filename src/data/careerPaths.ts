import type { CareerCategory, CareerCategoryId, CareerPathSummary } from '@/types'

/**
 * The career catalog (§9).
 *
 * This is the identity layer only — enough to browse, group, compare, and say
 * "I'm curious about that". The long-form write-ups (§10) and the market data
 * (§29) are separate files, added per path, so nothing here has to be invented
 * to fill a shape.
 *
 * Skill ids referenced here are defined in `./skills.ts` (Phase 3). Ids are
 * stable and safe to store in user data.
 */

export const careerCategories: CareerCategory[] = [
  {
    id: 'data',
    label: 'Data',
    blurb:
      'Roles built around questions and evidence. They differ far more than the job titles suggest.',
    openEnded: false,
  },
  {
    id: 'software',
    label: 'Software & infrastructure',
    blurb: 'Roles where the main output is a working system that other people rely on.',
    openEnded: false,
  },
  {
    id: 'business',
    label: 'Business & product',
    blurb:
      'Roles that sit between people and technology. Technical enough to be credible, not primarily about writing code.',
    openEnded: false,
  },
  {
    id: 'beyond_tech',
    label: 'Explore beyond tech',
    blurb:
      'Your degree does not oblige you to stay in technology. These are starting points, not a complete list — and you can add your own.',
    openEnded: true,
  },
]

export function categoryById(id: CareerCategoryId): CareerCategory {
  const found = careerCategories.find((category) => category.id === id)
  if (!found) throw new Error(`Unknown career category: ${id}`)
  return found
}

export const careerPathSummaries: CareerPathSummary[] = [
  // ── Data ───────────────────────────────────────────────────────────────────
  {
    id: 'data-analyst',
    categoryId: 'data',
    title: 'Data Analyst',
    tagline: 'Answer business questions with data, and make the answer easy to act on.',
    entryLevelTitles: ['Data Analyst', 'Junior Data Analyst', 'Reporting Analyst', 'Insights Analyst'],
    commonTools: ['SQL', 'Excel / Google Sheets', 'Python or R', 'Tableau', 'Power BI'],
    coreSkillIds: ['sql-basics', 'sql-joins', 'spreadsheets', 'descriptive-stats', 'data-viz', 'business-acumen', 'stakeholder-comms'],
    adjacentPathIds: ['bi-analyst', 'product-analyst', 'business-analyst', 'analytics-engineer'],
  },
  {
    id: 'bi-analyst',
    categoryId: 'data',
    title: 'BI Analyst',
    tagline: 'Build the dashboards and metric definitions a whole company reads every day.',
    entryLevelTitles: ['BI Analyst', 'Business Intelligence Developer', 'Reporting Analyst'],
    commonTools: ['SQL', 'Power BI', 'Tableau', 'Looker', 'dbt'],
    coreSkillIds: ['sql-basics', 'sql-joins', 'data-modeling', 'bi-tools', 'data-viz', 'metric-definition'],
    adjacentPathIds: ['data-analyst', 'analytics-engineer', 'data-engineer'],
  },
  {
    id: 'product-analyst',
    categoryId: 'data',
    title: 'Product Analyst',
    tagline: 'Work out what people actually do in a product, and what to change because of it.',
    entryLevelTitles: ['Product Analyst', 'Product Data Analyst', 'Growth Analyst'],
    commonTools: ['SQL', 'Amplitude / Mixpanel', 'Python', 'A/B testing tools'],
    coreSkillIds: ['sql-basics', 'sql-joins', 'funnel-analysis', 'experimentation', 'inferential-stats', 'product-sense'],
    adjacentPathIds: ['data-analyst', 'product-manager', 'data-scientist'],
  },
  {
    id: 'data-scientist',
    categoryId: 'data',
    title: 'Data Scientist',
    tagline: 'Use statistics and modelling to answer questions that a query alone cannot.',
    entryLevelTitles: ['Data Scientist', 'Junior Data Scientist', 'Applied Scientist (entry)', 'Decision Scientist'],
    commonTools: ['Python', 'pandas', 'scikit-learn', 'SQL', 'Jupyter'],
    coreSkillIds: ['python-basics', 'pandas', 'inferential-stats', 'ml-foundations', 'model-evaluation', 'experimentation', 'stakeholder-comms'],
    adjacentPathIds: ['ml-engineer', 'product-analyst', 'data-analyst'],
  },
  {
    id: 'data-engineer',
    categoryId: 'data',
    title: 'Data Engineer',
    tagline: 'Build the pipelines and storage that everyone else’s analysis depends on.',
    entryLevelTitles: ['Data Engineer', 'Junior Data Engineer', 'ETL Developer', 'Analytics Platform Engineer'],
    commonTools: ['Python', 'SQL', 'Airflow', 'Spark', 'dbt', 'Snowflake / BigQuery', 'Docker'],
    coreSkillIds: ['python-basics', 'sql-advanced', 'data-modeling', 'etl-pipelines', 'cloud-basics', 'version-control', 'orchestration'],
    adjacentPathIds: ['analytics-engineer', 'backend-engineer', 'cloud-devops'],
  },
  {
    id: 'analytics-engineer',
    categoryId: 'data',
    title: 'Analytics Engineer',
    tagline: 'Turn raw tables into trustworthy, documented datasets people can self-serve.',
    entryLevelTitles: ['Analytics Engineer', 'Junior Analytics Engineer', 'BI Engineer'],
    commonTools: ['dbt', 'SQL', 'Snowflake / BigQuery', 'Git', 'Looker'],
    coreSkillIds: ['sql-advanced', 'data-modeling', 'dbt', 'version-control', 'testing-data', 'metric-definition'],
    adjacentPathIds: ['data-engineer', 'bi-analyst', 'data-analyst'],
  },
  {
    id: 'ml-engineer',
    categoryId: 'data',
    title: 'ML Engineer',
    tagline: 'Get models out of notebooks and into something that runs reliably in production.',
    entryLevelTitles: ['ML Engineer', 'Machine Learning Engineer I', 'MLOps Engineer (entry)'],
    commonTools: ['Python', 'PyTorch / TensorFlow', 'Docker', 'Kubernetes', 'MLflow', 'cloud ML platforms'],
    coreSkillIds: ['python-intermediate', 'ml-foundations', 'model-evaluation', 'apis', 'docker', 'cloud-basics', 'mlops'],
    adjacentPathIds: ['data-scientist', 'ai-engineer', 'backend-engineer'],
  },
  {
    id: 'ai-engineer',
    categoryId: 'data',
    title: 'AI Engineer',
    tagline: 'Build products on top of existing models — retrieval, tools, evaluation, guardrails.',
    entryLevelTitles: ['AI Engineer', 'Applied AI Engineer', 'LLM Application Engineer'],
    commonTools: ['Python or TypeScript', 'model APIs', 'vector databases', 'evaluation frameworks'],
    coreSkillIds: ['python-intermediate', 'apis', 'prompt-engineering', 'rag-systems', 'eval-design', 'cloud-basics'],
    adjacentPathIds: ['ml-engineer', 'backend-engineer', 'software-engineer'],
  },

  // ── Software & infrastructure ──────────────────────────────────────────────
  {
    id: 'software-engineer',
    categoryId: 'software',
    title: 'Software Engineer',
    tagline: 'Build and maintain software that other people depend on daily.',
    entryLevelTitles: ['Software Engineer', 'Software Engineer I', 'Associate Software Engineer', 'Graduate Software Engineer'],
    commonTools: ['A primary language', 'Git', 'testing frameworks', 'CI', 'cloud services'],
    coreSkillIds: ['programming-fundamentals', 'data-structures', 'version-control', 'testing-code', 'debugging', 'apis', 'system-design-intro'],
    adjacentPathIds: ['backend-engineer', 'frontend-engineer', 'cloud-devops'],
  },
  {
    id: 'backend-engineer',
    categoryId: 'software',
    title: 'Backend Engineer',
    tagline: 'Own the data, the logic, and the APIs behind whatever the user sees.',
    entryLevelTitles: ['Backend Engineer', 'Software Engineer (Backend)', 'API Developer'],
    commonTools: ['Python / Java / Go / Node', 'PostgreSQL', 'Redis', 'Docker', 'cloud services'],
    coreSkillIds: ['programming-fundamentals', 'data-structures', 'databases', 'apis', 'testing-code', 'docker', 'system-design-intro'],
    adjacentPathIds: ['software-engineer', 'data-engineer', 'cloud-devops'],
  },
  {
    id: 'frontend-engineer',
    categoryId: 'software',
    title: 'Frontend Engineer',
    tagline: 'Build the part people actually touch, and make it fast and accessible.',
    entryLevelTitles: ['Frontend Engineer', 'Software Engineer (Frontend)', 'UI Engineer'],
    commonTools: ['TypeScript', 'React or similar', 'CSS', 'browser devtools', 'testing libraries'],
    coreSkillIds: ['programming-fundamentals', 'html-css', 'javascript', 'react', 'accessibility', 'testing-code', 'version-control'],
    adjacentPathIds: ['software-engineer', 'solutions-engineer'],
  },
  {
    id: 'cloud-devops',
    categoryId: 'software',
    title: 'Cloud / DevOps Engineer',
    tagline: 'Make deployment, scaling, and recovery boring — on purpose.',
    entryLevelTitles: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer I', 'Platform Engineer (entry)'],
    commonTools: ['AWS / Azure / GCP', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    coreSkillIds: ['linux-cli', 'networking-basics', 'cloud-basics', 'docker', 'infrastructure-as-code', 'ci-cd', 'observability'],
    adjacentPathIds: ['backend-engineer', 'data-engineer', 'cybersecurity'],
  },
  {
    id: 'cybersecurity',
    categoryId: 'software',
    title: 'Cybersecurity Analyst',
    tagline: 'Find and reduce the ways a system can be misused, before someone else does.',
    entryLevelTitles: ['Security Analyst', 'SOC Analyst', 'Information Security Analyst', 'GRC Analyst'],
    commonTools: ['SIEM platforms', 'Linux', 'Python scripting', 'network analysis tools'],
    coreSkillIds: ['networking-basics', 'linux-cli', 'security-fundamentals', 'threat-detection', 'scripting', 'risk-communication'],
    adjacentPathIds: ['cloud-devops', 'software-engineer'],
  },

  // ── Business & product ─────────────────────────────────────────────────────
  {
    id: 'business-analyst',
    categoryId: 'business',
    title: 'Business Analyst',
    tagline: 'Work out why a process is slow or expensive, and what should change.',
    entryLevelTitles: ['Business Analyst', 'Junior Business Analyst', 'Process Analyst', 'Operations Analyst'],
    commonTools: ['SQL', 'Excel', 'process mapping tools', 'Jira', 'BI tools'],
    coreSkillIds: ['sql-basics', 'spreadsheets', 'requirements-gathering', 'process-mapping', 'business-acumen', 'stakeholder-comms'],
    adjacentPathIds: ['data-analyst', 'product-manager', 'tech-consultant', 'product-ops'],
  },
  {
    id: 'product-manager',
    categoryId: 'business',
    title: 'Product Manager',
    tagline: 'Decide what gets built and why, then make that decision defensible.',
    entryLevelTitles: ['Associate Product Manager', 'Product Manager I', 'Product Owner'],
    commonTools: ['Analytics tools', 'Jira / Linear', 'Figma (reading, not designing)', 'SQL (basic)'],
    coreSkillIds: ['product-sense', 'user-research', 'prioritization', 'funnel-analysis', 'writing-clearly', 'stakeholder-comms'],
    adjacentPathIds: ['product-analyst', 'product-ops', 'business-analyst', 'tpm'],
  },
  {
    id: 'product-ops',
    categoryId: 'business',
    title: 'Product Operations',
    tagline: 'Make a product team’s process, data, and feedback loops actually function.',
    entryLevelTitles: ['Product Operations Associate', 'Product Ops Analyst', 'Program Coordinator'],
    commonTools: ['Analytics tools', 'automation tools', 'documentation platforms', 'SQL (basic)'],
    coreSkillIds: ['process-mapping', 'spreadsheets', 'writing-clearly', 'stakeholder-comms', 'metric-definition'],
    adjacentPathIds: ['product-manager', 'business-analyst', 'tpm'],
  },
  {
    id: 'tpm',
    categoryId: 'business',
    title: 'Technical Program Manager',
    tagline: 'Keep complicated, cross-team technical work moving and honest about risk.',
    entryLevelTitles: ['Program Manager', 'Associate TPM', 'Project Coordinator (Technical)'],
    commonTools: ['Jira', 'roadmapping tools', 'dashboards', 'documentation platforms'],
    coreSkillIds: ['project-management', 'risk-communication', 'system-design-intro', 'writing-clearly', 'stakeholder-comms'],
    adjacentPathIds: ['product-manager', 'product-ops', 'tech-consultant'],
  },
  {
    id: 'tech-consultant',
    categoryId: 'business',
    title: 'Technology Consultant',
    tagline: 'Go into other organisations, diagnose the problem, and recommend a change.',
    entryLevelTitles: ['Technology Consultant', 'Business Technology Analyst', 'Associate Consultant'],
    commonTools: ['Excel', 'PowerPoint', 'SQL', 'BI tools', 'client platforms'],
    coreSkillIds: ['business-acumen', 'structured-problem-solving', 'spreadsheets', 'presenting', 'requirements-gathering'],
    adjacentPathIds: ['business-analyst', 'solutions-engineer', 'tpm'],
  },
  {
    id: 'solutions-engineer',
    categoryId: 'business',
    title: 'Solutions Engineer',
    tagline: 'Be the technical person in the room while someone decides whether to buy.',
    entryLevelTitles: ['Solutions Engineer', 'Sales Engineer (entry)', 'Technical Account Manager', 'Implementation Engineer'],
    commonTools: ['The product being sold', 'APIs', 'SQL', 'demo environments'],
    coreSkillIds: ['apis', 'presenting', 'debugging', 'stakeholder-comms', 'business-acumen'],
    adjacentPathIds: ['tech-consultant', 'frontend-engineer', 'product-manager'],
  },

  // ── Beyond tech (explicitly non-exhaustive) ────────────────────────────────
  {
    id: 'operations-analyst',
    categoryId: 'beyond_tech',
    title: 'Operations Analyst',
    tagline: 'Make the physical or logistical side of a business run better.',
    entryLevelTitles: ['Operations Analyst', 'Supply Chain Analyst', 'Logistics Analyst'],
    commonTools: ['Excel', 'SQL', 'ERP systems', 'BI tools'],
    coreSkillIds: ['spreadsheets', 'sql-basics', 'process-mapping', 'descriptive-stats', 'business-acumen'],
    adjacentPathIds: ['business-analyst', 'data-analyst'],
  },
  {
    id: 'financial-analyst',
    categoryId: 'beyond_tech',
    title: 'Financial Analyst',
    tagline: 'Model what money is likely to do, and explain the assumptions behind it.',
    entryLevelTitles: ['Financial Analyst', 'FP&A Analyst', 'Revenue Analyst'],
    commonTools: ['Excel', 'SQL', 'financial planning software', 'BI tools'],
    coreSkillIds: ['spreadsheets', 'financial-modeling', 'descriptive-stats', 'business-acumen', 'presenting'],
    adjacentPathIds: ['business-analyst', 'data-analyst', 'operations-analyst'],
  },
  {
    id: 'marketing-analyst',
    categoryId: 'beyond_tech',
    title: 'Marketing Analytics',
    tagline: 'Work out which spending actually caused growth, and which just correlated with it.',
    entryLevelTitles: ['Marketing Analyst', 'Growth Analyst', 'CRM Analyst', 'Web Analyst'],
    commonTools: ['SQL', 'GA4', 'Excel', 'attribution tools', 'BI tools'],
    coreSkillIds: ['sql-basics', 'descriptive-stats', 'experimentation', 'funnel-analysis', 'data-viz'],
    adjacentPathIds: ['product-analyst', 'data-analyst'],
  },
  {
    id: 'research-analyst',
    categoryId: 'beyond_tech',
    title: 'Research (applied / policy / UX)',
    tagline: 'Design a study that answers a question people will make decisions on.',
    entryLevelTitles: ['Research Assistant', 'Research Analyst', 'UX Researcher (entry)', 'Policy Analyst'],
    commonTools: ['Python or R', 'survey platforms', 'interview protocols', 'reference managers'],
    coreSkillIds: ['inferential-stats', 'user-research', 'writing-clearly', 'presenting', 'experimentation'],
    adjacentPathIds: ['data-scientist', 'product-manager', 'product-analyst'],
  },
]

export function pathById(id: string): CareerPathSummary | undefined {
  return careerPathSummaries.find((path) => path.id === id)
}

export function pathsByCategory(categoryId: CareerCategoryId): CareerPathSummary[] {
  return careerPathSummaries.filter((path) => path.categoryId === categoryId)
}

/** Used by the AI Toolkit and Progress to name a path safely. */
export function pathTitle(id: string): string {
  return pathById(id)?.title ?? id
}
