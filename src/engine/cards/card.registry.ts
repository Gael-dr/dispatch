import type { CardTypeId } from './card.types'
import type { CardBlueprint } from './cards.blueprint'

// registry métier
const BLUEPRINTS: Partial<Record<CardTypeId, CardBlueprint<any>>> = {}

export function registerCardType<T>(bp: CardBlueprint<T>) {
  BLUEPRINTS[bp.type] = bp
}

export function getBlueprint(type: CardTypeId) {
  return BLUEPRINTS[type]
}

export function listCardTypes() {
  return Object.keys(BLUEPRINTS)
}
