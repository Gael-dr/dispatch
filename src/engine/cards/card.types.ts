export type CardTypeId = 'calendar' | 'notification' | (string & {})

export type CardStatus = 'pending' | 'done' | 'skipped'
export type CardPriority = 'low' | 'normal' | 'high'

import type { UiAction } from '@/engine/policies/card.policy'

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
  /**
   * Actions spécifiques à cette carte, venant du backend.
   * Ces actions ont priorité sur celles définies dans la config.
   */
  actions?: UiAction[]
}
