import FadeIn from '../components/FadeIn'

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-6 bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-light text-matte-black tracking-wide">
            about
          </h1>
          <div className="mt-8 space-y-6 text-soft-gray/80 text-lg leading-relaxed">
            <p>
              whispering hills is a creative ecosystem built on canon — 
              music, audio tools, and visual identity that compounds over time.
            </p>
            <p>
              we don't chase trends. we build systems. every release, every plugin, 
              every pixel connects back to the same source. raw authenticity over polish. 
              first-party over borrowed.
            </p>
            <p>
              founded and operated from fresno, california.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
