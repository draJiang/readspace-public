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

const INSTALLABLE_ASSET = /\.(dmg|zip|exe|msi|appimage)$/i

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
  ]
  return filenames.map((name) => ({
    name,
    url: releaseAssetDownloadUrl(tag, name),
    size: 0,
  }))
}

export async function fetchReadspaceRelease(): Promise<ReadspaceReleaseInfo> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${READSPACE_GITHUB.owner}/${READSPACE_GITHUB.repo}/releases/latest`,
      { headers, next: { revalidate: 600 } },
    )

    if (response.ok) {
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

      if (assets.length > 0) {
        return {
          tagName: data.tag_name ?? null,
          assets,
          releasesUrl: readspaceReleasesUrl,
        }
      }
    }

    const tagAssets = staticReleaseAssets(READSPACE_RELEASE_TAG)
    return {
      tagName: READSPACE_RELEASE_TAG,
      assets: tagAssets,
      releasesUrl: readspaceReleasesUrl,
    }
  } catch {
    const tagAssets = staticReleaseAssets(READSPACE_RELEASE_TAG)
    return {
      tagName: READSPACE_RELEASE_TAG,
      assets: tagAssets,
      releasesUrl: readspaceReleasesUrl,
    }
  }
}
