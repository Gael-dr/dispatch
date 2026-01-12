export interface CalendarPayload {
    title: string
    description?: string
    startDate: Date
    endDate?: Date
    severity?: 'info' | 'warning' | 'error' | 'success'
    context?: { message: string }
    location?: string
    attendees?: string[]
    status?: 'confirmed' | 'tentative' | 'cancelled'
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
