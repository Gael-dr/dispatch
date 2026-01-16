import {
  getAppointmentsByDate,
  type Appointment,
} from '@/shared/api/calendar.api'
import { useCallback, useEffect, useState } from 'react'

const buildMockAppointments = (date: string): Appointment[] => [
    {
      id: 'mock-1',
      title: 'Rendez-vous avec le client',
      start: `${date}T09:00:00`,
      end: `${date}T10:00:00`,
  },
  {
    id: 'mock-2',
    title: 'Rendez-vous avec le client',
    start: `${date}T11:00:00`,
    end: `${date}T12:30:00`,
  },
]

export const useAppointmentsForDate = (date: string, isOpen: boolean) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAppointments = useCallback(async (targetDate: string) => {
    setLoading(true)
    setError(null)
    try {
      const items = await getAppointmentsByDate(targetDate)
      setAppointments(items)
    } catch (err) {
      setAppointments(buildMockAppointments(targetDate))
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !date) return
    void loadAppointments(date)
  }, [date, isOpen, loadAppointments])

  return { appointments, loading, error }
}
