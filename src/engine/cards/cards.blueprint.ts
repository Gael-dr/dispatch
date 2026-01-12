import type { Card, CardTypeId, CardPriority } from './card.types'

export type CardBlueprint<TPayload = unknown> = {
    type: CardTypeId

    /**
     * Champs de base (sans id/type/payload/dates) – tu définis le title/priority ici.
     */
    defaults: (seed: number) => {
        title: string
        priority?: CardPriority
    }

    /**
     * Génération du payload typé pour ce type de card.
     */
    payloadFactory: (seed: number) => TPayload

    /**
     * Connecteurs "possibles/requis" pour ce type.
     */
    connectors?: string[]
}
