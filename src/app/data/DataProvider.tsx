import type { ReactNode } from 'react'
import React, { createContext, useContext } from 'react'
import type { CardRepository } from '@/engine/cards/card.repository'

const DataContext = createContext<{ cardRepo: CardRepository } | null>(null)

export function DataProvider({
    cardRepo,
    children,
}: {
    cardRepo: CardRepository
    children: ReactNode
}) {
    return (
        <DataContext.Provider value={{ cardRepo }}>
            {children}
        </DataContext.Provider>
    )
}

export function useCardRepo() {
    const ctx = useContext(DataContext)
    if (!ctx) throw new Error('useCardRepo must be used within DataProvider')
    return ctx.cardRepo
}
