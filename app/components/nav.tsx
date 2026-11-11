import Link from 'next/link'

const navItems = {
  '/': {
    name: 'home',
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between gap-4 relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative w-full"
          id="nav"
        >
          <div className="flex flex-row space-x-0 min-w-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <a
            href="/download"
            className="shrink-0 transition-all hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-md py-1 px-2.5 m-1 text-sm tracking-tight"
          >
             Download
          </a>
        </nav>
      </div>
    </aside>
  )
}
