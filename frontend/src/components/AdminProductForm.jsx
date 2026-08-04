import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createProduct, updateProduct } from '../services/api'

const ease = [0.2, 0.8, 0.2, 1]
const field =
  'border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink'

const empty = {
  name: '',
  category: '',
  price: '',
  size: '',
  active: '',
  skin: '',
  description: '',
  image: '',
  tag: '',
}

// A product coming from the grid is in UI shape (cat/desc/img). Map it back to
// the DB field names the form + API use.
const fromUi = (p) =>
  p
    ? {
        name: p.name || '',
        category: p.cat || '',
        price: p.price ?? '',
        size: p.size || '',
        active: p.active || '',
        skin: p.skin || '',
        description: p.desc || '',
        image: p.img || '',
        tag: p.tag || '',
      }
    : empty

export default function AdminProductForm({ open, product, onClose, onSaved }) {
  const editing = Boolean(product)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  // Reset/prefill each time the modal opens.
  useEffect(() => {
    if (open) {
      setForm(fromUi(product))
      setError(null)
    }
  }, [open, product])

  // Escape to close + lock page scroll.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const payload = { ...form, price: Number(form.price) }
      if (editing) await updateProduct(product.id, payload)
      else await createProduct(payload)
      onSaved() // refetch the grid so the change shows
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="admin-form"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div onClick={onClose} className="absolute inset-0 bg-ink/45" />

          <motion.div
            className="no-scrollbar relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto bg-paper p-8"
            initial={{ scale: 0.96, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 8 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-2xl leading-none"
            >
              ×
            </button>

            <span className="text-[11px] uppercase tracking-[0.28em] text-gold">Admin</span>
            <h2 className="mt-2 font-serif text-[28px] leading-tight">
              {editing ? 'Edit product' : 'New product'}
            </h2>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <input required placeholder="Name" aria-label="Name" value={form.name} onChange={set('name')} className={field} />
              <input required placeholder="Category (e.g. Step 01 · Cleanse)" aria-label="Category" value={form.category} onChange={set('category')} className={field} />

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" min="0" placeholder="Price" aria-label="Price" value={form.price} onChange={set('price')} className={field} />
                <input placeholder="Size (e.g. 30 ml)" aria-label="Size" value={form.size} onChange={set('size')} className={field} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Key active" aria-label="Key active" value={form.active} onChange={set('active')} className={field} />
                <input placeholder="Skin type" aria-label="Skin type" value={form.skin} onChange={set('skin')} className={field} />
              </div>

              <input required placeholder="Image URL" aria-label="Image URL" value={form.image} onChange={set('image')} className={field} />
              <input placeholder="Tag (optional, e.g. New)" aria-label="Tag" value={form.tag} onChange={set('tag')} className={field} />
              <textarea required placeholder="Description" aria-label="Description" rows={3} value={form.description} onChange={set('description')} className={`${field} resize-none`} />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-1 w-full bg-ink py-3.5 text-xs uppercase tracking-[0.16em] text-paper disabled:opacity-60"
              >
                {busy ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
