# Guide des couleurs OKLCH

## Qu'est-ce que OKLCH ?

**OKLCH** (OK Lightness Chroma Hue) est un espace colorimétrique moderne qui offre plusieurs avantages par rapport à RGB ou HSL :

### Avantages

1. **Cohérence perceptuelle** : Les variations de luminosité sont perçues de manière uniforme
2. **Transitions fluides** : Les gradients de couleur sont plus naturels
3. **Accessibilité** : Meilleur contraste prévisible
4. **Support moderne** : Supporté nativement par les navigateurs modernes

## Syntaxe

```css
oklch(L C H)
```

- **L (Lightness)** : 0-1 (0 = noir, 1 = blanc)
- **C (Chroma)** : 0-0.4 (intensité de la couleur, 0 = gris neutre)
- **H (Hue)** : 0-360 (teinte en degrés)

### Exemples

```css
/* Blanc pur */
oklch(1 0 0)

/* Noir pur */
oklch(0 0 0)

/* Gris moyen */
oklch(0.5 0 0)

/* Rouge vif */
oklch(0.6 0.25 25)

/* Bleu */
oklch(0.6 0.2 250)

/* Vert */
oklch(0.6 0.2 142)
```

## Utilisation dans le projet

### Variables CSS

Les couleurs sont définies dans `src/index.css` via des variables CSS :

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}
```

### Utilisation dans les composants

#### Avec Tailwind CSS

```tsx
// Utilisation directe des variables CSS
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Click me</button>
</div>
```

#### Avec des styles inline

```tsx
<div style={{ backgroundColor: 'oklch(0.6 0.2 250)' }}>Contenu</div>
```

#### Avec les utilitaires du projet

```tsx
import { createColor, createGray, colorExamples } from '@/lib/colors'

// Créer une couleur personnalisée
const myBlue = createColor(0.6, 0.2, 250)

// Créer un gris
const myGray = createGray(0.5)

// Utiliser des exemples prédéfinis
const buttonColor = colorExamples.blue
```

## Modifier les couleurs du thème

### 1. Modifier une couleur existante

Éditez `src/index.css` :

```css
:root {
  --primary: oklch(0.6 0.2 250); /* Change en bleu */
  /* ... */
}
```

### 2. Ajouter une nouvelle couleur

```css
:root {
  --custom-color: oklch(0.6 0.2 142); /* Vert */
  /* ... */
}
```

Puis dans `tailwind.config.ts` :

```typescript
export default {
  theme: {
    extend: {
      colors: {
        custom: 'var(--custom-color)',
      },
    },
  },
} satisfies Config
```

## Outils utiles

### 1. Convertisseurs en ligne

- [OKLCH Color Picker](https://oklch.com/)
- [Color Space Converter](https://www.w3.org/TR/css-color-4/#color-conversion-code)

### 2. Conversion depuis d'autres formats

```typescript
// Depuis RGB
// rgb(255, 0, 0) → oklch(0.628 0.258 29.234)

// Depuis HSL
// hsl(0, 100%, 50%) → oklch(0.628 0.258 29.234)

// Utilisez un outil en ligne pour la conversion exacte
```

### 3. Créer des palettes cohérentes

Utilisez la fonction `createColorScale` :

```typescript
import { createColorScale } from '@/lib/colors'

const blueScale = createColorScale(0.6, 0.2, 250)
// Génère une palette de 50 à 900
```

## Bonnes pratiques

### 1. Contraste pour l'accessibilité

- **Texte sur fond clair** : L < 0.3 pour le texte
- **Texte sur fond foncé** : L > 0.7 pour le texte
- Utilisez [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Cohérence des couleurs

- Gardez le même **Hue** pour une famille de couleurs
- Variez seulement **Lightness** et **Chroma**
- Pour les gris, utilisez `chroma = 0`

### 3. Mode sombre

Les couleurs pour le mode sombre sont définies dans `.dark` :

```css
.dark {
  --background: oklch(0.145 0 0); /* Fond sombre */
  --foreground: oklch(0.985 0 0); /* Texte clair */
  /* ... */
}
```

## Exemples pratiques

### Créer un bouton avec couleur personnalisée

```tsx
import { createColor } from '@/lib/colors'

function CustomButton() {
  const buttonColor = createColor(0.6, 0.2, 250) // Bleu

  return (
    <button
      style={{
        backgroundColor: buttonColor,
        color: 'oklch(1 0 0)', // Blanc pour le texte
      }}
    >
      Mon bouton
    </button>
  )
}
```

### Créer une palette de couleurs pour les cartes

```tsx
import { createColorScale } from '@/lib/colors'

const cardColors = {
  default: createColorScale(0.97, 0, 0), // Gris
  primary: createColorScale(0.6, 0.2, 250), // Bleu
  success: createColorScale(0.6, 0.2, 142), // Vert
  warning: createColorScale(0.7, 0.2, 50), // Orange
  danger: createColorScale(0.577, 0.245, 27.325), // Rouge
}
```

## Ressources

- [Documentation MDN sur OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [OKLCH Color Picker](https://oklch.com/)
- [shadcn/ui Colors](https://ui.shadcn.com/docs/theming)
