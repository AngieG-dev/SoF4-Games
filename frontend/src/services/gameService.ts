import type { Game } from '../types'
import type { PageResponse } from '../types/pageResponse'
import type { GameDetail } from '../types/game'
import { getCachedData } from '../utils/cache'

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
    getAll: async (page = 0, size = 20, sort?: string): Promise<Game[]> => {
        let url = `${BASE_URL}/games?page=${page}&size=${size}`

        if (sort) { url += `&sort=${sort}` }

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error al obtener juegos: ${response.status}`)
        }

        const data = await response.json()

        return data.content as Game[]
    },

    getPage: async (
        page = 0,
        size = 20,
        sort?: string
    ): Promise<PageResponse<Game>> => {

        let url = `${BASE_URL}/games?page=${page}&size=${size}`

        if (sort) { url += `&sort=${sort}` }

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Error al obtener juegos: ${response.status}`)
        }

        return response.json()
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
        return getCachedData(
            `game-${id}`,
            async () => {
                const response = await fetch(`${BASE_URL}/games/${id}`)

                if (!response.ok) {
                    throw new Error(`Error al obtener el juego: ${response.status}`)
                }

                return response.json()
            },
            1440
        )
    },

    search: async (
        query: string,
        page = 0,
        size = 20
    ): Promise<Game[]> => {

        const response = await fetch(`${BASE_URL}/games/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`)

        if (!response.ok) {
            throw new Error(`Error al buscar juegos: ${response.status}`)
        }

        const data = await response.json()

        return data.content as Game[]
    },

    getFeaturedGames: async (): Promise<Game[]> => {
        return getCachedData(
            'featured-games',
            async () => {
                const response = await fetch(`${BASE_URL}/games/featured`)

                if (!response.ok) {
                    throw new Error(`Error al obtener destacados: ${response.status}`)
                }

                return response.json()
            },
            1440
        )
    },

    getSaleGames: async (): Promise<Game[]> => {
        return getCachedData(
            'sale-games',
            async () => {
                const response = await fetch(`${BASE_URL}/games/sales`)

                if (!response.ok) {
                    throw new Error(`Error al obtener rebajas: ${response.status}`)
                }

                return response.json()
            },
            1440
        )
    },

    getRecentGames: async (): Promise<Game[]> => {
        return getCachedData(
            'recent-games',
            async () => {
                const response = await fetch(`${BASE_URL}/games/recent`)

                if (!response.ok) {
                    throw new Error(`Error al obtener recientes: ${response.status}`)
                }

                return response.json()
            },
            1440
        )
    },

    getTopRatedGames: async (): Promise<Game[]> => {
        return getCachedData(
            'top-rated-games',
            async () => {
                const response = await fetch(`${BASE_URL}/games/top-rated`)

                if (!response.ok) {
                    throw new Error(`Error al obtener mejor valorados: ${response.status}`)
                }

                return response.json()
            },
            1440
        )
    },
}