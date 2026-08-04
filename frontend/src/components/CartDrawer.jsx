import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

// Same drawer as before; the Checkout button now calls the real async
// checkout() and shows a "Placing…" state while the request is in flight.
export default function CartDrawer() {
  const { cart, isOpen, closeCart, changeQty, remove, total, checkout, placing } =
    useCart()

  // Lock page scroll while the drawer is open (mobile: stops the page behind
  // it from scrolling).
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 z-50 flex h-full w-[420px] max-w-[90vw] flex-col bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-6">
              <h3 className="text-lg">Your Cart</h3>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-7">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-sm text-muted">
                  Your cart is quietly empty.
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((i) => (
                    <motion.div
                      key={i.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-[70px_1fr_auto] gap-4 border-b border-line py-5"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-paper-2">
                        <img src={i.img} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-[15px]">{i.name}</h4>
                        <div className="mt-0.5 font-serif">${i.price}</div>
                        <div className="mt-3 inline-flex items-center gap-3.5 border border-line px-2.5 py-1">
                          <button
                            onClick={() => changeQty(i.id, -1)}
                            aria-label={`Decrease ${i.name} quantity`}
                          >
                            −
                          </button>
                          <span>{i.qty}</span>
                          <button
                            onClick={() => changeQty(i.id, 1)}
                            aria-label={`Increase ${i.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        className="self-start text-[11px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line px-7 py-6">
                <div className="mb-4 flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                <motion.button
                  whileHover={{ scale: placing ? 1 : 1.015 }}
                  whileTap={{ scale: placing ? 1 : 0.985 }}
                  onClick={checkout}
                  disabled={placing}
                  className="w-full bg-ink py-4 text-xs uppercase tracking-[0.16em] text-paper disabled:opacity-60"
                >
                  {placing ? 'Placing…' : 'Checkout →'}
                </motion.button>
                <p className="mt-3 text-center text-xs text-muted">
                  Complimentary shipping on orders over $80
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
