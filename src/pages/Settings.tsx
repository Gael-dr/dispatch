import { Button } from '@/shared/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export default function Settings() {
  const navigate = useNavigate()
  return (
    <main
      className="flex flex-col h-screen w-screen px-4 pt-10 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.2069 0.0403 263.99)' }}
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="w-fit h-fit p-0"
        >
          <ChevronLeft
            className="w-7 h-7"
            size={28}
            style={{ width: 28, height: 28 }}
          />
        </Button>
        <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
          PARAMÈTRES
        </h1>
      </div>
    </main>
  )
}
