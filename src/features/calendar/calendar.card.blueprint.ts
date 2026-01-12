import type { CardBlueprint } from '../../engine/cards/cards.blueprint'

export const calendarBlueprint: CardBlueprint<{ when: string; summary: string }> = {
    type: 'calendar',
    connectors: ['google_calendar'],

    defaults: () => ({
        title: 'Nouvel événement',
        priority: 'normal',
    }),

    payloadFactory: seed => ({
        when: new Date(seed).toISOString(),
        summary: 'Réunion (mock)',
    }),
}
