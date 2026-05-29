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
import GameSection from '../components/store/GameSection';

export default function GamePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('descripcion')

  const game = mockGames.find(g => g.steam_appid === Number(id))

  if (!game) {
    return (
      <main className="min-h-screen overflow-x-hidden flex items-center justify-center" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>
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
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>
      <div
        className="w-full py-10"
        style={{
          paddingLeft:   'clamp(1rem, 5vw, 5rem)',
          paddingRight:  'clamp(1rem, 5vw, 5rem)',
          paddingBottom: '4rem',
        }}
      >

        {/* Breadcrumb */}
        <nav 
          className="flex items-center gap-1.5 text-sm mb-6" 
          style={{ 
            color: 'var(--color-text-muted)', 
            fontFamily: 'var(--font-body)',
            margin: '1rem 0', 
          }}
        >
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
        <div className="mb-8" style={{ margin: '1rem 0', }}>
          <TabBar active={tab} onChange={setTab} />
          {tab === 'descripcion' && <TabDescripcion game={game} />}
          {tab === 'requisitos'  && <TabRequisitos  game={game} />}
          {tab === 'resenas'     && <TabResenas      game={game} />}
        </div>

        {/* También te puede gustar */}
        <GameSection title="También te puede gustar" games={relatedGames} linkTo="/store/top-rated" compact showCartButton={false} />

      </div>
    </main>
  )
}
