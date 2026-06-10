import { useEffect, useState } from 'react'
import type { Profile } from '../types/profile'
import * as userService from '../services/userService'

export default function ProfilePage() {

    const [profile, setProfile]         = useState<Profile | null>(null)
    const [loading, setLoading]         = useState(true)
    const [error, setError]             = useState('')
    const [showEdit, setShowEdit]       = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [username, setUsername]       = useState('')
    const [bio, setBio]                 = useState('')

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile()

                setProfile(data)
                setDisplayName(data.displayName ?? '')
                setUsername(data.username ?? '')
                setBio(data.bio ?? '')

            } catch (err) {
                setError( err instanceof Error ? err.message : 'Error al cargar perfil')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    async function handleSave() {
        try {
            const updated = await userService.updateProfile({ displayName, username, bio, })

            setProfile(updated)
            setShowEdit(false)

        } catch (err) {
            setError( err instanceof Error ? err.message : 'Error al guardar' )
        }
    }

    if (loading) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: 'var(--color-bg)',
                    paddingTop: 'var(--nav-height)',
                }}
            >
                Cargando perfil...
            </main>
        )
    }

    if (!profile) {
        return (
            <main
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: 'var(--color-bg)',
                    paddingTop: 'var(--nav-height)',
                }}
            >
                {error}
            </main>
        )
    }

    const initials = (profile.displayName || profile.username || '?').substring(0, 2).toUpperCase()

    return (
        <main
            className="min-h-screen"
            style={{
                background: 'var(--color-bg)',
                paddingTop: 'var(--nav-height)',
            }}
        >
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{
                            background: 'var(--color-accent)',
                            color: 'white',
                        }}
                    >
                        {initials}
                    </div>

                    <button disabled className="opacity-50 cursor-not-allowed">
                        Editar avatar (próximamente)
                    </button>
                </div>

                {error && (
                    <p className="mb-4">
                        {error}
                    </p>
                )}

                {!showEdit ? (
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">
                            Perfil
                        </h1>

                        <p>
                            <strong>Nombre:</strong>{' '}
                            {profile.displayName || '-'}
                        </p>

                        <p>
                            <strong>Usuario:</strong>{' '}
                            {profile.username || '-'}
                        </p>

                        <p>
                            <strong>Email:</strong>{' '}
                            {profile.email}
                        </p>

                        <p>
                            <strong>Biografía:</strong>{' '}
                            {profile.bio || '-'}
                        </p>

                        <button onClick={ () => setShowEdit(true) }>
                            Editar perfil
                        </button>

                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">
                            Editar perfil
                        </h1>

                        <input
                            className="w-full p-2"
                            placeholder="Nombre"
                            value={ displayName }
                            onChange={ e => setDisplayName(e.target.value) }
                        />

                        <input
                            className="w-full p-2"
                            placeholder="Usuario"
                            value={ username }
                            onChange={ e => setUsername(e.target.value) }
                        />

                        <textarea
                            className="w-full p-2"
                            rows={4}
                            value={bio}
                            onChange={ e => setBio(e.target.value) }
                        />

                        <div className="flex gap-4">
                            <button onClick={handleSave}>
                                Guardar
                            </button>

                            <button onClick={ () => setShowEdit(false) }>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
