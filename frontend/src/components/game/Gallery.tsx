// components/game/Gallery.tsx
import { useState } from 'react'
import type { Game } from '../../types'

export default function Gallery({ game }: { game: Game }) {
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
      <div className="rounded-xl overflow-hidden mb-3" style={{ height: '33.5rem' }}>
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
                width:     '90px',
                height:    '54px',
                border:    `2px solid ${i === active ? 'var(--color-accent)' : 'var(--color-border)'}`,
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
