interface ActionButtonProps {
  label: string
  type: 'primary' | 'secondary' | 'danger'
  onClick: () => void
  icon?: string
  disabled?: boolean
}

export function ActionButton({
  label,
  type,
  onClick,
  icon,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      className={`action-button action-button--${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="action-button__icon">{icon}</span>}
      <span className="action-button__label">{label}</span>
    </button>
  )
}
