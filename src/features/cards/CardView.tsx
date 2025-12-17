import { Card } from '../../engine/card.types'

interface CardViewProps {
  card: Card
}

export function CardView({ card }: CardViewProps) {
  return (
    <div className="card-view">
      <h2>{card.title}</h2>
      {card.content && <p>{card.content}</p>}
      {card.metadata && (
        <div className="card-metadata">
          {Object.entries(card.metadata).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
