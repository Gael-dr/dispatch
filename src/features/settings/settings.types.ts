export type CardTypeId = 'calendar' | 'notification'
export type ConnectorId = 'gmail' | 'google_calendar' | 'slack'

export type CardType = {
    id: CardTypeId
    label: string
    description: string
    icon: 'calendar' | 'bell'
    connectors: ConnectorId[]
}

export type Connector = {
    id: ConnectorId
    label: string
    description: string
    icon: 'gmail' | 'google_calendar' | 'slack'
}

export type CardSettings = {
    enabledConnectors: ConnectorId[]
}

export type SettingsState = Record<CardTypeId, CardSettings>
