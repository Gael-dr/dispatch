// CardFeedback handles animations, haptics, and toast notifications
// This is a pure UI component that receives feedback events

interface CardFeedbackProps {
  message?: string
  type?: 'success' | 'error' | 'info'
}

export function CardFeedback({ message, type = 'info' }: CardFeedbackProps) {
  if (!message) return null

  return <div className={`card-feedback card-feedback--${type}`}>{message}</div>
}
