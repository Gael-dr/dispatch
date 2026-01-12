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
    }
  }

  createMany(type: CardTypeId, count: number, seed = Date.now()) {
    return Array.from({ length: count }, (_, i) =>
      this.create(type, undefined, seed + i)
    )
  }

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
