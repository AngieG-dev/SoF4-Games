// pages/GamePage.tsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Gift, ChevronRight } from 'lucide-react'
import { mockGames } from '../data/mockGames'
import type { Game } from '../types'

type Tab = 'descripcion' | 'requisitos' | 'resenas'

// ─────────────────────────────────────────────────────────────────────────────
// Galería de screenshots
// ─────────────────────────────────────────────────────────────────────────────
function Gallery({ game }: { game: Game }) {
  const [active, setActive] = useState(0)
  const screenshots = game.screenshots

  if (!screenshots.length) {
    return (
      <div
        className="w-full rounded-xl flex items-center justify-center"
        style={{ height: '340px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>Sin imágenes disponibles</span>
      </div>
    )
  }

  return (
    <div>
      {/* Imagen principal */}
      <div className="rounded-xl overflow-hidden mb-3" style={{ height: '340px' }}>
        <img
          src={screenshots[active]?.path_full || screenshots[active]?.path_thumbnail}
          alt={`${game.name} screenshot ${active + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {screenshots.map((ss, i) => (
            <button
              key={ss.id}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
              style={{
                width:  '90px',
                height: '54px',
                border: `2px solid ${i === active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                boxShadow: i === active ? 'var(--glow-accent)' : 'none',
              }}
            >
              <img
                src={ss.path_thumbnail}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel de compra (sidebar)
// ─────────────────────────────────────────────────────────────────────────────
function PurchasePanel({ game }: { game: Game }) {
  const po = game.price_overview

  return (
    <aside
      className="rounded-xl p-5 flex flex-col gap-4 sticky top-20"
      style={{
        background: 'var(--color-bg-card)',
        border:     '1px solid var(--color-border)',
        minWidth:   '260px',
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
        className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          fontFamily: 'var(--font-cta)',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
          color:      '#fff',
          boxShadow:  'var(--glow-accent)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
      >
        <ShoppingCart size={16} />
        Añadir al carrito
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
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--color-accent)'
              el.style.color = 'var(--color-text)'
              el.style.boxShadow = 'var(--glow-accent)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--color-border)'
              el.style.color = 'var(--color-text-muted)'
              el.style.boxShadow = 'none'
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
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-title)' }}>
          Ficha técnica
        </p>
        {[
          { label: 'Lanzamiento', value: game.release_date.date || '—' },
          { label: 'Idiomas',     value: game.supported_languages.split(',').slice(0,3).join(', ') },
          { label: 'Plataforma',  value: [game.platforms.windows && 'PC', game.platforms.mac && 'Mac', game.platforms.linux && 'Linux'].filter(Boolean).join(' · ') },
          { label: 'Clasificación', value: game.required_age > 0 ? `+${game.required_age}` : 'Para todos' },
          { label: 'Desarrollador', value: game.developers[0] },
          { label: 'Género',       value: game.genres.map(g => g.description).join(' · ') },
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

// ─────────────────────────────────────────────────────────────────────────────
// Tabs: Descripción / Requisitos / Reseñas
// ─────────────────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'requisitos',  label: 'Requisitos' },
    { id: 'resenas',     label: 'Reseñas' },
  ]
  return (
    <div className="flex gap-1 border-b" style={{ borderColor: 'var(--color-border)' }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="px-4 py-3 text-sm font-medium transition-all duration-200 relative"
          style={{
            fontFamily: 'var(--font-cta)',
            color:      active === t.id ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          {t.label}
          {active === t.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))' }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

function TabDescripcion({ game }: { game: Game }) {
  return (
    <div className="py-5">
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
        {game.detailed_description || game.short_description}
      </p>
      {game.steam_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {game.steam_tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function TabRequisitos({ game }: { game: Game }) {
  const sr    = game.system_requirements
  const plats = Object.entries(sr)

  if (!plats.length) {
    return <p className="py-5 text-sm" style={{ color: 'var(--color-text-muted)' }}>No hay requisitos disponibles.</p>
  }

  const ReqBlock = ({ title, reqs }: { title: string; reqs: { minimum: string | null; recommended: string | null } }) => (
    <div className="flex-1">
      <h4 className="font-semibold mb-3 text-sm" style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {(reqs.minimum || reqs.recommended || '').split(' | ').filter(Boolean).map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs pb-2" style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="py-5">
      {plats.map(([plat, reqs]) => (
        <div key={plat} className="mb-6">
          {plats.length > 1 && (
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-title)' }}>
              {plat === 'pc' ? 'Windows' : plat === 'mac' ? 'macOS' : 'Linux'}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reqs.minimum    && <ReqBlock title="Mínimos"      reqs={{ minimum: reqs.minimum, recommended: null }} />}
            {reqs.recommended && <ReqBlock title="Recomendados" reqs={{ minimum: reqs.recommended, recommended: null }} />}
          </div>
        </div>
      ))}
    </div>
  )
}

function TabResenas({ game }: { game: Game }) {
  const total    = game.total_positive + game.total_negative
  const pct      = total > 0 ? Math.round((game.total_positive / total) * 100) : 0

  return (
    <div className="py-5">
      {/* Resumen */}
      <div className="flex items-center gap-6 mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-price)', color: 'var(--color-accent-alt)' }}>
            {pct}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            positivas
          </p>
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1" style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
            {game.review_score_desc}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Basado en {game.recommendations.total.toLocaleString('es-CL')} reseñas
          </p>
          {/* Barra de progreso */}
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width:      `${pct}%`,
                background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))',
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        Las reseñas individuales estarán disponibles cuando el backend esté conectado.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GamePage principal
// ─────────────────────────────────────────────────────────────────────────────
export default function GamePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('descripcion')

  const game = mockGames.find(g => g.steam_appid === Number(id))

  if (!game) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>Juego no encontrado</p>
          <button onClick={() => navigate('/')} className="text-sm" style={{ color: 'var(--color-accent)' }}>
            ← Volver a la tienda
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          <Link to="/" className="hover:underline" style={{ color: 'var(--color-text-muted)' }}>Tienda</Link>
          <ChevronRight size={12} />
          {game.genres[0] && (
            <>
              <span>{game.genres[0].description}</span>
              <ChevronRight size={12} />
            </>
          )}
          <span style={{ color: 'var(--color-text)' }}>{game.name}</span>
        </nav>

        {/* Layout principal: galería + panel compra */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Galería (izquierda) */}
          <div className="flex-1 min-w-0">
            <Gallery game={game} />
          </div>
          {/* Panel compra (derecha) */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <PurchasePanel game={game} />
          </div>
        </div>

        {/* Tabs de contenido */}
        <div className="mb-8">
          <TabBar active={tab} onChange={setTab} />
          {tab === 'descripcion' && <TabDescripcion game={game} />}
          {tab === 'requisitos'  && <TabRequisitos  game={game} />}
          {tab === 'resenas'     && <TabResenas      game={game} />}
        </div>

        {/* También te puede gustar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-title)' }}>
              También te puede gustar
            </h2>
            <button className="text-xs" style={{ color: 'var(--color-text-muted)' }} onClick={() => navigate('/')}>
              Ver todo →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockGames
              .filter(g => g.steam_appid !== game.steam_appid)
              .slice(0, 4)
              .map(g => {
                const po = g.price_overview
                return (
                  <button
                    key={g.steam_appid}
                    onClick={() => navigate(`/game/${g.steam_appid}`)}
                    className="text-left rounded-xl overflow-hidden transition-all duration-200"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,208,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                  >
                    <img src={g.header_image} alt={g.name} className="w-full object-cover" style={{ height: '100px' }} loading="lazy" />
                    <div className="p-2.5">
                      <p className="text-xs font-semibold mb-1 line-clamp-1" style={{ fontFamily: 'var(--font-title)' }}>{g.name}</p>
                      <div className="flex items-center gap-1.5">
                        {po && po.discount_percent > 0 && (
                          <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-price)' }}>{po.initial_formatted}</span>
                        )}
                        <span className="text-xs font-bold" style={{ color: po?.discount_percent ? 'var(--color-accent-alt)' : 'var(--color-text)', fontFamily: 'var(--font-price)' }}>
                          {g.is_free ? 'Gratis' : po?.final_formatted ?? '—'}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        </section>
      </div>
    </main>
  )
}
