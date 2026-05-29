export const ROUTES = {
  HOME:             '/',
  GAME_DETAIL:      '/game/:id',
  LIBRARY:          '/library',
  CART:             '/cart',
  PROFILE:          '/profile',
  SETTINGS:         '/settings',
  STORE_SALES:      '/store/sales',
  STORE_NEW:        '/store/new',
  STORE_TOP_RATED:  '/store/top-rated',
  STORE_CATEGORIES: '/store/categories',
} as const

export const gameDetailPath = (appid: number) => `/game/${appid}`
