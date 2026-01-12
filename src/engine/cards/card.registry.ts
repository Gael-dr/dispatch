import type { CardRenderer } from '@/features/cards/CardRenderers.registry'
import { registerCardRenderer } from '@/features/cards/CardRenderers.registry'
import type { CardBlueprint } from './cards.blueprint'
import { cardFactory } from './factory'

/**
 * Enregistre une carte complète (blueprint + renderer) en une seule opération.
 * Cette fonction simplifie l'enregistrement et garantit la cohérence.
 *
 * @example
 * ```typescript
 * registerCard(calendarBlueprint, CalendarCardRenderer)
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerCard<TBlueprint extends CardBlueprint<any>>(
  blueprint: TBlueprint,
  renderer: CardRenderer
): void {
  // Enregistrement du blueprint dans le factory
  cardFactory.register(blueprint)

  // Enregistrement du renderer avec le type extrait du blueprint
  registerCardRenderer(blueprint.type, renderer)
}
