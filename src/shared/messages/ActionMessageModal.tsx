import { useUIStore } from '@/app/store/uiStore'
import type { CalendarPayload } from '@/engine/cards/card.payloads'
import type {
  TemplateBuilder,
  Tone,
} from '@/shared/messages/actionMessageTemplates'
import { GraduationCap, PencilLine, Send, Smile, X, Zap } from 'lucide-react'
import type { ComponentType } from 'react'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  builder: TemplateBuilder
  onConfirm: (data: { tone: Tone; subject: string; message: string }) => void
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}
function formatFrTime(d: Date) {
  return `${pad2(d.getHours())}h${pad2(d.getMinutes())}`
}
function formatFrDay(d: Date) {
  return `le ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`
}

export function ActionMessageModal({ builder, onConfirm }: Props) {
  const closeModal = useUIStore(s => s.closeModal)
  const modalData = useUIStore(s => s.modalData)

  const payload = useMemo(
    () => (modalData?.payload ?? {}) as CalendarPayload,
    [modalData?.payload]
  )
  const start = useMemo(
    () => (payload.startDate ? new Date(payload.startDate) : new Date()),
    [payload.startDate]
  )
  const recipientName = payload.sender?.name ?? '—'
  const dayLabel = formatFrDay(start)
  const timeLabel = formatFrTime(start)

  const templates = useMemo(
    () => builder({ recipientName, dayLabel, timeLabel, payload }),
    [builder, recipientName, dayLabel, timeLabel, payload]
  )

  const [tone, setTone] = useState<Tone>('direct')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<string>(templates.byTone.direct)

  useEffect(() => {
    setDraft(templates.byTone[tone])
    setIsEditing(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates.subject])

  const setToneAndApplyTemplate = (t: Tone) => {
    setTone(t)
    setDraft(templates.byTone[t])
  }

  const handleSend = () => {
    onConfirm({ tone, subject: templates.subject, message: draft })
    closeModal()
  }

  const toneBtn = (
    t: Tone,
    label: string,
    IconCmp: ComponentType<{ className?: string }>
  ) => {
    const active = tone === t
    return (
      <button
        type="button"
        onClick={() => setToneAndApplyTemplate(t)}
        className={[
          'flex-1 rounded-xl px-3 py-2 text-sm font-extrabold tracking-tight border transition',
          active
            ? 'bg-blue-500/80 border-blue-400/30 text-white'
            : 'bg-slate-950 border-white/10 text-slate-300 hover:bg-slate-900',
        ].join(' ')}
      >
        <span className="inline-flex items-center gap-2 justify-center">
          <IconCmp className="w-4 h-4" />
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-lg"
        onClick={closeModal}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl border border-white/10 bg-slate-800 flex items-center justify-center">
                <Send className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="text-white font-extrabold tracking-tight leading-none">
                  {templates.title}
                </div>
                <div className="text-slate-400 text-xs font-bold tracking-wide opacity-80">
                  {templates.subtitle}
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="h-9 w-9 rounded-xl border border-white/10 bg-slate-950 hover:bg-slate-900 transition flex items-center justify-center"
              aria-label="Fermer"
              type="button"
            >
              <X className="h-4 w-4 text-slate-300" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 space-y-4">
            {/* Tone tabs */}
            <div className="flex items-center gap-2">
              {toneBtn('direct', 'Direct', Zap)}
              {toneBtn('cool', 'Cool', Smile)}
              {toneBtn('formel', 'Formel', GraduationCap)}
            </div>

            {/* Message box */}
            <div className="space-y-3">
              {/* Zone texte AVEC background */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                <p className="text-slate-300 text-sm font-bold mb-2">
                  Sujet :{' '}
                  <span className="text-slate-100">{templates.subject}</span>
                </p>

                {isEditing ? (
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    rows={6}
                    autoFocus
                    onBlur={() => setIsEditing(false)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 text-slate-100 placeholder:text-slate-500 p-4 text-[15px] leading-relaxed font-semibold outline-none focus:border-white/20"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full text-left"
                  >
                    <p className="text-slate-100 text-[15px] leading-relaxed font-semibold whitespace-pre-line">
                      {draft}
                    </p>
                  </button>
                )}
              </div>

              {/* Hint + reset — EN DEHORS du fond noir */}
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold tracking-wide text-slate-500 inline-flex items-center gap-2">
                  <PencilLine className="w-4 h-4" />
                  Cliquez sur le texte pour modifier
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setDraft(templates.byTone[tone])
                    setIsEditing(false)
                  }}
                  className="text-xs font-bold tracking-wide text-slate-400 hover:text-slate-300"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleSend}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-600/90 text-white font-extrabold tracking-tight py-3.5 shadow-xl shadow-emerald-500/15 active:scale-[0.99] transition"
              type="button"
            >
              <span className="inline-flex items-center gap-2 justify-center">
                Envoyer <span aria-hidden>→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
