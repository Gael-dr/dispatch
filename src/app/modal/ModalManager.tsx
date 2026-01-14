import { useUIStore } from '@/app/store/uiStore'
import { ScheduleTimeModal } from '@/features/calendar/ScheduleTimeModal'

/**
 * Gestionnaire centralisé des modals
 * Affiche la modal appropriée selon l'actionId
 */
export function ModalManager({
  onActionConfirm,
}: {
  onActionConfirm: (actionId: string, data?: unknown) => void
}) {
  const modalData = useUIStore(state => state.modalData)

  if (!modalData) {
    return null
  }

  const { actionId } = modalData

  // Gérer les différentes modals selon l'actionId
  switch (actionId) {
    case 'schedule':
      return (
        <ScheduleTimeModal
          onConfirm={(startTime, endTime) => {
            onActionConfirm(actionId, { startTime, endTime })
          }}
        />
      )

    // Ajouter d'autres cas ici pour d'autres modals
    // case 'other-action':
    //   return <OtherModal ... />

    default:
      return null
  }
}
