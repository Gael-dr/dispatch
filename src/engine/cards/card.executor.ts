import type { Card } from './card.types'

export class CardExecutor {
  async execute(
    _card: Card,
    _actionType: string
  ): Promise<{ success: boolean; message: string }> {
    // TODO: brancher backend plus tard
    return { success: true, message: 'ok' }
  }
}

export const cardExecutor = new CardExecutor()
