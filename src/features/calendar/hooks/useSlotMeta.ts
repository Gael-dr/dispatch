import { useMemo } from 'react'
import type { Appointment } from '@/shared/api/calendar.api'
import { toSlotDateTime } from '../utils/calendarDateUtils'
import type { SlotMeta } from '../components/TimeSlotGrid'

export const useSlotMeta = ({
  appointments,
  selectedDate,
  times,
  warningMinutes,
  includeStartBoundary = true,
}: {
  appointments: Appointment[]
  selectedDate: string
  times: string[]
  warningMinutes: number
  includeStartBoundary?: boolean
}) =>
  useMemo(() => {
    if (!selectedDate) return {}
    const warningWindowMs = warningMinutes * 60 * 1000
    return times.reduce<Record<string, SlotMeta>>((acc, time) => {
      const slotDateTime = toSlotDateTime(selectedDate, time)
      let hasOverlap = false
      let warning: Appointment | null = null

      appointments.forEach(appointment => {
        const start = new Date(appointment.start)
        const end = new Date(appointment.end)
        const isOverlapping = includeStartBoundary
          ? slotDateTime >= start && slotDateTime < end
          : slotDateTime > start && slotDateTime < end
        if (isOverlapping) {
          hasOverlap = true
          return
        }

        if (!warning) {
          const nearStart =
            slotDateTime <= start &&
            start.getTime() - slotDateTime.getTime() <= warningWindowMs
          const nearEnd =
            slotDateTime >= end &&
            slotDateTime.getTime() - end.getTime() <= warningWindowMs
          if (nearStart || nearEnd) {
            warning = appointment
          }
        }
      })

      acc[time] = { hasOverlap, warning }
      return acc
    }, {})
  }, [appointments, selectedDate, times, warningMinutes])
