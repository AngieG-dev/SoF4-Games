import type { LibraryItem } from '../types/library'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token found')
    return { Authorization: `Bearer ${token}` }
}

export const getLibrary = async (): Promise<LibraryItem[]> => {
    const response = await fetch(`${BASE_URL}/library`, {
        headers: getAuthHeader(),
    })

    if (!response.ok) throw new Error('Error al obtener la biblioteca')

    return response.json()
}