import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, checkout } from '../services/cartService'
import type { CartItem, CheckoutResponse } from '../services/cartService'

type PayMethod = 'card' | 'webpay' | 'wallet'

const STEPS = ['1 Carrito', '2 Pago', '3 Confirmación']

/* ── Stepper ──────────────────────────────────────────────────────── */
function Stepper({ active }: { active: 0 | 1 | 2 }) {
  return (
    <div style={{ display: 'flex', marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done    = i < active
        const current = i === active
        return (
          <div
            key={step}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 0',
              fontSize: 13,
              fontWeight: current ? 700 : 500,
              fontFamily: 'var(--font-body)',
              border: '1px solid',
              borderLeft: i > 0 ? 'none' : undefined,
              borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0',
              borderColor: current
                ? 'var(--color-accent)'
                : done
                ? 'rgba(255,0,208,0.3)'
                : 'rgba(255,255,255,0.1)',
              color: current ? '#fff' : done ? 'rgba(255,0,208,0.7)' : 'rgba(255,255,255,0.25)',
              background: current ? 'rgba(255,0,208,0.08)' : 'transparent',
              boxShadow: current ? 'inset 0 0 20px rgba(255,0,208,0.07)' : 'none',
              textShadow: current ? '0 0 10px rgba(255,0,208,0.6)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {done ? `${step} ✓` : step}
          </div>
        )
      })}
    </div>
  )
}

/* ── Input con foco accent ────────────────────────────────────────── */
function FormInput({
  label, value, onChange, placeholder, maxLength, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '11px 14px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(255,0,208,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

/* ── Resumen panel (reutilizado en pago y confirmación) ───────────── */
function SummaryPanel({
  subtotal, iva, currency, fmt, children,
}: {
  subtotal: number; iva: number; currency: string
  fmt: (n: number) => string
  children: React.ReactNode
}) {
  return (
    <div style={{ width: 296, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
        Resumen del pedido
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13, fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
          <span style={{ color: '#fff' }}>{fmt(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>IVA (incluido)</span>
          <span style={{ color: '#fff' }}>{fmt(iva)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-price)', color: '#fff' }}>
        <span>Total {currency}</span>
        <span>{fmt(subtotal)}</span>
      </div>
      {children}
    </div>
  )
}

/* ── Componente principal ─────────────────────────────────────────── */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems]               = useState<CartItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [paying, setPaying]             = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<CheckoutResponse | null>(null)
  const [method, setMethod]             = useState<PayMethod>('card')

  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvv, setCvv]         = useState('')
  const [rut, setRut]         = useState('')
  const [holder, setHolder]   = useState('')

  const username = localStorage.getItem('username') ?? 'Usuario'
  const email    = localStorage.getItem('email') ?? ''

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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('No se pudo procesar el pago')
    } finally {
      setPaying(false)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.priceFinal, 0)
  const iva      = Math.round(subtotal * 0.19)
  const currency = items[0]?.currency ?? 'CLP'
  const fmt = (n: number) => `$${new Intl.NumberFormat('es-CL').format(n / 100)}`

  const baseStyle: React.CSSProperties = {
    flex: 1,
    paddingTop: 'calc(var(--nav-height) + 32px)',
    paddingBottom: 48,
    paddingLeft: 24,
    paddingRight: 24,
    background: 'var(--color-bg)',
  }

  /* ── Loading ── */
  if (loading) return (
    <main style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>Cargando...</p>
    </main>
  )

  /* ── Confirmación ──────────────────────────────────────────────── */
  if (confirmation) return (
    <main style={{ ...baseStyle }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Stepper active={2} />

        {/* Hero éxito */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          {/* Ícono check animado */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(255,0,208,0.4)',
            marginBottom: 20,
            fontSize: 32,
          }}>
            ✓
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-title)', color: '#fff' }}>
            ¡Compra realizada!
          </h1>
          <p style={{ margin: '0 0 4px', fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
            Gracias por tu compra, <strong style={{ color: '#fff' }}>{username}</strong>. Tu pedido fue procesado con éxito.
          </p>
          {email && (
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
              Recibirás un email de confirmación en {email}
            </p>
          )}
          <div style={{
            display: 'inline-block', marginTop: 16, padding: '8px 20px', borderRadius: 8,
            border: '1px solid rgba(255,0,208,0.3)',
            background: 'rgba(255,0,208,0.06)',
            fontSize: 13, fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)',
          }}>
            N° de pedido:&nbsp;<strong style={{ color: '#fff', fontFamily: 'var(--font-price)' }}>{confirmation.orderId}</strong>
          </div>
        </div>

        {/* Resumen de la compra */}
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)' }}>
              Resumen de la compra
            </p>
          </div>

          {confirmation.games.map((game, i) => (
            <div key={game.gameId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < confirmation.games.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <img src={game.headerImage} alt={game.name} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--font-title)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {game.name} — Edición Estándar
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                  PC · Descarga digital
                </p>
              </div>
              <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--font-price)', color: '#fff', flexShrink: 0 }}>
                {fmt(game.pricePaid)}
              </p>
            </div>
          ))}

          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-price)', color: '#fff', fontSize: 15 }}>Total pagado</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-price)', color: '#fff', fontSize: 17 }}>{fmt(confirmation.total)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/library')}
            style={{ padding: '12px 32px', borderRadius: 8, background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))', color: '#fff', fontFamily: 'var(--font-cta)', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: 'var(--glow-accent)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ir a mi biblioteca
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '12px 32px', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-cta)', fontWeight: 600, fontSize: 14, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </main>
  )

  /* ── Vista de Pago ─────────────────────────────────────────────── */
  const METHODS: { id: PayMethod; icon: string; label: string; sub: string }[] = [
    { id: 'card',   icon: '💳', label: 'Tarjeta crédito / débito', sub: 'Visa · Mastercard'        },
    { id: 'webpay', icon: '🏦', label: 'Webpay (transferencia)',   sub: 'Bancos chilenos'           },
    { id: 'wallet', icon: '👛', label: 'Saldo SoF4 Wallet',        sub: 'CLP $12.500 disponible'   },
  ]

  return (
    <main style={baseStyle}>
      <div style={{ maxWidth: 1024, margin: '0 auto' }}>
        <Stepper active={1} />

        {error && (
          <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 13, color: 'var(--color-accent)', fontFamily: 'var(--font-body)' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── Formulario ── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Método de pago */}
            <section>
              <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-title)', color: '#fff' }}>
                Método de pago
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {METHODS.map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setMethod(opt.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${method === opt.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.09)'}`,
                      background: method === opt.id ? 'rgba(255,0,208,0.06)' : 'rgba(255,255,255,0.02)',
                      boxShadow: method === opt.id ? '0 0 0 1px rgba(255,0,208,0.2) inset' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Radio visual */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${method === opt.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: method === opt.id ? '0 0 8px rgba(255,0,208,0.5)' : 'none',
                        transition: 'all 0.2s ease',
                      }}>
                        {method === opt.id && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
                        )}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: method === opt.id ? 600 : 400, fontFamily: 'var(--font-body)', color: method === opt.id ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                        {opt.icon}&nbsp;&nbsp;{opt.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                      {opt.sub}
                    </span>
                    <input type="radio" name="method" value={opt.id} checked={method === opt.id} onChange={() => setMethod(opt.id)} style={{ display: 'none' }} />
                  </label>
                ))}
              </div>
            </section>

            {/* Datos de tarjeta */}
            {method === 'card' && (
              <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-title)', color: '#fff' }}>
                  Datos de tarjeta
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <FormInput label="Número de tarjeta" value={cardNum} onChange={setCardNum} placeholder="4716  ——  ——  ——" maxLength={19} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <FormInput label="Vencimiento" value={expiry}  onChange={setExpiry}  placeholder="MM / AA"       maxLength={7} />
                    <FormInput label="CVV"         value={cvv}     onChange={setCvv}     placeholder="123"           maxLength={4} />
                    <FormInput label="RUT"         value={rut}     onChange={setRut}     placeholder="12.345.678-9"              />
                  </div>
                </div>
              </section>
            )}

            {/* Dirección de facturación */}
            {method === 'card' && (
              <section>
                <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-title)', color: '#fff' }}>
                  Dirección de facturación
                </h2>
                <div style={{ maxWidth: 360 }}>
                  <FormInput label="Nombre en tarjeta" value={holder} onChange={setHolder} placeholder="Nombre Apellido" />
                </div>
              </section>
            )}
          </div>

          {/* ── Panel resumen ── */}
          <SummaryPanel subtotal={subtotal} iva={iva} currency={currency} fmt={fmt}>
            <button
              onClick={handleCheckout}
              disabled={paying || items.length === 0}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 8,
                background: paying
                  ? 'rgba(255,0,208,0.25)'
                  : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))',
                color: '#fff', fontFamily: 'var(--font-cta)', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: paying ? 'not-allowed' : 'pointer',
                boxShadow: paying ? 'none' : 'var(--glow-accent)',
                opacity: paying ? 0.7 : 1,
                boxSizing: 'border-box',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (!paying) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { if (!paying) e.currentTarget.style.opacity = '1' }}
            >
              {paying ? 'Procesando...' : `Pagar ${fmt(subtotal)}`}
            </button>
            <p style={{ margin: 0, fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
              Compra protegida · Reembolso 14 días
            </p>
            <button
              onClick={handleCheckout}
              disabled={paying}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)', textDecoration: 'underline', textAlign: 'center' }}
            >
              Continuar con el pago →
            </button>
          </SummaryPanel>

        </div>
      </div>
    </main>
  )
}
