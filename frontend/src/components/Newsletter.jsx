import { useCart } from '../context/CartContext'

export default function Newsletter() {
  const { notify } = useCart()

  const submit = (e) => {
    e.preventDefault()
    e.target.reset()
    notify('Thanks for subscribing.')
  }

  return (
    <section id="journal" className="mx-auto max-w-[1240px] px-8">
      <div className="mt-[120px] border-t border-line py-[90px] text-center">
        <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
          The Journal
        </span>
        <h2 className="mt-2 font-serif text-[clamp(30px,4.5vw,58px)] font-light leading-none">
          Notes on doing less.
        </h2>
        <p className="mx-auto my-5 max-w-[420px] text-muted">
          Slow beauty essays and early access to new formulas, in your inbox once a
          month.
        </p>
        <form onSubmit={submit} className="mx-auto flex max-w-[440px] border-b border-ink">
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="flex-1 bg-transparent px-1 py-3.5 outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="px-1.5 text-xs uppercase tracking-[0.14em] text-gold"
          >
            Subscribe →
          </button>
        </form>
      </div>
    </section>
  )
}