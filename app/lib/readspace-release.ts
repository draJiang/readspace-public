import {
  READSPACE_GITHUB,
  readspaceReleasesUrl,
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

export async function fetchReadspaceRelease(): Promise<ReadspaceReleaseInfo> {
  const fallback: ReadspaceReleaseInfo = {
    tagName: null,
    assets: [],
    releasesUrl: readspaceReleasesUrl,
  }

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

    if (!response.ok) {
      return fallback
    }

    const data = (await response.json()) as {
      tag_name?: string
      assets?: Array<{
        name: string
        browser_download_url: string
        size: number
      }>
    }

    return {
      tagName: data.tag_name ?? null,
      assets: (data.assets ?? []).map((asset) => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size,
      })),
      releasesUrl: readspaceReleasesUrl,
    }
  } catch {
    return fallback
  }
}
