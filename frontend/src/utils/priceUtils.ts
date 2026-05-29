import type { Platforms } from '../types'

export function getPlatformLabel(platforms: Platforms): string {
  return [
    platforms.windows && 'PC',
    platforms.mac     && 'Mac',
    platforms.linux   && 'Linux',
  ].filter(Boolean).join(' · ')
}
