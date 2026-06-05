const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export interface CartItem {
    gameId: number
    steamAppId: number
    name: string
    headerImage: string
    priceFinal: number
    currency: string
    addedAt: string
}

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token found')
    return { Authorization: `Bearer ${token}` }
}

export const getCartItems = async (): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`, {
        headers: getAuthHeader(),
    })

    if (!response.ok) throw new Error('Error al obtener el carrito')

    return response.json()
}

export const removeFromCart = async (gameId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/cart/${gameId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    })

    if (!response.ok) throw new Error('Error al eliminar del carrito')
}
export interface CheckoutResponse {
    orderId: string
    games: {
        gameId: number
        name: string
        headerImage: string
        pricePaid: number
    }[]
    total: number
    currency: string
    purchasedAt: string
}

export const checkout = async (): Promise<CheckoutResponse> => {
    const response = await fetch(`${BASE_URL}/checkout`, {
        method: 'POST',
        headers: getAuthHeader(),
    })

    if (!response.ok) throw new Error('Error al procesar el pago')

    return response.json()
}