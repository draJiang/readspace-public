import { homeSections, type HomeMedia, type HomeSection } from 'app/home/content'

function Media({ media }: { media: HomeMedia }) {
  if (media.type === 'video') {
    return (
      <video
        className="w-full h-auto"
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        preload="metadata"
      />
    )
  }

  return (
    <img
      className="w-full h-auto"
      src={media.src}
      alt={media.alt ?? ''}
      loading="lazy"
      decoding="async"
    />
  )
}

function Section({ section }: { section: HomeSection }) {
  return (
    <article className="flex flex-col gap-3">
      <Media media={section.media} />
      <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
        {section.description}
      </p>
    </article>
  )
}

export function HomeSections() {
  return (
    <div className="flex flex-col gap-12">
      {homeSections.map((section, index) => (
        <Section key={`${section.media.src}-${index}`} section={section} />
      ))}
    </div>
  )
}
