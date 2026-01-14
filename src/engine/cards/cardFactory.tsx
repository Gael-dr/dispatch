import type { CardTypeId } from './card.types'
import type { CardConfig } from './cards.config'

/**
 * Factory pour gérer les configurations de cartes.
 *
 * Les configurations sont enregistrées via `registerCard()` dans chaque feature.
 * Les mocks sont gérés séparément via les fixtures JSON dans `src/app/store/fixtures/`.
 */
export class CardFactory {
  private configs = new Map<CardTypeId, CardConfig<unknown>>()

  /**
   * Enregistre une configuration pour un type de carte.
   *
   * @param config - La configuration à enregistrer
   * @returns L'instance de la factory pour le chaînage
   */
  register<TPayload>(config: CardConfig<TPayload>) {
    if (this.configs.has(config.type)) {
      throw new Error(`Config already registered for type: ${config.type}`)
    }
    // Safe to cast: we store any config in a Map that accepts CardConfig<unknown>
    this.configs.set(config.type, config as CardConfig<unknown>)
    return this
  }

  /**
   * Récupère la configuration enregistrée pour un type donné.
   * Utilisé notamment par `getAvailableActions()` pour récupérer les actions.
   *
   * @param type - Le type de carte
   * @returns La configuration enregistrée, ou undefined si non trouvée
   */
  getConfig<TPayload = unknown>(
    type: CardTypeId
  ): CardConfig<TPayload> | undefined {
    return this.configs.get(type) as CardConfig<TPayload> | undefined
  }

  /**
   * Liste tous les types de cartes enregistrés.
   *
   * @returns Tableau des types de cartes enregistrés
   */
  listCardTypes(): CardTypeId[] {
    return Array.from(this.configs.keys())
  }
}
