import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import type { Game } from '../../types'
import DiscountBadge from './DiscountBadge'

export default function HeroCarousel({ games }: { games: Game[] }) {
  const [current, setCurrent]     = useState(0)
  const [animating, setAnimating] = useState(false)
  const navigate    = useNavigate()
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const isMobile    = window.innerWidth < 1024

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
    if (Math.abs(diff) < 40) return
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
    <div className="relative w-full overflow-hidden" style={{ height: '500px' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${game.screenshots?.[0]?.path_full || game.header_image})`,
          transition: 'opacity 0.4s ease',
          opacity: animating ? 0 : 1,
        }}
      />

      {/* Degradado horizontal */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(5,1,13,0.95) 0%, rgba(5,1,13,0.8) 20%, rgba(5,1,13,0.7) 40%, rgba(5,1,13,0) 60%)',
          ...(isMobile ? {
            background: 'linear-gradient(180deg, rgba(5,1,13,0.3) 0%, rgba(5,1,13,0.85) 60%, rgba(5,1,13,1) 100%)'
          } : {})
        }}
      />
      {/* Degradado inferior */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,1,13,0.6) 100%)' }}
      />

      <div className="absolute inset-0 flex items-stretch gap-8 px-5 lg:px-0">

        {/* Botón prev */}
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

        {/* Contenido */}
        <div
          className="flex flex-col justify-center flex-1 max-w-lg"
          style={{ paddingLeft: 'clamp(1.25rem, 5vw, 0px)', paddingRight: 'clamp(1.25rem, 5vw, 0px)' }}
        >
          {/* Tags de género */}
          <div className="flex gap-2 mb-6" style={{ marginBottom: '1rem' }}>
            {game.genres?.slice(0, 2).map(g => (
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
              fontFamily:   'var(--font-title)',
              fontSize:     'clamp(2rem, 4vw, 3.5rem)',
              textShadow:   '0 2px 24px rgba(0,0,0,0.9)',
              color:        '#fff',
              marginBottom: '0.5rem',
            }}
          >
            {game.name}
          </h1>

          {/* Descripción */}
          <p
            className="text-sm mb-6 line-clamp-2"
            style={{
              color:        'rgba(255,255,255,0.75)',
              fontFamily:   'var(--font-body)',
              lineHeight:   '1.6',
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
                  <span className="line-through text-sm" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-price)' }}>
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

        {/* Spacer */}
        <div className="hidden lg:block flex-1" />

        {/* Botón next */}
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

      {/* Dots */}
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
