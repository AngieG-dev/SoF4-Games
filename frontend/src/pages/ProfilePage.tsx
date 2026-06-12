import { useEffect, useState } from 'react'
import type { Profile } from '../types/profile'
import type { LibraryItem } from '../types/library'
import * as userService from '../services/userService'
import { getLibrary } from '../services/libraryService'

// Tipos
type Tab = 'resumen' | 'configuracion' | 'dev'
type ConfigSection = 'general' | 'cuenta' // Ampliar 

//Paleta
const P = {
    bgPrincipal:  '#05010D',   // Fondo global
    bgCard:       '#0D0A1A',   // Cards y contenedores
    bgPanel:      '#130F24',   // Navbar, sidebars, paneles
    accent:       '#FF00D0',   // Magenta — CTAs, activos
    accentCyan:   '#00F2FF',   // Cian — links, bordes activos, badges
    textPrimary:  '#F8F8FF',   // Títulos y texto principal
    textSecond:   '#B0A8C8',   // Metadata, fechas, texto secundario
    border:       'rgba(240,230,255,0.08)',
}

// Constante ficticia de horas jugadas por juego
const HORAS_FICTICIAS = 12

export default function ProfilePage() {

    // Estado: perfil
    const [profile, setProfile]       = useState<Profile | null>(null)
    const [loading, setLoading]       = useState(true)
    const [error, setError]           = useState('')
    // Estado: biblioteca
    const [library, setLibrary]       = useState<LibraryItem[]>([])
    const [libLoading, setLibLoading] = useState(true)
    // Estado: navegación
    const [activeTab, setActiveTab]         = useState<Tab>('resumen')
    const [configSection, setConfigSection] = useState<ConfigSection>('general')
    // Estado: formulario General
    const [username, setUsername] = useState('')
    const [bio, setBio]           = useState('')
    const [saveSuccess, setSaveSuccess] = useState(false)
    // Estado: formulario Detalles de cuenta — Email
    const [newEmail, setNewEmail]         = useState('')
    const [confirmEmail, setConfirmEmail] = useState('')
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [emailError, setEmailError]     = useState('')
    // Usuario
    const [newUsername, setNewUsername]         = useState('')
    const [usernameSuccess, setUsernameSuccess] = useState(false)
    const [usernameError, setUsernameError]     = useState('')
    // Contraseña
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword]         = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [passwordError, setPasswordError]     = useState('')
    // Estado: formulario Dev Mode
    const [gameName, setGameName]     = useState('')
    const [gameDesc, setGameDesc]     = useState('')
    const [gameImage, setGameImage]   = useState<File | null>(null)
    const [gameFile, setGameFile]     = useState<File | null>(null)
    const [devSuccess, setDevSuccess] = useState(false)
    const [devError, setDevError]     = useState('')
    // Estado: hover de botones
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)
    const hoverProps = (id: string) => ({
        onMouseEnter: () => setHoveredBtn(id),
        onMouseLeave: () => setHoveredBtn(null),
    })

    // Carga inicial
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [profileData, libraryData] = await Promise.all([
                    userService.getProfile(),
                    getLibrary().catch(() => [] as LibraryItem[]),
                ])
                setProfile(profileData)
                setUsername(profileData.username ?? profileData.displayName ?? '')
                setBio(profileData.bio ?? '')
                setLibrary(libraryData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar perfil')
            } finally {
                setLoading(false)
                setLibLoading(false)
            }
        }
        loadAll()
    }, [])

    async function handleSave() {
        try {
            const updated = await userService.updateProfile({ displayName: username, username, bio })
            setProfile(updated)
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar')
        }
    }

    function handleCancel() {
        if (!profile) return
        setUsername(profile.username ?? profile.displayName ?? '')
        setBio(profile.bio ?? '')
    }

    async function handleUpdateEmail() {
        setEmailError('')
        if (!newEmail || !confirmEmail) { setEmailError('Completa ambos campos.'); return }
        if (newEmail !== confirmEmail)  { setEmailError('Los emails no coinciden.'); return }
        try {
            const updated = await userService.updateProfile({ email: newEmail } as Partial<Profile>)
            setProfile(updated)
            setNewEmail('')
            setConfirmEmail('')
            setEmailSuccess(true)
            setTimeout(() => setEmailSuccess(false), 3000)
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : 'Error al actualizar email')
        }
    }

    async function handleUpdateUsername() {
        setUsernameError('')
        const usernameRegex = /^[a-zA-Z0-9_-]{4,}$/
        if (!newUsername) { setUsernameError('Ingresa un nuevo usuario.'); return }
        if (!usernameRegex.test(newUsername)) { setUsernameError('Solo letras, números y guiones bajos. Mín. 4 caracteres.'); return }
        try {
            const updated = await userService.updateProfile({ username: newUsername, displayName: newUsername })
            setProfile(updated)
            setUsername(newUsername)
            setNewUsername('')
            setUsernameSuccess(true)
            setTimeout(() => setUsernameSuccess(false), 3000)
        } catch (err) {
            setUsernameError(err instanceof Error ? err.message : 'Error al actualizar usuario')
        }
    }

    async function handleUpdatePassword() {
        setPasswordError('')
        if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError('Completa todos los campos.'); return }
        if (newPassword !== confirmPassword) { setPasswordError('Las contraseñas no coinciden.'); return }
        if (newPassword.length < 8) { setPasswordError('La contraseña debe tener al menos 8 caracteres.'); return }
        try {
            await userService.updateProfile({ password: newPassword } as Partial<Profile>)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setPasswordSuccess(true)
            setTimeout(() => setPasswordSuccess(false), 3000)
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : 'Error al cambiar contraseña')
        }
    }

    async function handleUploadGame() {
        setDevError('')
        if (!gameName || !gameDesc || !gameImage || !gameFile) {
            setDevError('Completa todos los campos y sube los archivos correspondientes.')
            return
        }
        try {
            console.log('Subiendo recursos:', { gameName, gameDesc, gameImage, gameFile })
            await new Promise(resolve => setTimeout(resolve, 1500))
            setGameName('')
            setGameDesc('')
            setGameImage(null)
            setGameFile(null)
            const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
            fileInputs.forEach(input => input.value = '')
            setDevSuccess(true)
            setTimeout(() => setDevSuccess(false), 3000)
        } catch (err) {
            setDevError('Ocurrió un error al subir el juego.')
        }
    }

    // Estados de carga / error
    if (loading) return (
        <main className="min-h-screen flex items-center justify-center"
              style={{ background: P.bgPrincipal, paddingTop: 'var(--nav-height)', color: P.textPrimary }}>
            Cargando perfil...
        </main>
    )

    if (!profile) return (
        <main className="min-h-screen flex items-center justify-center"
              style={{ background: P.bgPrincipal, paddingTop: 'var(--nav-height)', color: P.textPrimary }}>
            {error || 'No se pudo cargar el perfil.'}
        </main>
    )

    const initials          = (profile.username || profile.displayName || '?').substring(0, 2).toUpperCase()
    const totalJuegos       = library.length
    const totalHoras        = totalJuegos * HORAS_FICTICIAS
    // Actividad reciente: últimos 2 juegos por purchasedAt descendente
    const actividadReciente = [...library]
        .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
        .slice(0, 2)

    // Estilos compartidos
    const cardStyle: React.CSSProperties = {
        background: P.bgCard,
        border: `1px solid ${P.border}`,
        borderRadius: '8px',
    }
    const inputStyle: React.CSSProperties = {
        background: P.bgPanel,
        border: `1px solid ${P.border}`,
        borderRadius: '6px',
        color: P.textPrimary,
        padding: '10px 12px',
        width: '100%',
        outline: 'none',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
    }
    const labelStyle: React.CSSProperties = {
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: P.textSecond,
        marginBottom: '6px',
        display: 'block',
    }
    const btnStyle = (id: string): React.CSSProperties => ({
        background: hoveredBtn === id ? `linear-gradient(90deg, ${P.accent}, ${P.accentCyan})` : 'transparent',
        color: '#fff',
        border: `1.5px solid ${hoveredBtn === id ? 'transparent' : P.accentCyan}`,
        borderRadius: '6px',
        padding: '10px 22px',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background 0.25s, border-color 0.25s',
    })
    const btnSecondaryStyle: React.CSSProperties = {
        background: 'transparent',
        color: P.textPrimary,
        border: `1px solid ${P.border}`,
        borderRadius: '6px',
        padding: '10px 22px',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '0.9rem',
    }

    return (        <main className="min-h-screen" style={{ background: P.bgPrincipal, paddingTop: 'var(--nav-height)', color: P.textPrimary }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header de perfil */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                    {/* Avatar con borde */}
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
                        background: P.accent, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 700,
                        boxShadow: `0 0 0 3px ${P.bgPrincipal}, 0 0 0 5px ${P.accentCyan}`,
                    }}>
                        {initials}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: P.textPrimary }}>
                            {profile.username || profile.displayName}
                        </h1>
                        <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: P.textSecond }}>
                            {profile.email}
                        </p>
                        {profile.bio && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', fontStyle: 'italic', color: P.textSecond }}>
                                "{profile.bio}"
                            </p>
                        )}
                    </div>
                    {/* Stats con borde */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[{ label: 'HORAS', value: totalHoras }, { label: 'JUEGOS', value: totalJuegos }].map(s => (
                            <div key={s.label} style={{
                                ...cardStyle, padding: '12px 20px', textAlign: 'center', minWidth: '80px',
                                borderColor: P.accentCyan + '55',
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: P.textPrimary }}>{s.value}</div>
                                <div style={{ fontSize: '0.7rem', color: P.textSecond, letterSpacing: '0.07em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: `1px solid ${P.border}`, marginBottom: '28px', marginTop: '24px' }}>
                    {(['resumen', 'configuracion', 'dev'] as Tab[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 20px', fontWeight: 600, fontSize: '0.9rem',
                            color: activeTab === tab ? P.accent : P.textSecond,
                            borderBottom: activeTab === tab ? `2px solid ${P.accent}` : '2px solid transparent',
                            marginBottom: '-1px', transition: 'color 0.15s',
                        }}>
                            {tab === 'resumen' ? 'Resumen' : tab === 'configuracion' ? 'Configuración' : 'Dev Mode'}
                        </button>
                    ))}
                </div>

                {/* TAB: RESUMEN */}
                {activeTab === 'resumen' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        {/* Tabla juegos comprados */}
                        <section>
                            <h2 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}>
                                Juegos comprados
                            </h2>
                            <div style={{ ...cardStyle, overflow: 'hidden' }}>
                                {libLoading ? (
                                    <p style={{ padding: '20px', color: P.textSecond }}>Cargando biblioteca...</p>
                                ) : library.length === 0 ? (
                                    <p style={{ padding: '20px', color: P.textSecond }}>No tienes juegos comprados todavía.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        {/* Cabecera de tabla */}
                                        <thead>
                                        <tr style={{ borderBottom: `1px solid ${P.border}` }}>
                                            {['JUEGO', 'FECHA DE COMPRA', 'HORAS JUGADAS'].map(col => (
                                                <th key={col} style={{
                                                    padding: '10px 16px', textAlign: 'left', fontWeight: 600,
                                                    fontSize: '0.7rem', letterSpacing: '0.07em', color: P.textSecond,
                                                }}>{col}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        {/* Filas de juegos */}
                                        <tbody>
                                        {library.map((item, i) => (
                                            <tr key={item.steamAppId} style={{
                                                borderBottom: i < library.length - 1 ? `1px solid ${P.border}` : 'none',
                                            }}>
                                                {/* Columna imagen + nombre */}
                                                <td style={{ padding: '10px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img src={item.headerImage} alt={item.name}
                                                             style={{ width: '56px', height: '32px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0, background: P.bgPanel }} />
                                                        <span style={{ fontWeight: 500, color: P.textPrimary }}>{item.name}</span>
                                                    </div>
                                                </td>
                                                {/* Columna fecha */}
                                                <td style={{ padding: '10px 16px', color: P.textSecond }}> {new Date(item.purchasedAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })} </td>
                                                {/* Columna horas */}
                                                <td style={{ padding: '10px 16px', color: P.textSecond }}> {HORAS_FICTICIAS} h </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                        {/* Actividad reciente */}
                        <section>
                            <h2 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}> Actividad reciente </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {actividadReciente.length === 0 ? (
                                    <p style={{ color: P.textSecond }}>Sin actividad reciente.</p>
                                ) : actividadReciente.map(item => (
                                    <div key={item.steamAppId} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px' }}>
                                        <img src={item.headerImage} alt={item.name}
                                             style={{ width: '64px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: P.textPrimary }}>
                                                Compraste {item.name} </p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: P.textSecond }}>
                                                {new Date(item.purchasedAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })} </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
                {/* TAB CONFIGURACIÓN */}
                {activeTab === 'configuracion' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
                        {/* Sidebar de configuración */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {/* Sección General */}
                            <button onClick={() => setConfigSection('general')} style={{
                                padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
                                border: configSection === 'general' ? `1px solid ${P.accentCyan}` : '1px solid transparent',
                                background: configSection === 'general' ? P.bgCard : P.bgCard,
                                borderRadius: '6px', transition: 'background 0.15s',
                            }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>General</p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: configSection === 'general' ? 'rgba(255,255,255,0.75)' : P.textSecond }}>
                                    Nombre de usuario, descripción
                                </p>
                            </button>
                            {/* Sección Detalles de cuenta */}                            <button onClick={() => setConfigSection('cuenta')} style={{
                            padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
                            border: configSection === 'cuenta' ? `1px solid ${P.accentCyan}` : '1px solid transparent',
                            background: configSection === 'cuenta' ? P.bgCard : P.bgCard,
                            borderRadius: '6px', transition: 'background 0.15s',}}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Detalles de cuenta</p>
                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: configSection === 'cuenta' ? 'rgba(255,255,255,0.75)' : P.textSecond }}>
                                Mail, usuario, contraseña
                            </p>
                        </button>

                            {/* Sección Tema (no implementada) */}
                            <div style={{
                                background: P.bgCard, border: `1px solid ${P.border}`,
                                padding: '12px 14px', opacity: 0.4, cursor: 'not-allowed', borderRadius: '6px',
                            }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: P.textPrimary }}>Tema</p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: P.textSecond }}>Foto de perfil, colores</p>
                            </div>
                        </nav>
                        {/* Panel general */}
                        {configSection === 'general' && (
                            <div style={{ ...cardStyle, padding: '24px' }}>
                                <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, color: P.textPrimary }}>General</h2>
                                <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, marginBottom: '20px' }} />
                                {error && ( <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p> )}
                                <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}>Descripción</h3>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Di lo que quieres que el mundo conozca de ti</label>
                                    <div style={{ position: 'relative' }}>
                                        <textarea style={{ ...inputStyle, resize: 'none', paddingBottom: '28px' }} rows={4} value={bio}
                                                  onChange={e => setBio(e.target.value)} maxLength={160}
                                                  placeholder="Cuéntanos algo sobre ti..." />
                                        <span style={{ position: 'absolute', right: '12px', bottom: '10px',
                                            fontSize: '0.72rem', color: P.textSecond, pointerEvents: 'none' }}>
                                            {bio.length} / 160
                                        </span>
                                    </div>
                                </div>
                                {/* Vista previa */}
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ ...labelStyle as React.CSSProperties, marginBottom: '8px' }}>Vista previa pública</p>
                                    <div style={{
                                        background: P.bgPrincipal, border: `2px solid ${P.accentCyan}44`,
                                        borderRadius: '8px', padding: '16px',
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                    }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                            background: P.accent, color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1rem', fontWeight: 700 }}>
                                            {(username || '?').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600, color: P.textPrimary }}>{username || 'Sin nombre'}</p>
                                            {bio && (
                                                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', fontStyle: 'italic', color: P.textSecond }}>
                                                    "{bio.length > 60 ? bio.substring(0, 60) + '...' : bio}"
                                                </p>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: P.textSecond, whiteSpace: 'nowrap' }}>
                                            Así te ven otros usuarios
                                        </span>
                                    </div>
                                </div>
                                {/* Botones */}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <button style={btnStyle('guardar')} {...hoverProps('guardar')} onClick={handleSave}>Guardar cambios</button>
                                    <button style={btnSecondaryStyle} onClick={handleCancel}>Cancelar</button>
                                    {saveSuccess && (
                                        <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Cambios guardados</span>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Panel detalles de cuenta */}
                        {configSection === 'cuenta' && (
                            <div style={{ ...cardStyle, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <h2 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, color: P.textPrimary }}>
                                    Detalles de cuenta
                                </h2>
                                <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, margin: '16px 0 28px' }} />
                                {/* ── Cambiar email ── */}
                                <section style={{ marginBottom: '32px' }}>
                                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}>Cambiar email</h3>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label style={labelStyle}>Email actual</label>
                                        <input
                                            style={{ ...inputStyle, color: P.textSecond, cursor: 'default' }}
                                            value={profile.email ?? ''}
                                            readOnly
                                        />
                                    </div>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label style={labelStyle}>Nuevo email</label>
                                        <input
                                            style={inputStyle}
                                            type="email"
                                            placeholder="Ingresa nuevo email..."
                                            value={newEmail}
                                            onChange={e => setNewEmail(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Confirmar nuevo email</label>
                                        <input
                                            style={inputStyle}
                                            type="email"
                                            placeholder="Repite el nuevo email..."
                                            value={confirmEmail}
                                            onChange={e => setConfirmEmail(e.target.value)}
                                        />
                                    </div>
                                    {emailError && (
                                        <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#f87171' }}>{emailError}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button style={btnStyle('email')} {...hoverProps('email')} onClick={handleUpdateEmail}>
                                            Actualizar email
                                        </button>
                                        {emailSuccess && (
                                            <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Email actualizado</span>
                                        )}
                                    </div>
                                </section>

                                <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, marginBottom: '28px' }} />
                                {/* ── Cambiar nombre de usuario ── */}
                                <section style={{ marginBottom: '32px' }}>
                                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}>Cambiar nombre de usuario</h3>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label style={labelStyle}>Usuario actual</label>
                                        <input
                                            style={{ ...inputStyle, color: P.textSecond, cursor: 'default' }}
                                            value={profile.username ?? profile.displayName ?? ''}
                                            readOnly
                                        />
                                    </div>
                                    <div style={{ marginBottom: '6px' }}>
                                        <label style={labelStyle}>Nuevo usuario</label>
                                        <input
                                            style={inputStyle}
                                            type="text"
                                            placeholder="Ingresa nuevo usuario..."
                                            value={newUsername}
                                            onChange={e => setNewUsername(e.target.value)}
                                        />
                                    </div>
                                    <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: P.textSecond }}>
                                        Solo letras, números y guiones bajos. Mín. 4 caracteres.
                                    </p>
                                    {usernameError && (
                                        <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#f87171' }}>{usernameError}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button style={btnStyle('username')} {...hoverProps('username')} onClick={handleUpdateUsername}>
                                            Actualizar usuario
                                        </button>
                                        {usernameSuccess && (
                                            <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Usuario actualizado</span>
                                        )}
                                    </div>
                                </section>

                                <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, marginBottom: '28px' }} />
                                {/* ── Cambiar contraseña ── */}
                                <section>
                                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: P.textPrimary }}>Cambiar contraseña</h3>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label style={labelStyle}>Contraseña actual</label>
                                        <input
                                            style={inputStyle}
                                            type="password"
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label style={labelStyle}>Nueva contraseña</label>
                                        <input
                                            style={inputStyle}
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Confirmar nueva contraseña</label>
                                        <input
                                            style={inputStyle}
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {passwordError && (
                                        <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#f87171' }}>{passwordError}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button style={btnStyle('password')} {...hoverProps('password')} onClick={handleUpdatePassword}>
                                            Cambiar contraseña
                                        </button>
                                        {passwordSuccess && (
                                            <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Contraseña actualizada</span>
                                        )}
                                    </div>
                                </section>

                            </div>
                        )}

                    </div>
                )}
                {/* TAB DEV MODE */}
                {activeTab === 'dev' && (
                    <div style={{ ...cardStyle, padding: '28px 32px' }}>
                        <h2 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, color: P.textPrimary }}>
                            Dev Mode: publica tu juego
                        </h2>
                        <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: P.textSecond }}>
                            Completa los detalles y sube los archivos necesarios para compartir tu proyecto en la plataforma.
                        </p>
                        <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, margin: '0 0 28px' }} />
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Nombre del juego</label>
                            <input
                                style={inputStyle}
                                type="text"
                                placeholder="Ej. Mi Aventura Épica..."
                                maxLength={80}
                                value={gameName}
                                onChange={e => setGameName(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Descripción corta</label>
                            <textarea
                                style={{ ...inputStyle, resize: 'none' }}
                                rows={4}
                                maxLength={280}
                                placeholder="De qué trata tu juego, características principales..."
                                value={gameDesc}
                                onChange={e => setGameDesc(e.target.value)}
                            />
                            <p style={{ margin: '4px 0 0', fontSize: '11px', color: P.textSecond, textAlign: 'right' }}>
                                {gameDesc.length} / 280
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                            <div>
                                <label style={labelStyle}>Imagen de portada</label>
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', minHeight: '110px', padding: '20px 16px', textAlign: 'center',
                                    background: P.bgPanel, borderRadius: '6px', cursor: 'pointer',
                                    border: `1.5px dashed ${gameImage ? P.accentCyan + '88' : P.border}`,
                                    transition: 'border-color 0.2s',
                                }}>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={e => setGameImage(e.target.files?.[0] || null)}
                                    />
                                    <span style={{ fontSize: '0.85rem', color: gameImage ? P.accentCyan : P.textSecond }}>
                                        {gameImage ? `✓ ${gameImage.name}` : 'Arrastra o haz clic para subir'}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: P.textSecond }}>
                                        PNG, JPG, WEBP · máx. 4 MB
                                    </span>
                                </label>
                                {gameImage && (
                                    <img
                                        src={URL.createObjectURL(gameImage)}
                                        alt="Vista previa portada"
                                        style={{ marginTop: '8px', width: '100%', maxHeight: '90px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                )}
                            </div>
                            <div>
                                <label style={labelStyle}>Archivo del juego</label>
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', minHeight: '110px', padding: '20px 16px', textAlign: 'center',
                                    background: P.bgPanel, borderRadius: '6px', cursor: 'pointer',
                                    border: `1.5px dashed ${gameFile ? P.accentCyan + '88' : P.border}`,
                                    transition: 'border-color 0.2s',
                                }}>
                                    <input
                                        type="file"
                                        accept=".zip,.rar,.exe,.tar.gz"
                                        style={{ display: 'none' }}
                                        onChange={e => setGameFile(e.target.files?.[0] || null)}
                                    />
                                    <span style={{ fontSize: '0.85rem', color: gameFile ? P.accentCyan : P.textSecond }}>
                                        {gameFile ? `✓ ${gameFile.name}` : 'Arrastra o haz clic para subir'}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: P.textSecond }}>
                                        .ZIP, .RAR, .EXE · máx. 500 MB
                                    </span>
                                </label>
                            </div>
                        </div>

                        {devError && (
                            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#f87171' }}>{devError}</p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button style={btnStyle('upload')} {...hoverProps('upload')} onClick={handleUploadGame}>
                                Subir juego
                            </button>
                            {devSuccess && (
                                <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Juego publicado correctamente</span>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </main>
    )
}