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
      // 磁盘路径：public/media/example.svg
      src: '/media/example.svg',
      alt: '本地图片示例',
    },
    description:
      '把图片放在 public/ 下，用以 / 开头的路径引用。例如 public/media/shot.jpg → src: \'/media/shot.jpg\'。',
  },
  {
    media: {
      type: 'video',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    },
    description:
      'This extends to my support for static typing, where its early error detection ensures cleaner code, and my preference for dark mode, which eases long coding sessions by reducing eye strain.',
  },
]
