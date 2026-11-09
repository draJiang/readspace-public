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
      // File path on disk: public/media/home_1.png
      src: '/media/home_1.png',
      alt: 'readspace',
    },
    description:
      '',
  }
]
