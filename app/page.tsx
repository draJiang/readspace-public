import Image from 'next/image'
import { HomeSections } from 'app/components/home-sections'
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
      <HomeSections />
    </section>
  )
}
