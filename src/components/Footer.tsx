export default function Footer() {
  return (
    <footer className="bg-matte-black border-t border-soft-gray py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-cream/50 text-sm">
          © {new Date().getFullYear()} whispering hills. all rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-cream/40 hover:text-red-accent text-sm transition-colors">
            instagram
          </a>
          <a href="#" className="text-cream/40 hover:text-red-accent text-sm transition-colors">
            spotify
          </a>
          <a href="#" className="text-cream/40 hover:text-red-accent text-sm transition-colors">
            youtube
          </a>
        </div>
      </div>
    </footer>
  )
}
