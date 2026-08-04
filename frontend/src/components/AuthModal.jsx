import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const ease = [0.2, 0.8, 0.2, 1]

const field =
  'border-b border-line bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-ink'

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  // Escape to close + lock the page scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register(form)
      }
      onClose() // AuthContext has stored the token + user by now
    } catch (err) {
      setError(err.message) // the API's message, e.g. "Invalid email or password"
    } finally {
      setBusy(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="auth"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div onClick={onClose} className="absolute inset-0 bg-ink/45" />

          <motion.div
            className="relative w-full max-w-[420px] bg-paper p-8 sm:p-10"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 8 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-2xl leading-none"
            >
              ×
            </button>

            <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </span>
            <h2 className="mt-2 font-serif text-[30px] leading-tight">
              {isLogin ? 'Sign in' : 'Join ÉCRU'}
            </h2>

            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              {!isLogin && (
                <input
                  value={form.name}
                  onChange={set('name')}
                  required
                  placeholder="Name"
                  aria-label="Name"
                  className={field}
                />
              )}
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="Email"
                aria-label="Email"
                className={field}
              />
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                placeholder="Password (min 6 characters)"
                aria-label="Password"
                className={field}
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-2 w-full bg-ink py-3.5 text-xs uppercase tracking-[0.16em] text-paper disabled:opacity-60"
              >
                {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(isLogin ? 'register' : 'login')
                setError(null)
              }}
              className="mt-5 text-xs text-muted transition-colors hover:text-ink"
            >
              {isLogin
                ? 'New here? Create an account'
                : 'Already have an account? Sign in'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
