import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import StorePage from './pages/StorePage'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'
import LibraryPage from "./pages/LibraryPage.tsx"
import PrivateRoute from './components/PrivateRoute'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { CartProvider, useCart } from './context/CartContext'

function AppContent() {
  const { cartCount } = useCart()
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Navbar cartCount={cartCount} />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"         element={<StorePage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/login"    element={<LoginPage />} />

        {/* Rutas protegidas: requieren sesión iniciada */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart"     element={<CartPage />} />
          <Route path="/library"  element={<LibraryPage />} />
          <Route path="/profile"  element={<div>Perfil - por hacer</div>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/friends"  element={<div>Amigos - por hacer</div>} />
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App