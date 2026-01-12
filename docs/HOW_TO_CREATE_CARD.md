# Guide : Comment créer une nouvelle carte

Ce guide détaille le processus complet pour créer un nouveau type de carte dans l'application Dispatch. Le système est modulaire et suit une architecture claire séparant les responsabilités.

## 📚 Architecture du système de cartes

Le système de cartes repose sur **4 composants principaux** :

1. **Payload Type** : Définit la structure des données spécifiques à votre carte
2. **Blueprint** : Définit comment créer des cartes de ce type (factory pattern)
3. **Renderer** : Composant React qui affiche la carte
4. **Registration** : Fichier qui enregistre la carte dans les systèmes

## 📁 Structure des fichiers

Pour créer une nouvelle carte de type `ma-carte`, créez un dossier dans `src/features/ma-carte/` avec les fichiers suivants :

```
src/features/ma-carte/
├── ma-carte.payload.ts          # Type TypeScript pour le payload
├── ma-carte.card.blueprint.ts   # Définition du blueprint (factory)
├── MaCarteRenderer.tsx          # Composant React pour le rendu
└── register.ts                  # Enregistrement de la carte
```

---

## 🔧 Étapes détaillées

### Étape 1 : Définir le Payload Type

**Fichier** : `src/features/ma-carte/ma-carte.payload.ts`

Le payload définit la structure des données spécifiques à votre type de carte. Il étend les propriétés communes disponibles à toutes les cartes.

```typescript
export interface MaCartePayload {
  // Propriétés spécifiques à votre carte
  title: string
  description?: string
  customField: string

  // Propriétés communes optionnelles pour le header
  severity?: 'info' | 'warning' | 'error' | 'success'
  context?: { message: string }

  // Informations de l'expéditeur (optionnel)
  sender?: {
    name: string
    role?: string
    initials: string
    avatar?: string
  }

  // Source de la carte (optionnel)
  source?: {
    type: 'gmail' | 'linkedin' | 'direct' | 'calendar' | 'custom' | 'slack'
    label: string
  }

  // Timestamp personnalisé (optionnel)
  timestamp?: Date
}
```

**Exemple concret** (basé sur `calendar.payload.ts`) :

```typescript
export interface CalendarPayload {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  severity?: 'info' | 'warning' | 'error' | 'success'
  context?: { message: string }
  location?: string
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
}
```

**Note** : Le payload est automatiquement typé dans le renderer grâce à TypeScript. Vous n'avez pas besoin de l'ajouter à une union type manuellement.

---

### Étape 2 : Créer le Blueprint

**Fichier** : `src/features/ma-carte/ma-carte.card.blueprint.ts`

Le blueprint définit comment votre type de carte est créé. Il utilise le pattern Factory pour générer des cartes de manière cohérente, notamment pour les données de test/mock.

```typescript
import type { CardBlueprint } from '@/engine/cards/cards.blueprint'
import type { UiAction } from '@/engine/policies/card.policy'

// Type pour les données nécessaires à la génération du payload
export type MaCarteMockPayload = {
  title: string
  customField: string
  // ... autres propriétés nécessaires pour générer le payload
}

export const maCarteBlueprint: CardBlueprint<MaCarteMockPayload> = {
  // Identifiant unique du type de carte
  type: 'ma-carte',

  // Connecteurs possibles/requis pour ce type de carte
  connectors: ['gmail', 'slack'], // optionnel

  // Valeurs par défaut pour les propriétés de base de la carte
  defaults: (seed: number) => ({
    title: `Ma carte ${seed % 1000}`, // Utilisez le seed pour varier
    priority: 'normal', // 'low' | 'normal' | 'high'
  }),

  // Factory pour générer le payload typé
  payloadFactory: (seed: number) => {
    // Utilisez le seed pour générer des données variées
    return {
      title: `Ma carte ${seed % 1000}`,
      customField: `Valeur ${seed}`,
      // ... générez d'autres propriétés selon vos besoins
    }
  },

  // Actions spécifiques à ce type de carte (optionnel)
  actions: () => [
    {
      id: 'action-approve',
      type: 'approve',
      label: 'Approuver',
      requiresConfirmation: false,
    },
    {
      id: 'action-reject',
      type: 'reject',
      label: 'Rejeter',
      requiresConfirmation: true,
    },
  ],
}
```

**Exemple concret** (basé sur `calendar.card.blueprint.ts`) :

```typescript
export type CalendarMockPayload = {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
}

export const calendarBlueprint: CardBlueprint<CalendarMockPayload> = {
  type: 'calendar',
  connectors: ['google_calendar', 'gmail'],
  defaults: seed => ({
    title: `Rendez-vous ${seed % 1000}`,
    priority: 'normal',
  }),
  payloadFactory: seed => {
    const start = new Date(seed + 24 * 60 * 60 * 1000)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    return {
      title: `Rendez-vous ${seed % 1000}`,
      description: 'Ce rendez-vous nécessite votre attention...',
      startDate: start,
      endDate: end,
      location: ['Paris', 'Lyon', 'Marseille'][seed % 3],
    }
  },
}
```

**Points importants** :

- Le `seed` est un nombre unique utilisé pour générer des variations
- Utilisez le seed de manière créative (modulo, arrays, dates, etc.)
- Le `type` doit correspondre à l'identifiant que vous utiliserez partout

---

### Étape 3 : Créer le Renderer

**Fichier** : `src/features/ma-carte/MaCarteRenderer.tsx`

Le renderer est le composant React responsable de l'affichage visuel de votre carte. Il doit être un composant pur (pas de logique métier, pas d'appels API).

```typescript
import type { Card } from '@/engine/cards/card.types'
import type { MaCartePayload } from './ma-carte.payload'
import { CardHeader } from '@/features/cards/CardHeader'
import { CardShell } from '@/features/cards/CardShell'
import ContextBubble from '@/shared/ui/ContextBubble'

export function MaCarteRenderer({
    card,
    onAction,
}: {
    card: Card
    onAction?: (actionId: string) => void
}) {
    // Type assertion sécurisée - le payload est typé selon votre interface
    const payload = card.payload as MaCartePayload

    // Header optionnel avec informations de l'expéditeur
    const header = payload.sender ? (
        <CardHeader
            avatar={{
                initials: payload.sender.initials,
                image: payload.sender.avatar
            }}
            name={payload.sender.name}
            role={payload.sender.role}
            source={payload.source ? {
                type: payload.source.type,
                label: payload.source.label
            } : undefined}
            timestamp={payload.timestamp}
            showTopBorder={false} // true pour afficher une bordure en haut
        />
    ) : undefined

    return (
        <CardShell card={card} header={header} onAction={onAction}>
            {/* ContextBubble pour afficher des messages contextuels */}
            {payload.context && (
                <ContextBubble
                    severity={payload.severity}
                    message={payload.context.message}
                />
            )}

            {/* Contenu principal de votre carte */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {payload.title}
            </h2>

            {payload.description && (
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    {payload.description}
                </p>
            )}

            {/* Votre contenu personnalisé */}
            <div className="mt-4">
                <p className="text-foreground/60">{payload.customField}</p>
            </div>
        </CardShell>
    )
}
```

**Composants disponibles** :

1. **`CardShell`** : Enveloppe principale de la carte
   - Gère automatiquement le layout, les actions, le responsive
   - Accepte `header`, `children`, et `onAction`
   - Propriété `footerClassName` pour personnaliser le footer

2. **`CardHeader`** : Header réutilisable avec avatar, nom, source
   - Affiche automatiquement les icônes selon le type de source
   - Supporte `showTopBorder` pour une bordure colorée en haut
   - Gère le timestamp et les actions (voir, paramètres)

3. **`ContextBubble`** : Bulle contextuelle pour messages importants
   - Supporte différents niveaux de sévérité (`severity`)
   - Affiche un message optionnel

**Exemple concret** (basé sur `CalendarCardRenderer.tsx`) :

```typescript
export function CalendarCardRenderer({
    card,
    onAction,
}: {
    card: Card
    onAction?: (actionId: string) => void
}) {
    const payload = card.payload as CalendarPayload

    const header = payload.sender ? (
        <CardHeader
            avatar={{ initials: payload.sender.initials, image: payload.sender.avatar }}
            name={payload.sender.name}
            role={payload.sender.role}
            source={payload.source ? { type: payload.source.type, label: payload.source.label } : undefined}
            timestamp={payload.startDate}
            showTopBorder={false}
        />
    ) : undefined

    return (
        <CardShell card={card} header={header} onAction={onAction}>
            <ContextBubble severity={payload.severity} message={payload.context?.message} />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {payload.title}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {payload.description}
            </p>
        </CardShell>
    )
}
```

**Bonnes pratiques pour le renderer** :

- ✅ Utiliser `CardShell` pour la structure de base
- ✅ Utiliser `CardHeader` si vous avez un expéditeur
- ✅ Utiliser `ContextBubble` pour les messages contextuels
- ✅ Utiliser les classes Tailwind responsives (`sm:`, `md:`)
- ✅ Utiliser les tokens de couleur du thème (`text-foreground`, `text-foreground/80`, etc.)
- ❌ Pas de logique métier dans le renderer
- ❌ Pas d'appels API ou de hooks de données
- ❌ Pas de conditions spécifiques aux devices (mobile/desktop)

---

### Étape 4 : Enregistrer la carte

**Fichier** : `src/features/ma-carte/register.ts`

Ce fichier enregistre votre carte dans les deux systèmes en une seule opération :

1. Le registre métier (pour la création de cartes)
2. Le registre UI (pour le rendu)

```typescript
import { registerCard } from '@/engine/cards/card.registry'

import { maCarteBlueprint } from './ma-carte.card.blueprint'
import { MaCarteRenderer } from './MaCarteRenderer'

// Enregistrement unifié : blueprint + renderer
registerCard(maCarteBlueprint, MaCarteRenderer)

export {}
```

**Avantages du helper `registerCard()`** :

- ✅ Plus simple : une seule fonction au lieu de deux
- ✅ Type-safe : le type est automatiquement extrait du blueprint
- ✅ Impossible d'oublier un enregistrement
- ✅ Garantit la cohérence entre blueprint et renderer

**Important** : L'export vide `export { }` est nécessaire pour que TypeScript traite ce fichier comme un module et exécute le code d'enregistrement.

---

### Étape 5 : Importer le fichier register dans l'application

**Fichier** : `src/app/providers.tsx`

Ajoutez l'import de votre fichier `register.ts` au début du fichier pour que l'enregistrement soit exécuté au démarrage de l'application.

```typescript
import '@/features/notification/register'
import '@/features/calendar/register'
import '@/features/ma-carte/register' // ← Ajoutez votre ligne ici

// ... reste du fichier
```

**Note** : L'import avec `@/` est important car il garantit que le code est exécuté, même si le module n'exporte rien directement.

---

### Étape 6 : Définir des actions spécifiques (Optionnel)

**Fichier** : `src/features/ma-carte/ma-carte.card.blueprint.ts`

Les actions spécifiques à votre type de carte sont maintenant définies directement dans le blueprint pour une meilleure co-location.

```typescript
// Dans votre blueprint
export const maCarteBlueprint: CardBlueprint<MaCarteMockPayload> = {
  // ... autres propriétés

  actions: () => [
    {
      id: 'action-approve',
      type: 'approve',
      label: 'Approuver',
      requiresConfirmation: false,
    },
    {
      id: 'action-reject',
      type: 'reject',
      label: 'Rejeter',
      requiresConfirmation: true,
    },
  ],
}
```

**Avantages** :

- ✅ Actions co-localisées avec la définition de la carte
- ✅ Actions peuvent être dynamiques selon la carte (fonction au lieu d'un tableau statique)
- ✅ Plus facile à maintenir : tout est au même endroit

Les actions sont automatiquement récupérées par `getAvailableActions()` et affichées dans le footer de la carte via `CardShell` qui utilise `CardActions`.

**Note** : Si vous ne définissez pas d'actions, un tableau vide sera retourné par défaut.

---

## 🎨 Personnalisation avancée

### Ajouter un type de carte dans CardTypeId

Si vous voulez avoir une meilleure autocomplétion TypeScript, vous pouvez ajouter votre type dans `src/engine/cards/card.types.ts` :

```typescript
export type CardTypeId =
  | 'calendar'
  | 'notification'
  | 'ma-carte'
  | (string & {})
```

Cependant, ce n'est pas strictement nécessaire car le type `string & {}` permet n'importe quelle chaîne.

### Utiliser le CardFactory

Si vous utilisez le `CardFactory` pour créer des cartes (dans les tests ou les mocks), ajoutez votre blueprint dans `src/engine/cards/factory.ts` :

```typescript
import { maCarteBlueprint } from '@/features/ma-carte/ma-carte.card.blueprint'

export const cardFactory = new CardFactory()
  .register(calendarBlueprint)
  .register(notificationBlueprint)
  .register(maCarteBlueprint) // ← Ajoutez votre blueprint
```

---

## ✅ Checklist de création

Avant de considérer votre carte comme terminée, vérifiez :

- [ ] **Payload Type** : Interface TypeScript définie avec toutes les propriétés nécessaires
- [ ] **Blueprint** : Factory définie avec `type`, `defaults`, et `payloadFactory`
- [ ] **Renderer** : Composant React créé utilisant `CardShell` et les composants réutilisables
- [ ] **Registration** : Fichier `register.ts` créé avec `registerCard()`
- [ ] **Import** : Fichier `register.ts` importé dans `providers.tsx`
- [ ] **Actions** (optionnel) : Actions spécifiques définies dans le blueprint
- [ ] **Test visuel** : Vérifier que la carte s'affiche correctement dans l'application

---

## 🎯 Exemples de référence

Pour voir des exemples complets et fonctionnels, consultez :

- **Calendar** : `src/features/calendar/`
  - Payload avec dates et localisation
  - Blueprint avec génération de dates
  - Renderer avec header optionnel

- **Notification** : `src/features/notification/`
  - Payload simple avec message
  - Blueprint minimal
  - Renderer avec ContextBubble

---

## 🚫 Règles à respecter

### ❌ Ne PAS faire

- ❌ Mettre de la logique métier dans les renderers
- ❌ Faire des appels API dans `CardView` ou les renderers
- ❌ Ajouter des conditions spécifiques aux devices dans le moteur
- ❌ Créer des composants de carte sans utiliser `CardShell`
- ❌ Dupliquer la logique de header au lieu d'utiliser `CardHeader`
- ❌ Utiliser `registerCardType()` et `registerCardRenderer()` séparément (utilisez `registerCard()`)

### ✅ Faire

- ✅ Utiliser des payloads typés pour la sécurité TypeScript
- ✅ Définir les actions dans le blueprint (co-location)
- ✅ Utiliser `registerCard()` pour simplifier l'enregistrement
- ✅ Créer des renderers purs (juste affichage)
- ✅ Utiliser `CardHeader` pour les headers avec sender/source
- ✅ Utiliser `CardShell` pour la structure de base
- ✅ Utiliser `CardActions` pour afficher les actions
- ✅ Créer des cartes responsives avec les classes Tailwind adaptatives
- ✅ Utiliser les tokens de couleur du thème (`foreground`, `muted-foreground`, etc.)

---

## 💡 Questions pour réfléchir

Avant de créer une nouvelle carte, posez-vous ces questions :

1. **Quelles sont les données spécifiques nécessaires ?** → Définissez votre payload
2. **D'où vient cette carte ?** → Ajoutez `source` dans le payload
3. **Qui envoie cette carte ?** → Ajoutez `sender` dans le payload
4. **Quelles actions sont disponibles ?** → Définissez-les dans `card.policy.ts`
5. **Y a-t-il un message contextuel important ?** → Utilisez `ContextBubble`
6. **La carte doit-elle être générée automatiquement ?** → Configurez le blueprint

---

## 📝 Résumé rapide

Pour créer rapidement une nouvelle carte :

1. Créez le dossier `src/features/ma-carte/`
2. Définissez `ma-carte.payload.ts` avec votre interface
3. Créez `ma-carte.card.blueprint.ts` avec la factory et les actions (optionnel)
4. Implémentez `MaCarteRenderer.tsx` avec `CardShell`
5. Ajoutez `register.ts` avec `registerCard()`
6. Importez `register.ts` dans `providers.tsx`

Et voilà ! Votre nouvelle carte est prête à être utilisée. 🎉

**Exemple minimal complet** :

```typescript
// register.ts
import { registerCard } from '@/engine/cards/card.registry'
import { maCarteBlueprint } from './ma-carte.card.blueprint'
import { MaCarteRenderer } from './MaCarteRenderer'

registerCard(maCarteBlueprint, MaCarteRenderer)
```
