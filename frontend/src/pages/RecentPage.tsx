import { useEffect, useState } from 'react'
import type { Game } from '../types'
import { gameService } from '../services/gameService'
import StoreCategoryPage from './StoreCategoryPage'

export default function SalesPage() {

    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        gameService
            .getRecentGames()
            .then(setGames)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <StoreCategoryPage
            title="Lo más reciente"
            games={games}
            loading={loading}
            error={error}
        />
    )
}