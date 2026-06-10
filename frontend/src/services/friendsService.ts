import type { Friend, PendingRequest, SentRequest, UserSearchResult } from '../types/Friends'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

function getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

/** GET /api/v1/friends — lista de amigos aceptados */
export async function getFriends(): Promise<Friend[]> {
    const response = await fetch(`${BASE_URL}/friends`, {
        method: 'GET',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al cargar amigos')
    }
    return response.json()
}

/** GET /api/v1/friends/requests — solicitudes pendientes recibidas */
export async function getPendingRequests(): Promise<PendingRequest[]> {
    const response = await fetch(`${BASE_URL}/friends/requests`, {
        method: 'GET',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al cargar solicitudes')
    }
    return response.json()
}

/** GET /api/v1/friends/requests/sent — solicitudes pendientes enviadas */
export async function getSentRequests(): Promise<SentRequest[]> {
    const response = await fetch(`${BASE_URL}/friends/requests/sent`, {
        method: 'GET',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al cargar solicitudes enviadas')
    }
    return response.json()
}

/** POST /api/v1/friends/request — enviar solicitud */
export async function sendFriendRequest(addresseeId: string): Promise<{ id: number }> {
    const response = await fetch(`${BASE_URL}/friends/request`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ addresseeId }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al enviar solicitud')
    }
    return response.json()
}

/** DELETE /api/v1/friends/request/{id} — cancelar solicitud enviada */
export async function cancelFriendRequest(friendshipId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/friends/request/${friendshipId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al cancelar solicitud')
    }
}

/** PUT /api/v1/friends/{id}/accept — aceptar solicitud recibida */
export async function acceptFriendRequest(friendshipId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/friends/${friendshipId}/accept`, {
        method: 'PUT',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al aceptar solicitud')
    }
}

/** PUT /api/v1/friends/{id}/ignore — ignorar solicitud recibida */
export async function ignoreFriendRequest(friendshipId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/friends/${friendshipId}/ignore`, {
        method: 'PUT',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al ignorar solicitud')
    }
}

/** DELETE /api/v1/friends/{id} — eliminar amigo */
export async function removeFriend(friendshipId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al eliminar amigo')
    }
}

/** GET /api/v1/users/search?q= — buscar usuarios por username */
export async function searchUsers(query: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getAuthHeader(),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message ?? 'Error al buscar usuarios')
    }
    return response.json()
}