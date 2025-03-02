// src/components/Chat/ChatArea.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Maximize2, Star, Share2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import './Chat.css';

const ChatArea = ({ messages, addMessage }) => {
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator after user message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-header-left">
          <h2>Trading Assistant</h2>
          <div className="chat-status">
            <span className="status-dot online"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn">
            <Star size={18} />
          </button>
          <button className="icon-btn">
            <Share2 size={18} />
          </button>
          <button className="icon-btn">
            <Settings size={18} />
          </button>
          <button className="icon-btn">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="chat-messages">
        <div className="messages-container">
          {messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput onSendMessage={addMessage} />
    </div>
  );
};

export default ChatArea;