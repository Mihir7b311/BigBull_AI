// src/components/Transactions/RecentTransactions.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './RecentTransactions.css';

const RecentTransactions = () => {
  // Sample transactions data
  const transactions = [
    {
      id: 1,
      type: 'buy',
      asset: 'ETH',
      amount: '1.5',
      amountUSD: '$4,281.75',
      time: 'Today, 2:45 PM',
      change: '+1.5 ETH'
    },
    {
      id: 2,
      type: 'sell',
      asset: 'BTC',
      amount: '0.25',
      amountUSD: '$12,058.55',
      time: 'Yesterday, 6:12 PM',
      change: '-0.25 BTC'
    }
  ];

  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h2 className="section-title">Recent Transactions</h2>
      </div>
      
      <div className="transactions-list">
        {transactions.map(tx => (
          <div key={tx.id} className="transaction-item">
            <div className="transaction-icon">
              {tx.type === 'buy' ? 
                <ArrowUp size={18} className="icon-buy" /> : 
                <ArrowDown size={18} className="icon-sell" />
              }
            </div>
            
            <div className="transaction-details">
              <div className="transaction-title">
                {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.asset}
                <span className={`transaction-tag ${tx.type}`}>
                  {tx.type === 'buy' ? 'BUY' : 'SELL'}
                </span>
              </div>
              <div className="transaction-time">{tx.time}</div>
            </div>
            
            <div className="transaction-amount">
              <div className={`amount-change ${tx.type}`}>{tx.change}</div>
              <div className="amount-usd">{tx.amountUSD}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;