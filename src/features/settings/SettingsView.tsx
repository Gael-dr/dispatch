import { Button } from '@/shared/ui/button'
import { BellIcon, CalendarDaysIcon, ChevronLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CARD_TYPES } from './settings.mock'
import type { CardTypeId, SettingsState } from './settings.types'
import {
    connectProviderOnBackend,
    disconnectProviderOnBackend,
    fetchSettingsFromBackend,
    saveSettingsToBackend,
} from './settings.api'
import { SettingsDrawer } from './SettingsDrawer'

const cardIconMap = {
    calendar: CalendarDaysIcon,
    notification: BellIcon,
} as const

export default function SettingsView() {
    const navigate = useNavigate()

    const [settings, setSettings] = useState<SettingsState>({
        calendar: { enabledConnectors: [] },
        notification: { enabledConnectors: [] },
    })

    const [selectedType, setSelectedType] = useState<CardTypeId | null>(null)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    const selectedCardType = useMemo(
        () => CARD_TYPES.find(t => t.id === selectedType) ?? null,
        [selectedType],
    )

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    const res = await fetchSettingsFromBackend()
                    if (!mounted) return
                    setSettings(res)
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => {
            mounted = false
        }
    }, [])

    const isEnabled = (cardType: CardTypeId, connectorId: string) =>
        settings[cardType]?.enabledConnectors.includes(connectorId as any)

    const toggleConnector = async (connectorId: any) => {
        if (!selectedType) return
        const currentlyEnabled = settings[selectedType].enabledConnectors.includes(connectorId)

        setSettings(prev => {
            const prevEnabled = prev[selectedType].enabledConnectors
            const nextEnabled = currentlyEnabled
                ? prevEnabled.filter(id => id !== connectorId)
                : [...prevEnabled, connectorId]
            return { ...prev, [selectedType]: { enabledConnectors: nextEnabled } }
        })

        if (currentlyEnabled) await disconnectProviderOnBackend(selectedType, connectorId)
        else await connectProviderOnBackend(selectedType, connectorId)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await saveSettingsToBackend(settings)
        } finally {
            setSaving(false)
            setSelectedType(null)
        }
    }

    return (
        <main
            className="relative h-[100svh] w-screen overflow-y-auto overscroll-y-none overflow-x-hidden px-4 pt-10 pb-8"
            style={{ backgroundColor: 'oklch(0.2069 0.0403 263.99)' }}
        >
            <div className="flex items-center gap-4 mb-6">
                <Button onClick={() => navigate(-1)} variant="ghost" className="w-fit h-fit p-0">
                    <ChevronLeft className="w-7 h-7" style={{ width: 28, height: 28 }} />
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold tracking-tight text-white">PARAMÈTRES</h1>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">
                        Connecteurs par type de carte
                    </p>
                </div>
            </div>

            <section className="max-w-3xl">
                <p className="text-slate-400 text-xs font-bold tracking-wide mb-3">TYPES DE CARTES</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CARD_TYPES.map(type => {
                        const Icon = cardIconMap[type.id]
                        const enabledCount = settings[type.id]?.enabledConnectors.length ?? 0
                        const availableCount = type.connectors.length

                        return (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className="text-left group rounded-3xl border border-white/10 bg-slate-900/25 hover:bg-slate-900/35 transition-all overflow-hidden"
                            >
                                <div className="p-4 flex items-start gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center shadow-2xl">
                                        <Icon className="w-5 h-5 text-blue-400" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-white font-extrabold tracking-tight">{type.label}</p>
                                            <span className="text-xs font-bold text-slate-400">
                                                {enabledCount} / {availableCount}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium mt-1">{type.description}</p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {type.connectors.map(cid => (
                                                <span
                                                    key={cid}
                                                    className={[
                                                        'inline-flex items-center rounded-2xl px-3 py-1.5 text-xs font-bold border',
                                                        isEnabled(type.id, cid)
                                                            ? 'bg-blue-500/15 text-blue-200 border-blue-500/20'
                                                            : 'bg-slate-800/30 text-slate-300 border-white/10',
                                                    ].join(' ')}
                                                >
                                                    {cid}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {loading && <p className="text-slate-400 text-sm font-medium mt-4">Chargement…</p>}
            </section>

            {selectedCardType && (
                <SettingsDrawer
                    open={!!selectedCardType}
                    onClose={() => setSelectedType(null)}
                    saving={saving}
                    onSave={handleSave}
                    cardType={selectedCardType}
                    settings={settings}
                    onToggleConnector={toggleConnector}
                />
            )}
        </main>
    )
}
