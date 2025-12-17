# Guide de personnalisation du bouton shadcn/ui

## Structure du composant Button

Le composant Button de shadcn/ui est construit avec :

- **class-variance-authority (cva)** : Pour gérer les variantes
- **cn()** : Pour merger les classes Tailwind
- **Variantes prédéfinies** : size, variant

## Méthodes de personnalisation

### 1. Modifier directement le fichier source

Le fichier `src/components/ui/button.tsx` est **votre code**, vous pouvez le modifier librement.

#### Ajouter une nouvelle variante

```tsx
// Dans button.tsx
const buttonVariants = cva('inline-flex items-center justify-center...', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground...',
      outline: 'border border-input bg-background...',
      secondary: 'bg-secondary text-secondary-foreground...',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      // ✨ Ajoutez votre variante personnalisée
      custom: 'bg-blue-500 text-white hover:bg-blue-600',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
      // ✨ Ajoutez une nouvelle taille
      xl: 'h-14 rounded-lg px-10 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
```

#### Modifier les styles de base

```tsx
const buttonVariants = cva(
  // ✨ Modifiez les classes de base
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    // ...
  }
)
```

### 2. Utiliser les props className

La méthode la plus simple pour des personnalisations ponctuelles :

```tsx
import { Button } from '@/components/ui/button'

// Personnalisation avec className
<Button className="bg-purple-500 hover:bg-purple-600 text-white">
  Bouton personnalisé
</Button>

// Combiner avec les variantes existantes
<Button
  variant="outline"
  className="border-purple-500 text-purple-500 hover:bg-purple-50"
>
  Outline personnalisé
</Button>
```

### 3. Créer un composant wrapper

Pour réutiliser des styles personnalisés :

```tsx
// src/components/ui/custom-button.tsx
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CustomButtonProps extends ButtonProps {
  // Vos props personnalisées
  glow?: boolean
}

export function CustomButton({
  className,
  glow = false,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      className={cn(glow && 'shadow-lg shadow-blue-500/50', className)}
      {...props}
    />
  )
}
```

### 4. Modifier les couleurs via les variables CSS

Les couleurs utilisent les variables CSS définies dans `src/index.css` :

```css
/* Dans src/index.css */
:root {
  --primary: oklch(0.6 0.2 250); /* Change la couleur primaire */
  --primary-foreground: oklch(1 0 0);
  /* ... */
}
```

Tous les boutons avec `variant="default"` utiliseront automatiquement cette couleur.

### 5. Créer des variantes avec des couleurs OKLCH

```tsx
import { createColor } from '@/lib/colors'

// Dans votre composant
const customColor = createColor(0.6, 0.2, 250) // Bleu

<Button
  style={{
    backgroundColor: customColor,
    color: 'oklch(1 0 0)' // Blanc
  }}
>
  Bouton avec couleur OKLCH
</Button>
```

## Exemples pratiques

### Exemple 1 : Bouton avec icône personnalisée

```tsx
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'

<Button>
  <Heart className="mr-2 h-4 w-4" />
  J'aime
</Button>

<Button variant="outline">
  Continuer
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

### Exemple 2 : Bouton avec animation

```tsx
<Button className="transition-all duration-300 hover:scale-105 active:scale-95">
  Bouton animé
</Button>
```

### Exemple 3 : Bouton avec gradient

```tsx
<Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
  Gradient
</Button>
```

### Exemple 4 : Bouton avec ombre personnalisée

```tsx
<Button className="shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)]">
  Ombre bleue
</Button>
```

### Exemple 5 : Bouton full-width responsive

```tsx
<Button className="w-full sm:w-auto">Responsive</Button>
```

## Personnalisation avancée

### Créer un système de variantes personnalisées

```tsx
// src/components/ui/button-variants.ts
import { cva } from 'class-variance-authority'

export const customButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'bg-blue-500 text-white hover:bg-blue-600',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
  }
)
```

### Utiliser avec le composant Button existant

```tsx
import { Button } from '@/components/ui/button'
import { customButtonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
;<Button
  className={cn(customButtonVariants({ variant: 'success', size: 'lg' }))}
>
  Succès
</Button>
```

## Bonnes pratiques

### 1. Respecter l'accessibilité

```tsx
// Toujours inclure les états disabled
<Button disabled>Désactivé</Button>

// Utiliser aria-label pour les boutons icon-only
<Button size="icon" aria-label="Fermer">
  <X className="h-4 w-4" />
</Button>
```

### 2. Maintenir la cohérence

- Utilisez les variantes existantes quand c'est possible
- Créez de nouvelles variantes seulement si nécessaire
- Documentez vos variantes personnalisées

### 3. Performance

```tsx
// ✅ Bon : className est optimisé par Tailwind
<Button className="bg-blue-500">...</Button>

// ⚠️ Moins optimal : style inline (mais acceptable pour OKLCH)
<Button style={{ backgroundColor: 'oklch(0.6 0.2 250)' }}>...</Button>
```

## Migration depuis d'autres styles

### Depuis un bouton HTML classique

```tsx
// Avant
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>

// Après
<Button variant="default" className="bg-blue-500">
  Click me
</Button>
```

### Depuis un autre composant Button

```tsx
// Si vous aviez un composant ActionButton
import { Button } from '@/components/ui/button'

// Remplacez simplement
;<Button
  variant="primary" // ou utilisez className pour mapper
  className="..." // vos styles existants
>
  ...
</Button>
```

## Ressources

- [Documentation shadcn/ui Button](https://ui.shadcn.com/docs/components/button)
- [class-variance-authority](https://cva.style/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
