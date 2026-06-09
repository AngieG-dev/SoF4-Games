import { createContext, useContext, useEffect, useState } from 'react'
import { getCartItems, addToCart as addToCartService } from '../services/cartService'

interface CartContextType {
    cartCount: number
    addToCart: (gameId: number) => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
    cartCount: 0,
    addToCart: async () => {},
    refreshCart: async () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0)

    const refreshCart = async () => {
        const token = localStorage.getItem('token')
        if (!token) { setCartCount(0); return }
        try {
            const items = await getCartItems()
            setCartCount(items.length)
        } catch {
            setCartCount(0)
        }
    }

    const addToCart = async (gameId: number) => {
        await addToCartService(gameId)
        setCartCount(prev => prev + 1)
    }

    useEffect(() => {
        refreshCart()
    }, [])

    return (
        <CartContext.Provider value={{ cartCount, addToCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
