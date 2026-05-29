import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import StorePage from './pages/StorePage'
import GamePage from './pages/GamePage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <Navbar cartCount={0} />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"         element={<StorePage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/login"    element={<div>Login - por hacer</div>} />

          {/* Rutas protegidas: requieren sesión iniciada */}
          <Route element={<PrivateRoute />}>
            <Route path="/library"  element={<div>Biblioteca - por hacer</div>} />
            <Route path="/profile"  element={<div>Perfil - por hacer</div>} />
            <Route path="/checkout" element={<div>Checkout - por hacer</div>} />
            <Route path="/friends"  element={<div>Amigos - por hacer</div>} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App