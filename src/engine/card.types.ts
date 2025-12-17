// Card types definition

export interface Card {
  id: string
  type: string
  title: string
  content?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface CardAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  handler: () => void | Promise<void>
}
