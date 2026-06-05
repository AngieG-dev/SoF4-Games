import { useState, useEffect } from 'react'
import type { Game } from '../types'
import { gameService } from '../services/gameService'
import HeroCarousel from '../components/store/HeroCarousel'
import GameSection  from '../components/store/GameSection'

const HERO_IDS = [90, 25, 47, 35]

export default function StorePage() {

    const [games,   setGames]   = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)


    useEffect(() => {
        gameService.getAll()
            .then(data => {
                setGames(data)
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    const heroGames     = games.filter(g => HERO_IDS.includes(g.id))
    const saleGames     = games.filter(g => (g.price_overview?.discount_percent ?? 0) > 0)
    const recentGames   = [...games].reverse().slice(0, 4)
    const topRatedGames = [...games].sort((a, b) => b.total_positive - a.total_positive).slice(0, 4)

    if (loading) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}
            >
                {/* Spinner simple con CSS — sin dependencias externas */}
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div
                        style={{
                            width:  '40px',
                            height: '40px',
                            border: '3px solid var(--color-border)',
                            borderTopColor: 'var(--color-accent)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 1rem',
                        }}
                    />
                    Cargando juegos...
                    {/* La animación "spin" está definida en index.css */}
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}
            >
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Error al cargar los juegos: {error}
                </p>
            </main>
        )
    }

    return (
        <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>

            {/* Hero — full-width, fuera del contenedor */}
            <HeroCarousel games={heroGames} />

            {/* Secciones — contenidas en max-w */}
            <div
                className="w-full py-10"
                style={{
                    paddingLeft:   'clamp(1rem, 5vw, 5rem)',
                    paddingRight:  'clamp(1rem, 5vw, 5rem)',
                    paddingBottom: '4rem',
                    background:    'linear-gradient(180deg, transparent 0%, rgba(255,0,208,0.07) 50%, transparent 100%)',
                    borderRadius:  'var(--radius-card)',
                }}
            >
                <GameSection title="Rebajas"          games={saleGames}     linkTo="/store/sales"     />
                <GameSection title="Lo más reciente"   games={recentGames}   linkTo="/store/new"       />
                <GameSection title="Mejor valorados"   games={topRatedGames} linkTo="/store/top-rated" />
            </div>

        </main>
    )
}
