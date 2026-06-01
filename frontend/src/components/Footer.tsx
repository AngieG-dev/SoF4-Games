// components/Footer.tsx
import { Link } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-auto pt-12 pb-6"
      style={{
        borderTop:  '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        paddingLeft:  'clamp(1rem, 5vw, 5rem)',
        paddingRight: 'clamp(1rem, 5vw, 5rem)',
        paddingTop: 'clamp(1rem, 2vw, 2rem)',
        paddingBottom: 'clamp(1rem, 2vw, 2rem)',
      }}
    >
      {/* ── Fila principal: 3 columnas ── */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10"
        style={{ paddingBottom: '1.5rem' }}
      >

        {/* Columna 1: Logo + tagline */}
        <div className="footer-col flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2 w-fit group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))' }}
            >
              <Gamepad2 size={18} className="text-white" />
            </div>
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              <span className="text-white">SOF4</span>{' '}
              <span style={{ color: 'var(--color-accent)' }}>GAMES</span>
            </span>
          </Link>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Marketplace enfocado en videojuegos indie latinoamericanos.
          </p>
        </div>

        {/* Columna 2: Tienda */}
        <div className="footer-col">
          <h4
            className="text-xs font-semibold uppercase"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-title)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}
          >
            Tienda
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { label: 'Inicio',              to: '/' },
              { label: 'Ofertas',             to: '/store/sales' },
              { label: 'Categorías',          to: '/store/categories' },
              { label: 'Nuevos lanzamientos', to: '/store/new' },
            ].map(({ label, to }) => (
              <li key={to}><FooterLink to={to} label={label} /></li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Cuenta */}
        <div className="footer-col">
          <h4
            className="text-xs font-semibold uppercase"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-title)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}
          >
            Cuenta
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { label: 'Mi perfil',     to: '/profile' },
              { label: 'Biblioteca',    to: '/library' },
              { label: 'Configuración', to: '/settings' },
              { label: 'Carrito',       to: '/cart' },
            ].map(({ label, to }) => (
              <li key={to}><FooterLink to={to} label={label} /></li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Línea separadora + copyright ── */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
        <p
          className="text-center text-xs"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          © 2026 SoF4 Games · Todos los derechos reservados · Hecho en Chile · CLP $
        </p>
      </div>
    </footer>
  )
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="text-sm transition-all duration-200 w-fit"
      style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.color      = 'var(--color-text)'
        el.style.textShadow = '0 0 8px var(--color-accent)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.color      = 'var(--color-text-muted)'
        el.style.textShadow = 'none'
      }}
    >
      {label}
    </Link>
  )
}
