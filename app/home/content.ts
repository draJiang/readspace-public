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
 * Homepage copy. Edit this file to change the title and the vertical
 * list of image/video + description. Styling stays on the original page.
 * Local files live in `public/` and use paths like `/media/shot.jpg`.
 * Remote URLs work too.
 */
export const homeContent = {
  title: 'My Portfolio',
  sections: [
    {
      media: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        alt: 'Laptop on a desk',
      },
      description:
        "I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in Vim's keystroke commands and tabs' flexibility for personal viewing preferences.",
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
  ] satisfies HomeSection[],
}
