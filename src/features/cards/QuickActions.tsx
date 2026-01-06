// Actions rapides - Composant séparé des actions de cards
// ✅ Affichage distinct et indépendant

import {
  getButtonTypeForAction,
  getQuickActions,
} from '../../engine/policies/card.policy'
import { QuickButton } from '../../shared/ui/QuickButton'

interface QuickActionsProps {
  onAction?: (actionId: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const quickActions = getQuickActions()

  return (
    <div className="flex items-center justify-between gap-2 w-full py-4 px-4 fixed bottom-0 left-0 right-0">
      {quickActions.map(action => (
        <QuickButton
          key={action.id}
          label={action.label}
          buttonType={getButtonTypeForAction(action.type)}
          actionType={action.type}
          onClick={() => onAction?.(action.id)}
        />
      ))}
    </div>
  )
}
