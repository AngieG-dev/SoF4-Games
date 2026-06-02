import { useEffect, useState } from 'react'
import { X, UserCircle2 } from 'lucide-react'
import { getFriends } from '../services/friendsService'
import type { Friend } from '../types/Friends'

interface Props {
    isOpen:  boolean
    onClose: () => void
}

interface FriendsState {
    friends: Friend[]
    loading: boolean
    error:   string | null
}

export default function FriendsSidebar({ isOpen, onClose }: Props) {
    const [state, setState] = useState<FriendsState>({
        friends: [],
        loading: false,
        error:   null,
    })

    // Solo hacemos fetch cuando el sidebar se abre
    useEffect(() => {
        if (!isOpen) return

        setState({ friends: [], loading: true, error: null })

        getFriends()
            .then(data => setState({ friends: data, loading: false, error: null }))
            .catch(err  => setState({ friends: [],  loading: false, error: err.message ?? 'Error al cargar amigos' }))
    }, [isOpen])

    return (
        <>
            {/* ── Overlay semitransparente — clic cierra el sidebar ── */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position:   'fixed',
                        inset:      0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex:     99,
                    }}
                />
            )}

            {/* ── Panel deslizante ── */}
            <aside
                style={{
                    position:      'fixed',
                    top:           0,
                    right:         0,
                    height:        '100vh',
                    width:         '320px',
                    zIndex:        100,
                    display:       'flex',
                    flexDirection: 'column',
                    background:    'var(--color-bg-card)',
                    borderLeft:    '1px solid rgba(255, 0, 208, 0.25)',
                    boxShadow:     '-8px 0 32px rgba(0, 0, 0, 0.6)',
                    transform:     isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition:    'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Cabecera */}
                <div
                    style={{
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'space-between',
                        padding:        '1.25rem 1rem',
                        borderBottom:   '1px solid rgba(255, 0, 208, 0.2)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'var(--font-title)',
                            fontSize:   '1rem',
                            fontWeight: 700,
                            color:      'var(--color-text)',
                            margin:     0,
                        }}
                    >
                        Amigos
                    </h2>

                    <button
                        onClick={onClose}
                        aria-label="Cerrar panel de amigos"
                        style={{
                            background:   'transparent',
                            border:       'none',
                            color:        'var(--color-text-muted)',
                            cursor:       'pointer',
                            display:      'flex',
                            padding:      '4px',
                            borderRadius: '6px',
                            transition:   'color 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Cuerpo: estados de carga, error y lista */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>

                    {state.loading && (
                        <p style={{ padding: '1.5rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'center' }}>
                            Cargando amigos…
                        </p>
                    )}

                    {state.error && !state.loading && (
                        <p style={{ padding: '1.5rem 1rem', color: '#ff6b6b', fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {state.error}
                        </p>
                    )}

                    {!state.loading && !state.error && state.friends.length === 0 && (
                        <p style={{ padding: '1.5rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'center' }}>
                            Aún no tienes amigos agregados.
                        </p>
                    )}

                    {!state.loading && !state.error && state.friends.map(friend => (
                        <FriendRow key={friend.userId} friend={friend} />
                    ))}

                </div>
            </aside>
        </>
    )
}

// ── Sub-componente: una fila por amigo ──
function FriendRow({ friend }: { friend: Friend }) {
    return (
        <div
            style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '0.75rem',
                padding:    '0.625rem 1rem',
                cursor:     'default',
                transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,208,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
            {/* Avatar o placeholder */}
            {friend.avatarUrl ? (
                <img
                    src={friend.avatarUrl}
                    alt={friend.displayName ?? 'Avatar'}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
            ) : (
                <UserCircle2
                    size={36}
                    style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                />
            )}

            {/* Nombre y username */}
            <div style={{ minWidth: 0 }}>
                <p style={{
                    fontFamily:   'var(--font-cta)',
                    fontSize:     '0.875rem',
                    fontWeight:   600,
                    color:        'var(--color-text)',
                    margin:       0,
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {friend.displayName ?? friend.username ?? 'Usuario'}
                </p>
                {friend.username && (
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.75rem',
                        color:      'var(--color-text-muted)',
                        margin:     0,
                    }}>
                        @{friend.username}
                    </p>
                )}
            </div>
        </div>
    )
}