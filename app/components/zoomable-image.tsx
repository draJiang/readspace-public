'use client'

import { XIcon } from 'lucide-react'

import { Button } from 'app/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from 'app/components/ui/dialog'

export function ZoomableImage({
  src,
  alt = '',
}: {
  src: string
  alt?: string
}) {
  const title = alt || 'Image preview'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
          className="block w-full cursor-zoom-in rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            className="block h-auto w-full"
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-0 right-0 bottom-0 left-0 flex h-dvh w-screen max-h-none max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:h-auto sm:w-fit sm:max-w-[calc(100vw-2rem)] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:overflow-visible"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
        }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Enlarged view of the image. Press Escape or use the close button to
          return.
        </DialogDescription>
        <div className="h-full w-full max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-contain sm:h-auto sm:w-auto">
          <img
            src={src}
            alt={alt}
            className="block h-full w-auto max-w-none sm:hidden"
          />
          <DialogClose
            aria-label="Close enlarged image"
            className="hidden cursor-zoom-out border-0 bg-transparent p-0 sm:block"
          >
            <img
              src={src}
              alt={alt}
              className="block h-auto max-h-[90vh] w-auto max-w-[calc(100vw-2rem)] rounded-md object-contain shadow-2xl"
            />
          </DialogClose>
        </div>
        <DialogClose asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Close"
            className="absolute top-3 right-3 z-10 size-11 rounded-full border-black/10 bg-white/95 text-neutral-900 shadow-md hover:bg-white dark:border-white/20 dark:bg-neutral-950/95 dark:text-white dark:hover:bg-neutral-900"
          >
            <XIcon className="size-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
