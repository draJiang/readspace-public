import { site } from 'app/config'

export default function Footer() {
  return (
    <footer className="mb-16">
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="min-w-0 text-neutral-600 dark:text-neutral-300">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <a
          href="/download"
          className="shrink-0 transition-all hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-md py-1 px-2.5 m-1 text-sm tracking-tight"
        >
           Download
        </a>
      </div>
    </footer>
  )
}
