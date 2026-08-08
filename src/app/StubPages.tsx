import { PhasePage } from '@/ui/PhasePage'
import { useProfile } from '@/lib/store/selectors'
import { pathById } from '@/data/careerPaths'

/**
 * Areas whose real implementations land in later phases. Each one states what
 * is coming, so the shell can be navigated end to end without any fake UI.
 */

export function RoadmapPage() {
  const profile = useProfile()
  const primary = profile?.primaryPathId ? pathById(profile.primaryPathId) : null

  return (
    <PhasePage
      title="Roadmap"
      intro={
        primary
          ? `The skills behind ${primary.title}, in an order that makes each one easier than it would have been alone.`
          : "Once you're leaning toward a direction, its skills appear here as a map rather than a reading list."
      }
      building={[
        {
          title: 'A visual skill tree',
          body: 'Nodes with states — locked, available, in progress, done — and honest labels for what is core, what is merely useful, and what is optional. You never have to complete all of it.',
        },
        {
          title: 'Skill detail',
          body: 'Why each skill matters, how long it tends to take, what it depends on, free resources, and one practice task that tells you whether it stuck.',
        },
        {
          title: 'Quests generated from the map',
          body: 'Each node becomes small daily quests, which is what Today draws from.',
        },
      ]}
    />
  )
}

export function BuildPage() {
  return (
    <PhasePage
      title="Build"
      intro="Projects are how you stop describing your skills and start showing them. This is where you pick one and take it to finished."
      building={[
        {
          title: 'A project library',
          body: 'Filtered by direction, difficulty, and the time you actually have. Real problems rather than tutorial reruns.',
        },
        {
          title: 'Milestones',
          body: 'Every project broken into pieces you can finish in one sitting, so progress is visible before the project is done.',
        },
        {
          title: 'Portfolio guidance',
          body: 'A README checklist, help writing the resume bullet honestly, and how to present the work so someone can tell what you did.',
        },
      ]}
    />
  )
}

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

