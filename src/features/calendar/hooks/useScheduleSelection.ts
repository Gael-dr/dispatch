import { useState } from 'react'

export const useScheduleSelection = (getDefaultDate: () => string) => {
  const [accordionValue, setAccordionValue] = useState<string>('start-time')
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  )
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(getDefaultDate())

  const resetSelection = () => {
    setAccordionValue('start-time')
    setSelectedDate(getDefaultDate())
    setSelectedStartTime(null)
    setSelectedEndTime(null)
  }

  const selectStartTime = (time: string) => {
    setSelectedStartTime(time)
    setAccordionValue('end-time')
    if (selectedEndTime && time >= selectedEndTime) {
      setSelectedEndTime(null)
    }
  }

  const selectEndTime = (time: string) => {
    if (selectedStartTime && time > selectedStartTime) {
      setSelectedEndTime(time)
      setAccordionValue('')
    }
  }

  return {
    accordionValue,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    setAccordionValue,
    setSelectedDate,
    resetSelection,
    selectStartTime,
    selectEndTime,
  }
}
