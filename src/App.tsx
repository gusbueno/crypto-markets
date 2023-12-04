import { MarketList } from './components/MarketList'
import { WebSocketProvider } from './providers/WebSocketProvider'

function App() {
  return (
    <div>
     <WebSocketProvider>
        <MarketList />
     </WebSocketProvider>
    </div>
  )
}

export default App
