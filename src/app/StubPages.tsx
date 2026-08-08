import { PhasePage } from '@/ui/PhasePage'

/**
 * Areas whose real implementations land in later phases. Each one states what
 * is coming, so the shell can be navigated end to end without any fake UI.
 */

export function JobsPage() {
  return (
    <PhasePage
      title="Jobs"
      intro="Applications, outreach, and interview preparation in one place — organised so the search feels finite instead of endless."
      building={[
        {
          title: 'An application board',
          body: 'Saved → applied → screen → interview → final → offer, with rejection tracked as an outcome rather than a column you fall into.',
        },
        {
          title: 'A wins log',
          body: 'Offers are not the only measure of progress. Applications, replies, conversations, and interviews all count as things you created.',
        },
        {
          title: 'Interview preparation',
          body: 'Tracks per topic, each moving from understanding through practice to explaining out loud. No memorising answers you cannot reason about.',
        },
      ]}
    />
  )
}

