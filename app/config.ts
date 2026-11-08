/**
 * Readspace installation packages are published on GitHub Releases
 * (same idea as jietu: versioned assets per platform in each release).
 */
export const READSPACE_GITHUB = {
  owner: 'draJiang',
  repo: 'readspace',
} as const

export const readspaceReleasesUrl = `https://github.com/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases`

/**
 * Used when the Releases API is unavailable (private repo, rate limit, etc.)
 * to build direct `releases/download/{tag}/{asset}` links.
 */
export const READSPACE_RELEASE_TAG =
  process.env.NEXT_PUBLIC_READSPACE_RELEASE_TAG ??
  process.env.READSPACE_RELEASE_TAG ??
  'v0.1.1'

/** Optional override when no release exists yet or for a fixed asset URL. */
export const READSPACE_DOWNLOAD_URL_OVERRIDE =
  process.env.NEXT_PUBLIC_READSPACE_DOWNLOAD_URL

export function releaseAssetDownloadUrl(tag: string, filename: string): string {
  return `https://github.com/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(filename)}`
}
