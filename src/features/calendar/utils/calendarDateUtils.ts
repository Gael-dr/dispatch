export const formatDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDate = (value: string) => {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}-${month}-${year}`
}

export const formatDisplayDate = (value: string) => {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
  }).format(date)
  return isToday ? `Aujourd'hui, ${formatted}` : formatted
}

export const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const toSlotDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00`)
