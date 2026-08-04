import { splitImg } from '../data/products'

const stats = [
  ['03', 'Steps'],
  ['92%', 'Naturally derived'],
  ['0', 'Synthetic fragrance'],
]

export default function About() {
  return (
    <section id="ritual" className="mx-auto max-w-[1240px] px-8">
      <div id="about" className="mt-[120px] grid border border-line md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-paper-2">
          <img src={splitImg} alt="Ritual" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center p-10 md:p-16">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
            The Philosophy
          </span>
          <h2 className="my-5 font-serif text-[clamp(28px,3.5vw,44px)] font-light leading-tight">
            Less, but better.
          </h2>
          <p className="mb-4 text-muted">
            We believe a skincare routine should take four minutes, not fourteen.
            ÉCRU strips the ritual back to its essentials: cleanse, treat, protect,
            with formulas that do more so you can own less.
          </p>
          <p className="text-muted">
            Everything is developed in Copenhagen, tested on humans, and bottled in
            refillable glass.
          </p>

          <div className="mt-9 grid grid-cols-3 border-t border-line">
            {stats.map(([n, l]) => (
              <div key={l} className="py-5">
                <span className="block font-serif text-3xl">{n}</span>
                <span className="text-xs uppercase tracking-[0.1em] text-muted">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
