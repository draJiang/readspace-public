import {
  READSPACE_GITHUB,
  READSPACE_RELEASE_TAG,
  readspaceReleasesUrl,
  releaseAssetDownloadUrl,
} from 'app/config'

export type ReadspaceReleaseAsset = {
  name: string
  url: string
  size: number
}

export type ReadspaceReleaseInfo = {
  tagName: string | null
  assets: ReadspaceReleaseAsset[]
  releasesUrl: string
}

const GITHUB_API = 'https://api.github.com'

const INSTALLABLE_ASSET = /\.(dmg|zip|exe|msi|appimage|tar\.gz)$/i

type LatestJsonManifest = {
  version?: string
  platforms?: Record<
    string,
    {
      url?: string
      signature?: string
    }
  >
}

function installableAssets(
  assets: ReadspaceReleaseAsset[],
): ReadspaceReleaseAsset[] {
  return assets.filter((asset) => INSTALLABLE_ASSET.test(asset.name))
}

function staticReleaseAssets(tag: string): ReadspaceReleaseAsset[] {
  const version = tag.replace(/^v/, '')
  const filenames = [
    `readspace-macos-${version}.dmg`,
    `readspace-windows-${version}.zip`,
    `readspace-linux-${version}.AppImage`,
    `readspace-macos-${version}.app.tar.gz`,
  ]
  return filenames.map((name) => ({
    name,
    url: releaseAssetDownloadUrl(tag, name),
    size: 0,
  }))
}

function assetsFromLatestJson(
  manifest: LatestJsonManifest,
): ReadspaceReleaseAsset[] {
  const platforms = manifest.platforms ?? {}
  const assets: ReadspaceReleaseAsset[] = []

  for (const [platform, info] of Object.entries(platforms)) {
    const url = info?.url?.trim()
    if (!url) continue

    let name: string
    try {
      name = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '')
    } catch {
      name = `${platform}.bin`
    }

    if (!name) {
      name = `${platform}.bin`
    }

    assets.push({ name, url, size: 0 })
  }

  return installableAssets(assets)
}

function githubRequestHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

async function fetchLatestJson(
  headers: HeadersInit,
  latestJsonAssetUrl?: string,
): Promise<LatestJsonManifest | null> {
  const urls: string[] = []

  if (latestJsonAssetUrl) {
    urls.push(latestJsonAssetUrl)
  }

  urls.push(releaseAssetDownloadUrl(READSPACE_RELEASE_TAG, 'latest.json'))

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 600 },
      })
      if (!response.ok) continue
      return (await response.json()) as LatestJsonManifest
    } catch {
      continue
    }
  }

  return null
}

export async function fetchReadspaceRelease(): Promise<ReadspaceReleaseInfo> {
  const headers = githubRequestHeaders()

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases/latest`,
      { headers, next: { revalidate: 600 } },
    )

    let latestJsonAssetUrl: string | undefined

    if (response.ok) {
      const data = (await response.json()) as {
        tag_name?: string
        assets?: Array<{
          name: string
          browser_download_url: string
          size: number
        }>
      }

      latestJsonAssetUrl = data.assets?.find(
        (asset) => asset.name === 'latest.json',
      )?.browser_download_url

      const assets = installableAssets(
        (data.assets ?? []).map((asset) => ({
          name: asset.name,
          url: asset.browser_download_url,
          size: asset.size,
        })),
      )

      if (assets.length > 0) {
        return {
          tagName: data.tag_name ?? null,
          assets,
          releasesUrl: readspaceReleasesUrl,
        }
      }
    }

    const manifest = await fetchLatestJson(headers, latestJsonAssetUrl)
    if (manifest) {
      const assets = assetsFromLatestJson(manifest)
      if (assets.length > 0) {
        const version = manifest.version?.trim()
        const tagName = version
          ? version.startsWith('v')
            ? version
            : `v${version}`
          : null
        return {
          tagName,
          assets,
          releasesUrl: readspaceReleasesUrl,
        }
      }
    }

    const tagAssets = staticReleaseAssets(READSPACE_RELEASE_TAG)
    return {
      tagName: READSPACE_RELEASE_TAG,
      assets: installableAssets(tagAssets),
      releasesUrl: readspaceReleasesUrl,
    }
  } catch {
    const tagAssets = staticReleaseAssets(READSPACE_RELEASE_TAG)
    return {
      tagName: READSPACE_RELEASE_TAG,
      assets: installableAssets(tagAssets),
      releasesUrl: readspaceReleasesUrl,
    }
  }
}
