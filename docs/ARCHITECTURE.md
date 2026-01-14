# Architecture de Dispatch

Ce document décrit l'architecture globale de l'application Dispatch, un système de gestion de décisions basé sur des cartes (cards).

## Vue d'ensemble

Dispatch est une application React/TypeScript qui permet de gérer des décisions sous forme de cartes empilées. L'architecture suit une approche modulaire avec séparation claire des responsabilités.

## Structure générale

```
src/
├── app/              # Configuration et setup de l'application
├── engine/           # Moteur de cartes (logique métier)
├── features/         # Features métier (calendar, notification, etc.)
├── pages/            # Pages de l'application
├── shared/           # Composants et utilitaires partagés
└── main.tsx          # Point d'entrée
```

## Flux d'exécution

### 1. Point d'entrée (`main.tsx`)

```typescript
main.tsx
  └─> Providers (app/providers.tsx)
      └─> RouterProvider (app/router.tsx)
```

Le point d'entrée initialise les providers et le routeur React.

### 2. Providers (`app/providers.tsx`)

Les providers sont organisés en couches :

```
ThemeProvider
  └─> InteractionProvider
      └─> DataProvider (avec CardRepository)
          └─> AppInitializer (charge les cartes)
              └─> RouterProvider
```

**Responsabilités :**
- **ThemeProvider** : Gestion du thème (couleurs, styles)
- **InteractionProvider** : Gestion du mode d'interaction (auto, desktop, mobile)
- **DataProvider** : Fournit le `CardRepository` via un contexte React
- **AppInitializer** : Utilise `useInitializeCards()` pour charger les cartes au démarrage

### 3. Initialisation des cartes

Le hook `useInitializeCards()` :
1. Récupère le repository depuis `DataProvider`
2. Appelle `cardStore.loadCards(repo)`
3. Les cartes sont chargées et stockées dans le Zustand store

**Repository Pattern :**
- **En développement** : `JsonCardRepository` (lit depuis `cards.mixed.json`)
- **En production** : `ApiCardRepository` (appelle l'API backend)

## Système de cartes

### Architecture en couches

```
┌─────────────────────────────────────────┐
│         Features (UI Layer)            │
│  (calendar, notification, etc.)         │
│  - CardRenderer (composant React)       │
│  - register.ts (enregistrement)        │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Engine (Business Logic Layer)      │
│  - CardFactory (configurations)         │
│  - CardRegistry (enregistrement)        │
│  - CardRepository (interface)           │
│  - Policies (actions, permissions)      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  - CardStore (Zustand)                  │
│  - Repositories (JsonCardRepository,    │
│                  ApiCardRepository)     │
└─────────────────────────────────────────┘
```

### 1. Types de base (`engine/cards/card.types.ts`)

```typescript
type Card<TPayload = unknown> = {
  id: string
  type: CardTypeId
  title: string
  payload: TPayload
  status: 'pending' | 'done' | 'skipped'
  priority?: 'low' | 'normal' | 'high'
  createdAt: Date
  updatedAt: Date
  connectors?: string[]
  actions?: UiAction[]  // Actions spécifiques du backend
}
```

### 2. Configuration (`engine/cards/cards.config.ts`)

Chaque type de carte a une configuration :

```typescript
type CardConfig<TPayload> = {
  type: CardTypeId
  connectors?: string[]
  actions?: (card: Card<TPayload>) => UiAction[]
}
```

### 3. CardFactory (`engine/cards/cardFactory.tsx`)

Singleton qui stocke toutes les configurations de cartes :

```typescript
cardFactory.register(config)  // Enregistre une config
cardFactory.getConfig(type)    // Récupère une config
```

### 4. Enregistrement des cartes

**Processus d'enregistrement :**

1. **Dans chaque feature** (ex: `features/calendar/register.ts`) :
   ```typescript
   registerCard(calendarConfig, CalendarCardRenderer)
   ```

2. **Fonction `registerCard()`** (`engine/cards/card.registry.ts`) :
   - Enregistre la config dans `CardFactory`
   - Enregistre le renderer dans `CardRenderers.registry`

3. **Point d'entrée** (`features/cards/RegisterAll.ts`) :
   ```typescript
   import '@/features/calendar/register'
   import '@/features/notification/register'
   ```
   Ce fichier est importé dans `main.tsx` et `providers.tsx` pour garantir l'enregistrement au démarrage.

### 5. Rendu des cartes

**Flux de rendu :**

```
CardStack
  └─> CardController
      └─> CardView
          └─> CardRendererRouter
              └─> getCardRendererFor(card.type)
                  └─> CalendarCardRenderer | NotificationCardRenderer | DefaultCardRenderer
```

**CardRendererRouter** (`features/cards/CardRendererRouter.tsx`) :
- Cherche le renderer spécifique pour le type de carte
- Si trouvé : utilise le renderer spécifique
- Sinon : utilise `DefaultCardRenderer` avec `CardShell`

### 6. Actions sur les cartes

**Politique d'actions** (`engine/policies/card.policy.ts`) :

1. **Actions du backend** : Si la carte a `card.actions`, elles sont utilisées
2. **Actions de la config** : Sinon, `config.actions(card)` est appelé
3. **Fusion** : Les actions du backend ont priorité en cas de conflit

**Types d'actions disponibles :**
- `approve`, `reject`, `defer`, `archive`, `schedule`, `read`, `mark-urgent`, `mark-done`, `ignore`, `custom`

**Actions rapides globales** :
- `quick-defer` (PLUS TARD)
- `quick-urgent` (URGENT)
- `quick-done` (FAIT)
- `quick-ignore` (IGNORER)

## Gestion d'état (Zustand)

### CardStore (`app/store/cardStore.ts`)

**État :**
```typescript
{
  cards: Card[]
  selectedCardId: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}
```

**Actions principales :**
- `loadCards(repo)` : Charge les cartes depuis le repository
- `markCardDone(id)` : Marque une carte comme faite et sélectionne la suivante
- `skipCard(id)` : Ignore une carte
- `updateCard(id, updates)` : Met à jour une carte
- `selectCard(id)` : Sélectionne une carte

**Méthodes calculées :**
- `totalCards()`, `doneCards()`, `pendingCards()`, `progressPercentage()`

## Routing

### Router (`app/router.tsx`)

Routes disponibles :
- `/` : Home (écran d'accueil avec compteur de décisions)
- `/decisions` : Page principale avec la pile de cartes
- `/dashboard` : Tableau de bord avec statistiques
- `/settings` : Paramètres
- `/login`, `/register` : Authentification

### AppLayout (`app/AppLayout.tsx`)

Layout principal avec :
- Transitions de page (framer-motion)
- Fond de couleur uniforme
- Gestion des animations d'entrée/sortie

## Features

### Structure d'une feature

Chaque feature (ex: `calendar`, `notification`) contient :

```
features/calendar/
├── calendar.card.config.ts    # Configuration de la carte
├── calendar.payload.ts         # Types TypeScript pour le payload
├── CalendarCardRenderer.tsx   # Composant React de rendu
└── register.ts                # Enregistrement (appelle registerCard)
```

**Exemple avec Calendar :**

1. **Config** (`calendar.card.config.ts`) :
   ```typescript
   export const calendarConfig: CardConfig<CalendarPayload> = {
     type: 'calendar',
     actions: (card) => [
       { id: 'accept', type: 'approve', label: 'Accepter' },
       { id: 'decline', type: 'reject', label: 'Refuser' }
     ]
   }
   ```

2. **Renderer** (`CalendarCardRenderer.tsx`) :
   ```typescript
   export function CalendarCardRenderer({ card, onAction }: CardRendererProps) {
     const payload = card.payload as CalendarPayload
     return <CardShell>...</CardShell>
   }
   ```

3. **Enregistrement** (`register.ts`) :
   ```typescript
   registerCard(calendarConfig, CalendarCardRenderer)
   ```

## Interactions

### InteractionProvider (`app/interaction/InteractionProvider.tsx`)

Gère le mode d'interaction :
- `auto` : Détection automatique (desktop/mobile)
- `desktop` : Mode desktop forcé
- `mobile` : Mode mobile forcé

**Utilisation :**
- `DesktopInteractions` : Swipe, clavier, etc. pour desktop
- `MobileInteractions` : Gestes tactiles pour mobile

## API Client

### Structure (`shared/api/`)

- **apiClient.ts** : Client HTTP centralisé (axios/fetch)
- **cards.api.ts** : Endpoints spécifiques aux cartes
- **settings.api.ts** : Endpoints pour les paramètres

**Pattern :**
- Les repositories utilisent l'API client
- Séparation claire entre couche API et couche repository

## Composants partagés

### UI Components (`shared/ui/`)

Composants réutilisables :
- `Button`, `ActionButton`, `QuickButton`
- `CardShell` : Enveloppe standard pour les cartes
- `SwipeToUnlock` : Composant de swipe
- `Avatar`, `DropdownMenu`, `Popover`

### Hooks (`shared/hooks/`)

- `useSwipe` : Gestion des gestes de swipe
- `useKeyboard` : Gestion des raccourcis clavier
- `useHaptics` : Retour haptique (mobile)

## Animations

### CardStack (`features/cards/CardStack.tsx`)

Gère l'affichage empilé des cartes avec :
- Animations d'entrée/sortie (framer-motion)
- Gestion des cartes visibles (max 3)
- Transitions fluides entre les cartes
- Indicateur de cartes restantes

**Propriétés d'animation :**
- Scale, opacity, blur pour l'effet de profondeur
- Directions de sortie (gauche, droite, bas) selon l'action
- Animations spring pour un rendu naturel

## Bonnes pratiques

### 1. Séparation des responsabilités

- **Engine** : Logique métier pure (pas de React)
- **Features** : Composants UI et configurations spécifiques
- **Shared** : Code réutilisable

### 2. Type Safety

- Types TypeScript stricts partout
- Payloads typés pour chaque type de carte
- Pas de `any` sauf cas exceptionnels documentés

### 3. Enregistrement centralisé

- Tous les enregistrements passent par `registerCard()`
- Point d'entrée unique : `RegisterAll.ts`
- Garantit la cohérence config/renderer

### 4. Repository Pattern

- Interface `CardRepository` pour l'abstraction
- Implémentations séparées (JSON/API)
- Facilite les tests et le développement

### 5. Store centralisé

- Zustand pour la gestion d'état globale
- Actions typées et prévisibles
- Pas de prop drilling

## Questions de réflexion

1. **Extensibilité** : Comment ajouter facilement un nouveau type de carte ?
   - Réponse : Créer une feature avec config + renderer + register.ts

2. **Testabilité** : Comment tester les cartes isolément ?
   - Réponse : Utiliser les repositories mockés et les composants isolés

3. **Performance** : Comment optimiser le rendu de nombreuses cartes ?
   - Réponse : Limitation à 3 cartes visibles, virtualisation possible

4. **Maintenabilité** : Comment éviter la duplication de code entre features ?
   - Réponse : Composants partagés (CardShell, CardView), hooks réutilisables

## Évolutions possibles

- **Persistence** : Sauvegarde locale des actions utilisateur
- **Offline** : Mode hors ligne avec synchronisation
- **Plugins** : Système de plugins pour étendre les fonctionnalités
- **Analytics** : Tracking des actions et métriques
- **Multi-tenant** : Support de plusieurs utilisateurs/organisations
