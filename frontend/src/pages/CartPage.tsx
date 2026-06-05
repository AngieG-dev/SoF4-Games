import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, removeFromCart } from '../services/cartService'
import type { CartItem } from '../services/cartService'

const STEPS = ['1 Carrito', '2 Pago', '3 Confirmación']

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  useEffect(() => {
    getCartItems()
      .then(setItems)
      .catch(() => setError('No se pudo cargar el carrito'))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (gameId: number) => {
    setRemovingId(gameId)
    try {
      await removeFromCart(gameId)
      setItems(prev => prev.filter(item => item.gameId !== gameId))
    } catch {
      setError('No se pudo eliminar el juego')
    } finally {
      setRemovingId(null)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceFinal, 0)
  const iva = Math.round(subtotal * 0.19)
  const total = subtotal
  const currency = items[0]?.currency ?? 'CLP'
  const fmt = (n: number) => `$${new Intl.NumberFormat('es-CL').format(n / 100)}`

  if (loading) return (
    <main className="flex-1 flex items-center justify-center"
      style={{ color: 'var(--color-text-muted)' }}>
      Cargando carrito...
    </main>
  )

  if (error) return (
    <main className="flex-1 flex items-center justify-center"
      style={{ color: 'var(--color-accent)' }}>
      {error}
    </main>
  )

  if (items.length === 0) return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4">
      <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
        Tu carrito está vacío
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 rounded-md text-sm font-semibold"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
          color: '#fff',
          fontFamily: 'var(--font-cta)',
        }}
      >
        Explorar tienda
      </button>
    </main>
  )

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, i) => {
          const isActive = i === 0
          return (
            <div key={step} className="flex items-center flex-1">
              <div
                className="flex-1 text-center py-2 text-sm font-semibold"
                style={{
                  border: `1px solid ${isActive ? 'var(--color-text)' : 'var(--color-border)'}`,
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  borderRadius: i === 0 ? '6px 0 0 6px' : i === STEPS.length - 1 ? '0 6px 6px 0' : '0',
                }}
              >
                {step}
              </div>
            </div>
          )
        })}
      </div>

      <h1
        className="text-xl font-bold mb-6"
        style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}
      >
        Tu carrito · {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
      </h1>

      <div className="flex gap-6 items-start">

        {/* Lista de ítems */}
        <div className="flex-1 flex flex-col gap-0"
          style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
          {items.map((item, i) => (
            <div
              key={item.gameId}
              className="flex items-center gap-4 px-4 py-4"
              style={{
                borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <img
                src={item.headerImage}
                alt={item.name}
                className="rounded object-cover flex-shrink-0"
                style={{ width: '80px', height: '56px' }}
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate"
                  style={{ fontFamily: 'var(--font-title)', color: 'var(--color-text)' }}>
                  {item.name}
                </p>
                <p className="text-xs mt-0.5"
                  style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  Edición Estándar · PC
                </p>
                <button
                  onClick={() => handleRemove(item.gameId)}
                  disabled={removingId === item.gameId}
                  className="text-xs mt-1 underline transition-opacity"
                  style={{
                    color: removingId === item.gameId ? 'var(--color-text-muted)' : 'var(--color-accent)',
                    fontFamily: 'var(--font-body)',
                    background: 'none',
                    border: 'none',
                    cursor: removingId === item.gameId ? 'not-allowed' : 'pointer',
                    padding: 0,
                  }}
                >
                  {removingId === item.gameId ? 'Eliminando...' : 'Eliminar'}
                </button>
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
        <div
          className="flex flex-col gap-4 p-5"
          style={{
            width: '280px',
            flexShrink: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--color-bg-card)',
          }}
        >
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

          <div
            className="flex justify-between font-bold text-base pt-3"
            style={{
              borderTop: '1px solid var(--color-border)',
              fontFamily: 'var(--font-price)',
              color: 'var(--color-text)',
            }}
          >
            <span>Total {currency}</span>
            <span>{fmt(total)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 rounded-md font-semibold text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
              color: '#fff',
              fontFamily: 'var(--font-cta)',
              boxShadow: 'var(--glow-accent)',
            }}
          >
            Pagar {fmt(total)}
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