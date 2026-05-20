// components/game/tabs/TabDescripcion.tsx
import type { Game } from '../../../types'

export default function TabDescripcion({ game }: { game: Game }) {
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
              style={{
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
