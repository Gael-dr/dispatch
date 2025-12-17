// Mobile-specific policy rules

export interface MobilePolicy {
  enableSwipe: boolean
  enableHaptics: boolean
  enablePullToRefresh: boolean
  maxCardStackSize: number
}

export const defaultMobilePolicy: MobilePolicy = {
  enableSwipe: true,
  enableHaptics: true,
  enablePullToRefresh: true,
  maxCardStackSize: 10,
}

export function getMobilePolicy(): MobilePolicy {
  // Can be extended to fetch from config or user preferences
  return defaultMobilePolicy
}
