import type { Game } from '../types'
import type { GameDetail } from '../types/game'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

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

        return data.content as Game[]
    },

    /**
     * Pide el detalle completo de un juego por su ID interno.
     *
     * @param id  ID interno del juego (número)
     * @returns   Promise<GameDetail> con todos los datos del juego
     *
     * Ejemplo: getById(42) → GET /api/v1/games/42
     */
    getById: async (id: number): Promise<GameDetail> => {
        const response = await fetch(`${BASE_URL}/games/${id}`)

        if (!response.ok) {
            throw new Error(`Error al obtener el juego: ${response.status}`)
        }

        return response.json() as Promise<GameDetail>
    },
}