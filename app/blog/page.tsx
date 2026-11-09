import { BlogPosts } from 'app/components/posts'
import { site } from 'app/config'

export const metadata = {
  title: 'Blog',
  description: `News and updates from the ${site.name} team.`,
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
