// pages/StorePage.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import type { Game } from '../types'
import { heroGames, saleGames, recentGames, topRatedGames } from '../data/mockGames'

// ─────────────────────────────────────────────────────────────────────────────
// Badge de descuento — compartido por Hero y Cards
// ─────────────────────────────────────────────────────────────────────────────
function DiscountBadge({ pct }: { pct: number }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold"
      style={{
        background:   'rgba(0,242,255,0.15)',
        color:        'var(--color-accent-alt)',
        border:       '1px solid rgba(0,242,255,0.4)',
        fontFamily:   'var(--font-price)',
        borderRadius: 'var(--radius-badge)',
      }}
    >
      -{pct}%
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Carousel — full-width, sin border-radius, 500px de alto
// ─────────────────────────────────────────────────────────────────────────────
function HeroCarousel({ games }: { games: Game[] }) {
  const [current, setCurrent]   = useState(0)
  const [animating, setAnimating] = useState(false)
  const navigate   = useNavigate()
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const isMobile = window.innerWidth < 1024

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent((index + games.length) % games.length)
    setTimeout(() => setAnimating(false), 400)
  }, [animating, games.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 40) return  // ignorar taps accidentales
    if (timerRef.current) clearTimeout(timerRef.current)
    goTo(diff > 0 ? current + 1 : current - 1)
    touchStartX.current = null
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(current + 1), 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, goTo])

  if (!games.length) return null
  const game = games[current]
  const po   = game.price_overview

  return (
    // Sin border-radius, full-width (ancho completo del viewport)
    <div className="relative w-full overflow-hidden" style={{ height: '500px' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Imagen de fondo — transición de opacidad al cambiar slide */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${game.background_raw || game.header_image})`,
          transition: 'opacity 0.4s ease',
          opacity: animating ? 0 : 1,
        }}
      />

      {/* Degradado horizontal más suave: la imagen se ve bien a la derecha
          y el texto es legible a la izquierda */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(5,1,13,1) 0%, rgba(5,1,13,1) 40%, rgba(5,1,13,0.7) 50%, rgba(5,1,13,0) 60%)',
          // En mobile: gradiente vertical desde abajo
          ...(isMobile ? {
            background: 'linear-gradient(180deg, rgba(5,1,13,0.3) 0%, rgba(5,1,13,0.85) 60%, rgba(5,1,13,1) 100%)'
          } : {})
        }}
      />
      {/* Degradado inferior para que el texto del fondo no compita */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 40%, rgba(5,1,13,0.6) 100%)',
        }}
      />

      {/* Wrapper flex: [btn prev] [contenido] — gap unifica el espaciado automáticamente */}
      {/* px-5 = margen borde→botón, gap-5 = margen botón→contenido. Simétrico por construcción. */}
      <div className="absolute inset-0 flex items-stretch gap-8 px-5 lg:px-0">

        {/* Botón prev — oculto en mobile */}
        <button
          onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(current - 1) }}
          className="hidden lg:flex flex-shrink-0 ml-8 w-15 items-center justify-center transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'var(--color-accent)'
            el.style.background = 'linear-gradient(90deg, rgba(255,0,208,0.15) 0%, transparent 100%)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'rgba(255,255,255,0.6)'
            el.style.background = 'transparent'
          }}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Contenido — ocupa el espacio restante hasta el botón next */}
        <div 
          className="flex flex-col justify-center flex-1 max-w-lg"
          style={{ paddingLeft: 'clamp(1.25rem, 5vw, 0px)', paddingRight: 'clamp(1.25rem, 5vw, 0px)' }}
        >
          {/* Tags de género */}
          <div className="flex gap-2 mb-6" style={{ marginBottom: '1rem' }}>
            {game.genres.slice(0, 2).map(g => (
              <span
                key={g.id}
                className="px-2.5 py-1 rounded text-xs font-semibold"
                style={{
                  border:     '1px solid rgba(255,0,208,0.4)',
                  color:      'rgba(255,0,208,0.7)',
                  fontFamily: 'var(--font-cta)',
                  background: 'rgba(255,0,208,0.08)',
                  padding:    '3px 10px',
                }}
              >
                {g.description}
              </span>
            ))}
          </div>

          {/* Título */}
          <h1
            className="font-black mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-title)',
              fontSize:   'clamp(2rem, 4vw, 3.5rem)',
              textShadow: '0 2px 24px rgba(0,0,0,0.9)',
              color:      '#fff',
              marginBottom: '0.5rem',
            }}
          >
            {game.name}
          </h1>

          {/* Descripción */}
          <p
            className="text-sm mb-6 line-clamp-2"
            style={{
              color:      'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
            }}
          >
            {game.short_description}
          </p>

          {/* Precio */}
          <div className="flex items-center gap-3 mb-7" style={{ marginBottom: '1.75rem' }}>
            {game.is_free ? (
              <span className="text-2xl font-bold" style={{ color: 'var(--color-accent-alt)', fontFamily: 'var(--font-price)' }}>
                Gratis
              </span>
            ) : po ? (
              <>
                {po.discount_percent > 0 && (
                  <span
                    className="line-through text-sm"
                    style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-price)' }}
                  >
                    {po.initial_formatted}
                  </span>
                )}
                <span
                  className="text-2xl font-bold"
                  style={{
                    color:      po.discount_percent > 0 ? 'var(--color-accent-alt)' : '#fff',
                    fontFamily: 'var(--font-price)',
                  }}
                >
                  {po.final_formatted}
                </span>
                {po.discount_percent > 0 && <DiscountBadge pct={po.discount_percent} />}
              </>
            ) : null}
          </div>

          {/* Botón CTA */}
          <div>
            <button
              onClick={() => navigate(`/game/${game.steam_appid}`)}
              className="flex items-center gap-2 font-bold transition-all duration-200"
              style={{
                fontFamily:    'var(--font-cta)',
                fontSize:      '0.9rem',
                padding:       '12px 28px',
                borderRadius:  'var(--radius-btn)',
                background:    'var(--color-accent)',
                color:         '#fff',
                boxShadow:     '0 0 24px rgba(255,0,208,0.5), 0 4px 16px rgba(0,0,0,0.4)',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--color-accent-alt)'
                el.style.boxShadow  = '0 0 32px rgba(0,242,255,0.6), 0 4px 16px rgba(0,0,0,0.4)'
                el.style.transform  = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--color-accent)'
                el.style.boxShadow  = '0 0 24px rgba(255,0,208,0.5), 0 4px 16px rgba(0,0,0,0.4)'
                el.style.transform  = 'translateY(0)'
              }}
            >
              <ShoppingCart size={16} />
              Comprar ahora
            </button>
          </div>
        </div>

        {/* Spacer flexible — empuja el botón next al extremo derecho */}
        <div className="hidden lg:block flex-1" />

        {/* Botón next — oculto en mobile */}
        <button
          onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(current + 1) }}
          className="hidden lg:flex flex-shrink-0 mr-8 w-15 items-center justify-center transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'var(--color-accent)'
            el.style.background = 'linear-gradient(270deg, rgba(255,0,208,0.15) 0%, transparent 100%)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'rgba(255,255,255,0.6)'
            el.style.background = 'transparent'
          }}
        >
          <ChevronRight size={28} />
        </button>

      </div>

      {/* Dots — centrados horizontalmente en la parte inferior */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(i) }}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === current ? '28px' : '8px',
              height:     '8px',
              background: i === current ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
              boxShadow:  i === current ? 'var(--glow-accent)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Card
// ─────────────────────────────────────────────────────────────────────────────
function GameCard({ game }: { game: Game }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const po = game.price_overview

  return (
    <article
      className="rounded-xl overflow-hidden cursor-pointer flex flex-col"
      style={{
        background:   'var(--color-bg-card)',
        border:       `1px solid ${hovered ? 'rgba(255,0,208,0.45)' : 'var(--color-border)'}`,
        boxShadow:    hovered ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
        transform:    hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        transition:   'all 0.25s ease',
        borderRadius: 'var(--radius-card)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/game/${game.steam_appid}`)}
    >
      {/* Imagen con zoom sutil en hover */}
      <div className="overflow-hidden flex-shrink-0" style={{ height: '140px' }}>
        <img
          src={game.header_image}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
          loading="lazy"
        />
      </div>

      {/* Brillo inferior al hacer hover — efecto "levitar" */}
      {hovered && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height:     '2px',
            background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
            boxShadow:  '0 0 12px var(--color-accent)',
          }}
        />
      )}

      {/* Info */}
      <div className="flex flex-col flex-1" style={{ padding: '0.875rem', gap: '0.5rem' }}>
        <h3
          className="text-base font-semibold line-clamp-1"
          style={{
            fontFamily: 'var(--font-title)',
            color:      hovered ? '#fff' : 'var(--color-text)',
            transition: 'color 0.2s ease',
          }}
        >
          {game.name}
        </h3>

        <p
          className="text-xs line-clamp-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          {game.genres.map(g => g.description).join(' · ')}
        </p>

        {/* Precio */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {game.is_free ? (
            <span className="text-sm font-bold" style={{ color: 'var(--color-accent-alt)', fontFamily: 'var(--font-price)' }}>
              Gratis
            </span>
          ) : po ? (
            <>
              {po.discount_percent > 0 && (
                <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-price)' }}>
                  {po.initial_formatted}
                </span>
              )}
              <span
                className="text-sm font-bold"
                style={{
                  color:      po.discount_percent > 0 ? 'var(--color-accent-alt)' : 'var(--color-text)',
                  fontFamily: 'var(--font-price)',
                }}
              >
                {po.final_formatted}
              </span>
              {po.discount_percent > 0 && <DiscountBadge pct={po.discount_percent} />}
            </>
          ) : null}
        </div>

        {/* Botón añadir al carrito */}
        <div style={{ marginTop: 'auto' }}>
          <button
            className="w-full mt-2 py-2 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              fontFamily: 'var(--font-cta)',
              background: hovered
                ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))'
                : 'rgba(255,255,255,0.04)',
              color:      hovered ? '#fff' : 'var(--color-text-muted)',
              border:     `1px solid ${hovered ? 'transparent' : 'var(--color-border)'}`,
              boxShadow:  hovered ? 'var(--glow-accent)' : 'none',
              padding: '8px 0',
            }}
            onClick={e => { e.stopPropagation() /* TODO: addToCart */ }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección con grid de 4 cards
// ─────────────────────────────────────────────────────────────────────────────
function GameSection({ title, games, linkTo }: { title: string; games: Game[]; linkTo: string }) {
  const navigate = useNavigate()

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between" style={{ marginTop: '2rem', marginBottom: '2rem', }}>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}
        >
          {title}
        </h2>
        <button
          className="text-xs font-medium transition-all duration-200"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-cta)' }}
          onClick={() => navigate(linkTo)}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'var(--color-accent)'
            el.style.textShadow = '0 0 8px var(--color-accent)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color      = 'var(--color-text-muted)'
            el.style.textShadow = 'none'
          }}
        >
          Ver todo →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {games.slice(0, 4).map(game => (
          <GameCard key={game.steam_appid} game={game} />
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// StorePage — Hero full-width, secciones con max-w-6xl
// ─────────────────────────────────────────────────────────────────────────────
export default function StorePage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>

      {/* Hero — full-width, fuera del contenedor */}
      <HeroCarousel games={heroGames} />

      {/* Secciones — contenidas en max-w */}
      <div 
        className="w-full py-10" 
        style={{ 
          paddingLeft: 'clamp(1rem, 5vw, 5rem)', 
          paddingRight: 'clamp(1rem, 5vw, 5rem)',
          paddingBottom: '4rem',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,0,208,0.07) 50%, transparent 100%)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <GameSection title="Rebajas"         games={saleGames}     linkTo="/store/sales"     />
        <GameSection title="Lo más reciente"  games={recentGames}   linkTo="/store/new"       />
        <GameSection title="Mejor valorados"  games={topRatedGames} linkTo="/store/top-rated" />
      </div>

    </main>
  )
}
