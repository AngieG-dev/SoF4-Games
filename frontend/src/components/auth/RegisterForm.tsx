import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { register, checkUsernameAvailability } from '../../services/authService'
import { validatePassword } from '../../utils/passwordValidation'
import { usernameValidation } from '../../utils/usernameValidation';

import AuthInput from './AuthInput'
import AuthError from './AuthError'

export default function RegisterForm() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (username.length < 3) {
            setUsernameAvailable(null)
            return
        }

        const timeout = setTimeout(async () => {
                try {
                    const available = await checkUsernameAvailability(username)
                    setUsernameAvailable(available)
                } catch {
                    setUsernameAvailable(null)
                }
            },
            800,
        )

        return () => clearTimeout(timeout)
    }, [username])

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault()

        setError(null)

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        try {
            setLoading(true)

            const passwordValidationError = validatePassword(password)
            if (passwordValidationError) {
                setError(passwordValidationError)
                return
            }

            const usernameValidationError = usernameValidation(username)
            if (usernameValidationError) {
                setError(usernameValidationError)
                return
            }

            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.')
                return
            }

            if (usernameAvailable === false) {
                setError('El nombre de usuario ya está en uso.')
                return
            }

            const response = await register( email, password, username )

            localStorage.setItem('token', response.token)
            localStorage.setItem('email', response.email)
            localStorage.setItem('username', response.username)

            navigate('/')

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Ocurrió un error inesperado')
            }

        } finally {
            setLoading(false)
        }
    }

    const passwordError = password.length > 0 ? validatePassword(password) : null
    const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AuthInput 
                label="Nombre de usuario" 
                value={username} 
                onChange={setUsername} 
                required 
            />

            {usernameAvailable === true && (
                <p className="text-xs mt-2" style={{ color: '#4ade80' }}>
                    Nombre de usuario disponible.
                </p>
            )}

            {usernameAvailable === false && (
                <p className="text-xs mt-2" style={{ color: '#ff8aa8' }}>
                    El nombre de usuario ya está en uso.
                </p>
            )}

            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Mínimo 3 caracteres.
                Puede contener letras, números,
                . _ - ! ?
            </p>

            <AuthInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
            />

            <AuthInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                required
            />

            {passwordError && (
                <p className="text-xs mt-2" style={{ color: '#ff8aa8' }}>
                    {passwordError}
                </p>
            )}

            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                La contraseña debe contener al menos 8 caracteres,
                una mayúscula, una minúscula, un número y un carácter especial.
            </p>

            <AuthInput
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
            />

            {!passwordsMatch && (
                <p className="text-xs mt-2" style={{ color: '#ff8aa8' }}>
                    Las contraseñas no coinciden.
                </p>
            )}

            {error && (
                <AuthError message={error} />
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold transition-all"
                style={{
                    background: 'linear-gradient(90deg, #ff00d0, #00f2ff)',
                    borderRadius: '12px',
                    color: '#fff',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    margin: '0.5rem 0',
                }}
            >
                { loading ? 'Cargando...' : 'Crear cuenta' }
            </button>
        </form>
    )
}
