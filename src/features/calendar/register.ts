import { registerCard } from '@/engine/cards/card.registry'

import { calendarConfig } from './calendar.card.config'
import { CalendarCardRenderer } from './CalendarCardRenderer'

registerCard(calendarConfig, CalendarCardRenderer)
