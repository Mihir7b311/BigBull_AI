import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DeFiAgent from './components/DeFiAgent'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <DeFiAgent />
    </div>
    </>
  )
}

export default App
