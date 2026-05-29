export type Collection = 'indie_latam' | 'indie_global' | 'top_steam'

export interface Screenshot {
  id: number
  path_thumbnail: string  // 600×338 — para miniaturas en galería
  path_full: string       // 1920×1080 — para visor a pantalla completa
}

export interface PriceOverview {
  currency:          string   // 'CLP'
  initial:           number   // centavos: 1050000 = CLP$10.500
  final:             number   // centavos después del descuento
  discount_percent:  number   // 0–100
  initial_formatted: string   // 'CLP$ 10.500'
  final_formatted:   string   // 'CLP$ 5.250'
}

export interface Platforms {
  windows: boolean
  mac:     boolean
  linux:   boolean
}

export interface ReleaseDate {
  coming_soon: boolean
  date:        string  // ej: '15 mar 2026'
}

export interface Genre {
  id:          string
  description: string
}

export interface Category {
  id:          number
  description: string
}

export interface SystemRequirements {
  minimum:     string | null
  recommended: string | null
}

export interface Metacritic {
  score: number
  url:   string
}

export interface Recommendations {
  total: number
}

export interface Achievements {
  total: number
}

export interface Game {
  steam_appid:          number
  collection:           Collection
  name:                 string
  short_description:    string
  detailed_description: string
  header_image:         string
  capsule_image:        string
  background_raw:       string
  screenshots:          Screenshot[]
  is_free:              boolean
  price_overview:       PriceOverview | null
  platforms:            Platforms
  release_date:         ReleaseDate
  required_age:         number
  genres:               Genre[]
  categories:           Category[]
  developers:           string[]
  publishers:           string[]
  supported_languages:  string
  recommendations:      Recommendations
  review_score_desc:    string
  total_positive:       number
  total_negative:       number
  achievements:         Achievements | null
  system_requirements:  Record<string, SystemRequirements>
  metacritic:           Metacritic | null
  steam_tags:           string[]
  website:              string | null
  controller_support:   string | null
}

export interface GameCard {
  steam_appid:      number
  name:             string
  header_image:     string
  genres:           Genre[]
  is_free:          boolean
  price_overview:   PriceOverview | null
  review_score_desc: string
  collection:       Collection
}

export interface HeroGame {
  steam_appid:       number
  name:              string
  short_description: string
  background_raw:    string
  header_image:      string
  genres:            Genre[]
  is_free:           boolean
  price_overview:    PriceOverview | null
  review_score_desc: string
}
