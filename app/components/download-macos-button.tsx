import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MACOS_APP_DOWNLOAD_URL } from 'app/config'

export function DownloadMacOSButton() {
  return (
    <Button asChild size="lg">
      <a href={MACOS_APP_DOWNLOAD_URL} download>
        <Download data-icon="inline-start" />
        Download macOS App
      </a>
    </Button>
  )
}
