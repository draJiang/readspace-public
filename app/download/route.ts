import { NextResponse } from 'next/server'
import {
  platformFromDownloadRequest,
  resolveLatestInstallerUrl,
} from 'app/lib/readspace-release'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = await resolveLatestInstallerUrl({
    platform: platformFromDownloadRequest(request),
  })

  const response = NextResponse.redirect(url, 302)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
