// Each link is { label, href }. Real sections point at their anchor;
// decorative links use '#!' so a click doesn't jump the page to the top.
const cols = [
  [
    'Shop',
    [
      { label: 'Cleansers', href: '#shop' },
      { label: 'Serums', href: '#shop' },
      { label: 'Moisturisers', href: '#shop' },
      { label: 'Sets', href: '#shop' },
    ],
  ],
  [
    'Company',
    [
      { label: 'About', href: '#about' },
      { label: 'Ingredients', href: '#!' },
      { label: 'Sustainability', href: '#!' },
      { label: 'Stockists', href: '#!' },
    ],
  ],
  [
    'Connect',
    [
      { label: 'Instagram', href: '#!' },
      { label: 'Contact', href: '#!' },
      { label: 'Returns', href: '#!' },
      { label: 'FAQ', href: '#!' },
    ],
  ],
]

const legal = ['Privacy', 'Terms', 'Cookies']

export default function Footer() {
  return (
    <footer className="bg-ink pt-20 pb-10 text-paper">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="font-serif text-[34px] tracking-[0.3em] pl-[0.3em]">ÉCRU</div>
            <p className="mt-[18px] max-w-[280px] text-sm text-[#9a9893]">
              Considered skincare for people who'd rather own less and mean it.
            </p>
          </div>

          {cols.map(([heading, items]) => (
            <div key={heading}>
              <h4 className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.18em] text-gold-soft">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#cfcdc8]">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-2.5 border-t border-white/15 pt-6 text-xs text-[#9a9893]">
          <span>© 2026 ÉCRU Studio. Portfolio demo.</span>
          <span>
            {legal.map((item, i) => (
              <span key={item}>
                <a href="#!" className="hover:text-white">
                  {item}
                </a>
                {i < legal.length - 1 && ' · '}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
