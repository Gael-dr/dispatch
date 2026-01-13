import type { Card, CardStatus, CardTypeId } from './card.types'
import type { CardBlueprint } from './cards.blueprint'

function makeId(prefix: string, seed: number) {
  return `${prefix}_${seed}_${Math.random().toString(16).slice(2)}`
}

function now() {
  return new Date()
}

export class CardFactory {
  private blueprints = new Map<CardTypeId, CardBlueprint<unknown>>()

  register<TPayload>(bp: CardBlueprint<TPayload>) {
    if (this.blueprints.has(bp.type)) {
      throw new Error(`Blueprint already registered for type: ${bp.type}`)
    }
    // Safe to cast: we store any blueprint in a Map that accepts CardBlueprint<unknown>
    this.blueprints.set(bp.type, bp as CardBlueprint<unknown>)
    return this
  }

  /**
   * Crée une carte depuis des données réelles (production).
   * Ne passe PAS par les factories de mock (defaults/payloadFactory).
   * Utilisé uniquement pour créer des cartes depuis les données du backend.
   *
   * @param type - Type de carte
   * @param data - Données complètes de la carte (doit être complet)
   * @returns Card créée depuis les données fournies
   */
  createFromData<TPayload = unknown>(
    type: CardTypeId,
    data: Omit<Card<TPayload>, 'type'> & {
      type?: CardTypeId // Optionnel car fourni en paramètre séparé
    }
  ): Card<TPayload> {
    // Vérifier que le blueprint existe pour ce type
    const bp = this.blueprints.get(type) as CardBlueprint<TPayload> | undefined
    if (!bp) {
      throw new Error(`No blueprint registered for type: ${type}`)
    }

    // Créer directement depuis les données fournies, sans passer par defaults/payloadFactory
    return {
      id: data.id,
      type,
      title: data.title,
      payload: data.payload,
      status: data.status ?? ('pending' as CardStatus),
      priority: data.priority,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? data.createdAt,
      connectors: data.connectors ?? bp.connectors,
      actions: data.actions,
    }
  }

  /**
   * Crée une carte avec des données mockées (développement uniquement).
   * Utilise defaults() et payloadFactory() pour générer des données de test.
   *
   * @param type - Type de carte
   * @param overrides - Valeurs optionnelles pour surcharger les mocks
   * @param seed - Graine pour générer des variations
   * @returns Card avec des données mockées
   */
  create<TPayload = unknown>(
    type: CardTypeId,
    overrides?: Partial<Omit<Card<TPayload>, 'type' | 'payload'>> & {
      payload?: TPayload
    },
    seed = Date.now()
  ): Card<TPayload> {
    const bp = this.blueprints.get(type) as CardBlueprint<TPayload> | undefined
    if (!bp) throw new Error(`No blueprint registered for type: ${type}`)

    const base = bp.defaults(seed)
    const payload = overrides?.payload ?? bp.payloadFactory(seed)

    const createdAt = overrides?.createdAt ?? now()
    const updatedAt = overrides?.updatedAt ?? createdAt

    const status: CardStatus =
      (overrides?.status as CardStatus | undefined) ?? 'pending'

    return {
      id: overrides?.id ?? makeId(String(type), seed),
      type,

      title: overrides?.title ?? base.title,
      priority: overrides?.priority ?? base.priority,

      status,
      payload,

      createdAt,
      updatedAt,

      connectors: overrides?.connectors ?? bp.connectors,
      actions: overrides?.actions,
    }
  }

  /**
   * Crée plusieurs cartes avec des données mockées (développement uniquement).
   * Utilise create() qui génère des données via defaults() et payloadFactory().
   *
   * @param type - Type de carte à créer
   * @param count - Nombre de cartes à générer
   * @param seed - Graine de base pour la génération
   * @returns Tableau de cartes avec des données mockées
   */
  createMany(type: CardTypeId, count: number, seed = Date.now()) {
    return Array.from({ length: count }, (_, i) =>
      this.create(type, undefined, seed + i)
    )
  }

  /**
   * Crée un mélange de différents types de cartes avec des données mockées (développement uniquement).
   * Utilise create() qui génère des données via defaults() et payloadFactory().
   *
   * @param types - Types de cartes à mélanger
   * @param count - Nombre total de cartes à générer
   * @param seed - Graine de base pour la génération
   * @returns Tableau de cartes avec des données mockées
   */
  createMixed(types: CardTypeId[], count: number, seed = Date.now()) {
    return Array.from({ length: count }, (_, i) => {
      const t = types[i % types.length]
      return this.create(t, undefined, seed + i)
    })
  }

  /**
   * Récupère le blueprint enregistré pour un type donné.
   */
  getBlueprint<TPayload = unknown>(
    type: CardTypeId
  ): CardBlueprint<TPayload> | undefined {
    return this.blueprints.get(type) as CardBlueprint<TPayload> | undefined
  }

  /**
   * Liste tous les types de cartes enregistrés.
   */
  listCardTypes(): CardTypeId[] {
    return Array.from(this.blueprints.keys())
  }
}
