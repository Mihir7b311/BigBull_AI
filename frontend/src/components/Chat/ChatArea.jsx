// src/components/Chat/ChatArea.jsx
import React, { useRef, useEffect, useState } from 'react';
import MessageContent from './MessageContent';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import './Chat.css';

const ChatArea = ({ messages, addMessage }) => {
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState([
    'Send crypto to my friend',
    'Swap 0.1 ETH to USDC',
    'Check current gas prices',
    'Show my portfolio'
  ]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator when user sends a message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleComponentAction = (type, data) => {
    // Handle different component actions
    if (type === 'crypto-transfer') {
      // Add a user message showing the transfer request
      addMessage(`I want to send ${data.amount} ${data.crypto} to ${data.address}`, 'user');
      
      // Add the agent response confirming the transfer
      setTimeout(() => {
        addMessage(`I've initiated a transfer of ${data.amount} ${data.crypto} to ${data.address}. The transaction has been submitted to the blockchain.`, 'agent');
      }, 2000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addMessage(suggestion, 'user');
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-title">
          <div className="chat-logo">
            <img src="/vite.svg" alt="Marp" className="chat-logo-img" />
          </div>
          <div className="chat-info">
            <div className="chat-info-title">Marp Trades Assistant</div>
            <div className="chat-info-subtitle">Powered by advanced market analysis</div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        <h1 className="chat-welcome-title">How can I help with your trading today?</h1>
        
        <div className="suggested-messages">
          {suggestedMessages.map((suggestion, index) => (
            <button 
              key={index} 
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender}`}
            style={{ animationDelay: `${(message.id % 10) * 0.1}s` }}
          >
            <div className="message-content">
              {message.sender === 'agent' && (
                <div className="agent-icon">
                  <img src="/vite.svg" alt="Agent" className="agent-icon-img" />
                </div>
              )}
              
              <div className="message-bubble">
                {message.sender === 'agent' && (
                  <div className="message-actions">
                    <button 
                      className="message-action-btn"
                      onClick={() => handleCopyMessage(message.text)}
                    >
                      <Copy size={14} />
                    </button>
                    <button className="message-action-btn">
                      <ThumbsUp size={14} />
                    </button>
                    <button className="message-action-btn">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
                
                <MessageContent 
                  message={message} 
                  onAction={handleComponentAction} 
                />
                
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-content">
              <div className="agent-icon">
                <img src="/vite.svg" alt="Agent" className="agent-icon-img" />
              </div>
              <div className="typing-bubble">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;