export type HomeMedia =
  | {
      type: 'image'
      src: string
      alt?: string
    }
  | {
      type: 'video'
      src: string
      poster?: string
    }

export type HomeSection = {
  media: HomeMedia
  description: string
}

/**
 * Homepage content. Add / edit / reorder items here.
 * Put local files under `public/` (e.g. `/media/shot.jpg`) or use remote URLs.
 */
export const homeSections: HomeSection[] = [
  {
    media: {
      type: 'image',
      src: '/media/quipu-workspace.png',
      alt: 'Quipu workspace with an EPUB reader alongside a whiteboard canvas of highlights and notes',
    },
    description:
      'Read EPUBs, highlight passages, and organize your ideas on a whiteboard—bringing in your existing knowledge to build deeper understanding.',
  },
  {
    media: {
      type: 'video',
      src: '/media/boox-sync.mp4',
      poster: '/media/boox-sync-poster.jpg',
    },
    description:
      'Integrates with third-party e-readers (currently supporting BOOX) to sync your reading progress and highlights seamlessly across devices.',
  },
  {
    media: {
      type: 'image',
      src: '/media/quipu-local-files.png',
      alt: 'Quipu whiteboard alongside an Obsidian canvas sharing local Markdown files',
    },
    description:
      'Built around Obsidian\'s "file over app" philosophy—all your data is stored locally in open formats like Markdown, so it works seamlessly alongside Obsidian.\n\nNo data tracking. AI is off by default and only enabled when you provide your own API key.',
  },
]
