type AuthErrorProps = {
    message: string
}

export default function AuthError({ message }: AuthErrorProps) {

    return (
        <div
            className="px-4 py-3 text-sm"
            style={{
                background: 'rgba(255, 0, 80, 0.12)',
                border: '1px solid rgba(255, 0, 80, 0.3)',
                borderRadius: '12px',
                color: '#ff8aa8',
                marginBottom: '0.5rem',
                padding: '0.3rem 0.7rem',
            }}
        >
            {message}
        </div>
    )
}
