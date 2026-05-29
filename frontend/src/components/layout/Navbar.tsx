import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, X, Gamepad2, User } from 'lucide-react'

interface NavbarProps {
  cartCount?: number
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [searchOpen, setSearchOpen]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [mobileSearch, setMobileSearch] = useState('')
  const searchInputRef                  = useRef<HTMLInputElement>(null)
  const location                        = useLocation()

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
      style={{ background: 'var(--color-bg-nav)', borderBottom: '1px solid rgba(255,0,208,0.3)', backdropFilter: 'blur(12px)' }}
    >
      {/* ── Fila principal ── */}
      <div className="flex items-center justify-between px-4 h-16">

        {/* Izquierda: tabs */}
        <div className="flex items-center gap-3" style={{ marginLeft: '1rem' }}>
          <NavTab to="/"        label="Tienda"     active={isActive('/') && location.pathname === '/'} />
          <NavTab to="/library" label="Biblioteca" active={isActive('/library')} />
        </div>

        {/* Centro: logo — estático en mobile, absoluto centrado en desktop */}
        <Link
          to="/"
          className="flex items-center gap-2 group lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))', boxShadow: 'var(--glow-accent)' }}
          >
            <Gamepad2 size={18} className="text-white" />
          </div>
          <span
            className="text-sm font-bold tracking-widest uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.2em' }}
          >
            <span className="text-white group-hover:opacity-80 transition-opacity">SOF4</span>
            <span className="hidden lg:inline" style={{ color: 'var(--color-accent)' }}> GAMES</span>
          </span>
        </Link>

        {/* Derecha: búsqueda (desktop) + carrito + avatar */}
        <div className="flex items-center gap-2" style={{ marginRight: '1rem' }}>

          {/* Búsqueda expandible — solo desktop */}
          <div className="hidden lg:flex items-center">
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ width: searchOpen ? '220px' : '0px' }}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar juegos, tags…"
                className="w-full h-8 px-3 text-sm bg-transparent outline-none"
                style={{
                  border: 'none',
                  borderBottom: '1px solid var(--color-accent)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <button
              onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchQuery('') }}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.color = 'var(--color-accent)'; el.style.textShadow = '0 0 12px var(--color-accent)' }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'var(--color-text-muted)'; el.style.textShadow = 'none' }}
              aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>

          {/* Ícono de búsqueda — solo mobile (no expande, la barra está abajo) */}
          <button
            className="hidden lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>

          {/* Carrito */}
          <Link
            to="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-accent-alt)'; el.style.textShadow = '0 0 12px var(--color-accent-alt)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-text-muted)'; el.style.textShadow = 'none' }}
            aria-label="Carrito"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-price)' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <Link
            to="/profile"
            className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--color-accent)'; el.style.color = 'var(--color-accent)'; el.style.boxShadow = 'var(--glow-accent)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--color-border)'; el.style.color = 'var(--color-text-muted)'; el.style.boxShadow = 'none' }}
            aria-label="Perfil"
          >
            <User size={16} />
          </Link>
        </div>
      </div>

      {/* ── Barra de búsqueda — solo mobile ── */}
      <div className="flex lg:hidden pb-3 gap-2" style={{ padding: '0 1rem 0.75rem 1rem' }}>
        <input
          type="text"
          value={mobileSearch}
          onChange={e => setMobileSearch(e.target.value)}
          placeholder="Buscar juegos, tags, desarrolladores..."
          className="flex-1 h-9 px-3 rounded-lg text-sm outline-none"
          style={{
            background:  'rgba(255,255,255,0.06)',
            border:      '1px solid rgba(255,0,208,0.3)',
            color:       'var(--color-text)',
            fontFamily:  'var(--font-body)',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
          }}
        />
        <button
          className="px-4 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background:  'var(--color-accent)',
            color:       '#fff',
            fontFamily:  'var(--font-cta)',
            boxShadow:   'var(--glow-accent)',
            paddingLeft:  '1rem',
            paddingRight: '1rem',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#cc00a6' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)' }}
          onMouseDown={e =>  { (e.currentTarget as HTMLElement).style.background = '#990080' }}
          onMouseUp={e =>    { (e.currentTarget as HTMLElement).style.background = '#cc00a6' }}
          onTouchEnd={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#cc00a6'
            setTimeout(() => { el.style.background = 'var(--color-accent)' }, 150)
          }}
        >
          Buscar
        </button>
      </div>
    </nav>
  )
}

// ── Sub-componente: tab de navegación ──
interface NavTabProps { to: string; label: string; active: boolean }

function NavTab({ to, label, active }: NavTabProps) {
  return (
    <Link
      to={to}
      className="nav-tab rounded-md text-xs lg:text-sm font-medium transition-all duration-200"
      style={{
        fontFamily: 'var(--font-cta)',
        color:      active ? 'var(--color-text)' : 'var(--color-text-muted)',
        background: active ? 'rgba(255,0,208,0.1)' : 'transparent',
        border:     active ? '1px solid rgba(255,0,208,0.3)' : '1px solid transparent',
        textShadow: active ? '0 0 12px var(--color-accent)' : 'none',
      }}
      onMouseEnter={e => {
        if (!active) {
          const el = e.currentTarget as HTMLElement
          el.style.color = 'var(--color-text)'
          el.style.textShadow = '0 0 8px var(--color-accent)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          const el = e.currentTarget as HTMLElement
          el.style.color = 'var(--color-text-muted)'
          el.style.textShadow = 'none'
        }
      }}
    >
      {label}
    </Link>
  )
}
