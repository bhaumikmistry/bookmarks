/**
 * Builds api.json from every issue in this repo.
 *
 * Adapted from the sibling `reads` repo. Two differences: a bookmark has no
 * to-read/read state, so issue state is ignored and closed issues render the
 * same as open ones, and the body can carry a description on its second line.
 */

const [REPO_OWNER, REPO_NAME] = (process.env.GITHUB_REPOSITORY || 'bhaumikmistry/bookmarks').split('/')
const TOKEN = process.env.GITHUB_TOKEN

if (!TOKEN) {
  console.error('Missing GITHUB_TOKEN')
  process.exit(1)
}

async function ghFetch(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function getAllIssues() {
  let page = 1
  let all = []
  while (true) {
    const issues = await ghFetch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=100&page=${page}`
    )
    if (issues.length === 0) break
    all = all.concat(issues)
    page++
  }
  return all
}

/**
 * First non-empty line is the URL, the next one is the description. A body that
 * does not start with a URL still produces an entry, with an empty url, so a
 * malformed bookmark is visible on the site instead of silently missing.
 */
function parseBody(body) {
  const lines = (body || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const url = lines[0] || ''
  const isUrl = url.startsWith('http://') || url.startsWith('https://')
  return {
    url: isUrl ? url : '',
    description: (isUrl ? lines[1] : lines[0]) || '',
  }
}

async function main() {
  const issues = await getAllIssues()
  console.log(`Found ${issues.length} issues`)

  const bookmarks = issues
    .filter((i) => !i.pull_request)
    .map((issue) => ({
      id: issue.number,
      title: issue.title.trim(),
      ...parseBody(issue.body),
      createdAt: issue.created_at,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const { writeFileSync } = await import('fs')
  writeFileSync('api.json', JSON.stringify(bookmarks, null, 2) + '\n')

  const missing = bookmarks.filter((b) => !b.url).length
  console.log(`Written api.json with ${bookmarks.length} entries`)
  if (missing) console.log(`  ${missing} with no usable URL`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
