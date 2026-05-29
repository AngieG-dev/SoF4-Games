import { mockGames, HERO_APPIDS } from './mockGames'

export const heroGames     = mockGames.filter(g => HERO_APPIDS.includes(g.steam_appid))
export const saleGames     = mockGames.filter(g => (g.price_overview?.discount_percent ?? 0) > 0)
export const recentGames   = [...mockGames].reverse().slice(0, 4)
export const topRatedGames = [...mockGames].sort((a, b) => b.total_positive - a.total_positive).slice(0, 4)
