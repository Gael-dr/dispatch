import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'

/**
 * Provider qui applique le thème au document
 *
 * Ce composant écoute les changements du thème dans le store Zustand
 * et applique/retire la classe 'dark' sur l'élément <html> en conséquence.
 *
 * Il gère aussi le mode 'system' qui suit les préférences du système.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore(state => state.theme)

  useEffect(() => {
    const root = document.documentElement

    // Fonction pour déterminer si on doit activer le dark mode
    const shouldUseDark = () => {
      if (theme === 'dark') return true
      if (theme === 'light') return false
      // theme === 'system'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Appliquer ou retirer la classe 'dark'
    if (shouldUseDark()) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Si le thème est 'system', écouter les changements de préférences système
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }

      // Écouter les changements (méthode moderne)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
      // Fallback pour les navigateurs plus anciens
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [theme])

  return <>{children}</>
}
