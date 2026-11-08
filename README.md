# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Demo

https://portfolio-blog-starter.vercel.app

## Configure the homepage

The homepage keeps the original layout (heading, body copy, then the blog list). Text and media come from `app/home/content.ts`. Edit `homeContent` there — no CSS changes.

```ts
export const homeContent = {
  title: 'My Portfolio',
  sections: [
    {
      media: { type: 'image', src: '/media/shot.jpg', alt: 'Project shot' },
      description: 'A short caption for this piece.',
    },
    {
      media: {
        type: 'video',
        src: '/media/demo.mp4',
        poster: '/media/demo-poster.jpg',
      },
      description: 'Optional poster frame + description under the video.',
    },
  ],
}
```

Sections render top to bottom, in the same type and spacing as the original page. Put local files in `public/` (paths start with `/`), or use a remote URL. Blog posts stay below the sections and still come from `app/blog/posts`.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).
