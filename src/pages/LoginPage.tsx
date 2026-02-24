import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="pt-24 pb-16 px-6 bg-matte-black min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl font-light text-cream tracking-wide text-center">
          {isSignup ? 'create account' : 'sign in'}
        </h1>
        <p className="mt-2 text-cream/40 text-sm text-center">
          {isSignup
            ? 'join the whispering hills ecosystem'
            : 'access your purchases, licenses, and more'}
        </p>

        <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <div>
              <label className="block text-cream/60 text-sm mb-2">name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-soft-gray rounded-lg text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all"
                placeholder="your name"
              />
            </div>
          )}
          <div>
            <label className="block text-cream/60 text-sm mb-2">email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-soft-gray rounded-lg text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-cream/60 text-sm mb-2">password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-soft-gray rounded-lg text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-accent hover:bg-red-hover text-cream text-sm tracking-wider rounded-lg transition-colors"
          >
            {isSignup ? 'create account' : 'sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-cream/40 text-sm">
          {isSignup ? 'already have an account?' : "don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-red-accent hover:text-red-hover transition-colors"
          >
            {isSignup ? 'sign in' : 'sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
