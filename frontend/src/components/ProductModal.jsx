import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

const ease = [0.2, 0.8, 0.2, 1]

export default function ProductModal({ product, onClose }) {
  const { add, openCart } = useCart()

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock the page scroll while the modal is open, so dragging scrolls the
  // modal's own content instead of the page behind it (the mobile bug).
  useEffect(() => {
    if (!product) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [product])

  const meta = product
    ? [
        ['Size', product.size],
        ['Key active', product.active],
        ['Skin type', product.skin],
      ]
    : []

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div onClick={onClose} className="absolute inset-0 bg-ink/45" />

          {/*
            flex-col on mobile / flex-row on md. max-h caps the whole card,
            and the body cell uses min-h-0 + overflow-y-auto so it scrolls
            internally instead of overflowing off-screen.
          */}
          <motion.div
            className="relative flex max-h-[85vh] w-full max-w-[900px] flex-col overflow-hidden bg-paper md:flex-row"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 8 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 text-2xl leading-none"
            >
              ×
            </button>

            <div className="h-[240px] w-full shrink-0 overflow-hidden bg-paper-2 md:h-auto md:w-1/2">
              <img
                src={product.img}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-7 md:w-1/2 md:p-12">
              <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
                {product.cat}
              </span>
              <h2 className="mt-3.5 font-serif text-[30px] leading-tight md:text-[34px]">
                {product.name}
              </h2>
              <div className="my-5 font-serif text-2xl">${product.price}</div>
              <p className="mb-5 text-sm text-muted">{product.desc}</p>

              <ul className="border-t border-line">
                {meta.map(([k, v]) => (
                  <li
                    key={k}
                    className="flex justify-between border-b border-line py-3 text-[13px]"
                  >
                    <span className="text-[11px] uppercase tracking-[0.06em] text-muted">
                      {k}
                    </span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  add(product)
                  onClose()
                  openCart()
                }}
                className="mt-6 w-full bg-ink py-4 text-xs uppercase tracking-[0.16em] text-paper"
              >
                Add to cart · ${product.price}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
