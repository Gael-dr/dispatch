import type { ReactNode } from 'react'
import type { Card } from '@/engine/cards/card.types'
import { getAvailableActions } from '@/engine/policies/card.policy'
import { CardActions } from './CardActions'

export function CardShell({
    card,
    header,
    children,
    onAction,
    footerClassName,
}: {
    card: Card
    header?: ReactNode
    children: ReactNode
    onAction?: (actionId: string) => void
    footerClassName?: string
}) {
    return (
        <div className="w-full min-h-100 max-h-150 h-[60vh] sm:h-125 md:h-137.5 rounded-4xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col">
            {header}

            <div className="flex flex-col justify-between p-4 sm:p-6 overflow-y-auto gap-4 h-full bg-[#172030]">
                <div className="flex flex-col gap-2">{children}</div>

                <div className={footerClassName}>
                    <CardActions actions={getAvailableActions(card)} onAction={onAction} />
                </div>
            </div>
        </div>
    )
}
