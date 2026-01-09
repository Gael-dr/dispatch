import type { CardType, Connector, SettingsState } from './settings.types'

export const CONNECTORS: Connector[] = [
    { id: 'gmail', label: 'Gmail', description: 'Email entrant et actions', icon: 'gmail' },
    { id: 'google_calendar', label: 'Google Calendar', description: 'Événements, disponibilités', icon: 'google_calendar' },
    { id: 'slack', label: 'Slack', description: 'Messages et notifications', icon: 'slack' },
]

export const CARD_TYPES: CardType[] = [
    {
        id: 'calendar',
        label: 'Calendar',
        description: 'Traitement d’événements et décisions liées au temps',
        icon: 'calendar',
        connectors: ['google_calendar', 'gmail'],
    },
    {
        id: 'notification',
        label: 'Notification',
        description: 'Alertes, rappels, messages',
        icon: 'bell',
        connectors: ['slack', 'gmail'],
    },
]

export const DEFAULT_SETTINGS: SettingsState = {
    calendar: { enabledConnectors: ['google_calendar'] },
    notification: { enabledConnectors: ['slack'] },
}
