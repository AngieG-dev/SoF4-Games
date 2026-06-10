import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, X, Gamepad2, User, Users, BookOpen, Store } from 'lucide-react'
import FriendsSidebar from '../FriendsSidebar'
import { getPendingRequests } from '../../services/friendsService'

interface NavbarProps {
    cartCount?: number
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
    const [searchOpen, setSearchOpen]     = useState(false)
    const [searchQuery, setSearchQuery]   = useState('')
    const [mobileSearch, setMobileSearch] = useState('')
    const [sidebarOpen, setSidebarOpen]   = useState(false)
    const [pendingCount, setPendingCount] = useState(0)
    const searchInputRef                  = useRef<HTMLInputElement>(null)
    const location                        = useLocation()
    const navigate                        = useNavigate()
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef                     = useRef<HTMLDivElement>(null)
    const isAuthenticated                 = !!localStorage.getItem('token')

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) { setUserMenuOpen(false) }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Cargar badge de solicitudes pendientes cada 30 segundos
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        const load = () => getPendingRequests().then((data: { length: number }) => setPendingCount(data.length)).catch(() => {})
        load()
        const interval = setInterval(load, 30000)
        return () => clearInterval(interval)
    }, [])

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('username')
        navigate('/')
        setUserMenuOpen(false)
    }

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex flex-col"
                style={{ background: 'var(--color-bg-nav)', borderBottom: '1px solid rgba(255,0,208,0.3)', backdropFilter: 'blur(12px)' }}
            >
                {/* ── Fila principal ── */}
                <div className="flex items-center justify-between px-4 h-16">

                    {/* Izquierda: tabs */}
                    <div className="flex items-center gap-1 sm:gap-3" style={{ marginLeft: '1.5rem' }}>
                        <NavTab to="/"        label="Tienda"     icon={<Store size={18} />}    active={isActive('/') && location.pathname === '/'} />
                        <NavTab to="/library" label="Biblioteca" icon={<BookOpen size={18} />} active={isActive('/library')} />
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

                    {/* Derecha: búsqueda (desktop) + amigos + carrito + avatar */}
                    <div className="flex items-center gap-1 sm:gap-2" style={{ marginRight: '1.5rem' }}>

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
                                className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200"
                                style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}
                                onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#cc00a6'; el.style.borderColor = '#cc00a6'; el.style.boxShadow = '0 0 12px #cc00a6' }}
                                onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'var(--color-text-muted)'; el.style.borderColor = 'var(--color-border)'; el.style.boxShadow = 'none' }}
                                aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
                            >
                                {searchOpen ? <X size={18} /> : <Search size={18} />}
                            </button>
                        </div>

                        {/* Amigos */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 relative"
                            style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#cc00a6'; el.style.borderColor = '#cc00a6'; el.style.boxShadow = '0 0 12px #cc00a6' }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-text-muted)'; el.style.borderColor = 'var(--color-border)'; el.style.boxShadow = 'none' }}
                            aria-label="Ver amigos"
                        >
                            <Users size={18} />
                            {pendingCount > 0 && (
                                <span style={{
                                    position:   'absolute',
                                    top:        '-4px',
                                    right:      '-4px',
                                    background: 'var(--color-accent)',
                                    color:      '#fff',
                                    fontSize:   '0.6rem',
                                    fontWeight: 700,
                                    borderRadius: '999px',
                                    padding:    '1px 4px',
                                    minWidth:   '14px',
                                    textAlign:  'center',
                                    lineHeight: '1.4',
                                }}>
                                    {pendingCount > 9 ? '9+' : pendingCount}
                                </span>
                            )}
                        </button>

                        {/* Carrito */}
                        <Link
                            to="/cart"
                            className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                            style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#cc00a6'; el.style.borderColor = '#cc00a6'; el.style.boxShadow = '0 0 12px #cc00a6' }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-text-muted)'; el.style.borderColor = 'var(--color-border)'; el.style.boxShadow = 'none' }}
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
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-muted)',
                                    background: 'var(--color-bg-card)',
                                }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#cc00a6'; el.style.borderColor = '#cc00a6'; el.style.boxShadow = '0 0 12px #cc00a6' }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-text-muted)'; el.style.borderColor = 'var(--color-border)'; el.style.boxShadow = 'none' }}
                                aria-label="Usuario"
                            >
                                <User size={16} />
                            </button>

                            {userMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-44 rounded-lg overflow-hidden"
                                    style={{
                                        background: 'var(--color-bg-card)',
                                        border: '1px solid var(--color-border)',
                                        boxShadow: '0 0 20px rgba(0,0,0,0.4)',
                                        padding: '1rem',
                                    }}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-3 text-sm transition-colors"
                                                style={{ color: 'var(--color-text)', paddingBottom: '5px', borderBottom: '1px solid var(--color-border)' }}
                                            >
                                                Perfil
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm transition-colors"
                                                style={{ color: 'var(--color-text)' }}
                                            >
                                                Cerrar sesión
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-3 text-sm"
                                            style={{ color: 'var(--color-text)' }}
                                        >
                                            Iniciar sesión
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
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
                            background:   'rgba(255,255,255,0.06)',
                            border:       '1px solid rgba(255,0,208,0.3)',
                            color:        'var(--color-text)',
                            fontFamily:   'var(--font-body)',
                            paddingLeft:  '0.75rem',
                            paddingRight: '0.75rem',
                        }}
                    />
                    <button
                        className="px-4 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
                        style={{
                            background:   'var(--color-accent)',
                            color:        '#fff',
                            fontFamily:   'var(--font-cta)',
                            boxShadow:    'var(--glow-accent)',
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

            {/* ── Sidebar de amigos — fuera del <nav> para evitar problemas de z-index ── */}
            <FriendsSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    )
}

// ── Sub-componente: tab de navegación con ícono ──
interface NavTabProps {
    to:     string
    label:  string
    icon:   React.ReactNode
    active: boolean
}

function NavTab({ to, label, icon, active }: NavTabProps) {
    return (
        <Link
            to={to}
            className="nav-tab rounded-md font-medium transition-all duration-200 flex items-center gap-1.5"
            style={{
                fontFamily: 'var(--font-cta)',
                fontSize:   'clamp(0.7rem, 2vw, 0.875rem)',
                padding:    'clamp(0.25rem, 1vw, 0.375rem) clamp(0.4rem, 1.5vw, 0.625rem)',
                color:      active ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: active ? 'rgba(255,0,208,0.1)' : 'transparent',
                border:     active ? '1px solid rgba(255,0,208,0.3)' : '1px solid transparent',
                textShadow: active ? '0 0 12px var(--color-accent)' : 'none',
                whiteSpace: 'nowrap',
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
            {icon}
            <span className="hidden xs:inline sm:inline">{label}</span>
        </Link>
    )
}