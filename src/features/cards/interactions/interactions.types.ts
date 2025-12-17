// Types for card interactions

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
}

export interface InteractionEvent {
  type: 'swipe' | 'tap' | 'longPress' | 'keyboard'
  data: SwipeGesture | { key: string } | Record<string, unknown>
}
