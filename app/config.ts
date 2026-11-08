/**
 * Readspace installation packages are published on GitHub Releases.
 * The nav Download link hits /download, which resolves releases/latest
 * on each click (versioned assets such as readspace-macos-<version>.dmg).
 */
export const READSPACE_GITHUB = {
  owner: 'draJiang',
  repo: 'readspace-public',
} as const

export const readspaceReleasesUrl = `https://github.com/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases`

export const readspaceLatestReleaseUrl = `${readspaceReleasesUrl}/latest`

/** Optional fixed asset URL. When set, /download always redirects here. */
export const READSPACE_DOWNLOAD_URL_OVERRIDE =
  process.env.NEXT_PUBLIC_READSPACE_DOWNLOAD_URL

export function releaseAssetDownloadUrl(tag: string, filename: string): string {
  return `https://github.com/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(filename)}`
}
