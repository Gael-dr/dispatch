// src/app/modals/ModalManager.tsx
import { useUIStore } from '@/app/store/uiStore'
import { ScheduleTimeModal } from '@/features/calendar/ScheduleTimeModal'
import { ActionMessageModal } from '@/shared/messages/ActionMessageModal'
import {
  MESSAGE_BUILDERS,
  type MessageActionId,
} from '@/shared/messages/actionMessageTemplates'

export function ModalManager({
  onActionConfirm,
}: {
  onActionConfirm: (actionId: string, data?: unknown) => void
}) {
  const modalOpen = useUIStore(s => s.modalOpen)
  const modalData = useUIStore(s => s.modalData)
  const openModal = useUIStore(s => s.openModal)

  if (!modalOpen || !modalData) return null

  const { actionId } = modalData

  if (actionId === 'schedule') {
    return (
      <ScheduleTimeModal
        onConfirm={(date, startTime, endTime) => {
          const startDateTime = new Date(`${date}T${startTime}:00`)
          openModal({
            ...modalData,
            actionId: 'schedule-message',
            scheduleSelection: { date, startTime, endTime },
            payload: {
              ...(modalData.payload ?? {}),
              startDate: startDateTime.toISOString(),
            },
          })
        }}
      />
    )
  }

  const isMessageActionId = (value: string): value is MessageActionId =>
    value in MESSAGE_BUILDERS

  if (isMessageActionId(actionId)) {
    const builder = MESSAGE_BUILDERS[actionId]
    const scheduleSelection =
      actionId === 'schedule-message'
        ? (modalData.scheduleSelection as
            | { date: string; startTime: string; endTime: string }
            | undefined)
        : undefined
    return (
      <ActionMessageModal
        builder={builder}
        onConfirm={data =>
          onActionConfirm(
            actionId === 'schedule-message' ? 'schedule' : actionId,
            scheduleSelection ? { ...data, ...scheduleSelection } : data
          )
        }
      />
    )
  }

  return null
}
