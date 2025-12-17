import { Card } from './card.types'

type CardHandler = (card: Card) => void

class CardRegistry {
  private handlers: Map<string, CardHandler> = new Map()

  register(type: string, handler: CardHandler) {
    this.handlers.set(type, handler)
  }

  get(type: string): CardHandler | undefined {
    return this.handlers.get(type)
  }

  has(type: string): boolean {
    return this.handlers.has(type)
  }
}

export const cardRegistry = new CardRegistry()
