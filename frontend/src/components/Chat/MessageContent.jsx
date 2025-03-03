// src/components/Chat/MessageContent.jsx
import React from 'react';
import CryptoTransfer from '../UI/CryptoTransfer';

const MessageContent = ({ message, onAction }) => {
  // Based on the message type, render different content
  if (message.type === 'ui-component') {
    switch (message.component.type) {
      case 'crypto-transfer':
        return (
          <>
            {message.text && <div className="message-text">{message.text}</div>}
            <CryptoTransfer 
              onSend={(data) => onAction('crypto-transfer', data)} 
              cryptoOptions={message.component.options?.cryptoOptions || ['ETH', 'BTC', 'USDC']}
            />
          </>
        );
      // Add more component types as needed
      default:
        return <div className="message-text">Unsupported component type</div>;
    }
  }
  
  // Default text message rendering
  return (
    <>
      {message.text && <div className="message-text">{message.text}</div>}
      
      {message.bullets && (
        <ul className="message-bullets">
          {message.bullets.map((bullet, index) => (
            <li key={index} className="message-bullet">{bullet}</li>
          ))}
        </ul>
      )}
      
      {message.footer && <div className="message-footer">{message.footer}</div>}
    </>
  );
};

export default MessageContent;