import { Button } from '@/shared/ui/button'
import {
  CalendarDaysIcon,
  Link2Icon,
  MailIcon,
  MessageSquareIcon,
  XIcon,
} from 'lucide-react'
import type { CardType, ConnectorId, SettingsState } from './settings.types'
import { CONNECTORS } from './settings.mock'

const iconMap = {
  gmail: MailIcon,
  google_calendar: CalendarDaysIcon,
  slack: MessageSquareIcon,
} as const

type Props = {
  open: boolean
  onClose: () => void
  saving: boolean
  onSave: () => void

  cardType: CardType
  settings: SettingsState
  onToggleConnector: (connectorId: ConnectorId) => void
}

export function SettingsDrawer({
  open,
  onClose,
  saving,
  onSave,
  cardType,
  settings,
  onToggleConnector,
}: Props) {
  if (!open) return null

  const enabled = settings[cardType.id]?.enabledConnectors ?? []

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[min(560px,calc(100vw-2rem))]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/35 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white font-extrabold tracking-tight truncate">
                Configuration
              </p>
              <p className="text-slate-400 text-xs font-bold tracking-wide truncate">
                {cardType.label} • Actifs : {enabled.length}
              </p>
            </div>

            <Button
              variant="ghost"
              className="p-0 h-auto w-auto text-slate-300 hover:text-white"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-5 py-4">
            <p className="text-slate-400 text-xs font-bold tracking-wide mb-2">
              CONNECTEURS
            </p>

            <div className="space-y-2">
              {cardType.connectors.map(cid => {
                const connector = CONNECTORS.find(c => c.id === cid)!
                const active = enabled.includes(cid)
                const Icon = iconMap[connector.id]

                return (
                  <div
                    key={cid}
                    className="rounded-2xl border border-white/10 bg-slate-950/15 hover:bg-slate-950/25 transition flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800/35 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-200" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm tracking-tight">
                        {connector.label}
                      </p>
                      <p className="text-slate-400 text-xs font-medium">
                        {connector.description}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => onToggleConnector(cid)}
                      className={[
                        'rounded-2xl font-extrabold tracking-tight',
                        active
                          ? 'bg-blue-500/15 text-blue-200 hover:bg-blue-500/20'
                          : 'bg-slate-800/40 text-slate-200 hover:bg-slate-800/55',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2">
                        <Link2Icon className="w-4 h-4" />
                        {active ? 'Actif' : 'Link'}
                      </span>
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="mt-4">
              <Button
                onClick={onSave}
                disabled={saving}
                className="w-full rounded-2xl bg-blue-500/90 hover:bg-blue-500 text-white font-extrabold tracking-tight py-6 shadow-xl shadow-blue-500/15"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>

            <p className="mt-3 text-slate-500 text-xs font-medium">
              (mock) Ici tu brancheras les requêtes backend + OAuth.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
