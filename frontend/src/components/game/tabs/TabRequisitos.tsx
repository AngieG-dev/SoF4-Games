import type { GameDetail } from '../../../types/game'

function ReqBlock({ title, text }: { title: string; text: string }) {
  // Intentamos dividir por ' / ' o ' | ' o simple texto si no hay separadores claros
  const lines = text.split(/ \/ | \| /).filter(Boolean);
  return (
    <div className="flex-1">
      <h4 
        className="font-semibold mb-3" 
        style={{ 
          fontFamily: 'var(--font-title)', 
          color: 'var(--color-text)', 
          fontSize: '1rem', 
          paddingBottom: '1rem',
        }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {lines.length > 0 ? lines.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2"
            style={{
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              paddingTop: '0.4rem',
              paddingBottom: '0.5rem',
            }}
          >
            {item}
          </div>
        )) : <p className="text-sm text-gray-500">{text}</p>}
      </div>
    </div>
  )
}

export default function TabRequisitos({ game }: { game: GameDetail }) {
  const requirements = game.systemRequirements ? JSON.parse(game.systemRequirements) : null;
  
  if (!plats.length) {
    return <p className="py-5" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No hay requisitos disponibles.</p>
  }

  return (
    <div className="pb-5" style={{ paddingTop: '1.5rem' }}>
      {plats.map(([plat, reqs]) => (
        <div key={plat} className="mb-6">
          <p className="uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-title)', fontSize: '0.75rem' }}>
            {plat === 'pc' ? 'Windows' : plat === 'mac' ? 'macOS' : plat === 'linux' ? 'Linux' : plat}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reqs.minimum     && <ReqBlock title="Mínimos"      text={reqs.minimum} />}
            {reqs.recommended && <ReqBlock title="Recomendados" text={reqs.recommended} />}
          </div>
        </div>
      ))}
    </div>
  )
}