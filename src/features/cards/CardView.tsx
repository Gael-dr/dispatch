// CardView - Composant de rendu pur
// ❌ Pas d'API, pas de logique métier, pas de condition device
// ✅ Affiche uniquement le payload de la card via les renderers spécifiques

import { Card } from '../../engine/cards/card.types'
import { getCardRenderer } from './CardRendererRouter'

interface CardViewProps {
  card: Card
  onAction?: (actionId: string) => void
}

export function CardView({ card, onAction }: CardViewProps) {
  // Utilise le router de renderers pour afficher la card selon son type
  return getCardRenderer(card, onAction)
}
