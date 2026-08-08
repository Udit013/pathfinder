import { dailyQuests } from './quests'
import { resources } from './resources'
import { careerPathSummaries } from './careerPaths'
import { careerPathDetails } from './careerPathDetails'
import { careerExperiments } from './experiments'
import { datasetById } from './datasets'
import { marketData } from './marketData'
import { skills } from './skills'
import { roadmaps } from './roadmaps'
import { projectTemplates } from './projects'

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

  // ── Phase 3: skills and roadmaps ───────────────────────────────────────────

  const skillIds = new Set(skills.map((skill) => skill.id))

  for (const skill of skills) {
    for (const id of skill.prerequisiteSkillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Skill "${skill.id}" requires unknown skill "${id}"`)
      }
    }
    for (const id of skill.resourceIds) {
      if (!resourceIds.has(id)) {
        problems.push(`Skill "${skill.id}" pins unknown resource "${id}"`)
      }
    }
  }

  for (const path of careerPathSummaries) {
    for (const id of path.coreSkillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Career path "${path.id}" lists unknown core skill "${id}"`)
      }
    }
  }

  for (const quest of dailyQuests) {
    for (const id of quest.skillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Quest "${quest.id}" references unknown skill "${id}"`)
      }
    }
  }

  for (const experiment of careerExperiments) {
    for (const id of experiment.skillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Experiment "${experiment.id}" references unknown skill "${id}"`)
      }
    }
  }

  for (const resource of resources) {
    for (const id of resource.skillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Resource "${resource.id}" tagged with unknown skill "${id}"`)
      }
    }
  }

  for (const roadmap of roadmaps) {
    if (!pathIds.has(roadmap.careerPathId)) {
      problems.push(`Roadmap "${roadmap.id}" targets unknown career path "${roadmap.careerPathId}"`)
    }

    const nodeSkillIds = new Set(roadmap.nodes.map((node) => node.skillId))
    const seen = new Set<string>()

    for (const node of roadmap.nodes) {
      if (!skillIds.has(node.skillId)) {
        problems.push(`Roadmap "${roadmap.id}" has a node for unknown skill "${node.skillId}"`)
      }
      if (seen.has(node.id)) {
        problems.push(`Roadmap "${roadmap.id}" has duplicate node "${node.id}"`)
      }
      seen.add(node.id)

      for (const dependency of node.dependsOn) {
        // A dependency on a skill absent from this roadmap can never be
        // satisfied from within it, which would strand the node as permanently
        // locked — the exact failure the UI cannot recover from.
        if (!nodeSkillIds.has(dependency)) {
          problems.push(
            `Roadmap "${roadmap.id}" node "${node.id}" depends on "${dependency}", which is not in this roadmap`,
          )
        }
        const dependencyNode = roadmap.nodes.find((other) => other.skillId === dependency)
        if (dependencyNode && dependencyNode.tier >= node.tier) {
          problems.push(
            `Roadmap "${roadmap.id}" node "${node.id}" (tier ${node.tier}) depends on "${dependency}" at tier ${dependencyNode.tier} — a dependency must sit in an earlier tier`,
          )
        }
      }
    }

    if (!roadmap.nodes.some((node) => node.importance === 'core')) {
      problems.push(`Roadmap "${roadmap.id}" has no core nodes, so progress can never move`)
    }
  }

  // ── Phase 4: projects ──────────────────────────────────────────────────────

  for (const project of projectTemplates) {
    for (const id of project.careerPathIds) {
      if (!pathIds.has(id)) {
        problems.push(`Project "${project.id}" references unknown career path "${id}"`)
      }
    }
    for (const id of project.skillIds) {
      if (!skillIds.has(id)) {
        problems.push(`Project "${project.id}" references unknown skill "${id}"`)
      }
    }
    for (const id of project.resourceIds) {
      if (!resourceIds.has(id)) {
        problems.push(`Project "${project.id}" references unknown resource "${id}"`)
      }
    }
    if (project.datasetId && !datasetById(project.datasetId)) {
      problems.push(`Project "${project.id}" references unknown dataset "${project.datasetId}"`)
    }

    const milestoneIds = new Set<string>()
    for (const milestone of project.milestones) {
      if (milestoneIds.has(milestone.id)) {
        problems.push(`Project "${project.id}" has duplicate milestone id "${milestone.id}"`)
      }
      milestoneIds.add(milestone.id)
    }

    if (project.milestones.length === 0) {
      problems.push(`Project "${project.id}" has no milestones, so it can never be completed`)
    }

    // Milestone 1 is where projects get abandoned. If it isn't small, the
    // project is mis-scoped regardless of how good the rest is.
    const first = project.milestones[0]
    if (first && first.estimatedHours > 3) {
      problems.push(
        `Project "${project.id}" opens with a ${first.estimatedHours}h milestone — the first step should be finishable in one sitting`,
      )
    }

    // The stated total should roughly match the sum of the parts, or the time
    // filter silently lies to the user.
    const summed = project.milestones.reduce((sum, m) => sum + m.estimatedHours, 0)
    if (Math.abs(summed - project.estimatedHours) > project.estimatedHours * 0.25) {
      problems.push(
        `Project "${project.id}" claims ~${project.estimatedHours}h but its milestones sum to ${summed}h`,
      )
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
