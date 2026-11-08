'use client'

import { useMemo } from 'react'
import type { ReadspaceReleaseAsset } from 'app/lib/readspace-release'

type DownloadInstallButtonProps = {
  assets: ReadspaceReleaseAsset[]
  fallbackHref: string
  overrideHref?: string
}

const INSTALLABLE_ASSET = /\.(dmg|zip|exe|msi|appimage)$/i

function installableAssets(
  assets: ReadspaceReleaseAsset[],
): ReadspaceReleaseAsset[] {
  return assets.filter((asset) => INSTALLABLE_ASSET.test(asset.name))
}

function pickAssetForPlatform(
  assets: ReadspaceReleaseAsset[],
): ReadspaceReleaseAsset | undefined {
  const candidates = installableAssets(assets)
  if (candidates.length === 0) {
    return undefined
  }

  if (typeof navigator === 'undefined') {
    return (
      candidates.find((asset) => /macos|darwin|\.dmg$/i.test(asset.name)) ??
      candidates[0]
    )
  }

  const ua = navigator.userAgent
  const rules: Array<{ match: boolean; pattern: RegExp }> = [
    { match: /Mac|iPhone|iPad/i.test(ua), pattern: /macos|darwin|osx|\.dmg$/i },
    { match: /Win/i.test(ua), pattern: /windows|win32|win64|\.exe$|\.msi$/i },
    { match: /Linux/i.test(ua), pattern: /linux|\.appimage$/i },
  ]

  for (const rule of rules) {
    if (!rule.match) continue
    const hit = candidates.find((asset) => rule.pattern.test(asset.name))
    if (hit) return hit
  }

  return candidates[0]
}

export function DownloadInstallButton({
  assets,
  fallbackHref,
  overrideHref,
}: DownloadInstallButtonProps) {
  const asset = useMemo(() => pickAssetForPlatform(assets), [assets])

  const href = overrideHref ?? asset?.url ?? fallbackHref
  const isDirectAsset =
    !overrideHref &&
    Boolean(asset?.url) &&
    INSTALLABLE_ASSET.test(asset?.name ?? '')

  return (
    <a
      href={href}
      {...(isDirectAsset && asset ? { download: asset.name } : {})}
      className="shrink-0 transition-all hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-md py-1 px-2.5 m-1 text-sm tracking-tight"
    >
      Download
    </a>
  )
}
