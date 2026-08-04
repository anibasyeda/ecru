import { createContext, useContext, useRef, useState } from 'react'
import { createOrder } from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const notify = (message) => {
    setToast(message)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2200)
  }

  const add = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id)
      if (existing) {
        return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...c, { ...product, qty: 1 }]
    })
    notify(`${product.name} added to cart`)
  }

  const changeQty = (id, delta) =>
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    )

  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id))

  // Real checkout: send only ids + quantities. The server recomputes the
  // total from the DB, saves the order, and returns it.
  const checkout = async () => {
    if (cart.length === 0) return
    setPlacing(true)
    try {
      const items = cart.map((i) => ({ id: i.id, qty: i.qty }))
      const order = await createOrder(items)
      setCart([])
      setIsOpen(false)
      notify(`Order placed · total $${order.total}`)
    } catch (err) {
      notify(err.message)
    } finally {
      setPlacing(false)
    }
  }

  const count = cart.reduce((s, i) => s + i.qty, 0)
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider
      value={{
        cart, add, changeQty, remove, count, total,
        isOpen, openCart, closeCart,
        checkout, placing,
        toast, notify,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
