/**
 * Onboarding copy and options.
 *
 * Two rules shaped all of this:
 *   - Nothing asked here is used to predict anything about the user. It sets up
 *     what they see, and it can all be changed later in Settings.
 *   - Work authorisation is collected as a user-declared constraint only. There
 *     is no legal interpretation anywhere in this product (§5).
 */

export interface Option {
  value: string
  label: string
  description?: string
}

export const situationOptions: Option[] = [
  {
    value: 'recent-grad-searching',
    label: 'I recently graduated and I’m looking for my first full-time role',
  },
  {
    value: 'searching-a-while',
    label: 'I’ve been applying for a while and it’s wearing me down',
  },
  {
    value: 'still-studying',
    label: 'I’m still studying and planning ahead',
  },
  {
    value: 'working-considering-change',
    label: 'I’m working, and thinking about changing direction',
  },
]

export const goalOptions: Option[] = [
  {
    value: 'find-direction',
    label: 'Work out which direction actually fits me',
    description: 'Not just what my degree says I should do.',
  },
  {
    value: 'first-role',
    label: 'Get a first full-time role',
  },
  {
    value: 'build-skills',
    label: 'Build skills I can genuinely point to',
  },
  {
    value: 'build-portfolio',
    label: 'Have something to show — real projects',
  },
  {
    value: 'sustainable-search',
    label: 'Make the job search less exhausting',
    description: 'Keep going without burning out again.',
  },
  {
    value: 'interview-prep',
    label: 'Get better at interviews',
  },
  {
    value: 'understand-jobs',
    label: 'Understand what these jobs are actually like day to day',
  },
]

export const timeOptions: { value: number; label: string; description: string }[] = [
  { value: 25, label: 'About 25 minutes', description: 'Small and consistent. This is enough.' },
  { value: 45, label: 'About 45 minutes', description: 'A lesson and some practice.' },
  { value: 90, label: 'About 90 minutes', description: 'Room to learn and build in the same day.' },
  { value: 150, label: '2 hours or more', description: 'Space for deep project work.' },
]

/**
 * Free text on purpose. We do not maintain a taxonomy of immigration statuses,
 * because doing so would imply we understand their consequences. We don't.
 */
export const workAuthSuggestions = [
  'F-1 OPT',
  'F-1 STEM OPT',
  'H-1B',
  'US citizen or permanent resident',
  'Work permit outside the US',
  'Student, not yet authorised to work',
]

export const authorizationDisclaimer =
  'PathFinder uses this only to filter and frame what it shows you. It is not legal or immigration advice, and it never checks eligibility. Verify employment eligibility with your DSO and official USCIS guidance.'
