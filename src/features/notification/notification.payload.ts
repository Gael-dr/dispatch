export interface NotificationPayload {
    title: string
    message: string
    context?: { message: string }
    icon?: string
    severity?: 'info' | 'warning' | 'error' | 'success'
    read?: boolean
    timestamp: Date
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
