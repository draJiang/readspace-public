import {
  READSPACE_DOWNLOAD_URL_OVERRIDE,
  READSPACE_GITHUB,
  readspaceLatestReleaseUrl,
  readspaceReleasesUrl,
  releaseAssetDownloadUrl,
} from 'app/config'
import {
  chooseInstallerUrl,
  detectPlatform,
  installerCandidates,
  installableAssets,
  parseLatestReleaseTag,
  versionFromTag,
  type DesktopPlatform,
  type ReleaseAsset,
} from 'app/lib/release-assets'

export type ReadspaceReleaseAsset = ReleaseAsset

export type ReadspaceReleaseInfo = {
  tagName: string | null
  assets: ReadspaceReleaseAsset[]
  releasesUrl: string
}

const GITHUB_API = 'https://api.github.com'

type ReleaseLookup = {
  platform: DesktopPlatform | null
  fetchImpl?: typeof fetch
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'readspace-public',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function fetchLatestReleaseAssets(
  fetchImpl: typeof fetch,
): Promise<ReadspaceReleaseInfo | null> {
  const response = await fetchImpl(
    `${GITHUB_API}/repos/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases/latest`,
    {
      headers: githubHeaders(),
      cache: 'no-store',
    },
  )

  if (!response.ok) return null

  const data = (await response.json()) as {
    tag_name?: string
    assets?: Array<{
      name: string
      browser_download_url: string
      size: number
    }>
  }

  const assets = installableAssets(
    (data.assets ?? []).map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url,
      size: asset.size,
    })),
  )

  if (assets.length === 0) return null

  return {
    tagName: data.tag_name ?? null,
    assets,
    releasesUrl: readspaceReleasesUrl,
  }
}

async function fetchLatestReleaseTag(
  fetchImpl: typeof fetch,
): Promise<string | null> {
  const response = await fetchImpl(readspaceLatestReleaseUrl, {
    redirect: 'manual',
    cache: 'no-store',
    headers: {
      Accept: 'text/html',
      'User-Agent': 'readspace-public',
    },
  })

  return parseLatestReleaseTag(response.headers.get('location'))
}

async function assetExists(
  fetchImpl: typeof fetch,
  url: string,
): Promise<boolean> {
  const response = await fetchImpl(url, {
    method: 'HEAD',
    redirect: 'manual',
    cache: 'no-store',
    headers: { 'User-Agent': 'readspace-public' },
  })
  return response.status === 200 || response.status === 302
}

/**
 * URL of the newest installer. Resolved on each download click so the
 * homepage never embeds a stale version, and a missing API response still
 * follows GitHub's /releases/latest redirect.
 */
export async function resolveLatestInstallerUrl({
  platform,
  fetchImpl = fetch,
}: ReleaseLookup): Promise<string> {
  const assetUrl = releaseAssetDownloadUrl
  let assets: ReleaseAsset[] = []

  if (!READSPACE_DOWNLOAD_URL_OVERRIDE) {
    try {
      assets = (await fetchLatestReleaseAssets(fetchImpl))?.assets ?? []
    } catch {
      assets = []
    }
  }

  if (READSPACE_DOWNLOAD_URL_OVERRIDE || assets.length > 0) {
    return chooseInstallerUrl({
      overrideUrl: READSPACE_DOWNLOAD_URL_OVERRIDE,
      assets,
      platform,
      tag: null,
      existingNames: new Set(),
      releasesUrl: readspaceReleasesUrl,
      assetUrl,
    })
  }

  let tag: string | null = null
  try {
    tag = await fetchLatestReleaseTag(fetchImpl)
  } catch {
    tag = null
  }

  if (!tag) return readspaceReleasesUrl

  const names = installerCandidates(platform, versionFromTag(tag))
  const existingNames = new Set<string>()
  for (const name of names) {
    try {
      if (await assetExists(fetchImpl, assetUrl(tag, name))) {
        existingNames.add(name)
        break
      }
    } catch {
      return chooseInstallerUrl({
        assets,
        platform,
        tag,
        existingNames: null,
        releasesUrl: readspaceReleasesUrl,
        assetUrl,
      })
    }
  }

  return chooseInstallerUrl({
    assets,
    platform,
    tag,
    existingNames,
    releasesUrl: readspaceReleasesUrl,
    assetUrl,
  })
}

export function platformFromDownloadRequest(request: Request): DesktopPlatform | null {
  const url = new URL(request.url)
  return detectPlatform(
    request.headers.get('user-agent'),
    url.searchParams.get('platform'),
  )
}
