import assert from 'node:assert/strict'
import test from 'node:test'
import {
  chooseInstallerUrl,
  detectPlatform,
  installerCandidates,
  parseLatestReleaseTag,
  pickInstallableAsset,
  type ReleaseAsset,
} from './release-assets.ts'

const assets: ReleaseAsset[] = [
  {
    name: 'latest.json',
    url: 'https://example.com/latest.json',
    size: 10,
  },
  {
    name: 'readspace-macos-0.1.2.app.tar.gz',
    url: 'https://example.com/app.tar.gz',
    size: 20,
  },
  {
    name: 'readspace-macos-0.1.2.dmg',
    url: 'https://example.com/mac.dmg',
    size: 30,
  },
  {
    name: 'readspace-windows-0.1.2.zip',
    url: 'https://example.com/win.zip',
    size: 40,
  },
]

test('ignores updater archives and picks the platform installer', () => {
  assert.equal(pickInstallableAsset(assets, 'macos')?.name, 'readspace-macos-0.1.2.dmg')
  assert.equal(pickInstallableAsset(assets, 'windows')?.name, 'readspace-windows-0.1.2.zip')
  assert.equal(pickInstallableAsset(assets, null)?.name, 'readspace-macos-0.1.2.dmg')
  assert.equal(
    pickInstallableAsset(
      assets.filter((asset) => asset.name.endsWith('.dmg')),
      'linux',
    )?.name,
    'readspace-macos-0.1.2.dmg',
  )
})

test('detects platform from an explicit query or user agent', () => {
  assert.equal(detectPlatform('Mozilla/5.0 (Windows NT 10.0)', null), 'windows')
  assert.equal(detectPlatform('Mozilla/5.0 (Windows NT 10.0)', 'macos'), 'macos')
  assert.equal(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)', null), 'linux')
  assert.equal(detectPlatform('', null), null)
})

test('builds versioned installer names and falls back to the macOS dmg', () => {
  assert.deepEqual(installerCandidates('macos', '0.1.2'), ['readspace-macos-0.1.2.dmg'])
  assert.deepEqual(installerCandidates(null, '0.1.2'), ['readspace-macos-0.1.2.dmg'])
  assert.deepEqual(installerCandidates('linux', '0.1.2'), [
    'readspace-linux-0.1.2.AppImage',
    'readspace-macos-0.1.2.dmg',
  ])
})

test('prefers the live release asset over a pinned filename', () => {
  const releasesUrl = 'https://github.com/draJiang/readspace-public/releases'
  const assetUrl = (tag: string, filename: string) =>
    `https://github.com/draJiang/readspace-public/releases/download/${tag}/${filename}`

  assert.equal(
    chooseInstallerUrl({
      assets,
      platform: 'macos',
      tag: 'v0.0.1',
      existingNames: new Set(),
      releasesUrl,
      assetUrl,
    }),
    'https://example.com/mac.dmg',
  )

  assert.equal(
    chooseInstallerUrl({
      assets: [],
      platform: 'macos',
      tag: 'v0.1.2',
      existingNames: new Set(['readspace-macos-0.1.2.dmg']),
      releasesUrl,
      assetUrl,
    }),
    'https://github.com/draJiang/readspace-public/releases/download/v0.1.2/readspace-macos-0.1.2.dmg',
  )

  assert.equal(
    chooseInstallerUrl({
      assets: [],
      platform: 'windows',
      tag: 'v0.1.2',
      existingNames: new Set([
        'readspace-windows-0.1.2.zip',
        'readspace-macos-0.1.2.dmg',
      ]),
      releasesUrl,
      assetUrl,
    }),
    'https://github.com/draJiang/readspace-public/releases/download/v0.1.2/readspace-windows-0.1.2.zip',
  )

  assert.equal(
    chooseInstallerUrl({
      assets: [],
      platform: 'windows',
      tag: 'v0.1.2',
      existingNames: new Set(['readspace-macos-0.1.2.dmg']),
      releasesUrl,
      assetUrl,
    }),
    'https://github.com/draJiang/readspace-public/releases/download/v0.1.2/readspace-macos-0.1.2.dmg',
  )

  assert.equal(
    chooseInstallerUrl({
      assets: [],
      platform: null,
      tag: null,
      existingNames: new Set(),
      releasesUrl,
      assetUrl,
    }),
    releasesUrl,
  )
})

test('reads the latest tag from a GitHub releases redirect', () => {
  assert.equal(
    parseLatestReleaseTag(
      'https://github.com/draJiang/readspace-public/releases/tag/v0.1.2',
    ),
    'v0.1.2',
  )
  assert.equal(
    parseLatestReleaseTag('/draJiang/readspace-public/releases/tag/v1.2.3'),
    'v1.2.3',
  )
  assert.equal(parseLatestReleaseTag('https://github.com/draJiang/readspace-public/releases'), null)
  assert.equal(parseLatestReleaseTag(null), null)
})
