import { useEffect, useState, useMemo } from 'react'
import { useInteractionContext } from './useInteractionContext'

export type InteractionMode = 'mobile' | 'desktop' | 'auto'

export function useInteractionMode() {
  const { mode, setMode } = useInteractionContext()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    if (mode === 'auto') {
      const checkDevice = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener('resize', checkDevice)
      return () => window.removeEventListener('resize', checkDevice)
    }
  }, [mode])

  const detectedMode = useMemo(() => {
    if (mode === 'auto') {
      return windowWidth < 768 ? 'mobile' : 'desktop'
    }
    return mode
  }, [mode, windowWidth])

  return {
    mode: detectedMode,
    setMode,
    isMobile: detectedMode === 'mobile',
    isDesktop: detectedMode === 'desktop',
  }
}
