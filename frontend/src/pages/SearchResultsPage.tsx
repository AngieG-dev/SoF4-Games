import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gameService } from '../services/gameService'
import type { Game } from '../types'
import GameCard from '../components/store/GameCard'

export default function SearchResultsPage() {

    const [searchParams] = useSearchParams()

    const query = searchParams.get('q') ?? ''

    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query.trim()) {
            setGames([])
            setLoading(false)
            return
        }

        setLoading(true)

        gameService
            .search(query, 0, 20)
            .then(data => {
                setGames(data)
                setError(null)
            })
            .catch(err => {
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })

    }, [query])

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
                    Cargando resultados...
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
                    className="text-3xl font-bold mb-6"
                    style={{
                        fontFamily: 'var(--font-title)',
                    }}
                >
                    Resultados para "{query}"
                </h1>

                <p
                    className="mb-8"
                    style={{
                        color: 'var(--color-text-muted)',
                    }}
                >
                    {games.length} resultados encontrados
                </p>

                {games.length === 0 ? (
                    <p
                        style={{
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        No se encontraron juegos.
                    </p>
                ) : (
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
                        }}
                    >
                        {games.map(game => (
                            <GameCard
                                key={game.id}
                                game={game}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
