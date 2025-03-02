// src/components/DeFiAgent.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import ChatArea from './Chat/ChatArea';
import CommandInput from './CommandInput/CommandInput';
import '../styles/global.css';

const DeFiAgent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Sample messages for the chat
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', text: 'Welcome to DeFi Agent! I can help you trade, monitor markets, and manage your portfolio. What would you like to do today?' },
    { id: 2, sender: 'user', text: 'Show me the current price of Ethereum' },
    { id: 3, sender: 'agent', text: 'Ethereum (ETH) is currently trading at $2,103.48, down 0.78% in the last 24 hours. The 24-hour trading volume is $14.8B. Would you like to see more market data or execute a trade?' }
  ]);

  const addMessage = (text, sender = 'user') => {
    const newMessage = { 
      id: messages.length + 1, 
      sender, 
      text 
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate agent response
    if (sender === 'user') {
      setTimeout(() => {
        addMessage('I\'m processing your request. Can you please provide more details about what you\'d like to do?', 'agent');
      }, 1000);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="defi-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="main-content">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={toggleSidebar} 
        />
        
        <div className="app-container">
          <ChatArea 
            messages={messages} 
            addMessage={addMessage} 
          />
          
          <CommandInput 
            onSubmit={(command) => addMessage(command)} 
          />
        </div>
      </div>
    </div>
  );
};

export default DeFiAgent;