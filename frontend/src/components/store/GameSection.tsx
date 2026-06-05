import { useNavigate } from 'react-router-dom'
import type { Game } from '../../types'
import GameCard from './GameCard'

interface GameSectionProps {
  title:   string
  games:   Game[]
  linkTo:  string
  compact?: boolean
  showCartButton?: boolean
}

export default function GameSection({ title, games, linkTo, compact = false, showCartButton = true }: GameSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
          <GameCard key={game.id} game={game} compact={compact} showCartButton={showCartButton} />
        ))}
      </div>
    </section>
  )
}
