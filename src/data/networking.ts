import type { NetworkingQuest } from '@/types'

/**
 * Networking quests (§17, §18).
 *
 * Each one is a single action that can be finished in one sitting. Template
 * hints are starting points to rewrite, never scripts to send as-is — a message
 * that sounds generated is worse than no message.
 *
 * Phase 1 seeds enough for Today's "one job action"; Phase 5 expands to the
 * full set alongside the tracker.
 */
export const networkingQuests: NetworkingQuest[] = [
  {
    id: 'n-alumni-one',
    title: 'Find one alum doing the work you are curious about',
    detail:
      'Search your school on LinkedIn, filter by a job title you are exploring. Do not message anyone yet — just find one real person and read their path. Notice what they did before the role.',
    estimatedMinutes: 15,
    xp: 20,
  },
  {
    id: 'n-alumni-message',
    title: 'Message one alum with a specific question',
    detail:
      'Short, specific, and answerable in two sentences. A question about their actual work gets replies; "can I pick your brain" does not.',
    estimatedMinutes: 20,
    xp: 20,
    templateHint:
      'Hi [name] — I graduated from [school] and I am working out whether [role] is the right direction for me. You have been doing it for [time]: what part of the job takes up more of your week than people expect? Happy to be pointed at something to read instead if that is easier.',
  },
  {
    id: 'n-follow-up',
    title: 'Follow up on one thing that went quiet',
    detail:
      'Pick one application or conversation with no reply for over a week. One short message, no apology for following up, and a concrete reason for the nudge.',
    estimatedMinutes: 10,
    xp: 20,
    templateHint:
      'Hi [name] — following up on my application for [role] from [date]. Since applying I have [one specific new thing: a project, a skill]. Still very interested; happy to share anything useful.',
  },
  {
    id: 'n-recruiter-intro',
    title: 'Introduce yourself to one recruiter who hires for your target role',
    detail:
      'Find someone whose posts or postings match roles you want. Say what you do, what you are looking for, and one thing you have actually built.',
    estimatedMinutes: 20,
    xp: 20,
    templateHint:
      'Hi [name] — I saw you hire for [role type] at [company]. I am a recent [degree] graduate focused on [area]; most recently I built [one project, one sentence]. If anything entry-level opens up I would love to be considered.',
  },
  {
    id: 'n-comment-substantive',
    title: 'Leave one comment that is worth reading',
    detail:
      'Find a post about work you are learning. Add something real — a question, a counter-example, something you tried. This is how people start recognising your name.',
    estimatedMinutes: 10,
    xp: 20,
  },
  {
    id: 'n-thank-you',
    title: 'Thank someone who helped you',
    detail:
      'Anyone who replied, referred you, or answered a question. Tell them what you did with their advice. This is the step almost everyone skips, and it is the one that makes people help again.',
    estimatedMinutes: 10,
    xp: 20,
  },
  {
    id: 'n-share-progress',
    title: 'Post one thing you learned this week',
    detail:
      'Two or three sentences about something that clicked. Not a thought-leadership post — just visible evidence that you are actively working at this.',
    estimatedMinutes: 20,
    xp: 20,
  },
  {
    id: 'n-referral-ask',
    title: 'Ask one person you already know about a referral',
    detail:
      'Someone at a company you have applied to or want to. Make it easy to say yes: name the role, attach the resume, and give them a sentence they can forward.',
    estimatedMinutes: 20,
    xp: 20,
    templateHint:
      'Hi [name] — I applied for [role] at [company] ([link]). If you are comfortable passing my name along, here is a sentence you could use: "[Name] is a recent [degree] grad who built [thing]; they are looking for entry-level [role type]." Completely fine if not.',
  },
]

export function networkingQuestById(id: string): NetworkingQuest | undefined {
  return networkingQuests.find((quest) => quest.id === id)
}
