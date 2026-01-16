// src/features/calendar/ValidationActionModal.tsx
import { useMemo, useState } from 'react'
import { useUIStore } from '@/app/store/uiStore'
import type { CalendarPayload } from '@/engine/cards/card.payloads'
import { PencilLine, X, Send, Zap, Smile, GraduationCap } from 'lucide-react'

type Tone = 'direct' | 'cool' | 'formel'

function pad2(n: number) {
    return String(n).padStart(2, '0')
}
function formatFrTime(d: Date) {
    return `${pad2(d.getHours())}h${pad2(d.getMinutes())}`
}
function formatFrDay(d: Date) {
    return `le ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`
}

function buildTemplates({
    recipientName,
    dayLabel,
    timeLabel,
}: {
    recipientName: string
    dayLabel: string
    timeLabel: string
}) {
    const subject = `RE: Rendez-vous ${dayLabel} ${timeLabel} ?`

    const direct = `Ça marche ${recipientName}, c’est noté pour ${timeLabel} ${dayLabel}.
À bientôt.`

    const cool = `Yes ${recipientName} 🙌
Super, je bloque ${timeLabel} ${dayLabel}. À très vite !`

    const formel = `Bonjour ${recipientName},

Je vous confirme notre rendez-vous ${dayLabel} à ${timeLabel}.
Bien cordialement,`

    return { subject, byTone: { direct, cool, formel } as const }
}

export function ValidationActionModal({
    onConfirm,
}: {
    onConfirm: (data: { tone: Tone; subject: string; message: string }) => void
}) {
    const closeModal = useUIStore(s => s.closeModal)
    const modalData = useUIStore(s => s.modalData)
    const payload = (modalData?.payload ?? {}) as CalendarPayload

    const start = payload.startDate ? new Date(payload.startDate) : new Date()
    const recipientName = payload.sender?.name ?? '—'
    const dayLabel = formatFrDay(start)
    const timeLabel = formatFrTime(start)

    const templates = useMemo(
        () => buildTemplates({ recipientName, dayLabel, timeLabel }),
        [recipientName, dayLabel, timeLabel]
    )

    const [tone, setTone] = useState<Tone>('direct')
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(templates.byTone.direct)

    const setToneSafe = (t: Tone) => {
        setTone(t)
        if (!isEditing) setDraft(templates.byTone[t])
    }

    const handleSend = () => {
        onConfirm({ tone, subject: templates.subject, message: draft })
        closeModal()
    }

    const toneBtn = (t: Tone, label: string, Icon: any) => {
        const active = tone === t
        return (
            <button
                type="button"
                onClick={() => setToneSafe(t)}
                className={[
                    'flex-1 rounded-xl px-3 py-2 text-sm font-extrabold tracking-tight border transition',
                    active
                        ? 'bg-blue-500/80 border-blue-400/30 text-white'
                        : 'bg-slate-900/30 border-white/10 text-slate-300 hover:bg-slate-900/45',
                ].join(' ')}
            >
                <span className="inline-flex items-center gap-2 justify-center">
                    <Icon className="w-4 h-4" />
                    {label}
                </span>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <button
                aria-label="Fermer"
                onClick={closeModal}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Centered container (mobile included) */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                {/* Modal card */}
                <div className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">


                    {/* Header (match screenshot style) */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-center">
                                <Send className="h-5 w-5 text-emerald-300" />
                            </div>

                            <div className="min-w-0">
                                <div className="text-white font-extrabold tracking-tight leading-none">
                                    Validation Action
                                </div>
                                <div className="text-slate-400 text-xs font-bold tracking-wide opacity-80">
                                    Confirmation de rendez-vous
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="h-9 w-9 rounded-xl border border-white/10 bg-slate-900/25 hover:bg-slate-900/40 transition flex items-center justify-center"
                            aria-label="Fermer"
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
                        <div className="rounded-2xl border border-white/10 bg-slate-900/25 p-4">
                            <p className="text-slate-300 text-sm font-bold mb-2">
                                Sujet : <span className="text-slate-100">{templates.subject}</span>
                            </p>

                            {isEditing ? (
                                <textarea
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    rows={5}
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/35 text-slate-100 placeholder:text-slate-500 p-3 text-sm font-semibold outline-none focus:border-white/20"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full text-left"
                                    title="Cliquez pour modifier"
                                >
                                    <p className="text-slate-100 text-sm font-semibold whitespace-pre-line">
                                        {draft}
                                    </p>
                                    <p className="mt-3 text-xs font-bold tracking-wide text-slate-500 inline-flex items-center gap-2">
                                        <PencilLine className="w-4 h-4" />
                                        Cliquez sur le texte pour modifier
                                    </p>
                                </button>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(v => !v)}
                                    className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-400 hover:text-slate-300"
                                >
                                    <PencilLine className="w-4 h-4" />
                                    {isEditing ? 'Terminer' : 'Modifier'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDraft(templates.byTone[tone])}
                                    className="text-xs font-bold tracking-wide text-slate-400 hover:text-slate-300"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleSend}
                            className="w-full rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-extrabold tracking-tight py-3.5 shadow-xl shadow-emerald-500/15 active:scale-[0.99] transition"
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
