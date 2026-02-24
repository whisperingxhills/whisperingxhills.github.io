import FadeIn from '../components/FadeIn'

export default function MusicPage() {
  return (
    <div className="pt-24 pb-16 px-6 bg-matte-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-light text-cream tracking-wide">
            music
          </h1>
          <p className="mt-4 text-cream/50 text-lg">
            releases from the whispering hills catalog.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-soft-gray rounded-lg overflow-hidden flex items-center justify-center group-hover:ring-2 ring-red-accent transition-all">
                  <p className="text-cream/20 text-sm">coming soon</p>
                </div>
                <p className="mt-3 text-cream/40 text-sm">track {i + 1}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
