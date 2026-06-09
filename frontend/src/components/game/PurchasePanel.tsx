import { ShoppingCart, Heart, Gift, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Game } from '../../types'
import { getPlatformLabel } from '../../utils/priceUtils'
import { useCart } from '../../context/CartContext'

export default function PurchasePanel({ game }: { game: Game }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'loading' | 'added' | 'error'>('idle')
  const po = game.price_overview

  return (
    <aside
      className="rounded-xl p-6 flex flex-col gap-4 sticky top-20"
      style={{
        background: 'var(--color-bg-card)',
        border:     '1px solid var(--color-border)',
        minWidth:   '260px',
        padding:    '1.5rem',
        height:     'stretch',
      }}
    >
      {/* Nombre y estudio */}
      <div>
        <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-title)' }}>
          {game.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          {game.developers[0]}
        </p>
      </div>

      {/* Géneros */}
      <div className="flex flex-wrap gap-1.5">
        {game.genres.map(g => (
          <span
            key={g.id}
            className="px-2 py-0.5 rounded text-xs"
            style={{
              border:     '1px solid var(--color-border)',
              color:      'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              padding:    '3px 10px',
            }}
          >
            {g.description}
          </span>
        ))}
      </div>

      {/* Precio */}
      <div>
        {game.is_free ? (
          <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-alt)', fontFamily: 'var(--font-price)' }}>
            Gratis
          </p>
        ) : po ? (
          <div className="flex flex-col gap-1">
            {po.discount_percent > 0 && (
              <span className="line-through text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-price)' }}>
                {po.initial_formatted}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-price)' }}>
                {po.final_formatted}
              </span>
              {po.discount_percent > 0 && (
                <span
                  className="px-2 py-0.5 rounded text-sm font-bold"
                  style={{ background: 'rgba(0,242,255,0.15)', color: 'var(--color-accent-alt)', border: '1px solid rgba(0,242,255,0.3)' }}
                >
                  -{po.discount_percent}%
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Botón añadir al carrito */}
      <button
        disabled={status === 'loading' || status === 'added'}
        onClick={async () => {
          const token = localStorage.getItem('token')
          if (!token) { navigate('/login'); return }
          setStatus('loading')
          try {
            await addToCart(game.id)
            setStatus('added')
          } catch {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 2000)
          }
        }}
        className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          fontFamily: 'var(--font-cta)',
          background: status === 'added'
            ? 'linear-gradient(135deg, #00c26e, #00a85a)'
            : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
          color:      '#fff',
          boxShadow:  'var(--glow-accent)',
          padding:    '10px 28px',
          opacity:    status === 'loading' ? 0.7 : 1,
          cursor:     status === 'loading' || status === 'added' ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={e => { if (status === 'idle') (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
      >
        {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
        {status === 'added'   && <Check size={16} />}
        {status === 'idle' || status === 'error' ? <ShoppingCart size={16} /> : null}
        {status === 'loading' ? 'Agregando...' : status === 'added' ? '¡Agregado!' : status === 'error' ? 'Error, reintentar' : 'Añadir al carrito'}
      </button>

      {/* Botones secundarios */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: <Heart size={14} />, label: 'Lista de deseos' },
          { icon: <Gift size={14} />,  label: 'Regalar' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
            style={{
              fontFamily: 'var(--font-cta)',
              background: 'transparent',
              color:      'var(--color-text-muted)',
              border:     '1px solid var(--color-border)',
              padding:    '3px 10px',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--color-accent)'
              el.style.color       = 'var(--color-text)'
              el.style.boxShadow   = 'var(--glow-accent)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--color-border)'
              el.style.color       = 'var(--color-text-muted)'
              el.style.boxShadow   = 'none'
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Ficha técnica */}
      <div
        className="rounded-lg p-4 flex flex-col gap-2.5"
        style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border:     '1px solid var(--color-border)',
          padding:    '0.7rem',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-title)' }}>
          Ficha técnica
        </p>
        {[
          { label: 'Lanzamiento',  value: game.release_date.date || '—' },
          { label: 'Idiomas',      value: game.supported_languages.split(',').slice(0, 3).join(', ') },
          { label: 'Plataforma',   value: getPlatformLabel(game.platforms) },
          { label: 'Clasificación', value: game.required_age > 0 ? `+${game.required_age}` : 'Para todos' },
          { label: 'Desarrollador', value: game.developers[0] },
          { label: 'Género',        value: game.genres.map(g => g.description).join(' · ') },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start gap-2">
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {label}
            </span>
            <span className="text-xs text-right" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
