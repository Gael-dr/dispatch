/**
 * Exemple de composant montrant l'utilisation des couleurs OKLCH
 * Ce fichier sert de référence pour comprendre comment utiliser les couleurs
 */

import {
  createColor,
  createGray,
  colorExamples,
  createColorScale,
} from '@/lib/colors'

export function ColorExample() {
  // Exemple 1: Utilisation directe des variables CSS
  const cssVariablesExample = (
    <div className="bg-background text-foreground p-4 border border-border rounded">
      <h3 className="text-primary font-bold">Utilisation des variables CSS</h3>
      <p className="text-muted-foreground">
        Les couleurs sont définies dans index.css et accessibles via Tailwind
      </p>
    </div>
  )

  // Exemple 2: Création de couleurs personnalisées
  const customBlue = createColor(0.6, 0.2, 250)
  const customGray = createGray(0.5)

  const customColorsExample = (
    <div className="p-4 space-y-2">
      <div
        style={{ backgroundColor: customBlue, color: 'oklch(1 0 0)' }}
        className="p-2 rounded"
      >
        Couleur bleue personnalisée
      </div>
      <div
        style={{ backgroundColor: customGray, color: 'oklch(0 0 0)' }}
        className="p-2 rounded"
      >
        Gris personnalisé
      </div>
    </div>
  )

  // Exemple 3: Palette de couleurs
  const blueScale = createColorScale(0.6, 0.2, 250)

  const colorScaleExample = (
    <div className="p-4">
      <h3 className="mb-2">Palette de bleus</h3>
      <div className="flex gap-1">
        {Object.entries(blueScale).map(([key, color]) => (
          <div
            key={key}
            style={{
              backgroundColor: color,
              width: '40px',
              height: '40px',
              borderRadius: '4px',
            }}
            title={`${key}: ${color}`}
          />
        ))}
      </div>
    </div>
  )

  // Exemple 4: Couleurs prédéfinies
  const predefinedColorsExample = (
    <div className="p-4 space-y-2">
      <div
        style={{ backgroundColor: colorExamples.blue, color: 'oklch(1 0 0)' }}
        className="p-2 rounded"
      >
        Bleu
      </div>
      <div
        style={{ backgroundColor: colorExamples.green, color: 'oklch(1 0 0)' }}
        className="p-2 rounded"
      >
        Vert
      </div>
      <div
        style={{ backgroundColor: colorExamples.red, color: 'oklch(1 0 0)' }}
        className="p-2 rounded"
      >
        Rouge
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Exemples de couleurs OKLCH</h2>
      {cssVariablesExample}
      <div>
        <h3 className="text-lg font-semibold mb-2">Couleurs personnalisées</h3>
        {customColorsExample}
      </div>
      {colorScaleExample}
      <div>
        <h3 className="text-lg font-semibold mb-2">Couleurs prédéfinies</h3>
        {predefinedColorsExample}
      </div>
    </div>
  )
}
