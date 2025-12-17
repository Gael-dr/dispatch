import { CardStack } from '../features/cards/CardStack'
import { Card } from '../engine/card.types'

export default function Inbox() {
  // Example cards data - this would come from your data source
  const mockCards: Card[] = [
    {
      id: '1',
      type: 'notification',
      title: 'Welcome to Dispatch',
      content: 'This is your inbox',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const handleCardAction = (cardId: string, actionId: string) => {
    console.log(`Card ${cardId} action: ${actionId}`)
    // Handle card action here
  }

  return (
    <div className="inbox">
      <h1>Inbox</h1>
      <CardStack cards={mockCards} onCardAction={handleCardAction} />
    </div>
  )
}
