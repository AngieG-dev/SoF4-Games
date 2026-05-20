// pages/StorePage.tsx
import HeroCarousel from '../components/store/HeroCarousel'
import GameSection  from '../components/store/GameSection'
import { heroGames, saleGames, recentGames, topRatedGames } from '../data/gameSelectors'

export default function StorePage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>

      {/* Hero — full-width, fuera del contenedor */}
      <HeroCarousel games={heroGames} />

      {/* Secciones — contenidas en max-w */}
      <div
        className="w-full py-10"
        style={{
          paddingLeft:  'clamp(1rem, 5vw, 5rem)',
          paddingRight: 'clamp(1rem, 5vw, 5rem)',
          paddingBottom: '4rem',
          background:   'linear-gradient(180deg, transparent 0%, rgba(255,0,208,0.07) 50%, transparent 100%)',
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
