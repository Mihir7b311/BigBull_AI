// src/context/AccountContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState({
    address: '',
    isConnected: false,
    provider: null,
    chainId: null,
    balance: {
      ETH: 0,
      USDC: 0,
      // Add more tokens as needed
    }
  });
  
  // Function to update account after wallet connection
  const connectWallet = (data) => {
    const { address, provider } = data;
    
    setAccount(prev => ({
      ...prev,
      address,
      isConnected: true,
      provider
    }));
    
    // After connection, we can fetch balances and other data
    fetchAccountData(address, provider);
    
    // Store connection in localStorage
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('walletAddress', address);
  };
  
  // Function to disconnect wallet
  const disconnectWallet = () => {
    // If using a provider with a disconnect method, call it here
    if (account.provider?.disconnect) {
      account.provider.disconnect();
    }
    
    setAccount({
      address: '',
      isConnected: false,
      provider: null,
      chainId: null,
      balance: {
        ETH: 0,
        USDC: 0
      }
    });
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };
  
  // Fetch account data like balance, etc.
  const fetchAccountData = async (address, provider) => {
    try {
      if (!address || !provider) return;
      
      // Example: Fetch ETH balance
      const balance = await provider.getBalance?.(address);
      const ethBalance = balance ? parseInt(balance) / 1e18 : 0;
      
      // Update account state with balance
      setAccount(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          ETH: ethBalance
        }
      }));
      
      // You would also fetch other token balances here
      // This is just a placeholder and would need to be implemented
      // based on the specific tokens you want to support
      
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };
  
  // Check for existing connection on app start
  useEffect(() => {
    const checkExistingConnection = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      const storedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected && storedAddress) {
        // Here you would typically:
        // 1. Try to reconnect using your wallet provider
        // 2. If successful, call connectWallet with the provider and address
        // 3. If not, call disconnectWallet to clean up localStorage
        
        // For now, just update the UI to show the address
        setAccount(prev => ({
          ...prev,
          address: storedAddress,
          isConnected: true
        }));
      }
    };
    
    checkExistingConnection();
  }, []);
  
  return (
    <AccountContext.Provider
      value={{
        account,
        connectWallet,
        disconnectWallet,
        fetchAccountData
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};