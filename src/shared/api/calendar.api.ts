import { apiClient } from './apiClient'

export interface Appointment {
  id: string
  title: string
  start: string // ISO datetime
  end: string // ISO datetime
}

export interface AppointmentListResponse {
  items: Appointment[]
}

/**
 * Récupère les rendez-vous pour un jour donné.
 */
export async function getAppointmentsByDate(
  date: string
): Promise<Appointment[]> {
  const response = await apiClient.get<AppointmentListResponse>(
    `/calendar/appointments?date=${encodeURIComponent(date)}`
  )
  return response.items
}
