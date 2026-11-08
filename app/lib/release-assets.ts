export type ReleaseAsset = {
  name: string
  url: string
  size: number
}

export type DesktopPlatform = 'macos' | 'windows' | 'linux'

const INSTALLABLE_ASSET = /\.(dmg|zip|exe|msi|appimage)$/i

const PLATFORM_ASSET: Record<DesktopPlatform, RegExp> = {
  macos: /macos|darwin|osx|\.dmg$/i,
  windows: /windows|win32|win64|\.exe$|\.msi$/i,
  linux: /linux|\.appimage$/i,
}

export function installableAssets(assets: ReleaseAsset[]): ReleaseAsset[] {
  return assets.filter((asset) => INSTALLABLE_ASSET.test(asset.name))
}

export function detectPlatform(
  userAgent: string | null,
  explicit: string | null,
): DesktopPlatform | null {
  const value = explicit?.trim().toLowerCase()
  if (value === 'macos' || value === 'mac' || value === 'darwin') return 'macos'
  if (value === 'windows' || value === 'win') return 'windows'
  if (value === 'linux') return 'linux'

  const ua = userAgent ?? ''
  if (/Mac|iPhone|iPad/i.test(ua)) return 'macos'
  if (/Win/i.test(ua)) return 'windows'
  if (/Linux/i.test(ua)) return 'linux'
  return null
}

/**
 * Installers to try, most specific first.
 * macOS is the only package shipped today, so other platforms fall back to the DMG.
 */
export function installerCandidates(
  platform: DesktopPlatform | null,
  version: string,
): string[] {
  const dmg = `readspace-macos-${version}.dmg`
  if (platform === 'windows') {
    return [
      `readspace-windows-${version}.zip`,
      `readspace-windows-${version}.msi`,
      dmg,
    ]
  }
  if (platform === 'linux') {
    return [`readspace-linux-${version}.AppImage`, dmg]
  }
  return [dmg]
}

export function pickInstallableAsset(
  assets: ReleaseAsset[],
  platform: DesktopPlatform | null,
): ReleaseAsset | undefined {
  const candidates = installableAssets(assets)
  if (candidates.length === 0) return undefined
  if (platform) {
    const match = candidates.find((asset) =>
      PLATFORM_ASSET[platform].test(asset.name),
    )
    if (match) return match
  }
  return (
    candidates.find((asset) => PLATFORM_ASSET.macos.test(asset.name)) ??
    candidates[0]
  )
}

/** Tag from the Location of GET /releases/latest (absolute or relative). */
export function parseLatestReleaseTag(location: string | null): string | null {
  if (!location) return null
  try {
    const url = new URL(location, 'https://github.com')
    const match = url.pathname.match(/\/releases\/tag\/([^/]+)\/?$/)
    if (!match?.[1]) return null
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export function versionFromTag(tag: string): string {
  return tag.replace(/^v/, '')
}

/**
 * Pick a download URL from a latest-release lookup.
 * `existingNames === null` means the filename probe failed open (network),
 * so the first conventional name is used. An empty set means every probe
 * returned "not found".
 */
export function chooseInstallerUrl(options: {
  overrideUrl?: string
  assets: ReleaseAsset[]
  platform: DesktopPlatform | null
  tag: string | null
  existingNames: ReadonlySet<string> | null
  releasesUrl: string
  assetUrl: (tag: string, filename: string) => string
}): string {
  if (options.overrideUrl) return options.overrideUrl

  const picked = pickInstallableAsset(options.assets, options.platform)
  if (picked) return picked.url
  if (!options.tag) return options.releasesUrl

  const names = installerCandidates(
    options.platform,
    versionFromTag(options.tag),
  )
  if (options.existingNames === null) {
    return options.assetUrl(options.tag, names[0])
  }

  const found = names.find((name) => options.existingNames?.has(name))
  if (found) return options.assetUrl(options.tag, found)
  return options.releasesUrl
}
