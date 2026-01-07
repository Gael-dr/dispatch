import { AnimatePresence, motion } from 'framer-motion'
import { startTransition, useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

/**
 * Layout principal de l'application avec transitions de page
 */
export function AppLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const [displayOutlet, setDisplayOutlet] = useState(outlet)
  const [displayLocation, setDisplayLocation] = useState(location)

  useEffect(() => {
    // Quand la location change, mettre à jour après un court délai pour laisser l'animation de sortie se jouer
    if (location.pathname !== displayLocation.pathname) {
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setDisplayOutlet(outlet)
      }, 10) // Petit délai pour s'assurer que l'animation de sortie commence
      return () => clearTimeout(timer)
    } else {
      // Si c'est la même route, mettre à jour l'outlet de manière non-bloquante (pour les changements d'état)
      startTransition(() => {
        setDisplayOutlet(outlet)
      })
    }
  }, [location, outlet, displayLocation.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 35,
          duration: 0.4,
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: 'oklch(0.2069 0.0403 263.99)',
        }}
      >
        {displayOutlet}
      </motion.div>
    </AnimatePresence>
  )
}
