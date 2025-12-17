// Action types definition

export type ActionType = 'approve' | 'reject' | 'defer' | 'archive' | 'custom'

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
