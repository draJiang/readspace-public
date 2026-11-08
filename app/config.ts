/**
 * Public download URL for the macOS app.
 * Point this at a .dmg / GitHub release asset when available.
 */
export const MACOS_APP_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_MACOS_APP_DOWNLOAD_URL ??
  '/downloads/macos-app.dmg'
