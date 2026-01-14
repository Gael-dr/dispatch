import type { Card } from './card.types'

export interface CardRepository {
    list(): Promise<Card[]>
    // plus tard, tu pourras ajouter :
    // markDone(id: string): Promise<void>
    // skip(id: string): Promise<void>
}
