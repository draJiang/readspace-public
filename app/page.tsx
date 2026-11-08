import { BlogPosts } from 'app/components/posts'
import { homeContent, type HomeMedia } from 'app/home/content'

function Media({ media }: { media: HomeMedia }) {
  if (media.type === 'video') {
    return (
      <video
        className="w-full"
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        preload="metadata"
      />
    )
  }

  return (
    <img className="w-full" src={media.src} alt={media.alt ?? ''} />
  )
}

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {homeContent.title}
      </h1>
      {homeContent.sections.map((section, index) => (
        <div key={`${section.media.src}-${index}`}>
          <div className="mb-4">
            <Media media={section.media} />
          </div>
          <p className="mb-4">{section.description}</p>
        </div>
      ))}
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
