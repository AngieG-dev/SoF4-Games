import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import StorePage from './pages/StorePage'
import GamePage  from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <Navbar cartCount={0} />
        <Routes>
          <Route path="/"         element={<StorePage />} />
          <Route path="/game/:id" element={<GamePage />}  />
          {/* El resto de rutas se agregan en sprints siguientes */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
