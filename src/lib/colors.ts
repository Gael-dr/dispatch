/**
 * Guide des couleurs OKLCH dans le projet
 *
 * OKLCH est un espace colorimétrique qui offre :
 * - Meilleure cohérence perceptuelle (les couleurs semblent équilibrées)
 * - Transitions de couleur plus fluides
 * - Support natif dans les navigateurs modernes
 *
 * Syntaxe : oklch(L C H)
 * - L (Lightness) : 0-1 (0 = noir, 1 = blanc)
 * - C (Chroma) : 0-0.4 (intensité de la couleur, 0 = gris)
 * - H (Hue) : 0-360 (teinte en degrés)
 */

/**
 * Palette de couleurs de base (thème neutral)
 * Ces couleurs sont définies dans src/index.css
 */
export const colors = {
  // Couleurs principales
  background: 'oklch(1 0 0)', // Blanc pur
  foreground: 'oklch(0.145 0 0)', // Presque noir

  // Couleurs primaires (neutres pour le thème neutral)
  primary: 'oklch(0.205 0 0)', // Gris très foncé
  primaryForeground: 'oklch(0.985 0 0)', // Presque blanc

  // Couleurs secondaires
  secondary: 'oklch(0.97 0 0)', // Gris très clair
  secondaryForeground: 'oklch(0.205 0 0)', // Gris foncé

  // Couleurs muted (atténuées)
  muted: 'oklch(0.97 0 0)', // Gris très clair
  mutedForeground: 'oklch(0.556 0 0)', // Gris moyen

  // Couleurs accent
  accent: 'oklch(0.97 0 0)', // Gris très clair
  accentForeground: 'oklch(0.205 0 0)', // Gris foncé

  // Couleurs destructives (rouge)
  destructive: 'oklch(0.577 0.245 27.325)', // Rouge avec chroma et hue

  // Bordures et inputs
  border: 'oklch(0.922 0 0)', // Gris clair
  input: 'oklch(0.922 0 0)', // Gris clair
  ring: 'oklch(0.708 0 0)', // Gris moyen
} as const

/**
 * Fonction utilitaire pour créer des variations de couleur
 * @param lightness - Luminosité (0-1)
 * @param chroma - Intensité de la couleur (0-0.4)
 * @param hue - Teinte en degrés (0-360)
 */
export function createOklchColor(
  lightness: number,
  chroma: number,
  hue: number
): string {
  return `oklch(${lightness} ${chroma} ${hue})`
}

/**
 * Fonction pour créer une palette de gris (chroma = 0)
 * @param lightness - Luminosité (0-1)
 */
export function createGray(lightness: number): string {
  return `oklch(${lightness} 0 0)`
}

/**
 * Fonction pour créer une couleur avec teinte
 * @param lightness - Luminosité (0-1)
 * @param chroma - Intensité (0-0.4)
 * @param hue - Teinte en degrés
 */
export function createColor(
  lightness: number,
  chroma: number,
  hue: number
): string {
  return `oklch(${lightness} ${chroma} ${hue})`
}

/**
 * Exemples de couleurs prédéfinies
 */
export const colorExamples = {
  // Bleu
  blue: createColor(0.6, 0.2, 250),
  blueLight: createColor(0.8, 0.15, 250),
  blueDark: createColor(0.4, 0.25, 250),

  // Rouge
  red: createColor(0.577, 0.245, 27.325),
  redLight: createColor(0.7, 0.2, 27),
  redDark: createColor(0.45, 0.3, 27),

  // Vert
  green: createColor(0.6, 0.2, 142),
  greenLight: createColor(0.75, 0.15, 142),
  greenDark: createColor(0.45, 0.25, 142),

  // Jaune/Orange
  yellow: createColor(0.85, 0.15, 90),
  orange: createColor(0.7, 0.2, 50),

  // Violet
  purple: createColor(0.6, 0.2, 300),
  purpleLight: createColor(0.75, 0.15, 300),
  purpleDark: createColor(0.45, 0.25, 300),
} as const

/**
 * Fonction pour ajuster la luminosité d'une couleur OKLCH
 * @param color - Couleur OKLCH existante (ex: "oklch(0.6 0.2 250)")
 * @param delta - Ajustement de luminosité (-1 à 1)
 */
export function adjustLightness(color: string, delta: number): string {
  const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
  if (!match) return color

  const [, l, c, h] = match
  const newLightness = Math.max(0, Math.min(1, parseFloat(l) + delta))
  return `oklch(${newLightness} ${c} ${h})`
}

/**
 * Fonction pour créer une palette de couleurs avec différentes luminosités
 * @param baseLightness - Luminosité de base
 * @param chroma - Intensité de la couleur
 * @param hue - Teinte
 */
export function createColorScale(
  baseLightness: number,
  chroma: number,
  hue: number
) {
  return {
    50: createColor(Math.min(1, baseLightness + 0.4), chroma * 0.3, hue),
    100: createColor(Math.min(1, baseLightness + 0.3), chroma * 0.5, hue),
    200: createColor(Math.min(1, baseLightness + 0.2), chroma * 0.7, hue),
    300: createColor(Math.min(1, baseLightness + 0.1), chroma * 0.9, hue),
    400: createColor(baseLightness, chroma, hue),
    500: createColor(baseLightness, chroma, hue), // Base
    600: createColor(Math.max(0, baseLightness - 0.1), chroma * 1.1, hue),
    700: createColor(Math.max(0, baseLightness - 0.2), chroma * 1.2, hue),
    800: createColor(Math.max(0, baseLightness - 0.3), chroma * 1.3, hue),
    900: createColor(Math.max(0, baseLightness - 0.4), chroma * 1.4, hue),
  }
}
