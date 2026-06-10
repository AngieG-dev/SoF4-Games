import type { Profile } from '../types/profile'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

function getAuthHeaders() {
    const token = localStorage.getItem('token')

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export const getProfile = async (): Promise<Profile> => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('No se pudo cargar el perfil')
    }

    return response.json()
}

export const updateProfile = async (
    data: Partial<Profile>
): Promise<Profile> => {

    const response = await fetch(
        `${BASE_URL}/users/me`,
        {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                displayName: data.displayName,
                username: data.username,
                bio: data.bio,
            }),
        }
    )

    if (!response.ok) {

        let errorMessage = 'No se pudo actualizar el perfil'

        try {
            const errorData = await response.json()
            errorMessage =
                errorData.message ??
                errorMessage
        } catch {
            // The server did not return a valid JSON.
        }

        throw new Error(errorMessage)
    }

    return response.json()
}
