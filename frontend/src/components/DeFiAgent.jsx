// src/components/DeFiAgent.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import ChatArea from './Chat/ChatArea';
import CommandInput from './CommandInput/CommandInput';
import '../styles/global.css';

const DeFiAgent = () => {
  // Sample messages for the chat
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'agent', 
      type: 'text',
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

  const addMessage = (text, sender = 'user', extraData = {}) => {
    // Basic message
    const newMessage = { 
      id: messages.length + 1, 
      sender,
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...extraData
    };
    
    setMessages([...messages, newMessage]);
    
    // Generate a response if the message is from the user
    if (sender === 'user') {
      handleUserMessage(text);
    }
  };

  const handleUserMessage = (text) => {
    // Check for keywords to trigger UI components
    const lowerText = text.toLowerCase();
    
    setTimeout(() => {
      if (lowerText.includes('send crypto') || lowerText.includes('transfer crypto') || lowerText.includes('send token')) {
        // Add the crypto transfer UI component
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'agent',
          type: 'ui-component',
          text: "Sure, I can help you send crypto. Please fill in the details below:",
          component: {
            type: 'crypto-transfer',
            options: {
              cryptoOptions: ['ETH', 'BTC', 'USDC', 'SOL', 'LINK']
            }
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // Default response
        addMessage("I'll help you with that. What specific information are you looking for?", 'agent');
      }
    }, 1000);
  };

  return (
    <div className="defi-container">
      <div className="app-layout">
        <Sidebar />
        
        <main className="chat-container">
          <ChatArea 
            messages={messages} 
            addMessage={addMessage} 
          />
          
          <CommandInput 
            onSubmit={(command) => addMessage(command)} 
          />
        </main>
      </div>
    </div>
  );
};

export default DeFiAgent;
