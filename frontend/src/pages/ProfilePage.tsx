import { useEffect, useState } from 'react'
import type { Profile } from '../types/profile'
import type { LibraryItem } from '../types/library'
import * as userService from '../services/userService'
import { getLibrary } from '../services/libraryService'

//Tipos
type Tab = 'resumen' | 'configuracion'
type ConfigSection = 'general' // Ampliar cuando se implementen: 'tema' | 'cuenta'

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
    // displayName se omite del form — se unifica todo en username
    const [username, setUsername] = useState('')
    const [bio, setBio]           = useState('')
    const [saveSuccess, setSaveSuccess] = useState(false)

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

    //Guardar cambios en General
    async function handleSave() {
        try {
            // Sincronizamos displayName con username para mantener coherencia
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

    const btnPrimaryStyle: React.CSSProperties = {
        background: P.accent,
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 22px',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '0.9rem',
    }

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

    return (
        <main className="min-h-screen" style={{ background: P.bgPrincipal, paddingTop: 'var(--nav-height)', color: P.textPrimary }}>
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
                    {(['resumen', 'configuracion'] as Tab[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '10px 20px', fontWeight: 600, fontSize: '0.9rem',
                            color: activeTab === tab ? P.accent : P.textSecond,
                            borderBottom: activeTab === tab ? `2px solid ${P.accent}` : '2px solid transparent',
                            marginBottom: '-1px', transition: 'color 0.15s',
                        }}>
                            {tab === 'resumen' ? 'Resumen' : 'Configuración'}
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
                            {/* Sección General (activa) */}
                            <button onClick={() => setConfigSection('general')} style={{
                                padding: '12px 14px', textAlign: 'left', cursor: 'pointer', border: 'none',
                                background: configSection === 'general' ? P.accent : P.bgCard,
                                borderRadius: '6px', transition: 'background 0.15s',
                            }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>General</p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: configSection === 'general' ? 'rgba(255,255,255,0.75)' : P.textSecond }}>
                                    Nombre de usuario, descripción
                                </p>
                            </button>
                            {/* Secciones a desarrollar */}
                            {[{ key: 'tema', label: 'Tema', sub: 'Foto de perfil, colores' }, { key: 'cuenta', label: 'Detalles de cuenta', sub: 'Mail, usuario, contraseña' }].map(s => (
                                <div key={s.key} style={{
                                    background: P.bgCard, border: `1px solid ${P.border}`,
                                    padding: '12px 14px', opacity: 0.4, cursor: 'not-allowed', borderRadius: '6px',
                                }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: P.textPrimary }}>{s.label}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: P.textSecond }}>{s.sub}</p>
                                </div>
                            ))}
                        </nav>

                        {/* Panel general */}
                        {configSection === 'general' && (
                            <div style={{ ...cardStyle, padding: '24px' }}>
                                <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700, color: P.textPrimary }}>General</h2>
                                <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, marginBottom: '20px' }} />

                                {/* Error global */}
                                {error && ( <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p> )}

                                {/* Campo nombre de usuario */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Nombre de usuario</label>
                                    <div style={{ position: 'relative' }}>
                                        <input style={{ ...inputStyle, paddingRight: '190px' }} value={username}
                                               onChange={e => setUsername(e.target.value)}
                                               placeholder="Tu nombre visible" />
                                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                            fontSize: '0.72rem', color: P.textSecond, pointerEvents: 'none' }}>
                                            Nombre visible públicamente
                                        </span>
                                    </div>
                                </div>

                                {/* descripción */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Descripción</label>
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
                                        background: P.bgPrincipal, border: `1px dashed ${P.accentCyan}44`,
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
                                    <button style={btnPrimaryStyle} onClick={handleSave}>Guardar cambios</button>
                                    <button style={btnSecondaryStyle} onClick={handleCancel}>Cancelar</button>
                                    {saveSuccess && (
                                        <span style={{ fontSize: '0.85rem', color: P.accentCyan }}>✓ Cambios guardados</span>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </main>
    )
}