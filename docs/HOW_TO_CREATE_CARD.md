# Guide : Comment créer un nouveau type de card

Ce guide vous explique comment créer un nouveau type de card avec son propre visuel et ses actions.

## 📋 Étapes

### 1. Définir le payload dans `engine/card.payloads.ts`

```typescript
export interface MonNouveauTypePayload {
  // Vos propriétés spécifiques
  title: string
  customField: string
  // Header info (optionnel)
  sender?: {
    name: string
    role?: string
    initials: string
    avatar?: string
  }
  source?: {
    type: 'gmail' | 'linkedin' | 'direct' | 'calendar' | 'custom'
    label: string
  }
  // ...
}
```

N'oubliez pas d'ajouter le payload à l'union type :

```typescript
export type CardPayload =
  | CalendarPayload
  | NotificationPayload
  | MonNouveauTypePayload
  | Record<string, unknown>
```

### 2. Ajouter le type dans `engine/card.types.ts`

```typescript
export type CardType = 'calendar' | 'notification' | 'mon-nouveau-type'
```

### 3. Définir les actions dans `engine/policies/card.policy.ts`

Ajoutez votre type dans `defaultActions` :

```typescript
const defaultActions: Record<Card['type'], Action[]> = {
  calendar: [
    /* ... */
  ],
  notification: [
    /* ... */
  ],
  'mon-nouveau-type': [
    {
      id: 'action-1',
      type: 'approve',
      label: 'Action 1',
      requiresConfirmation: false,
    },
    // ...
  ],
}
```

### 4. Créer le renderer dans `features/cards/cardRenderers.tsx`

```typescript
export function MonNouveauTypeRenderer({
  payload,
  card,
  onAction,
}: {
  payload: MonNouveauTypePayload
  card: Card
  onAction?: (actionId: string) => void
}) {
  return (
    <div className="w-full min-h-[400px] max-h-[600px] h-[60vh] sm:h-[500px] md:h-[550px] rounded-2xl sm:rounded-4xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col">
      {/* Header optionnel avec CardHeader */}
      {payload.sender ? (
        <CardHeader
          avatar={{ initials: payload.sender.initials }}
          name={payload.sender.name}
          role={payload.sender.role}
          source={payload.source ? { type: payload.source.type, label: payload.source.label } : undefined}
        />
      ) : (
        <div className="p-4 sm:p-6 border-b border-border">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {payload.title}
          </h2>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Votre design personnalisé */}
        <p>{payload.customField}</p>
      </div>

      {/* Actions principales à l'intérieur de la card */}
      <div className="p-3 sm:p-4 border-t border-border">
        <CardActions actions={getAvailableActions(card)} onAction={onAction} />
      </div>
    </div>
  )
}
```

### 5. Ajouter le renderer dans `features/cards/cardRendererRouter.tsx`

```typescript
import { MonNouveauTypePayload } from '@/engine/card.payloads'
import { MonNouveauTypeRenderer } from './cardRenderers'

// Dans getCardRenderer()
case 'mon-nouveau-type':
  return (
    <MonNouveauTypeRenderer
      payload={card.payload as MonNouveauTypePayload}
      card={card}
      onAction={onAction}
    />
  )
```

### 6. Créer des cards de ce type

```typescript
const maCard: Card = {
  id: 'card-1',
  type: 'mon-nouveau-type',
  payload: {
    title: 'Ma card',
    customField: 'valeur',
    // Optionnel : header info
    sender: {
      name: 'John Doe',
      role: 'CEO',
      initials: 'JD',
    },
    source: {
      type: 'gmail',
      label: 'Gmail',
    },
  },
  // Optionnel : actions spécifiques à cette card
  // Sinon, les actions viennent de la policy (getAvailableActions)
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## ✅ Règles à respecter

- ❌ Pas de logique métier dans les renderers
- ❌ Pas d'API calls dans CardView
- ❌ Pas de conditions device dans le moteur
- ✅ Payload typé pour la sécurité
- ✅ Actions définies dans la policy
- ✅ Renderer pur (juste affichage)
- ✅ Utiliser `CardHeader` pour les headers avec sender/source
- ✅ Utiliser `CardActions` pour afficher les actions dans la card
- ✅ Cards responsive (hauteurs adaptatives)

## 🎯 Exemple complet

Voir les types `calendar` et `notification` dans le code pour des exemples complets.
