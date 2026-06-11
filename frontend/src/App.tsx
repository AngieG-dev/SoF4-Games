import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import StorePage from './pages/StorePage'
import GamePage from './pages/GamePage'
import GamesPage from './pages/GamesPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import LibraryPage from "./pages/LibraryPage"
import PrivateRoute from './components/PrivateRoute'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import SearchResultsPage from './pages/SearchResultsPage'
import SalesPage from './pages/SalesPage'
import RecentPage from './pages/RecentPage'
import TopRatedPage from './pages/TopRatedPage'
import { CartProvider, useCart } from './context/CartContext'

function AppContent() {
  const { cartCount } = useCart()
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Navbar cartCount={cartCount} />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"             element={<StorePage />} />
        <Route path="/games"        element={<GamesPage />} />  {/* Games page with filters and pagination */}
        <Route path="/game/:id"     element={<GamePage />} />   {/* Individual game page */}
        <Route path="/search"       element={<SearchResultsPage />} />
        <Route path="/store/sales"  element={<SalesPage />} />
        <Route path="/store/new"    element={<RecentPage />} />
        <Route path="/store/top-rated" element={<TopRatedPage />} />
        <Route path="/login"        element={<LoginPage />} />

        {/* Rutas protegidas: requieren sesión iniciada */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart"     element={<CartPage />} />
          <Route path="/library"  element={<LibraryPage />} />
          <Route path="/profile"  element={<ProfilePage />} />
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