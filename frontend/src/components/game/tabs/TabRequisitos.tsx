// components/game/tabs/TabRequisitos.tsx
import type { Game } from '../../../types'

function ReqBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex-1">
      <h4 className="font-semibold mb-3 text-sm" style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {text.split(' | ').filter(Boolean).map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs pb-2"
            style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TabRequisitos({ game }: { game: Game }) {
  const plats = Object.entries(game.system_requirements)

  if (!plats.length) {
    return <p className="py-5 text-sm" style={{ color: 'var(--color-text-muted)' }}>No hay requisitos disponibles.</p>
  }

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
            {reqs.minimum     && <ReqBlock title="Mínimos"      text={reqs.minimum} />}
            {reqs.recommended && <ReqBlock title="Recomendados" text={reqs.recommended} />}
          </div>
        </div>
      ))}
    </div>
  )
}
