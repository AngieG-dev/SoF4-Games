import { useEffect, useState } from 'react'
import type { Game } from '../types'
import { gameService } from '../services/gameService'
import GameCard from '../components/store/GameCard'

export default function GamesPage() {

    const [games, setGames]     = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)
    const [search, setSearch]   = useState('')
    const [sort, setSort]       = useState('name,asc')
    const [page, setPage]       = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {

        setLoading(true)

        gameService
            .getPage(page, 20, sort)
            .then(data => {
                setGames(data.content)
                setTotalPages(data.page.totalPages)
                setError(null)
            })
            .catch(err => {
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })

    }, [sort, page])

    if (loading) {
        return (
            <main
                className="min-h-screen"
                style={{
                    background: 'var(--color-bg)',
                    paddingTop: 'var(--nav-height)',
                }}
            >
                <div className="p-10">
                    Cargando juegos...
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main
                className="min-h-screen"
                style={{
                    background: 'var(--color-bg)',
                    paddingTop: 'var(--nav-height)',
                }}
            >
                <div className="p-10">
                    Error: {error}
                </div>
            </main>
        )
    }
    
    const filteredGames = games.filter(game => game.name.toLowerCase().includes(search.toLowerCase()))
    console.log(totalPages)
    return (
        <main
            className="min-h-screen"
            style={{
                background: 'var(--color-bg)',
                paddingTop: 'var(--nav-height)',
            }}
        >
            <div
                style={{
                    paddingLeft: 'clamp(1rem, 5vw, 5rem)',
                    paddingRight: 'clamp(1rem, 5vw, 5rem)',
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
                }}
            >
                <h1
                    className="text-3xl font-bold mb-8"
                    style={{
                        fontFamily: 'var(--font-title)',
                    }}
                >
                    Todos los juegos
                </h1>

                <div
                    className="flex flex-col md:flex-row gap-4 mb-8"
                    style={{
                        margin: '1rem 0',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar juego..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-3 py-2 rounded"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            padding: '0.5rem 0.7rem',
                        }}
                    />

                    <select
                        value={sort}
                        onChange={e => {
                            setPage(0)
                            setSort(e.target.value)
                        }}
                        className="px-3 py-2 rounded"
                        style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            padding: '0.5rem 0.7rem',
                        }}
                    >
                        <option value="name,asc">
                            Nombre
                        </option>

                        <option value="releaseDate,desc">
                            Más recientes
                        </option>

                        <option value="recommendationsTotal,desc">
                            Mejor valorados
                        </option>

                        <option value="discountPercent,desc">
                            Más descuento
                        </option>
                    </select>
                </div>

                <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    }}
                >
                    {filteredGames.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                        />
                    ))}
                </div>

                <div
                    className="flex justify-center gap-4 mt-8"
                    style={{ padding: '1rem', }}
                >
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {page + 1} de {totalPages}
                    </span>

                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </main>
    )
}