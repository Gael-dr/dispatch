import type { CardTypeId, ConnectorId, SettingsState } from './settings.types'
import { DEFAULT_SETTINGS } from './settings.mock'

export async function fetchSettingsFromBackend(): Promise<SettingsState> {
    // TODO: GET /settings/connectors
    return DEFAULT_SETTINGS
}

export async function saveSettingsToBackend(_next: SettingsState): Promise<void> {
    // TODO: PUT /settings/connectors
    return
}

export async function connectProviderOnBackend(_cardType: CardTypeId, _connector: ConnectorId): Promise<void> {
    // TODO: POST /connect/{provider}
    return
}

export async function disconnectProviderOnBackend(_cardType: CardTypeId, _connector: ConnectorId): Promise<void> {
    // TODO: DELETE /connect/{provider}
    return
}
