import type { CardRenderer } from '@/features/cards/CardRenderers.registry'
import { registerCardRenderer } from '@/features/cards/CardRenderers.registry'
import type { CardConfig } from './cards.config'
import { cardFactory } from './factory'

/**
 * Enregistre une carte complète (config + renderer) en une seule opération.
 * Cette fonction simplifie l'enregistrement et garantit la cohérence.
 *
 * @example
 * ```typescript
 * registerCard(calendarConfig, CalendarCardRenderer)
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerCard<TConfig extends CardConfig<any>>(
  config: TConfig,
  renderer: CardRenderer
): void {
  // Enregistrement de la config dans le factory
  cardFactory.register(config)

  // Enregistrement du renderer avec le type extrait de la config
  registerCardRenderer(config.type, renderer)
}
