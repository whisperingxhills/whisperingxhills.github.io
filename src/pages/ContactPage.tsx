import { useState, useRef } from 'react'
import { Mail, Send, Check, AlertCircle, Clock } from 'lucide-react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import FadeIn from '../components/FadeIn'

const WEBHOOK_URL =
  'https://discord.com/api/webhooks/1486873231502737469/HvA1iFeabf7lFkptZjW-j6MFDuYRVCmF4tvNQQrtOmuSBOBqVrpG3ZzDtgYj4DGFQYw9'
const HCAPTCHA_SITEKEY = '408adb3c-da4e-49a2-8d22-a068f01e8e06'
const SUBJECTS = ['General Inquiry', 'Music/Booking', 'Plugin Support', 'Business', 'Other'] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RATE_KEY = 'wxh_contact_last'

function getRateLimitDay(): string {
  return new Date().toISOString().slice(0, 10)
}

function isRateLimited(): boolean {
  return localStorage.getItem(RATE_KEY) === getRateLimitDay()
}

function markRateLimited(): void {
  localStorage.setItem(RATE_KEY, getRateLimitDay())
}

type Status = 'idle' | 'sending' | 'success' | 'rate-limited' | 'error'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const captchaRef = useRef<HCaptcha>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (isRateLimited()) {
      setStatus('rate-limited')
      return
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedEmail || !subject || !trimmedMessage) {
      setStatus('error')
      setErrorMsg('All fields are required.')
      return
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    if (!captchaToken) {
      setStatus('error')
      setErrorMsg('Please complete the captcha.')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '\ud83d\udcec New Contact Submission',
              color: 0xbb1f1f,
              fields: [
                { name: 'Name', value: trimmedName, inline: true },
                { name: 'Email', value: trimmedEmail, inline: true },
                { name: 'Subject', value: subject, inline: false },
                { name: 'Message', value: trimmedMessage, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })

      if (!res.ok) throw new Error('Webhook returned ' + res.status)

      markRateLimited()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Try again later.')
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
    }
  }

  return (
    <div className="bg-matte-black min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-red-accent" size={20} />
              <p className="text-red-accent text-xs uppercase tracking-[0.3em]">get in touch</p>
            </div>
            <h1
              className="text-4xl md:text-6xl font-light text-cream tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              contact
            </h1>
            <p className="mt-4 text-cream/40 text-lg max-w-xl">
              questions, bookings, plugin support, or just want to say something. we read everything.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.1}>
            {status === 'success' ? (
              <div className="p-12 bg-soft-gray/30 rounded-lg border border-cream/5 text-center">
                <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="text-green-500" size={32} />
                </div>
                <h2
                  className="text-2xl font-light text-cream tracking-wide"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  message sent!
                </h2>
                <p className="mt-3 text-cream/40 text-sm">we'll get back to you.</p>
              </div>
            ) : status === 'rate-limited' ? (
              <div className="p-12 bg-soft-gray/30 rounded-lg border border-cream/5 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto mb-6">
                  <Clock className="text-amber-500" size={32} />
                </div>
                <h2
                  className="text-2xl font-light text-cream tracking-wide"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  one message per day.
                </h2>
                <p className="mt-3 text-cream/40 text-sm">come back tomorrow.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-cream/60 text-xs uppercase tracking-widest mb-2">
                    name
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-soft-gray/80 rounded text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all placeholder:text-cream/20"
                    placeholder="your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-cream/60 text-xs uppercase tracking-widest mb-2">
                    email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-soft-gray/80 rounded text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all placeholder:text-cream/20"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-cream/60 text-xs uppercase tracking-widest mb-2">
                    subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-soft-gray/80 rounded text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-soft-gray text-cream/40">
                      select a topic
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-soft-gray text-cream">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-cream/60 text-xs uppercase tracking-widest mb-2">
                    message
                  </label>
                  <textarea
                    maxLength={1000}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-soft-gray/80 rounded text-cream text-sm outline-none focus:ring-2 ring-red-accent transition-all resize-none placeholder:text-cream/20"
                    placeholder="what's on your mind?"
                  />
                  <p className="mt-1 text-cream/20 text-xs text-right">{message.length}/1000</p>
                </div>

                {/* hCaptcha */}
                <div className="flex justify-center">
                  <HCaptcha
                    sitekey={HCAPTCHA_SITEKEY}
                    theme="dark"
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(null)}
                    ref={captchaRef}
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-accent text-sm">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-accent hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed text-cream text-sm tracking-widest uppercase rounded transition-all duration-200 hover:shadow-[0_0_30px_rgba(187,31,31,0.3)]"
                >
                  {status === 'sending' ? (
                    'sending...'
                  ) : (
                    <>
                      send message <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
