import { useEffect, useReducer, useRef } from 'react'
import { X, UserCircle2, UserPlus, UserMinus, Check, Ban, Search, Trash2 } from 'lucide-react'
import {
    getFriends,
    getPendingRequests,
    getSentRequests,
    searchUsers,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    ignoreFriendRequest,
    removeFriend,
} from '../services/friendsService'
import type { Friend, PendingRequest, SentRequest, UserSearchResult } from '../types/Friends'

interface Props {
    isOpen:  boolean
    onClose: () => void
}

interface SidebarState {
    tab:             'friends' | 'requests' | 'search'
    friends:         Friend[]
    pendingRequests: PendingRequest[]
    sentRequests:    SentRequest[]
    searchResults:   UserSearchResult[]
    loadingFriends:  boolean
    loadingRequests: boolean
    loadingSearch:   boolean
    errorFriends:    string | null
    errorRequests:   string | null
    searchQuery:     string
    // userId → friendshipId para solicitudes enviadas en esta sesión (no cargadas del backend)
    newSentRequests: Record<string, number>
}

const initialState: SidebarState = {
    tab:             'friends',
    friends:         [],
    pendingRequests: [],
    sentRequests:    [],
    searchResults:   [],
    loadingFriends:  false,
    loadingRequests: false,
    loadingSearch:   false,
    errorFriends:    null,
    errorRequests:   null,
    searchQuery:     '',
    newSentRequests: {},
}

function reducer(state: SidebarState, action: Partial<SidebarState>): SidebarState {
    return { ...state, ...action }
}

export default function FriendsSidebar({ isOpen, onClose }: Props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const searchTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Al abrir: cargar amigos, solicitudes recibidas y solicitudes enviadas
    useEffect(() => {
        if (!isOpen) return

        dispatch({ tab: 'friends', searchQuery: '', searchResults: [], newSentRequests: {} })

        dispatch({ loadingFriends: true, errorFriends: null })
        getFriends()
            .then(data => dispatch({ friends: data, loadingFriends: false }))
            .catch(err  => dispatch({ errorFriends: err.message, loadingFriends: false }))

        dispatch({ loadingRequests: true, errorRequests: null })
        getPendingRequests()
            .then(data => dispatch({ pendingRequests: data, loadingRequests: false }))
            .catch(err  => dispatch({ errorRequests: err.message, loadingRequests: false }))

        getSentRequests()
            .then(data => dispatch({ sentRequests: data }))
            .catch(()  => dispatch({ sentRequests: [] }))
    }, [isOpen])

    // Búsqueda con debounce
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        if (state.searchQuery.trim().length < 2) {
            dispatch({ searchResults: [], loadingSearch: false })
            return
        }
        dispatch({ loadingSearch: true })
        searchTimeoutRef.current = setTimeout(() => {
            searchUsers(state.searchQuery.trim())
                .then(data => dispatch({ searchResults: data, loadingSearch: false }))
                .catch(()  => dispatch({ searchResults: [],   loadingSearch: false }))
        }, 400)
    }, [state.searchQuery])

    // ── Acciones ──

    const getSentFriendshipId = (userId: string): number | undefined => {
        // Primero busca en solicitudes cargadas del backend
        const fromBackend = state.sentRequests.find(r => r.addresseeId === userId)
        if (fromBackend) return fromBackend.friendshipId
        // Si no, busca en las enviadas durante esta sesión
        return state.newSentRequests[userId]
    }

    const handleSendRequest = async (userId: string) => {
        try {
            const result = await sendFriendRequest(userId)
            dispatch({ newSentRequests: { ...state.newSentRequests, [userId]: result.id } })
        } catch { /* silencioso */ }
    }

    const handleCancelRequest = async (userId: string) => {
        const friendshipId = getSentFriendshipId(userId)
        if (!friendshipId) return
        try {
            await cancelFriendRequest(friendshipId)
            // Eliminar de sentRequests (backend) y newSentRequests (sesión)
            const updatedSent    = state.sentRequests.filter(r => r.addresseeId !== userId)
            const updatedNew     = { ...state.newSentRequests }
            delete updatedNew[userId]
            dispatch({ sentRequests: updatedSent, newSentRequests: updatedNew })
        } catch { /* silencioso */ }
    }

    const handleAccept = async (friendshipId: number) => {
        try {
            await acceptFriendRequest(friendshipId)
            dispatch({ pendingRequests: state.pendingRequests.filter(r => r.friendshipId !== friendshipId) })
            getFriends().then(data => dispatch({ friends: data })).catch(() => {})
        } catch { /* silencioso */ }
    }

    const handleIgnore = async (friendshipId: number) => {
        try {
            await ignoreFriendRequest(friendshipId)
            dispatch({ pendingRequests: state.pendingRequests.filter(r => r.friendshipId !== friendshipId) })
        } catch { /* silencioso */ }
    }

    const handleRemoveFriend = async (friendshipId: number) => {
        try {
            await removeFriend(friendshipId)
            dispatch({ friends: state.friends.filter(f => f.friendshipId !== friendshipId) })
        } catch { /* silencioso */ }
    }

    const pendingCount = state.pendingRequests.length

    return (
        <>
            {isOpen && (
                <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
            )}

            <aside style={{
                position: 'fixed', top: 0, right: 0, height: '100vh', width: '320px', zIndex: 100,
                display: 'flex', flexDirection: 'column',
                background: 'var(--color-bg-card)',
                borderLeft: '1px solid rgba(255,0,208,0.25)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            }}>

                {/* Cabecera */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,0,208,0.2)', flexShrink: 0 }}>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                        Amigos
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '6px' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)' }}
                            aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,0,208,0.15)', flexShrink: 0 }}>
                    {(['friends', 'requests', 'search'] as const).map(tabKey => {
                        const labels: Record<string, string> = { friends: 'Amigos', requests: 'Solicitudes', search: 'Buscar' }
                        const isActive = state.tab === tabKey
                        return (
                            <button key={tabKey} onClick={() => dispatch({ tab: tabKey })} style={{
                                flex: 1, padding: '0.625rem 0', fontSize: '0.75rem',
                                fontFamily: 'var(--font-cta)', fontWeight: isActive ? 700 : 400,
                                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                background: 'transparent', border: 'none',
                                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                                cursor: 'pointer', position: 'relative', transition: 'color 0.2s',
                            }}>
                                {labels[tabKey]}
                                {tabKey === 'requests' && pendingCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '4px', right: '12px',
                                        background: 'var(--color-accent)', color: '#fff',
                                        fontSize: '0.625rem', fontWeight: 700, borderRadius: '999px',
                                        padding: '1px 5px', minWidth: '16px', textAlign: 'center',
                                    }}>
                                        {pendingCount > 9 ? '9+' : pendingCount}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Cuerpo */}
                <div style={{ flex: 1, overflowY: 'auto' }}>

                    {/* Pestaña: Amigos */}
                    {state.tab === 'friends' && (
                        <>
                            {state.loadingFriends && <MsgCenter text="Cargando amigos…" />}
                            {state.errorFriends && !state.loadingFriends && <MsgCenter text={state.errorFriends} error />}
                            {!state.loadingFriends && !state.errorFriends && state.friends.length === 0 && (
                                <MsgCenter text="Aún no tienes amigos agregados." />
                            )}
                            {!state.loadingFriends && !state.errorFriends && state.friends.map(friend => (
                                <FriendRow
                                    key={friend.userId}
                                    friend={friend}
                                    onRemove={() => handleRemoveFriend(friend.friendshipId)}
                                />
                            ))}
                        </>
                    )}

                    {/* Pestaña: Solicitudes */}
                    {state.tab === 'requests' && (
                        <>
                            {state.loadingRequests && <MsgCenter text="Cargando solicitudes…" />}
                            {state.errorRequests && !state.loadingRequests && <MsgCenter text={state.errorRequests} error />}
                            {!state.loadingRequests && !state.errorRequests && state.pendingRequests.length === 0 && (
                                <MsgCenter text="No tienes solicitudes pendientes." />
                            )}
                            {!state.loadingRequests && !state.errorRequests && state.pendingRequests.map(req => (
                                <PendingRow
                                    key={req.friendshipId}
                                    request={req}
                                    onAccept={() => handleAccept(req.friendshipId)}
                                    onIgnore={() => handleIgnore(req.friendshipId)}
                                />
                            ))}
                        </>
                    )}

                    {/* Pestaña: Buscar */}
                    {state.tab === 'search' && (
                        <>
                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,0,208,0.1)' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por username…"
                                        value={state.searchQuery}
                                        onChange={e => dispatch({ searchQuery: e.target.value })}
                                        autoFocus
                                        style={{
                                            width: '100%', paddingLeft: '32px', paddingRight: '0.75rem',
                                            paddingTop: '0.5rem', paddingBottom: '0.5rem',
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,0,208,0.25)', borderRadius: '8px',
                                            color: 'var(--color-text)', fontFamily: 'var(--font-body)',
                                            fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            </div>

                            {state.loadingSearch && <MsgCenter text="Buscando…" />}
                            {!state.loadingSearch && state.searchQuery.trim().length >= 2 && state.searchResults.length === 0 && (
                                <MsgCenter text="No se encontraron usuarios." />
                            )}
                            {!state.loadingSearch && state.searchQuery.trim().length < 2 && (
                                <MsgCenter text="Escribe al menos 2 caracteres." />
                            )}
                            {!state.loadingSearch && state.searchResults.map(user => {
                                const sentId = getSentFriendshipId(user.userId)
                                const isFriend = state.friends.some(f => f.userId === user.userId)
                                return (
                                    <SearchRow
                                        key={user.userId}
                                        user={user}
                                        isSent={!!sentId}
                                        isFriend={isFriend}
                                        onSend={() => handleSendRequest(user.userId)}
                                        onCancel={() => handleCancelRequest(user.userId)}
                                    />
                                )
                            })}
                        </>
                    )}
                </div>
            </aside>
        </>
    )
}

// ── Sub-componentes ──

function MsgCenter({ text, error = false }: { text: string; error?: boolean }) {
    return (
        <p style={{ padding: '1.5rem 1rem', color: error ? '#ff6b6b' : 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', textAlign: 'center' }}>
            {text}
        </p>
    )
}

function Avatar({ url, name }: { url: string | null; name: string | null }) {
    return url ? (
        <img src={url} alt={name ?? 'Avatar'} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    ) : (
        <UserCircle2 size={36} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
    )
}

function FriendRow({ friend, onRemove }: { friend: Friend; onRemove: () => void }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', transition: 'background 0.15s' }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,208,0.06)' }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
            <Avatar url={friend.avatarUrl} name={friend.displayName} />
            <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-cta)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.displayName ?? friend.username ?? 'Usuario'}
                </p>
                {friend.username && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        @{friend.username}
                    </p>
                )}
            </div>
            <IconButton icon={<Trash2 size={13} />} color="#ff6b6b" title="Eliminar amigo" onClick={onRemove} />
        </div>
    )
}

function PendingRow({ request, onAccept, onIgnore }: { request: PendingRequest; onAccept: () => void; onIgnore: () => void }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}>
            <Avatar url={request.avatarUrl} name={request.displayName} />
            <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-cta)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {request.displayName ?? request.username ?? 'Usuario'}
                </p>
                {request.username && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        @{request.username}
                    </p>
                )}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <IconButton icon={<Check size={13} />} color="var(--color-accent-alt)" title="Aceptar" onClick={onAccept} />
                <IconButton icon={<Ban size={13} />}   color="#ff6b6b"                  title="Ignorar"  onClick={onIgnore} />
            </div>
        </div>
    )
}

function SearchRow({ user, isSent, isFriend, onSend, onCancel }: {
    user: UserSearchResult; isSent: boolean; isFriend: boolean; onSend: () => void; onCancel: () => void
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem' }}>
            <Avatar url={user.avatarUrl} name={user.displayName} />
            <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-cta)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.displayName ?? user.username ?? 'Usuario'}
                </p>
                {user.username && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        @{user.username}
                    </p>
                )}
            </div>
            {isFriend ? (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-alt)', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                    Amigo ✓
                </span>
            ) : (
                <IconButton
                    icon={isSent ? <UserMinus size={13} /> : <UserPlus size={13} />}
                    color={isSent ? '#ff6b6b' : '#4ade80'}
                    title={isSent ? 'Cancelar solicitud' : 'Enviar solicitud'}
                    onClick={isSent ? onCancel : onSend}
                />
            )}
        </div>
    )
}

function IconButton({ icon, color, title, onClick }: { icon: React.ReactNode; color: string; title: string; onClick: () => void }) {
    return (
        <button onClick={onClick} title={title} style={{
            background: 'transparent', border: `1px solid ${color}`, borderRadius: '6px',
            color: color, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '5px', transition: 'background 0.15s', flexShrink: 0,
        }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}22` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
            {icon}
        </button>
    )
}