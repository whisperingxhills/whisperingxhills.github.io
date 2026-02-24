import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Disc3, Cpu } from 'lucide-react'
import FadeIn from '../components/FadeIn'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-matte-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(187,31,31,0.08)_0%,_transparent_70%)]" />
        <div className="relative text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-cream tracking-widest"
          >
            whispering hills
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-cream/50 text-lg md:text-xl tracking-wide font-light"
          >
            sound. vision. system.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10"
          >
            <Link
              to="/music"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-accent hover:bg-red-hover text-cream text-sm tracking-wider rounded transition-colors"
            >
              explore <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-light text-matte-black tracking-wide">
              built different
            </h2>
            <p className="mt-6 text-soft-gray/80 text-lg leading-relaxed max-w-2xl mx-auto">
              whispering hills is a canon-driven creative system — music, tools, 
              and infrastructure designed to compound. no shortcuts. no borrowed identity. 
              everything from the source.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Music section */}
      <section className="py-24 px-6 bg-matte-black">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-12">
              <Disc3 className="text-red-accent" size={24} />
              <h2 className="text-2xl md:text-3xl font-light text-cream tracking-wide">
                releases
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-soft-gray rounded-lg flex items-center justify-center"
                >
                  <p className="text-cream/20 text-sm">coming soon</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center">
              <Link
                to="/music"
                className="text-cream/50 hover:text-red-accent text-sm tracking-wide transition-colors"
              >
                view all releases →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Hills DSP section */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-red-accent" size={24} />
              <h2 className="text-2xl md:text-3xl font-light text-matte-black tracking-wide">
                hillsxdsp
              </h2>
            </div>
            <p className="text-soft-gray/70 text-lg max-w-2xl leading-relaxed">
              affordable, focused audio plugins for producers who care about sound — not subscriptions. 
              one-time purchase. no fluff.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-matte-black rounded-lg">
                <h3 className="text-cream text-lg font-medium">sit down!</h3>
                <p className="text-cream/50 text-sm mt-2">transient shaper — $15</p>
                <p className="text-cream/30 text-xs mt-4">vst3 + au • macos</p>
              </div>
              <div className="p-6 bg-matte-black rounded-lg">
                <h3 className="text-cream text-lg font-medium">wet-n-wide!</h3>
                <p className="text-cream/50 text-sm mt-2">stereo widener — $10</p>
                <p className="text-cream/30 text-xs mt-4">coming soon</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8">
              <Link
                to="/dsp"
                className="inline-flex items-center gap-2 text-red-accent hover:text-red-hover text-sm tracking-wide transition-colors"
              >
                browse all plugins <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
