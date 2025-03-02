// src/components/DeFiAgent.jsx
import React, { useState } from 'react';
import Header from './Header/Header';
import ChatArea from './Chat/ChatArea';
import CommandInput from './CommandInput/CommandInput';
import AccountInfo from './AccountInfo/AccountInfo';
import RecentTransactions from './Transactions/RecentTransactions';
import WavyBackground from './WavyBackground/WavyBackground';
import '../styles/global.css';

const DeFiAgent = () => {
  // Sample messages for the chat
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'agent', 
      text: "Hello! I'm your Marp Trades assistant. I can help you with:", 
      bullets: [
        "Trading on Starknet (type 'trade' to start)",
        "Token swaps (e.g., 'swap 0.1 ETH to USDC')",
        "Information about our platform and features",
        "Trading strategies and market analysis"
      ],
      footer: "What would you like to do?",
      timestamp: "09:28 PM"
    }
  ]);

  const addMessage = (text, sender = 'user') => {
    const newMessage = { 
      id: messages.length + 1, 
      sender, 
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate agent response
    if (sender === 'user') {
      setTimeout(() => {
        addMessage("I'll help you with that. What specific information are you looking for?", 'agent');
      }, 1000);
    }
  };

  return (
    <div className="defi-container">
      <div className="background-container">
        <WavyBackground 
          colors={["#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#0284c7"]} 
          backgroundFill="#000000" 
          blur={15}
          waveOpacity={0.2}
          speed="slow"
        />
      </div>
      
      <Header />
      
      <div className="main-content">
        <div className="chat-container">
          <ChatArea 
            messages={messages} 
            addMessage={addMessage} 
          />
          
          <CommandInput 
            onSubmit={(command) => addMessage(command)} 
          />
        </div>
        
        <div className="right-sidebar">
          <AccountInfo />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default DeFiAgent;