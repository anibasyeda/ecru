import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import ProductGrid from './components/ProductGrid'
import About from './components/About'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'

export default function App() {
  const [modalProduct, setModalProduct] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <CartProvider>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <ProductGrid onOpen={setModalProduct} />
        <About />
        <Newsletter />
      </main>
      <Footer />

      <CartDrawer />
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <Toast />
    </CartProvider>
  )
}
