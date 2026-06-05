import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems } from '../services/cartService'
import { checkout } from '../services/cartService'
import type { CartItem, CheckoutResponse } from '../services/cartService'

const STEPS = ['1 Carrito', '2 Pago', '3 Confirmación']

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirmation, setConfirmation] = useState<CheckoutResponse | null>(null)

    useEffect(() => {
    getCartItems()
        .then(setItems)
        .catch(() => setError('No se pudo cargar el carrito'))
        .finally(() => setLoading(false))
    }, [])

    const handleCheckout = async () => {
    setPaying(true)
    setError(null)
    try {
        const result = await checkout()
        setConfirmation(result)
    } catch {
        setError('No se pudo procesar el pago')
    } finally {
        setPaying(false)
    }
    }

    const subtotal = items.reduce((sum, item) => sum + item.priceFinal, 0)
    const iva = Math.round(subtotal * 0.19)
    const currency = items[0]?.currency ?? 'CLP'
    const fmt = (n: number) => `$${new Intl.NumberFormat('es-CL').format(n / 100)}`

    if (loading) return (
    <main className="flex-1 flex items-center justify-center"
        style={{ color: 'var(--color-text-muted)' }}>
        Cargando...
    </main>
    )

    // Vista confirmación
    if (confirmation) return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">

        {/* Stepper */}
        <div className="flex items-center mb-10">
        {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
            <div
                className="flex-1 text-center py-2 text-sm font-semibold"
                style={{
                border: `1px solid ${i === 2 ? 'var(--color-text)' : 'var(--color-border)'}`,
                color: i === 2 ? 'var(--color-text)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0',
                }}
            >
                {i < 2 ? `${step} ✓` : step}
            </div>
            </div>
        ))}
        </div>

        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
            ¡Compra realizada!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Tu pedido fue procesado con éxito.
        </p>
        <div
            className="inline-block mt-4 px-6 py-2 rounded-md text-sm"
            style={{
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            }}
        >
            N° de pedido: <strong>{confirmation.orderId}</strong>
        </div>
        </div>

        {/* Resumen */}
        <div
        className="rounded-xl overflow-hidden mb-8"
        style={{ border: '1px solid var(--color-border)' }}
        >
        <p className="text-xs font-semibold tracking-widest uppercase px-5 py-3"
            style={{
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            borderBottom: '1px solid var(--color-border)',
            }}>
            Resumen de la compra
        </p>

        {confirmation.games.map((game, i) => (
            <div
            key={game.gameId}
            className="flex items-center gap-4 px-5 py-4"
            style={{ borderBottom: i < confirmation.games.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            >
            <img src={game.headerImage} alt={game.name}
                className="rounded object-cover flex-shrink-0"
                style={{ width: '80px', height: '56px' }} />
            <div className="flex-1 min-w-0">
                <p className="font-semibold truncate"
                style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
                {game.name}
                </p>
                <p className="text-xs mt-0.5"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                PC · Descarga digital
                </p>
            </div>
            <p className="font-semibold flex-shrink-0"
                style={{ fontFamily: 'var(--font-price)', color: 'var(--color-text)' }}>
                {fmt(game.pricePaid)}
            </p>
            </div>
        ))}

        <div className="px-5 py-4 flex justify-between font-bold"
            style={{
            borderTop: '1px solid var(--color-border)',
            fontFamily: 'var(--font-price)',
            color: 'var(--color-text)',
            }}>
            <span>Total pagado</span>
            <span>{fmt(confirmation.total)}</span>
        </div>
        </div>

        <div className="flex gap-4 justify-center">
        <button
            onClick={() => navigate('/library')}
            className="px-8 py-3 rounded-md font-semibold text-sm"
            style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
            color: '#fff',
            fontFamily: 'var(--font-cta)',
            boxShadow: 'var(--glow-accent)',
            }}
        >
            Ir a mi biblioteca
        </button>
        <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-md font-semibold text-sm"
            style={{
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-cta)',
            }}
        >
            Seguir comprando
        </button>
        </div>
    </main>
    )

    // Vista resumen + pago
    return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">

        {/* Stepper */}
        <div className="flex items-center mb-8">
        {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
            <div
                className="flex-1 text-center py-2 text-sm font-semibold"
                style={{
                border: `1px solid ${i === 1 ? 'var(--color-text)' : 'var(--color-border)'}`,
                color: i === 1 ? 'var(--color-text)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0',
                }}
            >
                {i === 0 ? `${step} ✓` : step}
            </div>
            </div>
        ))}
        </div>

        {error && (
        <p className="mb-4 text-sm text-center" style={{ color: 'var(--color-accent)' }}>
            {error}
        </p>
        )}

        <div className="flex gap-6 items-start">

        {/* Lista de ítems */}
        <div className="flex-1"
            style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
            {items.map((item, i) => (
            <div key={item.gameId}
                className="flex items-center gap-4 px-4 py-4"
                style={{ borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <img src={item.headerImage} alt={item.name}
                className="rounded object-cover flex-shrink-0"
                style={{ width: '80px', height: '56px' }} />
                <div className="flex-1 min-w-0">
                <p className="font-semibold truncate"
                    style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
                    {item.name}
                </p>
                <p className="text-xs mt-0.5"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    Edición Estándar · PC
                </p>
                </div>
                <div className="text-right flex-shrink-0">
                <p className="font-semibold"
                    style={{ fontFamily: 'var(--font-price)', color: 'var(--color-text)' }}>
                    {fmt(item.priceFinal)}
                </p>
                <p className="text-xs mt-0.5"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                    IVA incluido
                </p>
                </div>
            </div>
            ))}
        </div>

        {/* Panel resumen */}
        <div className="flex flex-col gap-4 p-5"
            style={{
            width: '280px',
            flexShrink: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-bg-card)',
            }}>
            <p className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Resumen del pedido
            </p>

            <div className="flex flex-col gap-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--color-text)' }}>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>IVA (incluido)</span>
                <span style={{ color: 'var(--color-text)' }}>{fmt(iva)}</span>
            </div>
            </div>

            <div className="flex justify-between font-bold text-base pt-3"
            style={{
                borderTop: '1px solid var(--color-border)',
                fontFamily: 'var(--font-price)',
                color: 'var(--color-text)',
            }}>
            <span>Total {currency}</span>
            <span>{fmt(subtotal)}</span>
            </div>

            <button
            onClick={handleCheckout}
            disabled={paying || items.length === 0}
            className="w-full py-3 rounded-md font-semibold text-sm transition-all duration-200"
            style={{
                background: paying
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
                color: '#fff',
                fontFamily: 'var(--font-cta)',
                boxShadow: paying ? 'none' : 'var(--glow-accent)',
                cursor: paying ? 'not-allowed' : 'pointer',
            }}
            >
            {paying ? 'Procesando...' : `Pagar ${fmt(subtotal)}`}
            </button>

            <p className="text-xs text-center"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Compra protegida · Reembolso 14 días
            </p>
        </div>
        </div>
    </main>
    )
}