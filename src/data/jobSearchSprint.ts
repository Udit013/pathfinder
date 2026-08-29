/**
 * The 30-Day Job Search Sprint (user-submitted guide, added 2026-08-29).
 *
 * This is reference reading, not a feature. PathFinder removed job tracking,
 * Kanban boards and networking logs earlier in its life — on purpose, because
 * turning the job search into another dashboard to maintain is exactly the
 * kind of pressure this app exists to remove. Nothing here creates state:
 * no tracker, no saved companies, no outreach log. It is a page you read.
 *
 * The statistics throughout are attributed the way the source document
 * attributed them — a named cluster of industry sources with a general access
 * date, not a per-figure citation. That is a lighter bar than the rest of
 * PathFinder holds market data to (see marketData.ts, where every verified
 * figure carries its own source, URL and access date). Rather than either
 * silently upgrade these numbers to "verified" or silently drop them, the page
 * shows the disclaimer plainly and says PathFinder has not independently
 * checked them — the same honesty rule applied to a case where the source
 * itself is coarser than usual.
 */

export type SprintBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'callout'; text: string }

export interface SprintSection {
  id: string
  title: string
  blocks: SprintBlock[]
}

export const sprintTitle = 'The 30-Day Job Search Sprint'
export const sprintSubtitle = 'A focused strategy for finding a job with barely any connections.'

export const sprintDisclaimer =
  'Statistics reflect data published through mid-2026 across recruiting industry sources including Jobvite, Gem, Glassdoor, Jobscan, SHRM and Greenhouse, and vary by industry, seniority and geography. Treat them as directional, and let your own tracked numbers override them once you have thirty applications of data.'

export const sprintSections: SprintSection[] = [
  {
    id: 'strategy',
    title: 'Part 1 — The strategy, and the math behind it',
    blocks: [
      { kind: 'p', text: 'Start with an honest calibration.' },
      {
        kind: 'p',
        text: 'The average time to hire in 2026 is around 44 days, up from 36 in 2020. In tech it stretches further, with median time to hire around 67 days in Q1 2026.',
      },
      {
        kind: 'p',
        text: 'So be clear about what 30 days can realistically produce. It is not usually a signed offer. It is a full pipeline: multiple live interview processes, several conversations in motion, and a system that keeps producing without you starting over. If an offer lands inside 30 days, it will almost always come from a warm introduction rather than a cold application, which is the entire argument for the strategy below.',
      },
      {
        kind: 'p',
        text: 'Plan for the sprint to end with momentum, not a contract. That framing prevents the day-25 panic spiral that makes people start mass-applying again.',
      },
      {
        kind: 'callout',
        text: 'Why mass applying fails, in numbers',
      },
      {
        kind: 'table',
        headers: ['The funnel', 'What happens'],
        rows: [
          ['You apply', 'The average corporate posting receives around 250 applicants'],
          ['ATS screening', 'Roughly 75% of resumes are rejected before a human sees them'],
          ['Human scan', 'Recruiters spend an average of about 7.4 seconds on a resume'],
          ['Interview', 'Only 4 to 6 candidates per posting are typically invited to a formal interview'],
          ['Your odds', 'Roughly 2 to 3% of applicants get an interview call for any given role'],
        ],
      },
      {
        kind: 'p',
        text: 'It gets worse. Recruiters now manage 56% more open requisitions and 2.7 times more applications than three years ago, and 79% of job seekers are using AI tools to apply. Volume is precisely the strategy that is already saturated. And somewhere between 18 and 30% of postings are ghost jobs that never lead to a hire, meaning a meaningful slice of your effort goes into a void no matter how good your resume is.',
      },
      { kind: 'callout', text: 'Why the focused strategy works, in numbers' },
      {
        kind: 'list',
        items: [
          'Tailoring works. Candidates who tailor each application receive a 78% higher response rate than those sending the same resume everywhere. Jobscan puts it at roughly 3 times more likely to land an interview.',
          'Referrals are the whole game. Employee referrals make up only about 7% of applications but account for 30 to 50% of hires. Referred candidates are 4 to 8 times more likely to be hired and move through the process about 55% faster.',
          'Being sourced beats applying. Candidates sourced directly by a recruiter are roughly 8 times more likely to be hired than those who apply. Direct sourcing accounts for around 2.5% of applications but nearly 10% of hires.',
          'Channel matters enormously. Response rates run roughly 20 to 25% on Indeed, 3 to 13% on LinkedIn, and 2 to 5% on company career sites. Tech can be as low as 5%. Company career pages generate 13% of applicants but 26% of hires, so low volume there is not the same as low value.',
        ],
      },
      {
        kind: 'callout',
        text: 'Twenty tailored applications a week at a 5% response rate produces the same outcome as one hundred generic ones at 1%, with one fifth of the effort and none of the burnout.',
      },
      {
        kind: 'p',
        text: 'Track your interview rate. Do not track your application count. Application count is the vanity metric that feels like progress while producing nothing.',
      },
      { kind: 'callout', text: 'One change to the order of your five steps' },
      {
        kind: 'p',
        text: 'You cannot tailor a resume without knowing what you are tailoring it to. Every hour spent perfecting a general-purpose resume before you have a target list is an hour you will spend again. Define the roles, then build the resume against them.',
      },
      {
        kind: 'p',
        text: 'Revised order for the sprint: target, then resume, then LinkedIn, then network and apply in parallel for the remaining 25 days.',
      },
      { kind: 'callout', text: 'The daily rhythm, once you are running' },
      {
        kind: 'p',
        text: 'From roughly day 6 to day 30, every weekday looks like this. Three hours, non-negotiable, ideally in the morning since applications submitted between 8 and 11 a.m. see meaningfully higher response rates.',
      },
      {
        kind: 'table',
        headers: ['Block', 'Time', 'What'],
        rows: [
          [
            'Outreach first',
            '60 min',
            '5 to 8 personalised messages. Do this before applications — it is the highest-value activity and the one you will skip if you leave it last.',
          ],
          [
            'Applications',
            '90 min',
            '3 to 4 tailored applications. Quality gate: if you cannot tailor it properly, do not send it.',
          ],
          [
            'Admin and follow-up',
            '30 min',
            'Update the tracker, send scheduled follow-ups, respond to anything incoming.',
          ],
        ],
      },
      {
        kind: 'p',
        text: 'Weekends: rest, or use them for deeper work like preparing STAR stories and researching companies. Do not apply on weekends. Tuesday through Thursday is the strongest window.',
      },
    ],
  },
  {
    id: 'days-1-2',
    title: 'Days 1 to 2 — Define the target',
    blocks: [
      {
        kind: 'p',
        text: 'Why first. Everything downstream depends on this. A vague target produces a vague resume, vague outreach, and no traction.',
      },
      {
        kind: 'list',
        items: [
          'Write down, concretely: the job titles you are going after (two or three variants, not eight), your seniority band, your location and remote constraints, your salary floor, and the industries you would actually accept.',
          'Build a target company list of 30 to 40 companies — not roles, companies. Sources: competitors of your current or previous employer, companies where your alumni network already works, companies that recently raised funding or announced expansion, companies whose products you actually use, and companies already hiring for your title.',
        ],
      },
      {
        kind: 'table',
        headers: ['Tier', 'Count', 'Approach'],
        rows: [
          ['A — dream roles', '10 companies', 'Real effort: multiple contacts, custom materials, deep research'],
          ['B — strong fit, realistic', '20 companies', 'Standard tailored application plus one outreach attempt'],
          ['C — backup and volume', '10 companies', 'Lighter tailoring, apply and move on'],
        ],
      },
      {
        kind: 'p',
        text: 'The fit rule. If you meet roughly 60% or more of the stated requirements, apply. Below that, you are usually donating time. Above 90%, you may be underlevelling yourself and should look one rung higher. "Requirements" lists are wish lists — the hard gates are usually only the first two or three bullets.',
      },
      {
        kind: 'callout',
        text: 'Deliverable by end of day 2: a spreadsheet with 30 to 40 companies, tiered, each with a column for "who do I know here" left blank for now.',
      },
    ],
  },
  {
    id: 'days-2-4',
    title: 'Days 2 to 4 — Fix the resume',
    blocks: [
      {
        kind: 'p',
        text: 'The bar: two audiences, in this order — an ATS that filters on keywords, and a human who will spend about 7.4 seconds deciding whether to keep reading. Your resume has to survive both.',
      },
      { kind: 'callout', text: 'Format rules, non-negotiable' },
      {
        kind: 'list',
        items: [
          'Reverse chronological — it gives recruiters what they expect in the order they expect it',
          'One page if under ten years of experience. Two maximum',
          'Standard fonts — Arial, Helvetica, Calibri. 10 to 12 point',
          'Margins around 0.75 inch',
          'No columns, no tables, no text boxes, no icons, no headshots, no skill bar charts — these break ATS parsing and communicate nothing',
          'Submit as PDF unless the application explicitly requests .docx',
          'Proofread twice. Typos disqualify at extremely high rates, and this is entirely preventable',
        ],
      },
      {
        kind: 'p',
        text: 'Structure: contact details, then a short professional summary, then experience, then skills, then education, then projects or certifications if relevant.',
      },
      { kind: 'callout', text: 'How to tailor, the actual method' },
      {
        kind: 'list',
        items: [
          'Read the job description like a recruiter. Extract three things: the hard requirements (skills, tools, years, credentials), the priority keywords (anything repeated twice or more, or listed first under requirements), and the soft signals (culture, collaboration style, leadership language)',
          'Run a gap check. For each keyword, mark it present, missing, or present-but-phrased-differently',
          'Fix the phrasing gaps first — the cheapest wins. If the description says "cross-functional collaboration," your resume should say that, not "worked with multiple teams." The ATS is matching strings, not meaning',
          'Add missing keywords only where they are true. Never invent experience. If a genuine requirement is missing from your background entirely, address it in the cover letter or outreach rather than fabricating it on the resume',
          'Reorder bullets so the most relevant experience sits first within each role',
          "Rewrite the summary to mirror the role's language and seniority",
        ],
      },
      {
        kind: 'p',
        text: 'Bullet formula: action verb, what you did, quantified result, and the tool or method where relevant.',
      },
      {
        kind: 'table',
        headers: ['Weak', 'Strong'],
        rows: [
          [
            'Responsible for improving the onboarding process.',
            'Redesigned customer onboarding flow, cutting time-to-first-value from 14 days to 5 and lifting 30-day activation by 22%.',
          ],
        ],
      },
      {
        kind: 'p',
        text: 'If you do not have exact numbers, use defensible estimates: team size, percentage improvement, frequency, budget, volume. "Roughly 40%" is far better than nothing, and you must be able to explain how you arrived at it.',
      },
      {
        kind: 'p',
        text: 'Time budget: build one strong master resume on day 2 and 3. From day 4 onward, tailoring each application should take 15 to 25 minutes, not two hours. If it is taking longer, your master version is not strong enough yet.',
      },
      {
        kind: 'p',
        text: 'A warning about AI: use it to draft and refine, absolutely. But 66% of hiring managers now use AI-detection software on resumes. Anything that reads as machine-generated boilerplate is a liability. Keep your own voice and specific details.',
      },
      {
        kind: 'callout',
        text: 'Deliverable by end of day 4: one master resume plus one fully tailored version for a Tier A role, used as your template.',
      },
    ],
  },
  {
    id: 'days-4-5',
    title: 'Days 4 to 5 — Optimise LinkedIn',
    blocks: [
      {
        kind: 'p',
        text: 'Why it matters: 72% of recruiters use LinkedIn as their primary sourcing tool, and being sourced makes you roughly 8 times more likely to be hired than applying cold. This is your inbound channel — it works while you sleep.',
      },
      {
        kind: 'list',
        items: [
          'Photo and banner. Photo is mandatory — clear face, decent light, professional but human. The banner is free advertising space that most people waste; use it to state your niche or value.',
          'Headline. The single highest-impact field on the profile, and most people waste it on a job title. Format: [Role or identity] | [Value you deliver] | [Niche or audience]. Weak: "Software Engineer at Acme." Strong: "Backend Engineer | Python, Go, distributed systems | Building payment infrastructure at scale." Include the exact job title you are targeting — that is the string recruiters search.',
          'About section. Open with a hook, not "I am a." Tell a short story about what you do and who you do it for. Include your target keywords naturally. End with a call to action. Three to five short paragraphs — recruiters read the first two lines before deciding to expand.',
          'Experience. Same rules as the resume: impact and outcomes, not task lists. Numbers wherever possible. The most recent role gets the most detail.',
          'Skills. Your top three are what appear first and what recruiters filter on — make them the three most relevant to your target role, not the three you happen to have the most endorsements for. Fill all 50 slots with role-relevant terms.',
          'Featured section. Almost universally unused, which makes it a cheap differentiator. Put your best work there: a project, a repository, an article, a case study.',
          'Open to Work. The recruiter-only setting is generally safer if you are currently employed — the public green frame increases inbound volume but also signals availability to your current employer. If you are not employed, use the public version; there is no downside.',
          'Activity. Post two or three times during the sprint about something you know. It gives people who look you up a reason to believe you are engaged, and gives your outreach targets a warm reason to already know your name.',
        ],
      },
      {
        kind: 'callout',
        text: 'Deliverable by end of day 5: headline, About, top three skills, and Featured section all rewritten. Total time: three to four hours.',
      },
    ],
  },
  {
    id: 'days-5-30',
    title: 'Days 5 to 30 — Network strategically',
    blocks: [
      {
        kind: 'p',
        text: 'This is where the sprint is won. Referrals are 7% of applications and 30 to 50% of hires. If you do only one thing from this document, do this one.',
      },
      {
        kind: 'p',
        text: '"Barely any connections" is a solvable problem. You have more surface than you think:',
      },
      {
        kind: 'list',
        items: [
          "Alumni. LinkedIn's alumni search filters your university by company and role — the single highest-response cold channel that exists, because a shared institution is a genuine reason to reply",
          'Former colleagues, including from internships, and people who have left your previous employer for your target companies',
          'Second-degree connections. Anyone connected to someone you already know',
          'Recruiters at target companies. Search "recruiter" or "talent" plus the company name',
          "Hiring managers. The person whose team the role sits in, usually findable from the job description plus a title search",
          'Community. Open source contributors, Discord and Slack communities, meetup organisers, conference speakers, newsletter authors',
        ],
      },
      {
        kind: 'p',
        text: 'Weekly target: 25 to 40 personalised messages, roughly 5 to 8 per weekday. Expect a response rate somewhere between 20 and 40% if the messages are genuinely personalised, and close to zero if they are not.',
      },
      { kind: 'callout', text: 'The rules of outreach' },
      {
        kind: 'list',
        items: [
          'Never open with "please refer me." It asks a stranger to stake their reputation on someone they have not evaluated — the single most common mistake, and it kills the conversation',
          'Ask for information, not favours. Referrals emerge from conversations. They are rarely granted on request',
          'Reference something specific — their post, their project, their career path, a shared alma mater, a talk they gave. Two sentences of genuine specificity beats two paragraphs of flattery',
          'Keep it under 100 words. Connection request notes cap at 300 characters',
          'One clear, small ask — fifteen minutes, or one specific question',
          'Follow up exactly once, a week later, then move on',
        ],
      },
      {
        kind: 'p',
        text: 'The sequencing that works: reach out before you apply, not after. A conversation on Monday and an application on Thursday, with the person aware it is coming, is a completely different artefact from a cold application followed by a request for help.',
      },
    ],
  },
  {
    id: 'days-6-30',
    title: 'Days 6 to 30 — Apply and follow up',
    blocks: [
      {
        kind: 'p',
        text: 'Volume target: 15 to 20 tailored applications per week, roughly 60 to 80 over the sprint. That is the number that matters, not 300.',
      },
      {
        kind: 'p',
        text: 'Timing: apply Tuesday through Thursday, between 8 and 11 a.m. local time, ideally within 48 hours of the posting going live. Early applications sit at the top of the ATS queue and the first cohort of applicants receives disproportionate attention.',
      },
      {
        kind: 'p',
        text: "Channel strategy: apply through the company's own career page where possible — career pages convert applicants to hires at roughly twice the rate of job boards. Use job boards for discovery, then apply direct.",
      },
      {
        kind: 'p',
        text: 'Track everything: company, role, tier, date applied, channel, contact name, outreach date, follow-up date, status, notes, and the specific resume version used. Without this you cannot tell what is working, and the whole strategy depends on being able to tell.',
      },
      { kind: 'callout', text: 'The follow-up cadence' },
      {
        kind: 'table',
        headers: ['When', 'What'],
        rows: [
          ['Same day as applying', 'If you have a contact there, tell them you applied and which role'],
          ['Day 5 to 7 after applying', 'Short note to the recruiter or hiring manager — restate interest, add one specific reason you fit'],
          ['Day 14', 'One final check-in. Then close it out mentally and move on'],
          ['Within 24 hours of any interview', 'Thank you note. Reference something specific from the conversation'],
          ['Day 7 after an interview with no update', 'Polite status check'],
        ],
      },
      {
        kind: 'p',
        text: 'Two follow-ups is the ceiling on a cold application. More reads as desperation and does not change outcomes.',
      },
      { kind: 'callout', text: 'The weekly review, every Friday, 30 minutes' },
      {
        kind: 'list',
        items: [
          'Applications sent, responses received, interviews scheduled. Calculate your response rate',
          'Which channel produced responses? Which company tier?',
          'Which resume version produced responses?',
          'Which outreach messages got replies, and what did they have in common?',
          'What changes next week?',
        ],
      },
      {
        kind: 'p',
        text: 'Diagnostics. If after two weeks you have sent 30 or more applications:',
      },
      {
        kind: 'table',
        headers: ['Symptom', 'Likely cause', 'Fix'],
        rows: [
          ['Under 5% response rate', 'ATS filtering, or targeting mismatch', 'Check keyword match against three job descriptions. Reconsider whether you meet 60% of requirements'],
          ['Responses but no first interviews', 'Resume passes ATS, fails the human scan', 'Rewrite bullets for impact and numbers. Get one experienced person to read it'],
          ['First interviews but no second rounds', 'Interview performance, or story quality', 'Build the STAR story bank. Do mock interviews'],
          ['Final rounds but no offers', 'Fit, competition, or negotiation posture', 'Ask for feedback directly — it is sometimes given'],
          ['Outreach getting no replies', 'Messages are not actually personalised', 'Rewrite. Reference something specific from their profile'],
        ],
      },
    ],
  },
  {
    id: 'templates',
    title: 'Part 3 — Templates',
    blocks: [
      {
        kind: 'p',
        text: 'Adapt these. Do not send them verbatim. The specificity is the entire point, and a template that reads like a template performs like a mass application.',
      },
      {
        kind: 'table',
        headers: ['Situation', 'Message'],
        rows: [
          [
            'Alumni outreach',
            'Hi [Name], I saw you studied [Programme] at [University] too, and you have been at [Company] for [X] years now. I am exploring [role type] roles and [Company] is high on my list, particularly because of [specific reason]. Would you be open to a 15-minute call? I would mostly want to understand what the [team or function] is actually like day to day. Happy to work around your schedule.',
          ],
          [
            'Recruiter outreach',
            'Hi [Name], I noticed you are hiring for [Role] at [Company]. I have spent the last [X] years doing [specific relevant thing], most recently [one concrete achievement with a number]. I have applied through your careers page, but wanted to reach out directly in case a quick conversation is useful. Happy to send anything that would help.',
          ],
          [
            'Hiring manager outreach',
            "Hi [Name], I have been following [Company]'s work on [specific product or initiative]. I am applying for the [Role] on your team. One thing I noticed: [specific, genuine observation or question about their product, technical approach, or market]. I have worked on something similar at [Company] where I [brief specific outcome]. Would you be open to a short conversation? I would value your view on what the role actually needs, whether or not I am the right fit.",
          ],
          [
            'The referral request, done properly, after a conversation',
            'Hi [Name], thanks again for the call last week. Your point about [specific thing they said] was genuinely useful and changed how I am thinking about [X]. I have applied for [Role, requisition number]. If, based on our conversation, you feel comfortable putting a referral in, I would really appreciate it. And if not, no issue at all. Either way I appreciated the time.',
          ],
          [
            'Reconnecting with a dormant contact',
            'Hi [Name], it has been a while since [specific shared context]. I saw you are now at [Company], congratulations on the move. I am in the middle of a job search for [role type] roles and thought of you. No agenda beyond catching up, but if you have 15 minutes I would love to hear what you are working on.',
          ],
          [
            'Follow-up after applying, day 5 to 7',
            'Hi [Name], I applied for the [Role] on [date] and wanted to follow up briefly. The part of the role that stood out most is [specific responsibility], which lines up closely with [specific thing you did]. Happy to share more detail if useful. Thanks for your time.',
          ],
          [
            'Thank you after an interview',
            'Hi [Name], thank you for the conversation today. I especially enjoyed discussing [specific topic]. Your point about [specific challenge they mentioned] stuck with me. [One or two sentences of genuine thought on it, ideally something you did not get to say in the room.] I am very interested in the role and happy to provide anything else that would help.',
          ],
          [
            'The connection request note (300 character limit)',
            'Hi [Name], fellow [University] alum here. I am exploring [role type] roles and would value your perspective on [Company]. Would appreciate connecting.',
          ],
        ],
      },
      {
        kind: 'p',
        text: 'The final sentence in each is not politeness. It is what makes the ask answerable without awkwardness, which is what makes people say yes.',
      },
    ],
  },
  {
    id: 'resources',
    title: 'Part 4 — Resources and tools',
    blocks: [
      { kind: 'callout', text: 'Resume and ATS' },
      {
        kind: 'table',
        headers: ['Tool', 'Use'],
        rows: [
          ['Jobscan', 'Paste resume and job description, get a match score and missing keywords'],
          ['Resume Worded', 'Free scoring against recruiter criteria'],
          ['Teal', 'Resume builder plus application tracker in one'],
          ['Google Docs or Word', 'Plain templates. Avoid Canva and any design-heavy template for ATS submissions'],
        ],
      },
      { kind: 'callout', text: 'Job discovery' },
      {
        kind: 'table',
        headers: ['Tool', 'Use'],
        rows: [
          ['LinkedIn Jobs', 'Best for discovery and for the alumni and recruiter search that follows'],
          ['Indeed', 'Highest response rates in the data, 20 to 25%'],
          ['Hiring Cafe', 'Aggregates postings directly from company career pages'],
          ['Simplify', 'Autofill applications, track them, browse aggregated listings'],
          ['Otta and Wellfound', 'Startup and tech-heavy'],
          ['Company career pages', 'Lower volume, roughly double the applicant-to-hire conversion'],
          ['Google Jobs', 'Reported the highest response rate of any single channel at around 9.3%'],
        ],
      },
      { kind: 'callout', text: 'Networking and research' },
      {
        kind: 'table',
        headers: ['Tool', 'Use'],
        rows: [
          ['LinkedIn Alumni tool', 'Filter your university by company, role and location — the highest-value free tool in this document'],
          ['LinkedIn Sales Navigator free trial', 'Better filtering for finding hiring managers'],
          ['Hunter.io or RocketReach', 'Finding email addresses when LinkedIn messaging is capped'],
          ['Glassdoor and Blind', 'Interview process intel, comp, and culture signals'],
          ['levels.fyi', 'Compensation data by company and level, for negotiation'],
          ['Crunchbase', 'Funding news, which is a strong signal of imminent hiring'],
        ],
      },
      { kind: 'callout', text: 'Tracking' },
      {
        kind: 'p',
        text: 'A spreadsheet is entirely sufficient. Airtable, Notion, Teal or Huntr work if you prefer structure. The tool does not matter. Filling it in every single day does.',
      },
      { kind: 'callout', text: 'Interview prep' },
      {
        kind: 'table',
        headers: ['Tool', 'Use'],
        rows: [
          ['Tech Interview Handbook', 'Free, includes strong behavioural preparation'],
          ['interviewing.io', 'Anonymous mock interviews for technical roles'],
          ['Exponent', 'Mocks and role-specific guides'],
          ['Glassdoor interview reports', 'Company-specific question patterns'],
        ],
      },
    ],
  },
  {
    id: 'week-by-week',
    title: 'Part 5 — The week-by-week view',
    blocks: [
      {
        kind: 'table',
        headers: ['Week', 'Focus', 'Daily target', 'Milestone'],
        rows: [
          [
            'Week 1, days 1–7',
            'Build the machine',
            'Days 1–5 setup, then start',
            'Target list of 30–40 companies, master resume, LinkedIn rewritten, first 10 outreach messages sent',
          ],
          [
            'Week 2, days 8–14',
            'Volume and outreach',
            '3–4 applications, 5–8 messages',
            '20 applications sent, 30 messages sent, first conversations booked',
          ],
          [
            'Week 3, days 15–21',
            'Optimise on data',
            '3–4 applications, 5–8 messages',
            '40 applications total, first interviews happening, resume revised based on what got responses',
          ],
          [
            'Week 4, days 22–28',
            'Convert',
            '2–3 applications, more interview prep',
            '60 applications total, multiple live processes, STAR stories tight and timed',
          ],
          [
            'Days 29–30',
            'Consolidate',
            'Follow-ups and review',
            'Full pipeline review, plan for the next 30 days',
          ],
        ],
      },
      { kind: 'callout', text: 'The three numbers to track' },
      {
        kind: 'list',
        items: [
          'Response rate. Responses divided by applications. Under 5% means fix the resume or the targeting. Above 10% means the system is working',
          'Outreach reply rate. Replies divided by messages. Under 15% means your messages are not personalised enough',
          'Interview conversion. Interviews divided by applications. This is the only number that actually correlates with getting hired',
        ],
      },
      { kind: 'callout', text: 'What day 31 looks like' },
      {
        kind: 'p',
        text: 'If you do not have an offer at day 30, you have not failed. You have built a system in a market where the median time to hire is 44 days. Keep the daily rhythm running. The pipeline you built in week one starts producing in week five and six.',
      },
      {
        kind: 'p',
        text: 'The people who struggle are the ones who treat the sprint as a one-time push and then stop. The ones who get hired keep the three-hour block going until something closes.',
      },
      { kind: 'callout', text: 'The five mistakes that waste the month' },
      {
        kind: 'list',
        items: [
          'Mass applying. It is the strategy everyone uses, which is exactly why it does not work — 2 to 3% of applicants get an interview',
          'Perfecting the resume for two weeks. Diminishing returns after day three. Ship it and iterate based on response data',
          'Asking strangers for referrals. It fails almost every time. Ask for a conversation and let the referral follow',
          'Not tracking anything. You cannot optimise what you do not measure, and this entire strategy is built on optimisation',
          'Skipping outreach because applications feel more productive. Applications produce a visible number. Outreach produces the actual hires. Do outreach first each day, when your energy is highest',
        ],
      },
    ],
  },
]
