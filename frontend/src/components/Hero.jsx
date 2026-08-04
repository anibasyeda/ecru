import { motion } from 'framer-motion'
import { heroImg } from '../data/products'

const ease = [0.2, 0.8, 0.2, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1240px] px-8">
      <div className="grid items-center gap-10 md:min-h-[calc(100vh-72px)] md:grid-cols-[1.05fr_.95fr]">
        <motion.div className="py-14" variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-block text-[11px] uppercase tracking-[0.28em] text-gold"
          >
            Clean skincare, since 2019
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-4 font-serif text-[clamp(48px,7vw,96px)] font-light leading-[0.98]"
          >
            Bare
            <br />
            essentials,
            <br />
            <em>refined.</em>
          </motion.h1>
          <motion.p variants={item} className="mt-7 mb-10 max-w-[400px] text-muted">
            A pared-back ritual of five considered formulas. No noise, no excess,
            only what your skin actually needs.
          </motion.p>
          <motion.a
            variants={item}
            href="#shop"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 border border-ink bg-ink px-[30px] py-4 text-xs uppercase tracking-[0.16em] text-paper transition-colors hover:bg-transparent hover:text-ink"
          >
            Shop the edit <span>→</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="relative h-[56vh] overflow-hidden bg-paper-2 md:h-[80vh]"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease }}
        >
          <img src={heroImg} alt="Premium clay mask" className="h-full w-full object-cover" />
          <span className="absolute bottom-[22px] right-[22px] text-[11px] tracking-[0.2em] text-gold">
            01 / 04
          </span>
        </motion.div>
      </div>
    </section>
  )
}
