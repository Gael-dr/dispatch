import { Card } from '@/engine/card.types'
import { CardStack } from '@/features/cards/CardStack'

export default function Decisions() {
  // TODO: Récupérer les cartes depuis le store ou une API
  const mockCards: Card[] = [
    {
      id: '1',
      type: 'decision',
      title: 'Décision 1',
      content: 'Contenu de la première décision',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const handleCardAction = (cardId: string, actionId: string) => {
    console.log(`Action ${actionId} sur la carte ${cardId}`)
    // Ici vous pouvez gérer les actions sur les cartes
  }

  return (
    <section className="decisions flex flex-col items-center h-screen w-screen pt-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="brand-text">DÉCISIONS</h1>
        <p className="text-slate-400 font-medium tracking-wide text-sm opacity-80">
          Traitez vos décisions en attente
        </p>
      </div>

      <div className="w-full max-w-2xl px-6">
        <CardStack cards={mockCards} onCardAction={handleCardAction} />
      </div>
    </section>
  )
}
