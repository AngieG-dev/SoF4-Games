// frontend/src/services/gameService.ts
//
// Único punto de contacto entre el frontend y la API de juegos del backend.

import type { Game } from '../types'

// URL base del backend. En desarrollo corre en localhost:8080.
const BASE_URL = 'http://localhost:8080/api/v1'

export const gameService = {

    /**
     * Pide la lista de juegos al backend con paginación.
     *
     * @param page  Número de página (empieza en 0). Default: 0.
     * @param size  Juegos por página. Default: 20.
     * @returns     Promise<Game[]> — array de juegos listo para usar en los componentes.
     *
     * El backend devuelve un objeto Page de Spring:
     * { "content": [...], "totalPages": 5, "totalElements": 98, ... }
     * Solo extraemos "content" que es el array de juegos.
     */
    getAll: async (page = 0, size = 20): Promise<Game[]> => {
        const url = `${BASE_URL}/games?page=${page}&size=${size}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error al obtener juegos: ${response.status}`)
        }

        const data = await response.json()

        // Spring Page devuelve { content: [...], totalPages, totalElements, ... }
        // Solo necesitamos el array de juegos.
        return data.content as Game[]
    },
}