import Image from 'next/image'
import { BadgeCheckIcon } from 'lucide-react'
import { HomeSections } from 'app/components/home-sections'
import { Alert, AlertDescription, AlertTitle } from 'app/components/ui/alert'
import { site } from 'app/config'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 flex items-center gap-3 text-2xl font-semibold tracking-tighter">
        <Image
          src="/quipu.svg"
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="size-8 rounded-lg border border-black/5 dark:border-white/10 shadow-xs"
          priority
          unoptimized
        />
        <span>{site.name}</span>
      </h1>
      <Alert className="mb-8">
        <BadgeCheckIcon />
        <AlertTitle className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold tracking-tight">$9.99</span>
          <span>Lifetime License.</span>
        </AlertTitle>
        <AlertDescription>
          7-Day Money-Back Guarantee — No Questions Asked.
        </AlertDescription>
      </Alert>
      <HomeSections />
    </section>
  )
}
