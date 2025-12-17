import { useEffect, useCallback, useRef } from 'react'

export function useKeyboard() {
  const handlersRef = useRef<Set<(event: KeyboardEvent) => void>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handlersRef.current.forEach(handler => handler(event))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const onKeyDown = useCallback((handler: (event: KeyboardEvent) => void) => {
    handlersRef.current.add(handler)
    return () => {
      handlersRef.current.delete(handler)
    }
  }, [])

  return { onKeyDown }
}
