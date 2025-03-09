// import { AccountProvider } from './context/AccountContext';
// import DeFiAgent from './components/DeFiAgent';

// function App() {
//   return (
//     <AccountProvider>
//       <div>
//         <DeFiAgent />
//       </div>
//     </AccountProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Investment parameters
  const [amount, setAmount] = useState(1000);
  const [profit, setProfit] = useState(1000.5);
  const [loss, setLoss] = useState(999.5);

  // Function to handle opening WebSocket connection
  const handleConnect = () => {
    const ws = new WebSocket('ws://localhost:8000/inv');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Send investment data as JSON
      const investmentData = JSON.stringify({ amount, profit, loss });
      ws.send(investmentData);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from backend:', data);
        setMessages((prevMessages) => [...prevMessages, JSON.stringify(data)]);
      } catch (error) {
        console.error("Error parsing JSON message:", error);
      }
    };
    
    // Detect WebSocket closure
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setIsClosing(false);
      setSocket(null);
    };
    setSocket(ws);
  };

  // Function to handle closing WebSocket connection with acknowledgment
  const handleDisconnect = () => {
    if (socket && !isClosing) {
      setIsClosing(true);
      socket.send("stop");
    }
  };

  return (
    <div className="App">
      <h1>WebSocket Investment Simulation</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleConnect(); }}>
        <div>
          <label>Initial Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Max Profit: </label>
          <input
            type="number"
            value={profit}
            onChange={(e) => setProfit(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Max Loss: </label>
          <input
            type="number"
            value={loss}
            onChange={(e) => setLoss(parseFloat(e.target.value))}
          />
        </div>

        {/* Green button to start the WebSocket connection */}
        <button
          style={{ backgroundColor: 'green', color: 'white', padding: '10px', margin: '10px' }}
          type="submit"
          disabled={isConnected} // Disable button if already connected
        >
          Start Connection
        </button>
      </form>

      {/* Red button to stop the WebSocket connection */}
      <button
        style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '10px' }}
        onClick={handleDisconnect}
        disabled={!isConnected} // Disable button if not connected
      >
        Stop Connection
      </button>

      <div>
        <h3>Received Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
