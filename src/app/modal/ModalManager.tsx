// src/app/modals/ModalManager.tsx (ou ton chemin actuel)
import { useUIStore } from '@/app/store/uiStore'
import { ScheduleTimeModal } from '@/features/calendar/ScheduleTimeModal'
import { ValidationActionModal } from '@/features/calendar/ValidationActionModal'

export function ModalManager({
  onActionConfirm,
}: {
  onActionConfirm: (actionId: string, data?: unknown) => void
}) {
  const modalOpen = useUIStore(state => state.modalOpen)
  const modalData = useUIStore(state => state.modalData)

  if (!modalOpen || !modalData) return null

  const { actionId } = modalData

  switch (actionId) {
    case 'schedule':
      return (
        <ScheduleTimeModal
          onConfirm={(date, startTime, endTime) => {
            onActionConfirm(actionId, { date, startTime, endTime })
          }}
        />
      )

    case 'accept':
      return (
        <ValidationActionModal
          onConfirm={data => {
            onActionConfirm(actionId, data)
          }}
        />
      )

    default:
      return null
  }
}
