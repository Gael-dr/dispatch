import type { UiAction } from '../../engine/policies/card.policy'

export function CardActions({
  actions,
  onAction,
}: {
  actions: UiAction[]
  onAction?: (actionId: string) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map(a => (
        <button
          key={a.id}
          onClick={() => onAction?.(a.id)}
          className="px-4 py-2 rounded-2xl bg-slate-800/40 border border-white/10 text-white font-bold text-sm hover:bg-slate-800/55 transition"
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
