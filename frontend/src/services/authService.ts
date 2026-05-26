export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {

    const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        let errorMessage = 'Ocurrió un error en el servidor';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
        }

        throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();

    return data;
};