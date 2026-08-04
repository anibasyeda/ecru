import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

const ease = [0.2, 0.8, 0.2, 1]

export default function ProductCard({
  product,
  onOpen,
  index = 0,
  isAdmin = false,
  onEdit,
  onDelete,
}) {
  const { add } = useCart()

  return (
    <motion.article
      onClick={() => onOpen(product)}
      className="group cursor-pointer pb-6"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <div className="relative mb-[18px] aspect-[3/4] overflow-hidden bg-paper-2">
        {product.tag && (
          <span className="absolute left-3.5 top-3.5 z-10 bg-paper px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em]">
            {product.tag}
          </span>
        )}

        {/* Admin-only controls. stopPropagation stops the card's own onClick
            (which opens the product modal) from also firing. */}
        {isAdmin && (
          <div className="absolute right-3.5 top-3.5 z-20 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(product)
              }}
              className="bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-gold"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(product)
              }}
              className="bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:text-red-300"
            >
              Delete
            </button>
          </div>
        )}

        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            add(product)
          }}
          className="absolute inset-x-3.5 bottom-3.5 bg-ink py-3.5 text-[11px] uppercase tracking-[0.16em] text-paper transition-all opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Add to cart
        </button>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[19px]">{product.name}</h3>
        <span className="font-serif text-[17px] text-gold">${product.price}</span>
      </div>
      <p className="mt-1 text-[13px] text-muted">{product.cat}</p>
    </motion.article>
  )
}
