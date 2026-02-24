import { Cpu } from 'lucide-react'
import FadeIn from '../components/FadeIn'

const plugins = [
  { name: 'sit down!', desc: 'transient shaper', price: '$15', status: 'available' },
  { name: 'wet-n-wide!', desc: 'stereo widener (microshift)', price: '$10', status: 'coming soon' },
  { name: 'devil-loc', desc: 'distortion/compression', price: '$10', status: 'coming soon' },
  { name: 'decapitator', desc: 'analog saturation', price: '$15', status: 'coming soon' },
  { name: 'vintageverb', desc: 'classic reverb', price: '$15', status: 'coming soon' },
  { name: 'delay/scatter', desc: 'creative delay', price: '$15', status: 'coming soon' },
  { name: 'vocal glitcher', desc: 'vocal fx processor', price: '$15', status: 'coming soon' },
  { name: 'ad-lib + bgv chain', desc: 'vocal chain preset engine', price: '$15', status: 'coming soon' },
  { name: 'nyc vocal chain', desc: 'full vocal processing', price: '$20', status: 'coming soon' },
  { name: '808 player', desc: 'sample-based 808 engine', price: '$20', status: 'coming soon' },
]

export default function DspPage() {
  return (
    <div className="pt-24 pb-16 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Cpu className="text-red-accent" size={28} />
            <h1 className="text-4xl md:text-5xl font-light text-matte-black tracking-wide">
              hillsxdsp
            </h1>
          </div>
          <p className="mt-4 text-soft-gray/70 text-lg max-w-2xl">
            focused audio plugins. one-time purchase. no subscriptions. 
            built for trap and hip-hop producers.
          </p>
        </FadeIn>

        {/* Pricing callout */}
        <FadeIn delay={0.15}>
          <div className="mt-10 p-6 bg-matte-black rounded-lg inline-block">
            <p className="text-cream text-sm">
              <span className="text-red-accent font-medium">bundle deal</span> — any 3 for $35 · full 10-pack for $99
            </p>
          </div>
        </FadeIn>

        {/* Plugin grid */}
        <FadeIn delay={0.2}>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {plugins.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-5 bg-matte-black rounded-lg"
              >
                <div>
                  <h3 className="text-cream font-medium">{p.name}</h3>
                  <p className="text-cream/40 text-sm mt-1">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-cream text-lg font-medium">{p.price}</p>
                  <p className={`text-xs mt-1 ${p.status === 'available' ? 'text-red-accent' : 'text-cream/30'}`}>
                    {p.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Free line */}
        <FadeIn delay={0.3}>
          <div className="mt-12">
            <h2 className="text-2xl font-light text-matte-black tracking-wide">
              free — one-knob line
            </h2>
            <p className="mt-3 text-soft-gray/60 text-sm">
              no account. no email. no ads. just tools.
            </p>
            <div className="mt-4 flex gap-4">
              <div className="px-4 py-3 bg-matte-black rounded-lg">
                <p className="text-cream text-sm font-medium">color</p>
                <p className="text-cream/30 text-xs mt-1">coming soon</p>
              </div>
              <div className="px-4 py-3 bg-matte-black rounded-lg">
                <p className="text-cream text-sm font-medium">glue</p>
                <p className="text-cream/30 text-xs mt-1">coming soon</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
