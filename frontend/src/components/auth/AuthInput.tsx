type AuthInputProps = {
    label: string
    type?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
}

export default function AuthInput({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
}: AuthInputProps) {

    return (
        <div>

            <label
                className="block mb-2 text-sm"
                style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', }}
            >
                {label}
            </label>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 outline-none transition-all"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    color: 'var(--color-text)',
                    padding: '0.3rem 0.7rem',
                }}
            />
        </div>
    )
}
