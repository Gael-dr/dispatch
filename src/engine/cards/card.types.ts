export type CardTypeId = 'calendar' | 'notification' | (string & {})

export type CardStatus = 'pending' | 'done' | 'skipped'
export type CardPriority = 'low' | 'normal' | 'high'

export type Card<TPayload = unknown> = {
  id: string
  type: CardTypeId

  title: string
  payload: TPayload

  status: CardStatus
  priority?: CardPriority

  createdAt: Date
  updatedAt: Date

  connectors?: string[]
}
