import { HomeSections } from 'app/components/home-sections'
import { DownloadMacOSButton } from 'app/components/download-macos-button'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <div className="mb-10">
        <DownloadMacOSButton />
      </div>
      <HomeSections />
    </section>
  )
}
