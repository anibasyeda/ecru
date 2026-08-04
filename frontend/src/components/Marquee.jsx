const line =
  'Vegan & cruelty-free ✦ Fragrance-free ✦ Dermatologist-tested ✦ Recyclable glass ✦ Made in small batches ✦ '

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-ink text-paper">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="shrink-0 py-4 font-serif text-xl tracking-[0.04em]">
          {line.repeat(2)}
        </span>
        <span className="shrink-0 py-4 font-serif text-xl tracking-[0.04em]" aria-hidden="true">
          {line.repeat(2)}
        </span>
      </div>
    </div>
  )
}
