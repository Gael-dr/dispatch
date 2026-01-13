import { registerCard } from '@/engine/cards/card.registry'

import { calendarBlueprint } from './calendar.card.blueprint'
import { CalendarCardRenderer } from './CalendarCardRenderer'

registerCard(calendarBlueprint, CalendarCardRenderer)

export {}
