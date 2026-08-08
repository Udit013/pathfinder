import { dailyQuests } from './quests'
import { resources } from './resources'
import { careerPathSummaries } from './careerPaths'
import { careerPathDetails } from './careerPathDetails'
import { careerExperiments } from './experiments'
import { datasetById } from './datasets'
import { marketData } from './marketData'

/**
 * Dev-only referential integrity check.
 *
 * Content is plain TypeScript arrays cross-referencing each other by id, which
 * is simple and fast but lets a rename rot a link silently. This runs once on
 * boot in development and shouts in the console instead.
 */
export function validateContent(): string[] {
  const problems: string[] = []

  const resourceIds = new Set(resources.map((resource) => resource.id))
  const pathIds = new Set(careerPathSummaries.map((path) => path.id))

  for (const quest of dailyQuests) {
    for (const id of quest.resourceIds) {
      if (!resourceIds.has(id)) {
        problems.push(`Quest "${quest.id}" references unknown resource "${id}"`)
      }
    }
    for (const id of quest.careerPathIds) {
      if (!pathIds.has(id)) {
        problems.push(`Quest "${quest.id}" references unknown career path "${id}"`)
      }
    }
  }

  for (const resource of resources) {
    for (const id of resource.careerPathIds) {
      if (!pathIds.has(id)) {
        problems.push(`Resource "${resource.id}" references unknown career path "${id}"`)
      }
    }
    if (resource.cost === 'free' && !resource.verified) {
      problems.push(
        `Resource "${resource.id}" claims cost "free" but is unverified — the UI will hide the Free label`,
      )
    }
  }

  for (const path of careerPathSummaries) {
    for (const id of path.adjacentPathIds) {
      if (!pathIds.has(id)) {
        problems.push(`Career path "${path.id}" references unknown adjacent path "${id}"`)
      }
    }
  }

  // ── Phase 2 content ────────────────────────────────────────────────────────

  const experimentIds = new Set(careerExperiments.map((experiment) => experiment.id))

  for (const experiment of careerExperiments) {
    for (const id of experiment.careerPathIds) {
      if (!pathIds.has(id)) {
        problems.push(`Experiment "${experiment.id}" references unknown career path "${id}"`)
      }
    }
    for (const id of experiment.resourceIds) {
      if (!resourceIds.has(id)) {
        problems.push(`Experiment "${experiment.id}" references unknown resource "${id}"`)
      }
    }
    if (experiment.datasetId && !datasetById(experiment.datasetId)) {
      problems.push(
        `Experiment "${experiment.id}" references unknown dataset "${experiment.datasetId}"`,
      )
    }
    // A step with no hints strands anyone who gets stuck.
    for (const step of experiment.steps) {
      if (step.hints.length === 0) {
        problems.push(`Experiment "${experiment.id}" step "${step.id}" has no hints`)
      }
    }
  }

  for (const detail of careerPathDetails) {
    if (!pathIds.has(detail.id)) {
      problems.push(`Career path detail "${detail.id}" has no matching summary`)
    }
    for (const id of detail.starterResourceIds) {
      if (!resourceIds.has(id)) {
        problems.push(`Career path detail "${detail.id}" references unknown resource "${id}"`)
      }
    }
    for (const id of detail.experimentIds) {
      if (!experimentIds.has(id)) {
        problems.push(`Career path detail "${detail.id}" references unknown experiment "${id}"`)
      }
    }
  }

  // §29 — a verified market data point without a source would render a number
  // with nothing behind it. That must never ship.
  for (const point of marketData) {
    if (point.status !== 'verified') continue
    if (!point.source || !point.sourceUrl || !point.accessedAt) {
      problems.push(
        `Market data "${point.id}" is marked verified but is missing a source, URL, or access date`,
      )
    }
    if (point.salaryMin === null || point.salaryMax === null) {
      problems.push(`Market data "${point.id}" is marked verified but has no figures`)
    }
  }

  return problems
}
