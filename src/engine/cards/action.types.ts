export type CardTypeId = 'calendar' | 'notification' | (string & {})

export type CardStatus = 'pending' | 'done' | 'skipped'

export type Card = {
  id: string
  type: CardTypeId

  title: string
  payload: unknown

  status: CardStatus
  priority?: 'low' | 'normal' | 'high'

  createdAt: Date
  updatedAt: Date

  connectors?: string[]
}
