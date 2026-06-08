import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Game } from '../../types'
import DiscountBadge from './DiscountBadge'

interface GameCardProps {
    game: Game
    showDescription?: boolean
    showGenres?: boolean
    compact?: boolean
    showCartButton?: boolean
}

export default function GameCard({
                                     game,
                                     showGenres = true,
                                     compact = false,
                                     showCartButton = true,
                                 }: GameCardProps) {
    const navigate = useNavigate()
    const [hovered, setHovered] = useState(false)
    const discount              = game.discount_percent ?? game.price_overview?.discount_percent ?? 0
    const priceInitialFormatted = game.price_overview?.initial_formatted ?? `CLP$ ${Math.floor((game.price_initial ?? 0) / 100).toLocaleString('es-CL')}`
    const priceFinalFormatted   = game.price_overview?.final_formatted   ?? `CLP$ ${Math.floor((game.price_final   ?? 0) / 100).toLocaleString('es-CL')}`

    return (
        <article
            className="rounded-xl overflow-hidden cursor-pointer flex flex-col"
            style={{
                background:   'var(--color-bg-card)',
                border:       `1px solid ${hovered ? 'rgba(255,0,208,0.45)' : 'var(--color-border)'}`,
                boxShadow:    hovered ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
                transform:    hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                transition:   'all 0.25s ease',
                borderRadius: 'var(--radius-card)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/game/${game.id}`)}
        >
            {/* Imagen con zoom sutil en hover */}
            <div className="overflow-hidden flex-shrink-0" style={{ height: compact ? '120px' : '160px' }}>
                <img
                    src={game.header_image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                    loading="lazy"
                />
            </div>

            {/* Brillo inferior al hacer hover */}
            {hovered && (
                <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                        height:     '2px',
                        background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
                        boxShadow:  '0 0 12px var(--color-accent)',
                    }}
                />
            )}

            {/* Info */}
            <div className="flex flex-col flex-1" style={{ padding: '0.875rem', gap: '0.5rem' }}>
                <h3
                    className="text-base font-semibold line-clamp-1"
                    style={{
                        fontFamily: 'var(--font-title)',
                        color:      hovered ? '#fff' : 'var(--color-text)',
                        transition: 'color 0.2s ease',
                    }}
                >
                    {game.name}
                </h3>

                {showGenres && !compact && (
                    <p
                        className="text-xs line-clamp-1"
                        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
                    >
                        {game.genres?.map(g => g.description).join(' · ')}
                    </p>
                )}

                {/* Precio */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {game.is_free ? (
                        <span
                            className="text-sm font-bold"
                            style={{ color: 'var(--color-accent-alt)', fontFamily: 'var(--font-price)' }}
                        >
              Gratis
            </span>
                    ) : (
                        <>
                            {discount > 0 && (
                                <span
                                    className="text-xs line-through"
                                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-price)' }}
                                >
                  {priceInitialFormatted}
                </span>
                            )}
                            <span
                                className="text-sm font-bold"
                                style={{
                                    color:      discount > 0 ? 'var(--color-accent-alt)' : 'var(--color-text)',
                                    fontFamily: 'var(--font-price)',
                                }}
                            >
                {priceFinalFormatted}
              </span>
                            {discount > 0 && <DiscountBadge pct={discount} />}
                        </>
                    )}
                </div>

                {/* Botón añadir al carrito */}
                {showCartButton && (
                    <div style={{ marginTop: 'auto' }}>
                        <button
                            className="w-full mt-2 py-2 rounded-md text-xs font-semibold transition-all duration-200"
                            style={{
                                fontFamily: 'var(--font-cta)',
                                background: hovered
                                    ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))'
                                    : 'rgba(255,255,255,0.04)',
                                color:      hovered ? '#fff' : 'var(--color-text-muted)',
                                border:     hovered ? 'none' : `1px solid var(--color-border)`,
                                boxShadow:  hovered ? 'var(--glow-accent)' : 'none',
                                padding:    '8px 0',
                            }}
                            onClick={e => { e.stopPropagation() /* TODO: addToCart */ }}
                        >
                            Añadir al carrito
                        </button>
                    </div>
                )}
            </div>
        </article>
    )
}