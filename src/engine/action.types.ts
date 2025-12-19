// Action types definition

export type ActionType =
  | 'approve'
  | 'reject'
  | 'defer'
  | 'archive'
  | 'schedule'
  | 'read'
  | 'mark-urgent'
  | 'mark-done'
  | 'ignore'
  | 'custom'

export interface Action {
  id: string
  type: ActionType
  label: string
  icon?: string
  requiresConfirmation?: boolean
  metadata?: Record<string, unknown>
}

export interface ActionResult {
  success: boolean
  message?: string
  data?: unknown
}
