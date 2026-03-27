import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/music', label: 'music' },
  { to: '/dsp', label: 'hills dsp' },
  { to: '/contact', label: 'contact' },
  { to: '/login', label: 'login' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-matte-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/wxh-badge.png" alt="wxh" className="h-8 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                location.pathname === l.to
                  ? 'text-red-accent'
                  : 'text-cream/60 hover:text-cream'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-cream" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-matte-black/98 backdrop-blur-md border-t border-cream/5 px-6 pb-6 pt-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block py-3 text-sm tracking-wider uppercase border-b border-cream/5 last:border-0 ${
                location.pathname === l.to ? 'text-red-accent' : 'text-cream/60'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
