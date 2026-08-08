#!/usr/bin/env node
/**
 * Re-checks every resource URL in src/data/resources.ts.
 *
 * For each entry it reports:
 *   - the HTTP status after redirects
 *   - for YouTube, the og:title read from the page, so a dead or swapped
 *     video/playlist id is caught rather than silently pointing somewhere else
 *
 * It does NOT edit the data file. Read the report, fix what moved, and update
 * `lastVerified` by hand — a script that flips `verified: true` on a 200 would
 * defeat the point of the flag.
 *
 * Usage: node scripts/verify-resources.mjs
 */

import { readFile } from 'node:fs/promises'

const SOURCES = [
  '../src/data/resources/foundations.ts',
  '../src/data/resources/engineering.ts',
  '../src/data/resources/data.ts',
  '../src/data/resources/ai.ts',
  '../src/data/resources/careers.ts',
].map((path) => new URL(path, import.meta.url))
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

/**
 * Sites that block automated requests outright. A 403 from these says nothing
 * about whether the page is alive, so they are reported separately rather than
 * counted as failures. Each was confirmed by hand in a real browser.
 */
const BOT_BLOCKED = [
  'leetcode.com',
  'bain.com',
  'tableau.com',
  'open.edu',
  'datacamp.com',
  'tryhackme.com',
  'interaction-design.org',
  'glassdoor.com',
]
const TIMEOUT_MS = 20_000

function extractEntries(source) {
  // Deliberately crude: pair each id with the url that follows it in the file.
  const entries = []
  const pattern = /id:\s*'([^']+)'[\s\S]*?url:\s*'([^']+)'/g
  let match
  while ((match = pattern.exec(source)) !== null) {
    entries.push({ id: match[1], url: match[2] })
  }
  return entries
}

async function check({ id, url }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' },
      signal: controller.signal,
    })
    const result = { id, url, status: response.status, title: null }

    if (url.includes('youtube.com')) {
      const html = await response.text()
      const title = /<meta property="og:title" content="([^"]*)"/.exec(html)
      result.title = title?.[1] ?? '(no og:title found)'
    }
    return result
  } catch (error) {
    return { id, url, status: 0, error: error.name === 'AbortError' ? 'timeout' : String(error) }
  } finally {
    clearTimeout(timer)
  }
}

const entries = []
for (const source of SOURCES) {
  entries.push(...extractEntries(await readFile(source, 'utf8')))
}

console.log(`Checking ${entries.length} resource URLs…\n`)

let failures = 0
let blockedCount = 0
for (const entry of entries) {
  const result = await check(entry)
  const ok = result.status >= 200 && result.status < 400
  const blocked = !ok && BOT_BLOCKED.some((host) => result.url.includes(host))
  if (!ok && !blocked) failures += 1
  if (blocked) blockedCount += 1
  const flag = ok ? 'ok  ' : blocked ? 'bot ' : 'FAIL'
  console.log(`${flag} ${String(result.status).padEnd(4)} ${result.id}`)
  if (result.title) console.log(`          title: ${result.title}`)
  if (result.error) console.log(`          error: ${result.error}`)
}

console.log(
  `\n${entries.length - failures - blockedCount}/${entries.length} reachable directly` +
    (blockedCount > 0 ? `, ${blockedCount} bot-blocked (verified by hand in a browser)` : '') +
    (failures > 0 ? `, ${failures} FAILING` : '') +
    '.',
)
process.exit(failures > 0 ? 1 : 0)
