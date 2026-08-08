/**
 * In-app datasets for career experiments (§11).
 *
 * Generated deterministically at module load rather than shipped as large
 * files: the Lab works offline, nothing has to be downloaded before you can
 * start, and the numbers are the same every time so hints can refer to what is
 * actually in the data.
 *
 * The patterns are planted on purpose — each dataset contains a real, findable
 * story, because an experiment where the answer is "nothing happened" teaches
 * nothing about whether you'd enjoy the work.
 */

/** Small deterministic PRNG (mulberry32) so every user sees the same data. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)] as T
}

function round(value: number, places = 2): number {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

export interface DatasetTable {
  name: string
  columns: string[]
  rows: (string | number | null)[][]
}

export interface Dataset {
  id: string
  title: string
  description: string
  /** What the user is meant to be able to find in here. Not shown until asked. */
  spoiler: string
  tables: DatasetTable[]
}

// ─── 1. Revenue drop (Data Analyst) ──────────────────────────────────────────

function buildRevenueDataset(): Dataset {
  const random = makeRandom(1042)
  const regions = ['North', 'South', 'East', 'West'] as const
  const categories = ['Hardware', 'Software', 'Accessories', 'Services'] as const
  const channels = ['Direct', 'Partner', 'Online'] as const

  const rows: (string | number | null)[][] = []
  let orderId = 40_001

  for (let month = 1; month <= 9; month += 1) {
    const quarter = Math.ceil(month / 3)
    // Enough orders per month that random variation between segments stays well
    // below the planted effect — otherwise the "story" is indistinguishable
    // from noise and the experiment teaches the wrong lesson.
    for (let index = 0; index < 260; index += 1) {
      const region = pick(random, regions)
      const category = pick(random, categories)
      const channel = pick(random, channels)

      let units = 1 + Math.floor(random() * 6)
      let unitPrice = round(40 + random() * 460)

      // The planted story is deliberately two levels deep, so that segmenting by
      // one dimension is not enough:
      //   - In Q3 the whole Partner channel softens (fewer orders, discounting),
      //     which is what produces the ~12% company-wide drop.
      //   - Within Partner, the West collapses far harder than anywhere else,
      //     which is the finding that is actually actionable.
      // Direct and Online hold steady throughout, so region alone looks murky
      // and channel alone looks uniform. Both together tell the real story.
      if (quarter === 3 && channel === 'Partner') {
        const severe = region === 'West'
        if (random() < (severe ? 0.6 : 0.17)) continue // orders that never happened
        unitPrice = round(unitPrice * (severe ? 0.72 : 0.94)) // and discounting on the rest
        if (severe) units = Math.max(1, units - 2)
      }

      const day = 1 + Math.floor(random() * 28)
      rows.push([
        orderId++,
        `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        region,
        category,
        channel,
        units,
        unitPrice,
        round(units * unitPrice),
      ])
    }
  }

  rows.sort((a, b) => String(a[1]).localeCompare(String(b[1])))

  return {
    id: 'ds-revenue-drop',
    title: 'Quarterly orders, 2026',
    description:
      'Nine months of orders from a mid-sized hardware and software reseller. One row per order.',
    spoiler:
      'Q3 revenue is down about 14% against Q2 — slightly more than the 12% you were told, which is normal and worth mentioning. The cause is the Partner channel: it fell roughly 37% while Direct and Online were essentially flat. Within Partner, the West collapsed hardest, losing about 80% of its revenue on roughly 60% fewer orders and around 28% discounting on the ones that closed. Splitting by region alone is misleading, because several regions look moderately down; it is channel, and then region within channel, that isolates it.',
    tables: [
      {
        name: 'orders',
        columns: [
          'order_id',
          'order_date',
          'region',
          'category',
          'channel',
          'units',
          'unit_price',
          'revenue',
        ],
        rows,
      },
    ],
  }
}

// ─── 2. Signup funnel (Product Analyst) ──────────────────────────────────────

function buildFunnelDataset(): Dataset {
  const random = makeRandom(77)
  const devices = ['desktop', 'mobile', 'tablet'] as const
  const sources = ['organic', 'paid', 'referral'] as const
  const steps = [
    'landing_view',
    'signup_start',
    'email_verify',
    'profile_setup',
    'first_action',
  ] as const

  const rows: (string | number | null)[][] = []

  for (let user = 1; user <= 1200; user += 1) {
    const device = pick(random, devices)
    const source = pick(random, sources)
    const userId = `u_${String(user).padStart(4, '0')}`
    const day = 1 + Math.floor(random() * 14)
    const date = `2026-07-${String(day).padStart(2, '0')}`

    // The planted story: email verification is where mobile users are lost.
    // Everything else performs similarly across devices.
    //
    // These are the chance of dropping out BEFORE reaching each step, so the
    // email_verify figure governs how many users arrive at verification —
    // which is the number the experiment asks the user to find.
    const dropBefore: Record<(typeof steps)[number], number> = {
      landing_view: 0,
      signup_start: 0.3,
      email_verify: device === 'mobile' ? 0.62 : 0.14,
      profile_setup: 0.18,
      first_action: 0.22,
    }

    for (const step of steps) {
      if (random() < dropBefore[step]) break
      rows.push([userId, date, device, source, step, 1])
    }
  }

  return {
    id: 'ds-signup-funnel',
    title: 'Signup funnel events, July 2026',
    description:
      'One row per user per funnel step reached. 1,200 users over two weeks of a consumer product.',
    spoiler:
      'The worst transition is signup_start → email_verify, at about 68%. Split it by device and the reason is obvious: roughly 84% of desktop users verify, against about 37% of mobile users. Traffic source is flat across the board (66–69%), so it explains nothing. The likely cause is what physically happens on a phone — the user leaves the app for their mail client and does not come back.',
    tables: [
      {
        name: 'funnel_events',
        columns: ['user_id', 'event_date', 'device', 'source', 'step', 'reached'],
        rows,
      },
    ],
  }
}

// ─── 3. Messy daily sales files (Data Engineer) ──────────────────────────────

function buildMessySalesDataset(): Dataset {
  const random = makeRandom(31337)
  const stores = ['SEA-01', 'sea-01', 'PDX-02', 'pdx 02', 'DEN-03'] as const
  const products = ['Widget A', 'widget a', 'Widget B', 'Gadget C', 'GADGET C'] as const

  const rows: (string | number | null)[][] = []

  for (let index = 0; index < 220; index += 1) {
    const day = 1 + Math.floor(random() * 5)

    // Three date formats, because the upstream systems never agreed on one.
    const dateStyle = random()
    const date =
      dateStyle < 0.45
        ? `2026-08-${String(day).padStart(2, '0')}`
        : dateStyle < 0.8
          ? `08/${String(day).padStart(2, '0')}/2026`
          : `${day} Aug 2026`

    // Amounts arrive as numbers, currency strings, or with stray whitespace.
    const raw = round(5 + random() * 300)
    const amountStyle = random()
    const amount =
      amountStyle < 0.6
        ? String(raw)
        : amountStyle < 0.85
          ? `$${raw.toFixed(2)}`
          : `  ${raw.toFixed(2)} `

    const quantity = random() < 0.06 ? '' : String(1 + Math.floor(random() * 9))

    rows.push([
      `TX${10_000 + index}`,
      date,
      pick(random, stores),
      pick(random, products),
      quantity,
      amount,
      random() < 0.08 ? null : 'completed',
    ])
  }

  // Duplicated transaction ids — the same sale delivered twice.
  for (let index = 0; index < 12; index += 1) {
    const source = rows[Math.floor(random() * rows.length)]
    if (source) rows.push([...source])
  }

  return {
    id: 'ds-messy-sales',
    title: 'Daily sales drops, 5 days',
    description:
      'What a real ingestion job actually receives: five days of sales files from stores that each format things slightly differently.',
    spoiler:
      'Four problems to handle: three different date formats; amounts stored as strings, sometimes with a currency symbol or padding; store and product names inconsistently cased and spaced; and about a dozen duplicated transaction ids. Some quantities and statuses are missing — you have to decide whether to drop, default, or quarantine those rows, and that decision is the actual job.',
    tables: [
      {
        name: 'raw_sales',
        columns: ['transaction_id', 'date', 'store', 'product', 'quantity', 'amount', 'status'],
        rows,
      },
    ],
  }
}

// ─── 4. Customer churn (Data Scientist) ──────────────────────────────────────

function buildChurnDataset(): Dataset {
  const random = makeRandom(555)
  const plans = ['basic', 'standard', 'premium'] as const
  const rows: (string | number | null)[][] = []

  for (let index = 1; index <= 900; index += 1) {
    const plan = pick(random, plans)
    const tenureMonths = 1 + Math.floor(random() * 36)
    const supportTickets = Math.floor(random() * 8)
    const loginsLast30 = Math.floor(random() * 40)
    const monthlySpend = round(
      (plan === 'basic' ? 12 : plan === 'standard' ? 29 : 79) * (0.85 + random() * 0.3),
    )

    // The planted story: disengagement (few logins) drives churn, with short
    // tenure a clear second. Price and plan are deliberately near-irrelevant —
    // the intuitive explanation ("it's too expensive") is the wrong one, and
    // discovering that is the point of the experiment.
    const risk =
      0.6 * (loginsLast30 < 5 ? 1 : loginsLast30 < 15 ? 0.45 : 0.08) +
      0.35 * (tenureMonths < 6 ? 1 : tenureMonths < 12 ? 0.4 : 0.05) +
      0.1 * (supportTickets >= 5 ? 1 : 0)

    rows.push([
      `c_${String(index).padStart(4, '0')}`,
      plan,
      tenureMonths,
      monthlySpend,
      loginsLast30,
      supportTickets,
      random() < risk * 0.75 ? 1 : 0,
    ])
  }

  return {
    id: 'ds-churn',
    title: 'Subscription customers, churn snapshot',
    description:
      '900 customers of a subscription product, with a churned flag for whether they left in the last quarter.',
    spoiler:
      'Logins in the last 30 days is by far the strongest predictor (about 13.6 on average for churned customers against 21.4 for retained), with tenure a clear second (15.6 months against 19.1). Customers under six months old who barely log in are the high-risk group — roughly 54% of customers with fewer than 5 logins churned, against a 23% base rate. Monthly spend is close to irrelevant (37.2 against 39.7), which is the point: the intuitive story that people leave because it is too expensive is not what this data says. With about 23% churn, accuracy is a misleading metric — look at precision and recall.',
    tables: [
      {
        name: 'customers',
        columns: [
          'customer_id',
          'plan',
          'tenure_months',
          'monthly_spend',
          'logins_last_30d',
          'support_tickets',
          'churned',
        ],
        rows,
      },
    ],
  }
}

// ─── 5. Slow business process (Business Analyst) ─────────────────────────────

function buildProcessDataset(): Dataset {
  const random = makeRandom(9091)
  const stages = [
    'request_submitted',
    'manager_approval',
    'finance_review',
    'vendor_setup',
    'po_issued',
  ] as const
  const rows: (string | number | null)[][] = []

  for (let index = 1; index <= 260; index += 1) {
    const requestId = `REQ-${2000 + index}`
    // Squared so smaller requests dominate, as they do in reality — and so
    // there are enough requests either side of the $5,000 threshold for the
    // split to be discoverable rather than a handful of outliers.
    const amount = round(200 + random() ** 2 * 24_800)
    let hours = 0

    for (const stage of stages) {
      // The planted story: finance review is the bottleneck, and it is much
      // worse above the $5,000 approval threshold.
      const base =
        stage === 'request_submitted'
          ? 0.5
          : stage === 'manager_approval'
            ? 6 + random() * 10
            : stage === 'finance_review'
              ? amount > 5000
                ? 70 + random() * 90
                : 8 + random() * 14
              : stage === 'vendor_setup'
                ? 10 + random() * 20
                : 2 + random() * 5

      hours += base
      rows.push([requestId, stage, round(hours, 1), amount])
    }
  }

  return {
    id: 'ds-process-cycle-time',
    title: 'Purchase request cycle times',
    description:
      '260 purchase requests, timestamped at each stage, from a company where procurement has started taking noticeably longer.',
    spoiler:
      'Finance review is the bottleneck, and the split is at the $5,000 approval threshold: requests above it sit in finance for a median of roughly 111 hours, against about 15 hours below it. Manager approval and vendor setup are consistent regardless of amount, which is why the durations in finance review look bimodal rather than merely high. The lever is the approval policy at that threshold, not the people doing the reviewing.',
    tables: [
      {
        name: 'process_events',
        columns: ['request_id', 'stage', 'cumulative_hours', 'amount'],
        rows,
      },
    ],
  }
}

// ─── Registry ────────────────────────────────────────────────────────────────

/**
 * Built lazily on first access, then cached.
 *
 * Generating all five costs ~19ms and produces 8,000+ rows, and almost no page
 * needs them — Today, Explore, Roadmap, Build, Interview and Progress never
 * touch a dataset. Doing that work at module load put it on the critical path
 * of every single visit, for a fast machine; on a low-end phone it is several
 * times worse. Measured before and after rather than assumed.
 */
const builders: (() => Dataset)[] = [
  buildRevenueDataset,
  buildFunnelDataset,
  buildMessySalesDataset,
  buildChurnDataset,
  buildProcessDataset,
]

let cache: Dataset[] | null = null

export function getDatasets(): Dataset[] {
  cache ??= builders.map((build) => build())
  return cache
}

export function datasetById(id: string): Dataset | undefined {
  return getDatasets().find((dataset) => dataset.id === id)
}

/** CSV for copying or downloading, so the work can happen in real tools. */
export function tableToCsv(table: DatasetTable): string {
  const escape = (value: string | number | null): string => {
    if (value === null) return ''
    const text = String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  return [
    table.columns.join(','),
    ...table.rows.map((row) => row.map(escape).join(',')),
  ].join('\n')
}

export function datasetToCsv(dataset: Dataset): string {
  return dataset.tables.map(tableToCsv).join('\n\n')
}
