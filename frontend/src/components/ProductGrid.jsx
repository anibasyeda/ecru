import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { deleteProduct } from '../services/api'
import ProductCard from './ProductCard'
import AdminProductForm from './AdminProductForm'

export default function ProductGrid({ onOpen }) {
  const { products, loading, error, reload } = useProducts()
  const { user } = useAuth()
  const { notify } = useCart()
  const isAdmin = user?.role === 'admin'

  // form state: null = closed. 'new' = create. a product object = edit.
  const [editing, setEditing] = useState(null)
  const formOpen = editing !== null

  const handleDelete = async (product) => {
    // Guard the destructive action.
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return
    try {
      await deleteProduct(product.id)
      notify(`${product.name} deleted`)
      reload()
    } catch (err) {
      notify(err.message)
    }
  }

  return (
    <section id="shop" className="mx-auto max-w-[1240px] px-8">
      <div className="mt-28 mb-12 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
            The Collection
          </span>
          <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-light leading-none">
            Five formulas.
          </h2>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setEditing('new')}
            className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.16em] text-paper"
          >
            + Add product
          </button>
        ) : (
          <p className="max-w-[340px] text-[15px] text-muted">
            Each product earns its place. Multi-tasking actives, no filler
            ingredients, and packaging built to be refilled.
          </p>
        )}
      </div>

      {loading && <p className="py-20 text-center text-muted">Loading the collection…</p>}
      {error && (
        <p className="py-20 text-center text-muted">Couldn’t load products: {error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={onOpen}
              index={i}
              isAdmin={isAdmin}
              onEdit={(prod) => setEditing(prod)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* One form for create (editing === 'new') and edit (editing is a product) */}
      <AdminProductForm
        open={formOpen}
        product={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={reload}
      />
    </section>
  )
}
