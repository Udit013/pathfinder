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

const SOURCE = new URL('../src/data/resources.ts', import.meta.url)
const UA = 'Mozilla/5.0 (compatible; PathFinder resource verifier)'
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
      headers: { 'user-agent': UA },
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

const source = await readFile(SOURCE, 'utf8')
const entries = extractEntries(source)

console.log(`Checking ${entries.length} resource URLs…\n`)

let failures = 0
for (const entry of entries) {
  const result = await check(entry)
  const ok = result.status >= 200 && result.status < 400
  if (!ok) failures += 1
  const flag = ok ? 'ok  ' : 'FAIL'
  console.log(`${flag} ${String(result.status).padEnd(4)} ${result.id}`)
  if (result.title) console.log(`          title: ${result.title}`)
  if (result.error) console.log(`          error: ${result.error}`)
}

console.log(
  `\n${entries.length - failures}/${entries.length} reachable.` +
    (failures > 0 ? ` Fix the ${failures} failing entr${failures === 1 ? 'y' : 'ies'}.` : ''),
)
process.exit(failures > 0 ? 1 : 0)
