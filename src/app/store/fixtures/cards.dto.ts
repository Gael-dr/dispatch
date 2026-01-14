import type { Card, CardStatus, CardTypeId } from '@/engine/cards/card.types'

export type CardDTO = {
    id: string
    type: CardTypeId
    title?: string
    payload: unknown

    status: CardStatus
    priority?: 'low' | 'normal' | 'high'

    createdAt: string
    updatedAt: string

    connectors?: string[]
}

const toDate = (v: unknown) => (typeof v === 'string' ? new Date(v) : new Date())

function normalizePayload(type: string, payload: any) {
    if (!payload || typeof payload !== 'object') return payload

    if (type === 'calendar') {
        return {
            ...payload,
            startDate: payload.startDate ? toDate(payload.startDate) : undefined,
            endDate: payload.endDate ? toDate(payload.endDate) : undefined,
        }
    }

    if (type === 'notification') {
        return {
            ...payload,
            timestamp: payload.timestamp ? toDate(payload.timestamp) : undefined,
        }
    }

    return payload
}

export function dtoToCard(dto: CardDTO): Card {
    const p: any = dto.payload

    return {
        id: dto.id,
        type: dto.type,
        title: dto.title ?? (typeof p?.title === 'string' ? p.title : 'Card'),
        payload: normalizePayload(dto.type, dto.payload),
        status: dto.status,
        priority: dto.priority,
        createdAt: toDate(dto.createdAt),
        updatedAt: toDate(dto.updatedAt),
        connectors: dto.connectors,
    }
}
