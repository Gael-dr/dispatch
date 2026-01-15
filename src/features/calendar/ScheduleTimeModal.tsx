import { useUIStore } from '@/app/store/uiStore'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

import { CalendarIcon } from 'lucide-react'
import { useMemo } from 'react'
import { DaySelector } from './components/DaySelector'
import { TimeSlotGrid } from './components/TimeSlotGrid'
import { useAppointmentsForDate } from './hooks/useAppointmentsForDate'
import { useScheduleSelection } from './hooks/useScheduleSelection'
import { useSlotMeta } from './hooks/useSlotMeta'
import {
  addMinutesToTime,
  formatDate,
  formatDateInput,
  toSlotDateTime,
} from './utils/calendarDateUtils'

/**
 * Horaires disponibles pour la sélection
 */
const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

const APPOINTMENT_GAP_WARNING_MINUTES = 0

interface ScheduleTimeModalProps {
  onConfirm: (date: string, startTime: string, endTime: string) => void
}

/**
 * Modal pour sélectionner un créneau horaire
 */
export function ScheduleTimeModal({ onConfirm }: ScheduleTimeModalProps) {
  const isOpen = useUIStore(state => state.modalOpen)
  const closeModal = useUIStore(state => state.closeModal)
  const {
    accordionValue,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    setAccordionValue,
    setSelectedDate,
    resetSelection,
    selectStartTime,
    selectEndTime,
    forceEndTime,
  } = useScheduleSelection(() => formatDateInput(new Date()))
  const { appointments, loading, error } = useAppointmentsForDate(
    selectedDate,
    isOpen
  )

  const handleDateChange = (nextDate: string) => {
    setSelectedDate(nextDate)
  }

  const handleConfirm = () => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      onConfirm(selectedDate, selectedStartTime, selectedEndTime)
      closeModal()
      resetSelection()
    }
  }

  const handleCancel = () => {
    closeModal()
    resetSelection()
  }

  const startSlotMeta = useSlotMeta({
    appointments,
    selectedDate,
    times: TIME_SLOTS,
    warningMinutes: APPOINTMENT_GAP_WARNING_MINUTES,
  })
  const endSlotMeta = useSlotMeta({
    appointments,
    selectedDate,
    times: TIME_SLOTS,
    warningMinutes: APPOINTMENT_GAP_WARNING_MINUTES,
    includeStartBoundary: false,
  })

  const maxEndBoundary = useMemo(() => {
    if (!selectedDate || !selectedStartTime) return null
    const startDateTime = toSlotDateTime(selectedDate, selectedStartTime)
    const futureStarts = appointments
      .map(appointment => new Date(appointment.start))
      .filter(start => start > startDateTime)
      .sort((a, b) => a.getTime() - b.getTime())
    return futureStarts[0] ?? null
  }, [appointments, selectedDate, selectedStartTime])

  const isLastSlot = (time: string) =>
    time === TIME_SLOTS[TIME_SLOTS.length - 1]

  const handleStartSelect = (time: string) => {
    selectStartTime(time)
    if (isLastSlot(time)) {
      forceEndTime(addMinutesToTime(selectedDate, time, 60))
    }
  }

  // Filtrer les horaires disponibles pour la fin (doivent être après le début)
  const availableEndTimes = selectedStartTime
    ? TIME_SLOTS.filter(time => {
        if (time <= selectedStartTime) return false
        if (!maxEndBoundary) return true
        const endDateTime = toSlotDateTime(selectedDate, time)
        return endDateTime <= maxEndBoundary
      })
    : []

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          handleCancel()
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] gap-2">
        <DialogHeader className="flex items-start gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <DialogTitle className="font-extrabold text-md">
              Choisir un créneau
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Sélection du jour */}
          <div className="w-full">
            <DaySelector date={selectedDate} onChange={handleDateChange} />
            {loading && (
              <p className="text-xs text-slate-400 mt-2">
                Chargement des rendez-vous...
              </p>
            )}
            {error && (
              <p className="text-xs text-yellow-400 mt-2">
                Données de test affichées (API indisponible).
              </p>
            )}
          </div>

          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={value => setAccordionValue(value || '')}
            className="w-full"
          >
            <AccordionItem value="start-time">
              <AccordionTrigger>
                <span className="text-sm font-medium">
                  Heure de début
                  {selectedStartTime ? ` • ${selectedStartTime}` : ''}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-56 overflow-y-auto">
                  <TimeSlotGrid
                    times={TIME_SLOTS}
                    selectedTime={selectedStartTime}
                    slotMeta={startSlotMeta}
                    onSelect={handleStartSelect}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="end-time">
              <AccordionTrigger>
                <span className="text-sm font-medium">
                  Heure de fin
                  {selectedEndTime ? ` • ${selectedEndTime}` : ''}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {selectedStartTime ? (
                  <div className="max-h-56 overflow-y-auto">
                    <TimeSlotGrid
                      times={availableEndTimes}
                      selectedTime={selectedEndTime}
                      slotMeta={endSlotMeta}
                      onSelect={selectEndTime}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    Sélectionnez d'abord une heure de début
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Aperçu du créneau sélectionné */}
          {selectedDate && selectedStartTime && selectedEndTime && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                <span className="font-semibold">Créneau sélectionné :</span>{' '}
                {formatDate(selectedDate)} • {selectedStartTime} -{' '}
                {selectedEndTime}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedStartTime || !selectedEndTime}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
