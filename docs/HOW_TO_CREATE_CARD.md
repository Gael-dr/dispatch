# Guide : Comment créer une nouvelle carte

Ce guide détaille le processus complet pour créer un nouveau type de carte dans l'application Dispatch. Le système est modulaire et suit une architecture claire séparant les responsabilités.

## 📚 Architecture du système de cartes

Le système de cartes repose sur **4 composants principaux** :

1. **Payload Type** : Définit la structure des données spécifiques à votre carte
2. **Config** : Définit la configuration du type de carte (actions, connecteurs)
3. **Renderer** : Composant React qui affiche la carte
4. **Registration** : Fichier qui enregistre la carte dans les systèmes

## 📁 Structure des fichiers

Pour créer une nouvelle carte de type `ma-carte`, créez un dossier dans `src/features/ma-carte/` avec les fichiers suivants :

```
src/features/ma-carte/
├── ma-carte.payload.ts          # Type TypeScript pour le payload
├── ma-carte.card.config.ts      # Configuration du type de carte
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

### Étape 2 : Créer la Config

**Fichier** : `src/features/ma-carte/ma-carte.card.config.ts`

La config définit la configuration de votre type de carte pour la production. Elle contient les actions disponibles et les connecteurs possibles.

**⚠️ Important** : En production, **toutes les données proviennent du backend**. La config est utilisée pour :

- Définir les actions disponibles pour ce type de carte
- Spécifier les connecteurs possibles (utilisés comme fallback si non fournis par le backend)

Les mocks sont gérés séparément via les fixtures JSON dans `src/app/store/fixtures/`.

```typescript
import type { CardConfig } from '@/engine/cards/cards.config'
import type { UiAction } from '@/engine/policies/card.policy'
import type { MaCartePayload } from './ma-carte.payload'

export const maCarteConfig: CardConfig<MaCartePayload> = {
  // Identifiant unique du type de carte
  type: 'ma-carte',

  // Connecteurs possibles/requis pour ce type de carte (optionnel)
  connectors: ['gmail', 'slack'],

  // Actions spécifiques à ce type de carte (optionnel)
  // La fonction reçoit la carte en paramètre pour des actions dynamiques
  actions: (card) => [
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

**Exemple concret** (basé sur `calendar.card.config.ts`) :

```typescript
import type { CardConfig } from '@/engine/cards/cards.config'
import type { CalendarPayload } from './calendar.payload'

export const calendarConfig: CardConfig<CalendarPayload> = {
  type: 'calendar',
  connectors: ['google_calendar', 'gmail'],
  actions: () => [
    {
      id: 'accept',
      type: 'approve',
      label: 'Accepter',
      icon: 'Check',
      requiresConfirmation: false,
    },
    {
      id: 'reject',
      type: 'reject',
      label: 'Refuser',
      icon: 'X',
      requiresConfirmation: false,
    },
  ],
}
```

**Points importants** :

- Le `type` doit correspondre à l'identifiant que vous utiliserez partout
- Les actions peuvent être dynamiques en fonction de la carte (fonction au lieu d'un tableau)
- Les connecteurs sont utilisés comme fallback si non fournis par le backend

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

1. <b>`CardShell`</b> : Enveloppe principale de la carte
   - Gère automatiquement le layout, les actions, le responsive
   - Accepte `header`, `children`, et `onAction`
   - Propriété `footerClassName` pour personnaliser le footer
2. <b>`CardHeader`</b> : Header réutilisable avec avatar, nom, source
   - Affiche automatiquement les icônes selon le type de source
   - Supporte `showTopBorder` pour une bordure colorée en haut
   - Gère le timestamp et les actions (voir, paramètres)
3. <b>`ContextBubble`</b> : Bulle contextuelle pour messages importants
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

1. Le registre métier (pour la configuration)
2. Le registre UI (pour le rendu)

```typescript
import { registerCard } from '@/engine/cards/card.registry'

import { maCarteConfig } from './ma-carte.card.config'
import { MaCarteRenderer } from './MaCarteRenderer'

// Enregistrement unifié : config + renderer
registerCard(maCarteConfig, MaCarteRenderer)
```

<b>Avantages du helper `registerCard()`</b> :

- ✅ Plus simple : une seule fonction au lieu de deux
- ✅ Type-safe : le type est automatiquement extrait de la config
- ✅ Impossible d'oublier un enregistrement
- ✅ Garantit la cohérence entre config et renderer


---

### Étape 5 : Importer le fichier register dans l'application

**Fichier** : `engine/cards/RegisterAll.ts`

Ajoutez l'import de votre fichier `register.ts` dans le fichier pour que l'enregistrement soit exécuté au démarrage de l'application.

```typescript
import '@/features/notification/register'
import '@/features/calendar/register'
import '@/features/ma-carte/register' // ← Ajoutez votre ligne ici

```

**Note** : L'import avec `@/` est important car il garantit que le code est exécuté, même si le module n'exporte rien directement.

---

### Étape 6 : Définir des actions spécifiques (Optionnel)

**Fichier** : `src/features/ma-carte/ma-carte.card.config.ts`

Les actions spécifiques à votre type de carte sont définies directement dans la config pour une meilleure co-location.

```typescript
// Dans votre config
export const maCarteConfig: CardConfig<MaCartePayload> = {
  // ... autres propriétés

  // La fonction reçoit la carte en paramètre pour des actions dynamiques
  actions: (card) => [
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

Les actions sont automatiquement récupérées par `getAvailableActions(card)` qui :
1. Récupère la config pour le type de carte
2. Appelle `config.actions(card)` si défini
3. Retourne les actions (ou un tableau vide si aucune action n'est définie)

Les actions sont ensuite affichées dans le footer de la carte via `CardShell` qui utilise `CardActions`.

**Note** : Si vous ne définissez pas d'actions dans la config, un tableau vide sera retourné par défaut.

### Actions dynamiques depuis la Config

**Les actions sont définies dans la config** via une fonction qui reçoit la carte en paramètre :

```typescript
actions?: (card: Card<TPayload>) => UiAction[]
```

Cette approche permet de définir des **actions dynamiques** basées sur l'état de la carte (statut, priorité, payload, etc.).

#### Scénarios d'utilisation

**Scénario 1 : Actions statiques**

```typescript
// Actions toujours disponibles pour ce type de carte
config.actions = (card) => [
  { id: 'accept', type: 'approve', label: 'Accepter' },
  { id: 'reject', type: 'reject', label: 'Refuser' }
]
```

**Scénario 2 : Actions conditionnelles**

```typescript
// Actions selon le statut de la carte
config.actions = (card) => {
  if (card.status === 'pending') {
    return [
      { id: 'accept', type: 'approve', label: 'Accepter' },
      { id: 'reject', type: 'reject', label: 'Refuser' }
    ]
  }
  return []  // Pas d'actions si déjà traitée
}
```

**Scénario 3 : Actions dynamiques depuis la config**

```typescript
// La config définit des actions dynamiques basées sur la carte
config.actions = (card) => {
  const actions = []
  
  if (card.status === 'pending') {
    actions.push({ id: 'accept', type: 'approve', label: 'Accepter' })
    actions.push({ id: 'reject', type: 'reject', label: 'Refuser' })
  }
  
  if (card.priority === 'high') {
    actions.push({ id: 'defer', type: 'defer', label: 'Reporter' })
  }
  
  return actions
}
// → Résultat: Actions conditionnelles selon l'état de la carte
```

**Note** : Actuellement, les actions du backend ne sont pas directement supportées dans le DTO. Les actions sont définies uniquement dans les configs. Si vous avez besoin d'actions spécifiques par carte depuis le backend, vous devrez étendre le système.

**Scénario 4 : Actions basées sur le payload**

```typescript
// Actions selon les données du payload
config.actions = (card) => {
  const payload = card.payload as MaCartePayload
  
  const actions = []
  
  if (payload.severity === 'error') {
    actions.push({ id: 'urgent', type: 'mark-urgent', label: 'Marquer urgent' })
  }
  
  if (payload.customField === 'approvable') {
    actions.push({ id: 'approve', type: 'approve', label: 'Approuver' })
  }
  
  return actions
}
```

#### Avantages de cette approche

- ✅ **Flexibilité** : Actions dynamiques basées sur l'état de la carte
- ✅ **Maintenabilité** : Toutes les actions sont définies dans la config (co-location)
- ✅ **Type-safe** : Le payload est typé dans la fonction `actions(card)`
- ✅ **Pas de duplication** : Les actions sont définies une seule fois dans la config

---

## 🔌 Intégration avec le Backend

En production, **toutes les données des cartes proviennent du backend** via l'API. Le système utilise un **pattern Repository** pour abstraire la source de données.

Le flux de données est le suivant :

```
Repository (API/JSON) → Transformation → Card → Store → Renderer
```

### Architecture Repository

Le système utilise une interface `CardRepository` pour abstraire la source de données :

```typescript
export interface CardRepository {
  list(): Promise<Card[]>
}
```

Deux implémentations sont disponibles :

1. **`ApiCardRepository`** : Charge les cartes depuis l'API backend (production)
2. **`JsonCardRepository`** : Charge les cartes depuis un fichier JSON (développement)

### Utiliser les données du backend

**Les cartes sont chargées automatiquement au démarrage de l'application** via le hook `useInitializeCards()` dans les `Providers`. Vous n'avez **pas besoin** de charger les cartes manuellement dans vos composants.

Le flux est le suivant :

```
Démarrage App → Providers → DataProvider → useInitializeCards() → Store.loadCards(repo) → Repository → Store
```

#### Fonctionnement automatique

1. **Au démarrage** : Le `Providers` crée le repository approprié selon l'environnement :
   - **Développement** (`import.meta.env.DEV`) : `JsonCardRepository` (fichier JSON)
   - **Production** : `ApiCardRepository` (API backend)
2. **DataProvider** : Le repository est fourni via un contexte React (`DataProvider`)
3. **Initialisation** : Le hook `useInitializeCards()` récupère le repository depuis le contexte et appelle `loadCards(repo)`
4. **Chargement** : Le store appelle `repo.list()` pour charger les cartes
5. **Transformation** : Les données sont transformées en Cards via `dtoToCard()` (normalisation des dates)
6. **Stockage** : Les cartes sont stockées dans le store Zustand

#### Accéder aux cartes dans vos composants

```typescript
import { useCardStore } from '@/app/store/cardStore'

function MyComponent() {
  // Les cartes sont déjà chargées au démarrage
  const cards = useCardStore(state => state.cards)
  const isLoading = useCardStore(state => state.isLoading)
  const error = useCardStore(state => state.error)

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return <div>{cards.length} cartes chargées</div>
}
```

#### Accéder au repository (si nécessaire)

Si vous avez besoin d'accéder directement au repository (par exemple pour des opérations personnalisées), utilisez le hook `useCardRepo()` :

```typescript
import { useCardRepo } from '@/app/data/DataProvider'

function MyComponent() {
  const repo = useCardRepo()
  
  // Le repository est disponible pour des opérations personnalisées
  // Par exemple : repo.list(), repo.markDone(id), etc.
}
```

### Format des données API

Le backend doit renvoyer des données au format `CardDTO` suivant :

```typescript
// Format attendu par l'API (CardDTO)
{
  "id": "card_123",
  "type": "calendar",
  "title": "Rendez-vous client",  // Optionnel, peut être extrait du payload
  "status": "pending",
  "priority": "high",  // Optionnel
  "createdAt": "2024-01-15T10:30:00.000Z",  // ISO string
  "updatedAt": "2024-01-15T10:30:00.000Z",  // ISO string
  "connectors": ["google_calendar", "gmail"],  // Optionnel
  "payload": {
    "title": "Rendez-vous client",
    "description": "Discussion projet",
    "startDate": "2024-01-20T14:00:00.000Z",  // ISO string (sera convertie en Date)
    "endDate": "2024-01-20T15:00:00.000Z",    // ISO string (sera convertie en Date)
    "location": "Paris",
    "severity": "warning",
    "sender": {
      "name": "Jean Dupont",
      "role": "Directeur",
      "initials": "JD",
      "avatar": "https://..."
    },
    "source": {
      "type": "gmail",
      "label": "Gmail"
    }
  }
}
```

**Points importants** :

- Les dates dans le payload sont des **strings ISO** et seront automatiquement converties en objets `Date` par `dtoToCard()`
- Le `title` au niveau racine est **optionnel** : s'il est absent, il sera extrait du `payload.title` si disponible
- Le `payload` doit correspondre au type défini dans votre `ma-carte.payload.ts`
- Le `type` doit correspondre à une config enregistrée (via `register.ts`)
- Les `actions` ne sont **pas** dans le DTO : elles sont définies uniquement dans la config ou peuvent être ajoutées dynamiquement
- La transformation `dtoToCard()` normalise les dates de manière spécifique selon le type de carte (voir `cards.dto.ts`)

### Architecture du chargement

Le chargement des cartes est centralisé dans le store et utilise le pattern Repository :

**Fichier** : `src/app/store/cardStore.ts`

```typescript
export const useCardStore = create<CardState>((set, get) => ({
  // ... autres propriétés

  loadCards: async (repo: CardRepository) => {
    // Évite de recharger si déjà initialisé
    if (get().isInitialized) return

    set({ isLoading: true, error: null })
    try {
      // Charge depuis le repository (API ou JSON selon l'environnement)
      const cards = await repo.list()
      set({ cards, isInitialized: true, isLoading: false })
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  },
}))
```

**Fichier** : `src/app/providers.tsx`

```typescript
export function Providers({ children }: ProvidersProps) {
  // Crée le repository selon l'environnement
  const repo = useMemo(() => {
    return import.meta.env.DEV
      ? new JsonCardRepository()  // Développement : fichier JSON
      : new ApiCardRepository('/api')  // Production : API backend
  }, [])

  return (
    <ThemeProvider>
      <InteractionProvider>
        <DataProvider cardRepo={repo}>
          <AppInitializer>
            {children || <RouterProvider router={router} />}
          </AppInitializer>
        </DataProvider>
      </InteractionProvider>
    </ThemeProvider>
  )
}

function AppInitializer({ children }: { children: ReactNode }) {
  // Charge les cartes une seule fois au démarrage
  useInitializeCards()
  return <>{children}</>
}
```

**Fichier** : `src/app/hooks/useInitializeCards.ts`

```typescript
export function useInitializeCards() {
  const loadCards = useCardStore(state => state.loadCards)
  const isInitialized = useCardStore(state => state.isInitialized)
  const repo = useCardRepo()  // Récupère le repository depuis le contexte

  useEffect(() => {
    // Charge les cartes une seule fois au montage
    if (!isInitialized) {
      loadCards(repo)
    }
  }, [loadCards, isInitialized, repo])
}
```

**Important** : Les composants n'ont **pas besoin** de charger les cartes manuellement. Ils doivent simplement accéder au store avec `useCardStore()`. Le chargement se fait automatiquement au démarrage via `useInitializeCards()`.

### Normalisation automatique

La fonction `dtoToCard()` (utilisée par les repositories) effectue automatiquement :

- ✅ Conversion des dates ISO strings → objets `Date` pour `createdAt` et `updatedAt`
- ✅ Normalisation spécifique des dates dans les payloads selon le type de carte
- ✅ Extraction du `title` depuis le payload si absent au niveau racine
- ✅ Préservation de toutes les données du backend (aucune valeur mockée n'est utilisée)

**Note** : La normalisation des dates dans le payload est spécifique à chaque type de carte. Si vous créez un nouveau type de carte avec des dates dans le payload, vous devrez ajouter la logique de normalisation dans `normalizePayload()` de `cards.dto.ts`.

**Note** : La normalisation est spécifique à chaque type de carte pour garantir la cohérence. Si vous créez un nouveau type de carte avec des dates dans le payload, ajoutez la logique correspondante dans `normalizePayload()`.

### Configs et données backend

Même si les données viennent du backend, les **configs restent essentielles** car elles :

1. **Définissent les actions par défaut** via `actions(card)` (la fonction reçoit la carte pour des actions dynamiques)
2. **Spécifient les connecteurs possibles** (affichés dans l'UI, utilisés comme fallback si non fournis par le backend)
3. **Servent de validation** : la config doit être enregistrée pour que le type de carte soit reconnu

**Note sur les actions** : Les actions de la config sont récupérées dynamiquement via `getAvailableActions(card)` qui appelle `config.actions(card)`. La fonction reçoit la carte en paramètre, ce qui permet de définir des actions conditionnelles basées sur l'état de la carte (ex: afficher "Accepter" uniquement si le statut est "pending").

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

**Note** : Vous n'avez **pas besoin** d'enregistrer manuellement votre config dans `factory.ts`. L'enregistrement se fait automatiquement via votre fichier `register.ts` (voir Étape 4).

Le `CardFactory` est utilisé pour :

- **Gérer les configurations** : Les configs sont enregistrées automatiquement lors de l'import de `register.ts` dans `providers.tsx`
- **Récupérer les actions** : `getAvailableActions(card)` utilise `cardFactory.getConfig()` pour récupérer les actions

**Méthodes disponibles** :

- `register(config)` : Enregistre une configuration (appelé automatiquement par `registerCard()`)
- `getConfig(type)` : Récupère la configuration enregistrée pour un type
- `listCardTypes()` : Liste tous les types de cartes enregistrés

**Note** : Les mocks sont gérés séparément via les fixtures JSON dans `src/app/store/fixtures/`. Vous n'avez pas besoin d'utiliser le CardFactory pour créer des cartes mockées.

---

## ✅ Checklist de création

Avant de considérer votre carte comme terminée, vérifiez :

- [ ] **Payload Type** : Interface TypeScript définie avec toutes les propriétés nécessaires
- [ ] **Config** : Configuration définie avec `type`, `actions()` (optionnel), et `connectors` (optionnel)
- [ ] **Renderer** : Composant React créé utilisant `CardShell` et les composants réutilisables
- [ ] **Registration** : Fichier `register.ts` créé avec `registerCard()`
- [ ] **Import** : Fichier `register.ts` importé dans `providers.tsx`
- [ ] **Actions** (optionnel) : Actions spécifiques définies dans la config via `actions(card)`
- [ ] **Normalisation des dates** (si nécessaire) : Si votre payload contient des dates, ajoutez la logique dans `normalizePayload()` de `cards.dto.ts`
- [ ] **Test visuel** : Vérifier que la carte s'affiche correctement dans l'application

---

## 🎯 Exemples de référence

Pour voir des exemples complets et fonctionnels, consultez :

- **Calendar** : `src/features/calendar/`
  - Payload avec dates et localisation
  - Config avec actions et connecteurs
  - Renderer avec header optionnel
- **Notification** : `src/features/notification/`
  - Payload simple avec message
  - Config minimal avec actions
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
- ✅ Définir les actions dans la config (co-location)
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
4. **Quelles actions sont disponibles ?** → Définissez-les dans la config via `actions(card)`
5. **Y a-t-il un message contextuel important ?** → Utilisez `ContextBubble`
6. **Les actions doivent-elles être dynamiques ?** → Utilisez `actions(card)` pour des actions conditionnelles basées sur l'état de la carte
7. **Quels connecteurs sont nécessaires ?** → Ajoutez-les dans la config via `connectors`

---

## 📝 Résumé rapide

Pour créer rapidement une nouvelle carte :

1. Créez le dossier `src/features/ma-carte/`
2. Définissez `ma-carte.payload.ts` avec votre interface (structure des données du backend)
3. Créez `ma-carte.card.config.ts` avec la configuration (actions, connecteurs)
4. Implémentez `MaCarteRenderer.tsx` avec `CardShell`
5. Ajoutez `register.ts` avec `registerCard()`
6. Importez `register.ts` dans `providers.tsx`

**Pour utiliser les données du backend** :

- Les cartes sont **chargées automatiquement au démarrage** dans `Providers.tsx`
- Le système utilise un **pattern Repository** : `ApiCardRepository` en production, `JsonCardRepository` en développement
- Le backend doit renvoyer des données au format `CardDTO` (dates en ISO string) sur l'endpoint `/api/cards`
- Les dates seront automatiquement normalisées en objets `Date` par `dtoToCard()`
- Le repository est fourni via `DataProvider` et accessible via `useCardRepo()` si nécessaire
- Les composants accèdent aux cartes via `useCardStore(state => state.cards)` - **pas besoin de charger manuellement**

Et voilà ! Votre nouvelle carte est prête à être utilisée. 🎉

**Exemple minimal complet** :

```typescript
// register.ts
import { registerCard } from '@/engine/cards/card.registry'
import { maCarteConfig } from './ma-carte.card.config'
import { MaCarteRenderer } from './MaCarteRenderer'

registerCard(maCarteConfig, MaCarteRenderer)
```
