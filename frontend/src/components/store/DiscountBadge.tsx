export default function DiscountBadge({ pct }: { pct: number }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-bold"
      style={{
        background:   'rgba(0,242,255,0.15)',
        color:        'var(--color-accent-alt)',
        border:       '1px solid rgba(0,242,255,0.4)',
        fontFamily:   'var(--font-price)',
        borderRadius: 'var(--radius-badge)',
      }}
    >
      -{pct}%
    </span>
  )
}
