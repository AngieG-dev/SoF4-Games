import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../../services/authService'

import AuthInput from './AuthInput'
import AuthError from './AuthError'

export default function LoginForm() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault()

        setError(null)

        try {

            setLoading(true)

            const response = await login(email, password)

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

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >

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
                {loading
                    ? 'Cargando...'
                    : 'Ingresar'}
            </button>
        </form>
    )
}
