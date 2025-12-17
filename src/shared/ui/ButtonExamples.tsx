/**
 * Exemples de personnalisation du composant Button shadcn/ui
 * Ce fichier montre différentes façons de personnaliser les boutons
 */

import { Button } from '@/components/ui/button'
import { Heart, ArrowRight, Download, Trash2, Check } from 'lucide-react'
import { createColor } from '@/lib/colors'

export function ButtonExamples() {
  // Couleur personnalisée avec OKLCH
  const customBlue = createColor(0.6, 0.2, 250)
  const customGreen = createColor(0.6, 0.2, 142)

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Exemples de personnalisation des boutons</h2>

      {/* 1. Variantes de base */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">1. Variantes de base</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* 2. Tailles */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">2. Tailles</h3>
        <div className="flex items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Heart />
          </Button>
        </div>
      </section>

      {/* 3. Personnalisation avec className */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">3. Personnalisation avec className</h3>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white">
            Purple
          </Button>
          <Button
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-50"
          >
            Purple Outline
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Gradient
          </Button>
          <Button className="shadow-lg shadow-blue-500/50 hover:shadow-xl">
            Avec ombre
          </Button>
        </div>
      </section>

      {/* 4. Couleurs OKLCH personnalisées */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">4. Couleurs OKLCH personnalisées</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            style={{
              backgroundColor: customBlue,
              color: 'oklch(1 0 0)',
            }}
          >
            Bleu OKLCH
          </Button>
          <Button
            style={{
              backgroundColor: customGreen,
              color: 'oklch(1 0 0)',
            }}
          >
            Vert OKLCH
          </Button>
        </div>
      </section>

      {/* 5. Boutons avec icônes */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">5. Boutons avec icônes</h3>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Heart className="mr-2" />
            J'aime
          </Button>
          <Button variant="outline">
            Télécharger
            <Download className="ml-2" />
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2" />
            Supprimer
          </Button>
          <Button variant="ghost" size="icon">
            <Check />
          </Button>
        </div>
      </section>

      {/* 6. Animations */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">6. Animations</h3>
        <div className="flex flex-wrap gap-2">
          <Button className="transition-all duration-300 hover:scale-105 active:scale-95">
            Scale on hover
          </Button>
          <Button className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
            Lift on hover
          </Button>
          <Button className="animate-pulse">Pulsing</Button>
        </div>
      </section>

      {/* 7. États */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">7. États</h3>
        <div className="flex flex-wrap gap-2">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
          <Button className="opacity-50 cursor-not-allowed">
            Custom disabled
          </Button>
        </div>
      </section>

      {/* 8. Boutons full-width et responsive */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">8. Responsive</h3>
        <div className="space-y-2">
          <Button className="w-full sm:w-auto">Full width (mobile)</Button>
          <Button className="w-full md:w-1/2 lg:w-1/3">
            Responsive width
          </Button>
        </div>
      </section>

      {/* 9. Combinaisons avancées */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">9. Combinaisons avancées</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
          >
            <ArrowRight className="mr-2" />
            Avancé
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Multi-gradient
          </Button>
        </div>
      </section>
    </div>
  )
}

