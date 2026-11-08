/**
 * Readspace installation packages are published on GitHub Releases
 * (same idea as jietu: versioned assets per platform in each release).
 */
export const READSPACE_GITHUB = {
  owner: 'draJiang',
  repo: 'readspace',
} as const

export const readspaceReleasesUrl = `https://github.com/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases`

/** Optional override when no release exists yet or for a fixed asset URL. */
export const READSPACE_DOWNLOAD_URL_OVERRIDE =
  process.env.NEXT_PUBLIC_READSPACE_DOWNLOAD_URL
