// pages/StorePage.tsx
//
// CAMBIOS respecto a la versión anterior:
//   - Eliminado import de heroGames/saleGames/recentGames/topRatedGames (datos mock)
//   - Añadido useState + useEffect para cargar juegos desde el backend real
//   - Las secciones (Rebajas, Lo más reciente, Mejor valorados) ahora filtran
//     y ordenan los datos que llegan del backend, igual que antes hacían los selectores

import { useState, useEffect } from 'react'
import type { Game } from '../types'
import { gameService } from '../services/gameService'
import HeroCarousel from '../components/store/HeroCarousel'
import GameSection  from '../components/store/GameSection'

// IDs de los juegos que aparecen en el hero carousel.
// Son los mismos que estaban en mockGames.ts → HERO_APPIDS.
// Cuando el backend devuelva los juegos reales, estos IDs deben existir en la BD.
const HERO_APPIDS = [1145360, 2379780, 367520, 646570]

export default function StorePage() {

    // ── Estado ────────────────────────────────────────────────────────────────
    // games: array vacío hasta que el backend responda
    const [games,   setGames]   = useState<Game[]>([])
    // loading: true mientras esperamos → mostramos spinner
    const [loading, setLoading] = useState(true)
    // error: null si todo OK, string con mensaje si algo falla
    const [error,   setError]   = useState<string | null>(null)

    // ── Llamada al backend ────────────────────────────────────────────────────
    // useEffect con [] se ejecuta UNA SOLA VEZ cuando la página aparece en pantalla.
    // Si quitaras el [], se ejecutaría en cada re-render → bucle infinito.
    useEffect(() => {
        gameService.getAll()
            .then(data => {
                setGames(data)    // guardamos los juegos
                setLoading(false) // ya no cargamos
            })
            .catch((err: Error) => {
                setError(err.message) // guardamos el mensaje de error
                setLoading(false)
            })
    }, [])

    // ── Derivamos las secciones de los datos reales ───────────────────────────
    // Antes esto lo hacía gameSelectors.ts con mockGames.
    // Ahora lo hacemos aquí con los datos del backend.
    // (Solo se calculan cuando games cambia, no en cada render)
    const heroGames     = games.filter(g => HERO_APPIDS.includes(g.steam_appid))
    const saleGames     = games.filter(g => (g.price_overview?.discount_percent ?? 0) > 0)
    const recentGames   = [...games].reverse().slice(0, 4)
    const topRatedGames = [...games].sort((a, b) => b.total_positive - a.total_positive).slice(0, 4)

    // ── Estados de carga y error ──────────────────────────────────────────────
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

    // ── Render principal ──────────────────────────────────────────────────────
    // Igual que antes, pero ahora "games" viene del backend en vez de los mocks.
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
