import { useCallback } from 'react'

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

export function useHaptics() {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if Vibration API is available (mobile browsers)
    if ('vibrate' in navigator) {
      const patterns: Record<HapticType, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [20, 50, 20],
        error: [30, 50, 30],
      }

      navigator.vibrate(patterns[type])
    }
  }, [])

  return { triggerHaptic }
}
