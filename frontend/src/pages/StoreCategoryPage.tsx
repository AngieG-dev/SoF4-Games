import type { Game } from '../types'
import GameCard from '../components/store/GameCard'

interface StoreCategoryPageProps {
    title: string
    games: Game[]
    loading: boolean
    error: string | null
}

export default function StoreCategoryPage({
    title,
    games,
    loading,
    error,
}: StoreCategoryPageProps) {

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
                    {title}
                </h1>

                <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(260px, 1fr))',
                    }}
                >
                    {games.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}