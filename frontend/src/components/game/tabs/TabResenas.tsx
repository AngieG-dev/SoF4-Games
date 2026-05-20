// components/game/tabs/TabResenas.tsx
import type { Game } from '../../../types'

export default function TabResenas({ game }: { game: Game }) {
  const total = game.total_positive + game.total_negative
  const pct   = total > 0 ? Math.round((game.total_positive / total) * 100) : 0

  return (
    <div className="py-5">
      {/* Resumen */}
      <div
        className="flex items-center gap-6 mb-6 p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}
      >
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
