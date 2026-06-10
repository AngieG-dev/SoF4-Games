import { useState, useEffect } from 'react'
import type { LibraryItem } from '../types/library'
import { getLibrary } from '../services/libraryService'

export default function LibraryPage() {
    const [games, setGames] = useState<LibraryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selected, setSelected] = useState<LibraryItem | null>(null)
    const [hoveredId, setHoveredId] = useState<number | null>(null)

    useEffect(() => {
        getLibrary()
            .then((data) => { setGames(data); setLoading(false) })
            .catch((err: Error) => { setError(err.message); setLoading(false) })
    }, [])

    const fmt = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

    const centered = (msg: string) => (
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>{msg}</p>
        </main>
    )

    if (loading) return centered('Cargando biblioteca...')
    if (error)   return centered(`Error al cargar la biblioteca: ${error}`)
    if (games.length === 0) return centered('Tu biblioteca está vacía. Visita la tienda para comprar juegos.')

    const LibraryCard = ({ game, height = 160 }: { game: LibraryItem; height?: number }) => {
        const hovered = hoveredId === game.steamAppId
        return (
            <article
                className="rounded-xl overflow-hidden cursor-pointer flex flex-col"
                style={{ background: 'var(--color-bg-card)', border: `1px solid ${hovered ? 'rgba(255,0,208,0.45)' : 'var(--color-border)'}`, boxShadow: hovered ? 'var(--card-shadow-hover)' : 'var(--card-shadow)', transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)', transition: 'all 0.25s ease', borderRadius: 'var(--radius-card)', marginBottom: '1rem' }}
                onMouseEnter={() => setHoveredId(game.steamAppId)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelected(game)}>

                <div className="overflow-hidden flex-shrink-0" style={{ height: `${height}px` }}>
                    <img src={game.headerImage} alt={game.name} className="w-full h-full object-cover transition-transform duration-500" style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }} loading="lazy" />
                </div>

                <div className="flex flex-col flex-1" style={{ padding: '0.875rem', gap: '0.4rem' }}>

                    <h3 className="text-base font-semibold line-clamp-1" style={{ fontFamily: 'var(--font-title)', color: hovered ? '#fff' : 'var(--color-text)', transition: 'color 0.2s ease' }}>{game.name}</h3>

                    <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>▶ 12 h · ★ 2/10 logros</p>

                    <button
                        className="w-full rounded-md text-xs font-semibold transition-all duration-200"
                        style={{ marginTop: '8px', padding: '8px 0', fontFamily: 'var(--font-cta)', background: hovered ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))' : 'rgba(255,255,255,0.04)', color: hovered ? '#fff' : 'var(--color-text-muted)', border: hovered ? 'none' : '1px solid var(--color-border)', boxShadow: hovered ? 'var(--glow-accent)' : 'none' }}
                        onClick={e => e.stopPropagation()}>▶ Jugar</button>
                    <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>Instalado · 100%</p>
                </div>
            </article>
        )
    }

    return (
        <main className="min-h-screen flex" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>

            {/* Sidebar */}
            <aside className="flex-shrink-0 flex flex-col" style={{ width: '260px', minHeight: 'calc(100vh - var(--nav-height))', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                    <input type="text" placeholder="Buscar en biblioteca..." className="w-full rounded-md text-sm" style={{ padding: '8px 12px', background: 'var(--color-input)', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} />
                </div>
                <ul className="flex-1 overflow-y-auto" style={{ padding: '0.5rem' }}>
                    {games.map((game) => {
                        const active = selected?.steamAppId === game.steamAppId
                        return (
                            <li key={game.steamAppId}>
                                <button onClick={() => setSelected(game)} className="w-full flex items-center gap-3 text-left rounded-md transition-colors" style={{ padding: '8px 10px', background: active ? 'var(--color-primary-subtle)' : 'transparent', borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent' }}>
                                    <img src={game.headerImage} alt={game.name} className="rounded flex-shrink-0 object-cover" style={{ width: '40px', height: '30px' }} />
                                    <span className="text-sm truncate font-medium" style={{ color: active ? 'var(--color-primary)' : 'var(--color-text)' }}>{game.name}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <div className="text-xs text-center" style={{ padding: '0.75rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
                    · · · {games.length} juego{games.length !== 1 ? 's' : ''} · · ·
                </div>
            </aside>

            {/* Main panel */}
            <div className="flex-1 overflow-y-auto">
                {selected ? (
                    <>
                        <div className="w-full overflow-hidden" style={{ height: '240px' }}>
                            <img src={selected.headerImage} alt={selected.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.75)' }} />
                        </div>
                        <div style={{ padding: '0 2rem' }}>
                            <div className="flex items-center justify-between gap-4 py-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <div>
                                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>{selected.name}</h1>
                                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Comprado el {fmt(selected.purchasedAt)} &nbsp;·&nbsp; ▶ 12 h jugadas &nbsp;·&nbsp; ★ 2/10 logros</p>
                                </div>
                                <div className="flex gap-3 flex-shrink-0">
                                    <button className="rounded-md font-semibold text-sm transition-all duration-200" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: 'var(--glow-accent)', fontFamily: 'var(--font-cta)' }}>▶ Jugar</button>
                                    <button className="rounded-md font-semibold text-sm" style={{ padding: '8px 20px', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer', fontFamily: 'var(--font-cta)' }}>Ver en tienda</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--color-border)' }}>
                                    <div className="h-full rounded-full" style={{ width: '20%', background: 'var(--color-accent)' }} />
                                </div>
                                <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>Instalado · 100%</span>
                            </div>
                            <div className="py-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-base font-semibold" style={{ margin: 2, color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>Jugados recientemente</h2>
                                    <button className="text-sm" style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Ver todos →</button>
                                </div>
                                <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', paddingTop: '8px', overflow: 'visible' }}>
                                    {games.filter(g => g.steamAppId !== selected.steamAppId).slice(0, 5).map(game => (
                                        <LibraryCard key={game.steamAppId} game={game} height={90} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '2.5rem 2rem' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-title)' }}>Jugados recientemente</h1>
                            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Ordenar por: Más reciente</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{games.length} juegos en tu biblioteca</p>
                        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                            {games.map(game => <LibraryCard key={game.steamAppId} game={game} />)}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}