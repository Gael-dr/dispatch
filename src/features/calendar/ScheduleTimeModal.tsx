import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion'
import { Button } from '@/shared/ui/button'
import { useUIStore } from '@/app/store/uiStore'

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
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

interface ScheduleTimeModalProps {
  onConfirm: (date: string, startTime: string, endTime: string) => void
}

/**
 * Modal pour sélectionner un créneau horaire
 */
export function ScheduleTimeModal({ onConfirm }: ScheduleTimeModalProps) {
  const isOpen = useUIStore(state => state.modalOpen)
  const closeModal = useUIStore(state => state.closeModal)
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    'start-time'
  )
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null)
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null)

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = `${today.getMonth() + 1}`.padStart(2, '0')
    const day = `${today.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate())

  const handleStartTimeSelect = (time: string) => {
    setSelectedStartTime(time)
    setAccordionValue('end-time')
    // Réinitialiser l'heure de fin si elle est avant la nouvelle heure de début
    if (selectedEndTime && time >= selectedEndTime) {
      setSelectedEndTime(null)
    }
  }

  const handleEndTimeSelect = (time: string) => {
    if (selectedStartTime && time > selectedStartTime) {
      setSelectedEndTime(time)
    }
  }

  const handleConfirm = () => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      onConfirm(selectedDate, selectedStartTime, selectedEndTime)
      closeModal()
      // Réinitialiser les sélections
      setAccordionValue('start-time')
      setSelectedDate(getTodayDate())
      setSelectedStartTime(null)
      setSelectedEndTime(null)
    }
  }

  const handleCancel = () => {
    closeModal()
    setAccordionValue('start-time')
    setSelectedDate(getTodayDate())
    setSelectedStartTime(null)
    setSelectedEndTime(null)
  }

  // Filtrer les horaires disponibles pour la fin (doivent être après le début)
  const availableEndTimes = selectedStartTime
    ? TIME_SLOTS.filter(time => time > selectedStartTime)
    : []

  const formatDate = (value: string) => {
    if (!value) return ''
    const [year, month, day] = value.split('-')
    if (!year || !month || !day) return value
    return `${day}-${month}-${year}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Proposer un créneau</DialogTitle>
          <DialogDescription>
            Sélectionnez l'heure de début et de fin pour votre créneau
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Sélection du jour */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Jour
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={event => setSelectedDate(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
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
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={`start-${time}`}
                      type="button"
                      onClick={() => handleStartTimeSelect(time)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${
                          selectedStartTime === time
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
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
                  <div className="grid grid-cols-4 gap-2">
                    {availableEndTimes.map((time) => (
                      <button
                        key={`end-${time}`}
                        type="button"
                        onClick={() => handleEndTimeSelect(time)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            selectedEndTime === time
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
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
                {formatDate(selectedDate)} • {selectedStartTime} - {selectedEndTime}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
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
