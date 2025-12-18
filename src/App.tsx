import { useState } from 'react'
import './App.css'
import { Button } from './shared/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Dispatch</h1>
        <div className="card">
          <Button onClick={() => setCount(count => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
