# Guide d'utilisation du store Zustand

## Structure du store

Le store est organisé en plusieurs stores spécialisés :

```
src/app/store/
├── index.ts          # Exports principaux
├── cardStore.ts      # Store pour les cartes
└── uiStore.ts        # Store pour l'UI
```

## Stores disponibles

### 1. CardStore (`useCardStore`)

Gère l'état des cartes dans l'application.

#### State

```typescript
{
  cards: Card[]                    // Liste des cartes
  selectedCardId: string | null    // ID de la carte sélectionnée
  isLoading: boolean               // État de chargement
  error: string | null             // Message d'erreur
}
```

#### Actions

```typescript
setCards(cards: Card[])                    // Définir toutes les cartes
addCard(card: Card)                        // Ajouter une carte
removeCard(cardId: string)                 // Supprimer une carte
updateCard(cardId: string, updates: Partial<Card>)  // Mettre à jour une carte
selectCard(cardId: string | null)          // Sélectionner une carte
executeCardAction(cardId: string, action: Action)  // Exécuter une action
setLoading(loading: boolean)                // Définir l'état de chargement
setError(error: string | null)              // Définir une erreur
clearError()                                // Effacer l'erreur
```

### 2. UIStore (`useUIStore`)

Gère l'état de l'interface utilisateur.

#### State

```typescript
{
  sidebarOpen: boolean            // État de la sidebar
  theme: 'light' | 'dark' | 'system'  // Thème
  viewMode: 'grid' | 'list'      // Mode d'affichage
  filters: {                       // Filtres
    type?: string
    dateRange?: { start: Date | null, end: Date | null }
  }
}
```

#### Actions

```typescript
toggleSidebar()                                    // Basculer la sidebar
setSidebarOpen(open: boolean)                      // Ouvrir/fermer la sidebar
setTheme(theme: 'light' | 'dark' | 'system')      // Définir le thème
setViewMode(mode: 'grid' | 'list')                 // Définir le mode d'affichage
setFilters(filters: Partial<UIState['filters']>)   // Définir les filtres
clearFilters()                                      // Effacer les filtres
```

## Utilisation

### Utilisation de base

```tsx
import { useCardStore } from '@/app/store'

function MyComponent() {
  // Récupérer le state et les actions
  const cards = useCardStore((state) => state.cards)
  const addCard = useCardStore((state) => state.addCard)
  const isLoading = useCardStore((state) => state.isLoading)

  return (
    <div>
      {isLoading && <div>Chargement...</div>}
      {cards.map(card => (
        <div key={card.id}>{card.title}</div>
      ))}
      <button onClick={() => addCard(newCard)}>Ajouter</button>
    </div>
  )
}
```

### Sélectionner plusieurs valeurs

```tsx
const { cards, isLoading, selectedCardId } = useCardStore((state) => ({
  cards: state.cards,
  isLoading: state.isLoading,
  selectedCardId: state.selectedCardId,
}))
```

### Utiliser toutes les actions

```tsx
const {
  setCards,
  addCard,
  removeCard,
  updateCard,
  selectCard,
  executeCardAction,
} = useCardStore()
```

### Utiliser plusieurs stores

```tsx
import { useCardStore } from '@/app/store/cardStore'
import { useUIStore } from '@/app/store/uiStore'

function MyComponent() {
  const cards = useCardStore((state) => state.cards)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  // ...
}
```

### Utiliser le hook combiné

```tsx
import { useAppStore } from '@/app/store'

function MyComponent() {
  const { cards, isLoading, sidebarOpen, theme } = useAppStore()
  // ...
}
```

## Exemples pratiques

### Charger des cartes

```tsx
import { useEffect } from 'react'
import { useCardStore } from '@/app/store'
import { Card } from '@/engine/card.types'

function Inbox() {
  const { setCards, setLoading, setError } = useCardStore()

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cards')
        const cards: Card[] = await response.json()
        setCards(cards)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [setCards, setLoading, setError])

  // ...
}
```

### Exécuter une action sur une carte

```tsx
import { useCardStore } from '@/app/store'
import { Action } from '@/engine/action.types'

function CardActions({ cardId }: { cardId: string }) {
  const executeCardAction = useCardStore(
    (state) => state.executeCardAction
  )

  const handleApprove = async () => {
    const action: Action = {
      id: 'approve',
      type: 'approve',
      label: 'Approuver',
    }

    const result = await executeCardAction(cardId, action)
    if (result.success) {
      console.log('Carte approuvée!')
    }
  }

  return <button onClick={handleApprove}>Approuver</button>
}
```

### Gérer le thème

```tsx
import { useUIStore } from '@/app/store/uiStore'

function ThemeToggle() {
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)

  return (
    <select
      value={theme}
      onChange={(e) =>
        setTheme(e.target.value as 'light' | 'dark' | 'system')
      }
    >
      <option value="light">Clair</option>
      <option value="dark">Sombre</option>
      <option value="system">Système</option>
    </select>
  )
}
```

## Bonnes pratiques

### 1. Sélectionner uniquement ce dont vous avez besoin

```tsx
// ✅ Bon : sélectionne uniquement ce qui est nécessaire
const cards = useCardStore((state) => state.cards)

// ⚠️ Moins optimal : sélectionne tout le store
const store = useCardStore()
```

### 2. Utiliser des sélecteurs pour éviter les re-renders

```tsx
// ✅ Bon : ne re-render que si cards change
const cards = useCardStore((state) => state.cards)

// ⚠️ Re-render à chaque changement du store
const { cards } = useCardStore()
```

### 3. Extraire les actions en dehors du composant si possible

```tsx
// ✅ Bon : action extraite
const addCard = useCardStore((state) => state.addCard)

// Utilisation
<button onClick={() => addCard(newCard)}>Ajouter</button>
```

### 4. Utiliser TypeScript pour la sécurité des types

```tsx
// Les types sont automatiquement inférés
const cards = useCardStore((state) => state.cards) // Type: Card[]
const addCard = useCardStore((state) => state.addCard) // Type: (card: Card) => void
```

## Persistance (optionnel)

Pour persister le store dans le localStorage :

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      // ... votre store
    }),
    {
      name: 'card-storage', // nom de la clé dans localStorage
    }
  )
)
```

## Ressources

- [Documentation Zustand](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

