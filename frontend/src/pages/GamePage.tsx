import { useState, useEffect, useReducer } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { gameService }  from '../services/gameService'
import type { GameDetail } from '../types/game'
import type { Game }       from '../types'
import Gallery       from '../components/game/Gallery'
import PurchasePanel from '../components/game/PurchasePanel'
import TabBar, { type Tab } from '../components/game/TabBar'
import TabDescripcion from '../components/game/tabs/TabDescripcion'
import TabRequisitos  from '../components/game/tabs/TabRequisitos'
import TabResenas     from '../components/game/tabs/TabResenas'

interface PageState {
    game:    GameDetail | null
    loading: boolean
    error:   string | null
}

export default function GamePage() {
    const { id }   = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [tab, setTab] = useState<Tab>('descripcion')

    const [state, dispatch] = useReducer(
        (prev: PageState, next: Partial<PageState>) => ({ ...prev, ...next }),
        { game: null, loading: true, error: null }
    )

    useEffect(() => {
        if (!id) return

        gameService.getById(Number(id))
            .then(data => dispatch({ game: data,  loading: false, error: null }))
            .catch(err => dispatch({ game: null,  loading: false, error: err.message ?? 'Error al cargar el juego' }))
    }, [id])

    // ── Estado: cargando ──
    if (state.loading) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>
                <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    Cargando juego…
                </p>
            </main>
        )
    }

    // ── Estado: error o juego no encontrado ──
    if (state.error || !state.game) {
        return (
            <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}>
                <div className="text-center">
                    <p className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
                        Juego no encontrado
                    </p>
                    <button onClick={() => navigate('/')} className="text-sm" style={{ color: 'var(--color-accent)' }}>
                        ← Volver a la tienda
                    </button>
                </div>
            </main>
        )
    }

    const game = state.game

    const gameForComponents: Game = {
        id:                   game.id,
        steam_appid:          game.steamAppId,
        collection:           'top_steam',
        name:                 game.name,
        short_description:    game.shortDescription,
        detailed_description: game.shortDescription,
        header_image:         game.headerImage,
        capsule_image:        game.headerImage,
        background_raw:       game.backgroundRaw,
        is_free:              game.isFree,
        required_age:         game.requiredAge,
        controller_support:   game.controllerSupport,
        supported_languages:  game.supportedLanguages ?? '',
        website:              null,
        metacritic:           null,
        steam_tags:           [],
        review_score_desc:    '',
        total_positive:       0,
        total_negative:       0,

        screenshots: game.screenshots.map(s => ({
            id:             s.id,
            path_thumbnail: s.pathThumbnail,
            path_full:      s.pathFull,
        })),

        genres: game.genres.map(g => ({
            id:          String(g.id),
            description: g.name,
        })),

        categories: game.categories.map(c => ({
            id:          c.id,
            description: c.name,
        })),

        developers: game.developers,
        publishers: game.publishers,

        price_overview: game.isFree ? null : {
            currency:          game.currency ?? 'CLP',
            initial:           game.priceInitial,
            final:             game.priceFinal,
            discount_percent:  game.discountPercent,
            initial_formatted: formatPrice(game.priceInitial, game.currency ?? 'CLP'),
            final_formatted:   formatPrice(game.priceFinal,   game.currency ?? 'CLP'),
        },

        release_date: {
            coming_soon: false,
            date:        game.releaseDate ?? '—',
        },

        recommendations: { total: game.recommendationsTotal },
        achievements:    game.achievementsTotal > 0 ? { total: game.achievementsTotal } : null,
        platforms:       { windows: true, mac: false, linux: false },
        system_requirements: {},
    }

    return (
        <main
            className="min-h-screen overflow-x-hidden"
            style={{ background: 'var(--color-bg)', paddingTop: 'var(--nav-height)' }}
        >
            {/* Imagen de fondo difuminada */}
            {game.backgroundRaw && (
                <div
                    style={{
                        position:           'fixed',
                        inset:              0,
                        backgroundImage:    `url(${game.backgroundRaw})`,
                        backgroundSize:     'cover',
                        backgroundPosition: 'center',
                        opacity:            0.08,
                        zIndex:             0,
                        pointerEvents:      'none',
                    }}
                />
            )}

            <div
                className="relative w-full py-10"
                style={{
                    paddingLeft:   'clamp(1rem, 5vw, 5rem)',
                    paddingRight:  'clamp(1rem, 5vw, 5rem)',
                    paddingBottom: '4rem',
                    zIndex:        1,
                }}
            >
                {/* Breadcrumb */}
                <nav
                    className="flex items-center gap-1.5 text-sm mb-6"
                    style={{
                        color:      'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                        margin:     '1rem 0',
                    }}
                >
                    <Link to="/" className="hover:underline" style={{ color: 'var(--color-text-muted)' }}>
                        Tienda
                    </Link>
                    <ChevronRight size={12} />
                    {game.genres[0] && (
                        <>
                            <span>{game.genres[0].name}</span>
                            <ChevronRight size={12} />
                        </>
                    )}
                    <span style={{ color: 'var(--color-text)' }}>{game.name}</span>
                </nav>

                {/* Layout principal: galería + panel compra */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 min-w-0">
                        <Gallery game={gameForComponents} />
                    </div>
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <PurchasePanel game={gameForComponents} />
                    </div>
                </div>

                {/* Tabs de contenido */}
                <div className="mb-8" style={{ margin: '2rem 0' }}>
                    <TabBar active={tab} onChange={setTab} />
                    {tab === 'descripcion' && <TabDescripcion game={gameForComponents} />}
                    {tab === 'requisitos'  && <TabRequisitos  game={gameForComponents} />}
                    {tab === 'resenas'     && <TabResenas      game={gameForComponents} />}
                </div>
            </div>
        </main>
    )
}

// ── Helper: formatea centavos a string legible ──
function formatPrice(cents: number, currency: string): string {
    const units = Math.floor(cents / 100)
    return `${currency}$ ${units.toLocaleString('es-CL')}`
}