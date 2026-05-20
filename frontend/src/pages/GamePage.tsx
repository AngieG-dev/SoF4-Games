// pages/GamePage.tsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { mockGames } from '../data/mockGames'
import Gallery       from '../components/game/Gallery'
import PurchasePanel from '../components/game/PurchasePanel'
import TabBar, { type Tab } from '../components/game/TabBar'
import TabDescripcion from '../components/game/tabs/TabDescripcion'
import TabRequisitos  from '../components/game/tabs/TabRequisitos'
import TabResenas     from '../components/game/tabs/TabResenas'

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

  const relatedGames = mockGames.filter(g => g.steam_appid !== game.steam_appid).slice(0, 4)

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
          <div className="flex-1 min-w-0">
            <Gallery game={game} />
          </div>
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
            {relatedGames.map(g => {
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
