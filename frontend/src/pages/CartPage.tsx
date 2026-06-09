import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, removeFromCart } from '../services/cartService'
import type { CartItem } from '../services/cartService'

const STEPS = ['1 Carrito', '2 Pago', '3 Confirmación']

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems]             = useState<CartItem[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [removingId, setRemovingId]   = useState<number | null>(null)
  const [coupon, setCoupon]           = useState('')
  const [discount, setDiscount]       = useState(0)
  const [couponError, setCouponError] = useState('')

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
      setItems(prev => prev.filter(i => i.gameId !== gameId))
    } catch {
      setError('No se pudo eliminar el juego')
    } finally {
      setRemovingId(null)
    }
  }

  const handleApplyCoupon = () => {
    setCouponError('')
    if (coupon.trim().toUpperCase() === 'SOF4GAMES') {
      setDiscount(Math.round(subtotal * 0.1))
    } else {
      setDiscount(0)
      setCouponError('Cupón no válido')
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.priceFinal, 0)
  const total    = Math.max(0, subtotal - discount)
  const iva      = Math.round(total * 0.19)
  const currency = items[0]?.currency ?? 'CLP'
  const fmt = (n: number) => `$${new Intl.NumberFormat('es-CL').format(n / 100)}`

  const baseMain: React.CSSProperties = {
    flex: 1,
    paddingTop: 'calc(var(--nav-height) + 32px)',
    paddingBottom: 40,
    paddingLeft: 24,
    paddingRight: 24,
    background: 'var(--color-bg)',
  }

  if (loading) return (
    <main style={{ ...baseMain, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Cargando carrito...</p>
    </main>
  )

  if (error) return (
    <main style={{ ...baseMain, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>{error}</p>
    </main>
  )

  if (items.length === 0) return (
    <main style={{ ...baseMain, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Tu carrito está vacío</p>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg,var(--color-accent),var(--color-accent-alt))', color: '#fff', fontFamily: 'var(--font-cta)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
      >
        Explorar tienda
      </button>
    </main>
  )

  return (
    <main style={baseMain}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>

        {/* Stepper */}
        <div style={{ display: 'flex', marginBottom: 28 }}>
          {STEPS.map((step, i) => (
            <div
              key={step}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                fontSize: 13,
                fontWeight: i === 0 ? 700 : 500,
                fontFamily: 'var(--font-body)',
                border: '1px solid',
                borderColor: i === 0 ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                borderLeft: i > 0 ? 'none' : undefined,
                color: i === 0 ? '#fff' : 'rgba(255,255,255,0.28)',
                borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0',
                background: i === 0 ? 'rgba(255,0,208,0.1)' : 'transparent',
                boxShadow: i === 0 ? 'inset 0 0 18px rgba(255,0,208,0.08)' : 'none',
                textShadow: i === 0 ? '0 0 10px var(--color-accent)' : 'none',
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Título */}
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, fontFamily: 'var(--font-title)', color: '#fff' }}>
          Tu carrito · {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
        </h1>

        {/* Cuerpo */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Lista de ítems */}
          <div style={{ flex: 1, minWidth: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((item, i) => (
              <div
                key={item.gameId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <img
                  src={item.headerImage}
                  alt={item.name}
                  style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--font-title)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                  <p style={{ margin: '3px 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
                    Edición Estándar · PC
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}>
                      Mover a deseos
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>|</span>
                    <button
                      onClick={() => handleRemove(item.gameId)}
                      disabled={removingId === item.gameId}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: removingId === item.gameId ? 'not-allowed' : 'pointer', fontSize: 12, color: removingId === item.gameId ? 'rgba(255,255,255,0.3)' : 'var(--color-accent)', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}
                    >
                      {removingId === item.gameId ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--font-price)', color: '#fff', fontSize: 15 }}>
                    {fmt(item.priceFinal)}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
                    IVA incluido
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Panel resumen */}
          <div style={{ width: 296, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: 14 }}>

            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
              Resumen del pedido
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13, fontFamily: 'var(--font-body)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                <span style={{ color: '#fff' }}>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Descuento</span>
                  <span style={{ color: '#00c26e' }}>-{fmt(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>IVA (incluido)</span>
                <span style={{ color: '#fff' }}>{fmt(iva)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-price)', color: '#fff' }}>
              <span>Total {currency}</span>
              <span>{fmt(total)}</span>
            </div>

            {/* Cupón */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
                Código de descuento
              </p>
              <input
                type="text"
                value={coupon}
                onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="Ingresa cupón"
                style={{ padding: '9px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: `1px solid ${couponError ? 'var(--color-accent)' : 'rgba(255,255,255,0.12)'}`, color: '#fff', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
              {couponError && <p style={{ margin: 0, fontSize: 12, color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>{couponError}</p>}
              {coupon && !couponError && discount === 0 && (
                <button onClick={handleApplyCoupon} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: 'var(--color-accent-alt)', fontFamily: 'var(--font-body)', textDecoration: 'underline', textAlign: 'left' }}>
                  Aplicar cupón
                </button>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', padding: '12px 0', borderRadius: 8, background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))', color: '#fff', fontFamily: 'var(--font-cta)', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxSizing: 'border-box', boxShadow: 'var(--glow-accent)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Pagar {fmt(total)}
            </button>

            <p style={{ margin: 0, fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
              Compra protegida · Reembolso 14 días
            </p>

            <button
              onClick={() => navigate('/checkout')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)', textDecoration: 'underline', textAlign: 'center' }}
            >
              Continuar con el pago →
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}
