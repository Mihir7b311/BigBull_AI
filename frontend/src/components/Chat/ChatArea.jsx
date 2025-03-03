// src/components/Chat/ChatArea.jsx
import React, { useRef, useEffect } from 'react';
import MessageContent from './MessageContent';
import './Chat.css';

const ChatArea = ({ messages, addMessage }) => {
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleComponentAction = (type, data) => {
    // Handle different component actions
    if (type === 'crypto-transfer') {
      // Add a user message showing the transfer request
      addMessage(`I want to send ${data.amount} ${data.crypto} to ${data.address}`, 'user');
      
      // Add the agent response confirming the transfer
      setTimeout(() => {
        addMessage(`I've initiated a transfer of ${data.amount} ${data.crypto} to ${data.address}. The transaction has been submitted to the blockchain.`, 'agent');
      }, 1000);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-title">
          <div className="chat-logo">
            <img src="https://via.placeholder.com/36" alt="Marp" className="chat-logo-img" />
          </div>
          <div className="chat-info">
            <div className="chat-info-title">Marp Trades Assistant</div>
            <div className="chat-info-subtitle">Powered by advanced market analysis</div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        <h1 className="chat-welcome-title">How can I help with your trading today?</h1>
        
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.sender === 'agent' && (
                <div className="agent-icon">
                  <img src="https://via.placeholder.com/36" alt="Agent" className="agent-icon-img" />
                </div>
              )}
              
              <div className="message-bubble">
                <MessageContent 
                  message={message} 
                  onAction={handleComponentAction} 
                />
                
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;