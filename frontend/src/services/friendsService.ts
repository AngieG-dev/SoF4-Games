import type { Friend } from '../types/Friends'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

function getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

/**
 * GET /api/v1/friends
 * Devuelve la lista de amigos aceptados del usuario autenticado.
 */
export async function getFriends(): Promise<Friend[]> {
    const response = await fetch(`${BASE_URL}/friends`, {
        method: 'GET',
        headers: getAuthHeader(),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message ?? 'Error al cargar amigos')
    }

    return response.json() as Promise<Friend[]>
}

/**
 * POST /api/v1/friends/request
 * Envía una solicitud de amistad al usuario con el UUID indicado.
 */
export async function sendFriendRequest(addresseeId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/friends/request`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ addresseeId }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message ?? 'Error al enviar solicitud de amistad')
    }
}