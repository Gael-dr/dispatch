import { registerCardType } from '@/engine/cards/card.registry'
import { registerCardRenderer } from '@/features/cards/CardRenderers.registry'

import { calendarBlueprint } from './calendar.card.blueprint'
import { CalendarCardRenderer } from './CalendarCardRenderer'

registerCardType(calendarBlueprint)
registerCardRenderer('calendar', CalendarCardRenderer)

export { }
