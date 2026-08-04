import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const links = ['Shop', 'Ritual', 'About', 'Journal']

export default function Navbar({ onOpenAuth }) {
  const { count, openCart } = useCart()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const firstName = user?.name?.split(' ')[0]

  return (
    <header className="sticky top-0 z-40 border-t-2 border-gold border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1240px] px-8">
        <nav className="flex h-[72px] items-center justify-between">
          <a href="#" className="font-serif text-2xl tracking-[0.32em] pl-[0.32em]">
            ÉCRU
          </a>

          <div className="hidden md:flex gap-9 text-[13px] uppercase tracking-[0.08em]">
            {links.map((x) => (
              <a
                key={x}
                href={`#${x.toLowerCase()}`}
                className="text-muted transition-colors hover:text-gold"
              >
                {x}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            {/* Account control (desktop) */}
            {user ? (
              <div className="hidden items-center gap-3 text-[13px] md:flex">
                <span className="text-muted">Hi, {firstName}</span>
                <button
                  onClick={logout}
                  className="uppercase tracking-[0.08em] transition-colors hover:text-gold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden text-[13px] uppercase tracking-[0.08em] transition-colors hover:text-gold md:block"
              >
                Login
              </button>
            )}

            <button
              onClick={openCart}
              className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em]"
            >
              Cart
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-[5px] text-[11px] text-paper">
                {count}
              </span>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="h-px w-5 bg-ink"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-px w-5 bg-ink"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="h-px w-5 bg-ink"
              />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden border-b border-line md:hidden"
          >
            <div className="mx-auto flex max-w-[1240px] flex-col px-8 py-4">
              {links.map((x) => (
                <a
                  key={x}
                  href={`#${x.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line py-4 text-[13px] uppercase tracking-[0.08em] text-muted transition-colors last:border-none hover:text-gold"
                >
                  {x}
                </a>
              ))}

              {/* Account control (mobile) */}
              {user ? (
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="border-t border-line py-4 text-left text-[13px] uppercase tracking-[0.08em] transition-colors hover:text-gold"
                >
                  Logout ({firstName})
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth()
                    setMenuOpen(false)
                  }}
                  className="border-t border-line py-4 text-left text-[13px] uppercase tracking-[0.08em] transition-colors hover:text-gold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
