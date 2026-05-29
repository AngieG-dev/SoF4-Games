// components/game/tabs/TabDescripcion.tsx
import type { Game } from '../../../types'

export default function TabDescripcion({ game }: { game: Game }) {
  return (
    <div className="pb-5" style={{ paddingTop: '1rem', }}>
      <p 
        className="text-base leading-relaxed" 
        style={{ 
          color: 'rgba(255,255,255,0.85)', 
          fontFamily: 'var(--font-body)', 
        }}
      >
        {game.detailed_description || game.short_description}
      </p>
      {game.steam_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5" style={{ paddingTop: '1rem', }}>
          {game.steam_tags.map(tag => (
            <span
              key={tag}
              className="rounded text-xs"
              style={{
                padding:    '5px 15px',
                background: 'rgba(255,255,255,0.05)',
                border:     '1px solid var(--color-border)',
                color:      'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
