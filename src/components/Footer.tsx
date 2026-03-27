import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-matte-black border-t border-cream/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src="/assets/wxh-badge.png" alt="wxh" className="h-10 w-auto mb-4" />
            <p className="text-cream/40 text-sm leading-relaxed max-w-sm">
              canon-driven creative system. music, audio tools, and infrastructure 
              designed to compound. fresno, california.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-cream/60 text-xs uppercase tracking-widest mb-4">navigate</h4>
            <div className="space-y-2">
              {[
                { to: '/about', label: 'about' },
                { to: '/music', label: 'music' },
                { to: '/dsp', label: 'hills dsp' },
                { to: '/contact', label: 'contact' },
                { to: '/login', label: 'account' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-cream/30 hover:text-red-accent text-sm transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-cream/60 text-xs uppercase tracking-widest mb-4">connect</h4>
            <div className="space-y-2">
              {[
                { href: '#', label: 'instagram' },
                { href: '#', label: 'spotify' },
                { href: '#', label: 'youtube' },
                { href: '#', label: 'soundcloud' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="block text-cream/30 hover:text-red-accent text-sm transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/20 text-xs">
            © {new Date().getFullYear()} whispering hills. all rights reserved.
          </p>
          <p className="text-cream/10 text-xs">
            mind.the" ".gap
          </p>
        </div>
      </div>
    </footer>
  )
}
