// Permissions policy rules

export type Permission = 'read' | 'write' | 'delete' | 'execute'

export interface PermissionsPolicy {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canExecute: boolean
}

export function checkPermission(
  policy: PermissionsPolicy,
  permission: Permission
): boolean {
  switch (permission) {
    case 'read':
      return policy.canRead
    case 'write':
      return policy.canWrite
    case 'delete':
      return policy.canDelete
    case 'execute':
      return policy.canExecute
    default:
      return false
  }
}

export const defaultPermissionsPolicy: PermissionsPolicy = {
  canRead: true,
  canWrite: true,
  canDelete: true,
  canExecute: true,
}
