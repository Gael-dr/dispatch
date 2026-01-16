// src/app/modals/ModalManager.tsx
import { useUIStore } from '@/app/store/uiStore'
import { ScheduleTimeModal } from '@/features/calendar/ScheduleTimeModal'
import { ActionMessageModal } from '@/features/calendar/ActionMessageModal'
import { MESSAGE_BUILDERS } from '@/features/calendar/actionMessageTemplates'

export function ModalManager({
  onActionConfirm,
}: {
  onActionConfirm: (actionId: string, data?: unknown) => void
}) {
  const modalOpen = useUIStore(s => s.modalOpen)
  const modalData = useUIStore(s => s.modalData)

  if (!modalOpen || !modalData) return null

  const { actionId } = modalData

  if (actionId === 'schedule') {
    return (
      <ScheduleTimeModal
        onConfirm={(date, startTime, endTime) =>
          onActionConfirm(actionId, { date, startTime, endTime })
        }
      />
    )
  }

  const builder = (MESSAGE_BUILDERS as Record<string, any>)[actionId]
  if (builder) {
    return (
      <ActionMessageModal
        builder={builder}
        onConfirm={data => onActionConfirm(actionId, data)}
      />
    )
  }

  return null
}
