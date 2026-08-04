import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          className="pointer-events-none fixed bottom-7 left-1/2 z-[70] rounded-sm bg-ink px-6 py-3.5 text-[13px] tracking-[0.06em] text-paper shadow-[0_12px_40px_rgba(0,0,0,0.4)] ring-1 ring-gold/40"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 12, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}