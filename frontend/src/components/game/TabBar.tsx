export type Tab = 'descripcion' | 'requisitos' | 'resenas'

interface TabBarProps {
  active:   Tab
  onChange: (t: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'requisitos',  label: 'Requisitos'  },
  { id: 'resenas',     label: 'Reseñas'     },
]

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="px-4 py-3 text-base font-medium transition-all duration-200 relative"
          style={{
            fontFamily: 'var(--font-cta)',
            color:      active === t.id ? 'var(--color-text)' : 'var(--color-text-muted)',
          }}
        >
          {t.label}
          {active === t.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
              style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-alt))' }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
