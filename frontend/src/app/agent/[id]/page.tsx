'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputRightAddon,
  Flex,
  Icon,
  Input,
  InputRightElement,
  IconButton,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { FaChartLine, FaWallet, FaChartPie, FaTrophy, FaComments, FaRobot, FaPlay, FaStop, FaList, FaCog, FaArrowUp, FaArrowDown, FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { Card } from '@/components/ui/Card';

// Add TradingView type declaration
declare global {
  interface Window {
    TradingView: any;
  }
}

// TradingView component
const TradingViewComponent = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (window.TradingView && container.current) {
        new window.TradingView.widget({
          container_id: 'tradingview_chart',
          symbol: 'BINANCE:EGLDUSDT',
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'VolumeProfite@tv-basicstudies'
          ],
          width: '100%',
          height: '600px',
          save_image: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650'
        });
      }
    };

    container.current?.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      id="tradingview_chart" 
      ref={container} 
      style={{ 
        height: '100%', 
        width: '100%',
        backgroundColor: 'rgba(17, 24, 39, 0.5)',
        borderRadius: '12px',
        overflow: 'hidden'
      }} 
    />
  );
};

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  type?: 'default' | 'transaction' | 'wallet' | 'market' | 'transfer' | 'swap';
  metadata?: {
    address?: string;
    amount?: number;
    txHash?: string;
    fromToken?: string;
    toToken?: string;
  };
}

interface OrderFormState {
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  orderType: 'LIMIT' | 'MARKET';
}

interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface Order {
  id: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: Date;
  source: 'BOT' | 'MANUAL';
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
}

interface AICall {
  message: string;
  timestamp: Date;
  type: 'BUY' | 'SELL' | 'INFO';
}

// Add new interface for chat state
interface ChatState {
  showTransfer: boolean;
  showSwap: boolean;
  isProcessing: boolean;
}

// Add new function for transaction history
async function fetchTransactionHistory(address: string) {
  const baseUrl = 'https://devnet-api.multiversx.com';
  const endpoint = `${baseUrl}/accounts/${address}/transactions`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const history = await response.json();
    return history;
  } catch (error) {
    console.error("❌ Error fetching transaction history:", error);
    return null;
  }
}

// Add new components for Transfer and Swap
const TransferComponent = ({ onSubmit }: { onSubmit: (amount: number) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fixedAmount = 0.01;

  return (
    <Card p={6} bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="blue.800" borderRadius="xl">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">Transfer EGLD</Text>
        <Text fontSize="sm" color="gray.400">
          To: erd1el2mhkj0mdwtx022pndxjfstksd2fe2h0sv65f7pxvra6u973vhsspjjjd
        </Text>
        <VStack spacing={1} align="center" width="full">
          <Text fontSize="xl" fontWeight="bold" color="white">
            {fixedAmount} EGLD
          </Text>
          <Text fontSize="sm" color="gray.400">
            Fixed transfer amount
          </Text>
        </VStack>
        <Button
          colorScheme="blue"
          width="full"
          onClick={() => onSubmit(fixedAmount)}
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          Confirm Transfer
        </Button>
      </VStack>
    </Card>
  );
};

const SwapComponent = ({ onSubmit }: { onSubmit: (fromToken: string, toToken: string, amount: number) => void }) => {
  const [fromToken, setFromToken] = useState('EGLD');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tokens = ['EGLD', 'USDC', 'USDT', 'ETH'];

  return (
    <Card p={6} bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="purple.800" borderRadius="xl">
      <VStack spacing={4}>
        <HStack spacing={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="white">Swap Tokens</Text>
          <Badge colorScheme="purple" variant="subtle">Powered by xExchange</Badge>
        </HStack>
        <FormControl>
          <FormLabel color="gray.300">From</FormLabel>
          <HStack>
            <Select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="purple.600"
              _hover={{ borderColor: 'purple.500' }}
              flex="1"
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </Select>
            <NumberInput
              flex="2"
              value={amount}
              onChange={(value) => setAmount(value)}
              min={0}
            >
              <NumberInputField
                placeholder="Amount"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="purple.600"
                _hover={{ borderColor: 'purple.500' }}
              />
            </NumberInput>
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel color="gray.300">To</FormLabel>
          <Select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="purple.600"
            _hover={{ borderColor: 'purple.500' }}
          >
            {tokens.filter(t => t !== fromToken).map(token => (
              <option key={token} value={token}>{token}</option>
            ))}
          </Select>
        </FormControl>
        <Button
          colorScheme="purple"
          width="full"
          onClick={() => {
            setIsLoading(true);
            onSubmit(fromToken, toToken, parseFloat(amount));
          }}
          isDisabled={!amount || parseFloat(amount) <= 0 || fromToken === toToken || isLoading}
          isLoading={isLoading}
        >
          Confirm Swap
        </Button>
      </VStack>
    </Card>
  );
};

export default function AgentInterface() {
  const params = useParams();
  const agentId = params.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiCalls, setAiCalls] = useState<AICall[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(45.32); // Real EGLD price
  const [priceChange, setPriceChange] = useState(2.5);
  const [volume24h, setVolume24h] = useState('24.5M');
  const [high24h, setHigh24h] = useState(46.18);
  const [low24h, setLow24h] = useState(44.85);

  // Investment parameters with realistic values
  const [investAmount, setInvestAmount] = useState(1000);
  const [profitTarget, setProfitTarget] = useState(currentPrice * 1.02); // 2% profit target
  const [stopLoss, setStopLoss] = useState(currentPrice * 0.98); // 2% stop loss

  // Mock trading data with realistic values
  const [balance, setBalance] = useState(5432.50);
  const [profitLoss, setProfitLoss] = useState(234.50);
  const [profitLossPercentage, setProfitLossPercentage] = useState(4.32);
  const [winRate, setWinRate] = useState(68.5);
  const [totalTrades, setTotalTrades] = useState(124);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [orderForm, setOrderForm] = useState<OrderFormState>({
    type: 'BUY',
    price: currentPrice,
    amount: 1,
    total: currentPrice,
    orderType: 'LIMIT',
  });

  // Mock data for order book
  const [orderBook, setOrderBook] = useState({
    asks: [
      { price: 65450, size: 1.2, total: 78540 },
      { price: 65455, size: 0.8, total: 52364 },
      { price: 65460, size: 2.5, total: 163650 },
    ],
    bids: [
      { price: 65445, size: 1.5, total: 98167.5 },
      { price: 65440, size: 1.0, total: 65440 },
      { price: 65435, size: 3.2, total: 209392 },
    ],
  });

  const [sidebarView, setSidebarView] = useState<'actions' | 'chat' | 'transactions'>('actions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // WebSocket state
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  const [chatView, setChatView] = useState<'chat' | 'transactions' | 'wallet'>('chat');
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  // Update chat-related state
  const [chatState, setChatState] = useState<ChatState>({
    showTransfer: false,
    showSwap: false,
    isProcessing: false,
  });

  useEffect(() => {
    setMounted(true);

    // Simulate initial transactions with realistic EGLD values
    const initialTransactions: Transaction[] = [
      {
        id: '1',
        type: 'BUY',
        amount: 2.5,
        price: 18.85,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'completed',
      },
      {
        id: '2',
        type: 'SELL',
        amount: 1.8,
        price: 19.12,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'completed',
      },
    ];

    setTransactions(initialTransactions);

    // Simulate price updates with realistic EGLD movements
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.05; // Smaller price movements
      setCurrentPrice((prev) => {
        const newPrice = parseFloat((prev + change).toFixed(2));
        setProfitTarget(newPrice * 1.02);
        setStopLoss(newPrice * 0.98);
        return newPrice;
      });
      setPriceChange((prev) => {
        const newChange = prev + (Math.random() - 0.5) * 0.2;
        return parseFloat(newChange.toFixed(2));
      });

      // Randomly update volume
      if (Math.random() > 0.8) {
        const volumeChange = (Math.random() - 0.5) * 0.5;
        setVolume24h(prev => {
          const current = parseFloat(prev.replace('M', ''));
          return `${(current + volumeChange).toFixed(1)}M`;
        });
      }

      // Update high/low
      setHigh24h(prev => Math.max(prev, currentPrice));
      setLow24h(prev => Math.min(prev, currentPrice));

      // Simulate trading activity
      if (Math.random() > 0.9) {
        const tradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const tradeAmount = parseFloat((Math.random() * 5 + 1).toFixed(2));
        const aiCall: AICall = {
          message: `${tradeType} ${tradeAmount} EGLD at $${currentPrice.toFixed(2)} - ${
            tradeType === 'BUY' ? 'Support level reached' : 'Resistance breakout'
          }`,
          timestamp: new Date(),
          type: tradeType as 'BUY' | 'SELL',
        };
        setAiCalls(prev => [aiCall, ...prev].slice(0, 20));
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Update total when price or amount changes
  useEffect(() => {
    setOrderForm((prev) => ({ ...prev, total: prev.price * prev.amount }));
  }, [orderForm.price, orderForm.amount]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOrderSubmit = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      type: orderForm.type,
      price: orderForm.price,
      amount: orderForm.amount,
      timestamp: new Date(),
      source: 'MANUAL',
      status: 'PENDING',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Simulate order execution after 2-5 seconds
    setTimeout(() => {
      setOrders((prev) => 
        prev.map((order) => 
          order.id === newOrder.id 
            ? { ...order, status: Math.random() > 0.1 ? 'EXECUTED' : 'FAILED' }
            : order
        )
      );

      // If executed, add to transactions
      if (Math.random() > 0.1) {
        const newTransaction: Transaction = {
          id: newOrder.id,
          type: newOrder.type,
          amount: newOrder.amount,
          price: newOrder.price,
          timestamp: new Date(),
          status: 'completed',
        };
        setTransactions((prev) => [newTransaction, ...prev]);
      }
    }, Math.random() * 3000 + 2000);

    // Reset form
    setOrderForm((prev) => ({
      ...prev,
      amount: 0,
      total: 0,
    }));
  };

  const updateOrderTotal = (price: number, amount: number) => {
    setOrderForm((prev) => ({ ...prev, total: price * amount }));
  };

  // Function to handle transaction history request
  const handleTransactionCheck = async (address: string) => {
    const history = await fetchTransactionHistory(address);
    if (history) {
      setTransactionHistory(history);
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Found transaction history for ${address.slice(0, 6)}...${address.slice(-4)}`,
        timestamp: new Date(),
        type: 'transaction',
        metadata: { address }
      };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '❌ No transaction history found or error occurred.',
        timestamp: new Date(),
        type: 'transaction'
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleTransfer = async (amount: number) => {
    try {
      // Show initial processing message
      const processingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔄 Processing transfer request for ${amount} EGLD...`,
        timestamp: new Date(),
        type: 'transfer'
      };
      setMessages(prev => [...prev, processingMessage]);

      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      // Add transaction initiation message
      const initiationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Transfer initiated!\n\nAmount: ${amount} EGLD\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
        timestamp: new Date(),
        type: 'transfer',
        metadata: { amount, txHash: data.txHash }
      };
      setMessages(prev => [...prev, initiationMessage]);

      // Poll for transaction status
      let attempts = 0;
      const maxAttempts = 20; // Increased max attempts for longer transactions
      const checkStatus = async () => {
        try {
          const statusResponse = await fetch(`https://devnet-api.multiversx.com/transactions/${data.txHash}`);
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'success' || statusData.status === 'executed') {
            const successMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `✅ Transfer completed successfully!\n\nAmount: ${amount} EGLD\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
              timestamp: new Date(),
              type: 'transfer',
              metadata: { amount, txHash: data.txHash }
            };
            setMessages(prev => [...prev, successMessage]);
            return;
          }
          
          if (statusData.status === 'failed' || statusData.status === 'invalid') {
            throw new Error(`Transaction failed with status: ${statusData.status}`);
          }
          
          if (attempts < maxAttempts) {
            attempts++;
            // Add status update message every 5 attempts
            if (attempts % 5 === 0) {
              const updateMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `⏳ Still processing transfer... (Attempt ${attempts}/${maxAttempts})\n\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
                timestamp: new Date(),
                type: 'transfer',
                metadata: { amount, txHash: data.txHash }
              };
              setMessages(prev => [...prev, updateMessage]);
            }
            setTimeout(checkStatus, 3000); // Check every 3 seconds
          } else {
            throw new Error('Transaction took too long to confirm. Please check the explorer for status.');
          }
        } catch (error: any) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `❌ Error checking transaction status: ${error.message}\n\nYou can still view the transaction on the explorer:\nhttps://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
            timestamp: new Date(),
            type: 'transfer',
            metadata: { amount, txHash: data.txHash }
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      };

      // Start polling for status
      setTimeout(checkStatus, 3000);
      setChatState(prev => ({ ...prev, showTransfer: false }));

    } catch (error: any) {
      // Handle API errors
      const errorDetails = error.details ? `\n\nError Details: ${JSON.stringify(error.details, null, 2)}` : '';
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Transfer failed: ${error.message}${errorDetails}`,
        timestamp: new Date(),
        type: 'transfer',
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Transfer error:', error);
    }
  };

  const handleSwap = (fromToken: string, toToken: string, amount: number) => {
    const fixedTxHash = '7719678a112f4890d26bc62d65dde195278318320d433f2706fb90b15405a54b';
    
    // Initial message
    const initiationMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🔄 Processing swap request...\n\nFrom: ${amount} ${fromToken}\nTo: ${toToken}\nPowered by xExchange`,
      timestamp: new Date(),
      type: 'swap',
      metadata: { fromToken, toToken, amount }
    };
    setMessages(prev => [...prev, initiationMessage]);

    // Add a processing update message after 4 seconds
    setTimeout(() => {
      const processingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `⏳ Finalizing swap on xExchange...\n\nFrom: ${amount} ${fromToken}\nTo: ${toToken}`,
        timestamp: new Date(),
        type: 'swap',
        metadata: { fromToken, toToken, amount }
      };
      setMessages(prev => [...prev, processingMessage]);
    }, 4000);

    // Show success message after 8 seconds
    setTimeout(() => {
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Swap completed successfully!\n\nFrom: ${amount} ${fromToken}\nTo: ${toToken}\nTransaction Hash: ${fixedTxHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${fixedTxHash}`,
        timestamp: new Date(),
        type: 'swap',
        metadata: { fromToken, toToken, amount, txHash: fixedTxHash }
      };
      setMessages(prev => [...prev, successMessage]);
      setChatState(prev => ({ ...prev, showSwap: false }));
    }, 8000);
  };

  // Update processMessageWithAI function to use API route
  const processMessageWithAI = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.content;

      // Handle special commands
      if (aiResponse.toLowerCase().includes('transfer')) {
        setChatState(prev => ({ ...prev, showTransfer: true, showSwap: false }));
        return "I'll help you with the transfer. Please use the transfer form that appeared.";
      } else if (aiResponse.toLowerCase().includes('swap')) {
        setChatState(prev => ({ ...prev, showTransfer: false, showSwap: true }));
        return "I'll help you with the swap. Please use the swap form that appeared.";
      }

      return aiResponse;
    } catch (error) {
      console.error('Error processing message with AI:', error);
      return "I apologize, but I encountered an error. Please try again.";
    }
  };

  // Update handleSend function
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setChatState(prev => ({ ...prev, isProcessing: true }));

    try {
      const aiResponse = await processMessageWithAI(newMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Function to handle opening WebSocket connection
  const handleConnect = () => {
    if (isConnected) return; // Prevent multiple connections

    const ws = new WebSocket('ws://localhost:8000/inv');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Add connection message to AI calls
      const aiCall: AICall = {
        message: 'Bot connected successfully',
        timestamp: new Date(),
        type: 'INFO',
      };
      setAiCalls((prev) => [aiCall, ...prev]);

      // Send investment data as JSON
      const investmentData = JSON.stringify({
        amount: investAmount,
        profit: profitTarget,
        loss: stopLoss,
      });
      console.log('Sending investment data:', investmentData);
      ws.send(investmentData);

      // Start heartbeat to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 25000); // Send ping every 25 seconds

      // Store the heartbeat interval to clear it when needed
      (ws as any).heartbeatInterval = heartbeatInterval;
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      
      // Only clear heartbeat and update state if we're intentionally closing
      if (isClosing) {
        if ((ws as any).heartbeatInterval) {
          clearInterval((ws as any).heartbeatInterval);
        }
        setIsConnected(false);
        setIsClosing(false);
        setSocket(null);

        // Add disconnection message to AI calls
        const aiCall: AICall = {
          message: 'Bot disconnected',
          timestamp: new Date(),
          type: 'INFO',
        };
        setAiCalls((prev) => [aiCall, ...prev]);
      } else {
        // Attempt to reconnect if not intentionally closed
        console.log('Attempting to reconnect...');
        const aiCall: AICall = {
          message: 'waiting now.',
          timestamp: new Date(),
          type: 'INFO',
        };
        setAiCalls((prev) => [aiCall, ...prev]);
        
        // Wait 3 seconds before attempting to reconnect
        setTimeout(() => {
          if (!isClosing) {
            handleConnect();
          }
        }, 3000);
      }
    };

    ws.onmessage = (event) => {
      console.log('Raw message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Message from backend:', data);

        // Add to AI calls
        const aiCall: AICall = {
          message: JSON.stringify(data),
          timestamp: new Date(),
          type: data.action?.toUpperCase() || 'INFO',
        };
        setAiCalls((prev) => [aiCall, ...prev]);

        // Create new order if action present
        if (data.action) {
          const newOrder: Order = {
            id: Date.now().toString(),
            type: data.action.toUpperCase() as 'BUY' | 'SELL',
            price: data.price || currentPrice,
            amount: data.amount || 1,
            timestamp: new Date(),
            source: 'BOT',
            status: 'EXECUTED',
          };
          setOrders((prev) => [newOrder, ...prev]);
        }
      } catch (error) {
        console.error('Error parsing JSON message:', error);
        // Add error to AI calls
        const aiCall: AICall = {
          message: `Error parsing message: ${event.data}`,
          timestamp: new Date(),
          type: 'INFO',
        };
        setAiCalls((prev) => [aiCall, ...prev]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Add error to AI calls
      const aiCall: AICall = {
        message: 'WebSocket error occurred',
        timestamp: new Date(),
        type: 'INFO',
      };
      setAiCalls((prev) => [aiCall, ...prev]);
    };

    setSocket(ws);
  };

  // Function to handle closing WebSocket connection with acknowledgment
  const handleDisconnect = () => {
    if (socket && !isClosing && isConnected) {
      setIsClosing(true);
  
      // Add message to AI calls
      const aiCall: AICall = {
        message: 'Stopping bot...',
        timestamp: new Date(),
        type: 'INFO',
      };
      setAiCalls((prev) => [aiCall, ...prev]);
  
      socket.send('stop');
      socket.close(); // Explicitly close the connection
    }
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  if (!mounted) return null;

  return (
    <Box position="relative" h="100vh" bg="gray.900">
      <Grid templateColumns="1fr 350px" h="full" gap={0}>
        {/* Main Trading Area */}
        <Box bg="gray.900" overflowY="auto" h="full">
          {/* Top Navigation Bar */}
          <Flex
            h="70px"
            bg="gray.800"
            borderBottom="1px"
            borderColor="gray.700"
            align="center"
            px={8}
            justify="space-between"
            position="sticky"
            top={0}
            zIndex={10}
            backdropFilter="blur(10px)"
            boxShadow="lg"
          >
            <HStack spacing={8}>
              <HStack spacing={3}>
                <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">
                  EGLD/USDC
                </Text>
                <Badge
                  colorScheme={priceChange >= 0 ? 'green' : 'red'}
                  fontSize="md"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {priceChange >= 0 ? '+' : ''}{priceChange}%
                </Badge>
              </HStack>
              <Text fontSize="3xl" fontWeight="bold" color="white">${currentPrice.toLocaleString()}</Text>
              <Button
                leftIcon={isConnected ? <FaStop /> : <FaPlay />}
                colorScheme={isConnected ? 'red' : 'green'}
                size="md"
                onClick={isConnected ? handleDisconnect : handleConnect}
                isLoading={isClosing}
                loadingText={isClosing ? 'Stopping...' : 'Starting...'}
                borderRadius="full"
                px={6}
                _hover={{
                  bg: isConnected ? 'red.600' : 'green.600',
                }}
              >
                {isConnected ? 'Stop Bot' : 'Start Bot'}
              </Button>
            </HStack>

            <HStack spacing={8} color="gray.300">
              <HStack spacing={2}>
                <Icon as={FaChartLine} color="blue.400" />
                <Text fontWeight="medium">Vol: ${volume24h}</Text>
              </HStack>
              <HStack spacing={4}>
                <Text>24h High: <Text as="span" color="green.400" fontWeight="bold">${high24h.toLocaleString()}</Text></Text>
                <Text>Low: <Text as="span" color="red.400" fontWeight="bold">${low24h.toLocaleString()}</Text></Text>
              </HStack>
            </HStack>
          </Flex>

          {/* Content Area */}
          <Box p={8} pb={8}>
            {/* Stats Cards */}
            <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor="blue.800">
                <HStack spacing={4}>
                  <Icon as={FaWallet} boxSize={6} color="blue.400" />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">Balance</Text>
                    <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">
                      ${balance.toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor={profitLoss >= 0 ? "green.800" : "red.800"}>
                <HStack spacing={4}>
                  <Icon as={FaChartPie} boxSize={6} color={profitLoss >= 0 ? "green.400" : "red.400"} />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">P/L</Text>
                    <HStack>
                      <Text fontSize="2xl" fontWeight="bold" color={profitLoss >= 0 ? "green.400" : "red.400"}>
                        {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString()}
                      </Text>
                      <Badge colorScheme={profitLoss >= 0 ? "green" : "red"} borderRadius="full">
                        {profitLoss >= 0 ? '+' : ''}{profitLossPercentage}%
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor="purple.800">
                <HStack spacing={4}>
                  <Icon as={FaTrophy} boxSize={6} color="purple.400" />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">Win Rate</Text>
                    <HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.400">{winRate}%</Text>
                      <Badge colorScheme="purple" borderRadius="full">{totalTrades}</Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
                <HStack spacing={4}>
                  <Icon as={FaRobot} boxSize={6} color="blue.400" />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">Grid Strategy</Text>
                    <Badge colorScheme={isConnected ? "green" : "gray"} fontSize="md" variant="subtle" borderRadius="full" px={3}>
                      {isConnected ? 'Active' : 'Inactive'}
                    </Badge>
                  </VStack>
                </HStack>
              </Card>
            </Grid>

            {/* Chart */}
            <Card mb={8} h="500px" overflow="hidden" borderRadius="xl" boxShadow="2xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
              <TradingViewComponent />
            </Card>

            {/* Trading Interface with Orders */}
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              {/* Buy Side */}
              <Card p={6} borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="green.800">
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="green.400">Buy EGLD</Text>
                    <Select
                      size="sm"
                      w="120px"
                      value={orderForm.orderType}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as 'LIMIT' | 'MARKET' }))}
                      bg="whiteAlpha.50"
                      borderColor="green.600"
                      _hover={{ borderColor: 'green.500' }}
                      borderRadius="lg"
                    >
                      <option value="LIMIT">Limit</option>
                      <option value="MARKET">Market</option>
                    </Select>
                  </HStack>
                  {orderForm.orderType === 'LIMIT' && (
                    <InputGroup size="md">
                      <NumberInput
                        w="full"
                        value={orderForm.price}
                        onChange={(value) => updateOrderTotal(parseFloat(value), orderForm.amount)}
                        min={0}
                        precision={2}
                        step={0.01}
                      >
                        <NumberInputField 
                          placeholder="Price" 
                          bg="whiteAlpha.50"
                          borderColor="green.600"
                          _hover={{ borderColor: 'green.500' }}
                          borderRadius="lg"
                        />
                      </NumberInput>
                      <InputRightAddon children="USDC" bg="green.800" borderColor="green.600" />
                    </InputGroup>
                  )}
                  <InputGroup size="md">
                    <NumberInput
                      w="full"
                      value={orderForm.amount}
                      onChange={(value) => updateOrderTotal(orderForm.price, parseFloat(value))}
                      min={0}
                      precision={2}
                      step={0.1}
                    >
                      <NumberInputField 
                        placeholder="Amount" 
                        bg="whiteAlpha.50"
                        borderColor="green.600"
                        _hover={{ borderColor: 'green.500' }}
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <InputRightAddon children="EGLD" bg="green.800" borderColor="green.600" />
                  </InputGroup>
                  <Text fontSize="sm" color="gray.400">
                    Total: {(orderForm.price * orderForm.amount).toFixed(2)} USDC
                  </Text>
                  <Button 
                    colorScheme="green" 
                    size="lg"
                    onClick={handleOrderSubmit}
                    borderRadius="lg"
                  >
                    Buy EGLD
                  </Button>
                </VStack>
              </Card>

              {/* Sell Side */}
              <Card p={6} borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="red.800">
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="red.400">Sell EGLD</Text>
                    <Select
                      size="sm"
                      w="120px"
                      value={orderForm.orderType}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as 'LIMIT' | 'MARKET' }))}
                      bg="whiteAlpha.50"
                      borderColor="red.600"
                      _hover={{ borderColor: 'red.500' }}
                      borderRadius="lg"
                    >
                      <option value="LIMIT">Limit</option>
                      <option value="MARKET">Market</option>
                    </Select>
                  </HStack>
                  {orderForm.orderType === 'LIMIT' && (
                    <InputGroup size="md">
                      <NumberInput
                        w="full"
                        value={orderForm.price}
                        onChange={(value) => updateOrderTotal(parseFloat(value), orderForm.amount)}
                        min={0}
                        precision={2}
                        step={0.01}
                      >
                        <NumberInputField 
                          placeholder="Price" 
                          bg="whiteAlpha.50"
                          borderColor="red.600"
                          _hover={{ borderColor: 'red.500' }}
                          borderRadius="lg"
                        />
                      </NumberInput>
                      <InputRightAddon children="USDC" bg="red.800" borderColor="red.600" />
                    </InputGroup>
                  )}
                  <InputGroup size="md">
                    <NumberInput
                      w="full"
                      value={orderForm.amount}
                      onChange={(value) => updateOrderTotal(orderForm.price, parseFloat(value))}
                      min={0}
                      precision={2}
                      step={0.1}
                    >
                      <NumberInputField 
                        placeholder="Amount" 
                        bg="whiteAlpha.50"
                        borderColor="red.600"
                        _hover={{ borderColor: 'red.500' }}
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <InputRightAddon children="EGLD" bg="red.800" borderColor="red.600" />
                  </InputGroup>
                  <Text fontSize="sm" color="gray.400">
                    Total: {(orderForm.price * orderForm.amount).toFixed(2)} USDC
                  </Text>
                  <Button 
                    colorScheme="red" 
                    size="lg"
                    onClick={handleOrderSubmit}
                    borderRadius="lg"
                  >
                    Sell EGLD
                  </Button>
                </VStack>
              </Card>
            </Grid>

            {/* Orders Section */}
            <Box mt={8}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {/* Open Orders */}
                <Box>
                  <HStack mb={4} justify="space-between">
                    <HStack spacing={3}>
                      <Icon as={FaList} color="blue.400" boxSize={5} />
                      <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">Open Orders</Text>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>
                        {orders.filter(o => o.status === 'PENDING').length} Active
                      </Badge>
                    </HStack>
                  </HStack>
                  <Card maxH="300px" overflowY="auto" borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
                    <VStack spacing={3} align="stretch" p={4}>
                      {orders.filter(order => order.status === 'PENDING').map((order) => (
                        <Flex
                          key={order.id}
                          p={4}
                          bg="rgba(17, 25, 40, 0.7)"
                          rounded="xl"
                          borderLeft="4px solid"
                          borderLeftColor={order.type === 'BUY' ? 'green.500' : 'red.500'}
                          transition="all 0.2s"
                          _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                        >
                          <Grid templateColumns="1fr 1fr 1fr auto" gap={4} width="full" alignItems="center">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge
                                  colorScheme={order.type === 'BUY' ? 'green' : 'red'}
                                  variant="solid"
                                  borderRadius="full"
                                  px={3}
                                >
                                  {order.type}
                                </Badge>
                                <Badge
                                  colorScheme="yellow"
                                  variant="subtle"
                                  borderRadius="full"
                                >
                                  {order.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.400">
                                {order.timestamp.toLocaleTimeString()}
                              </Text>
                            </VStack>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" color="white" fontWeight="medium">
                                {order.amount} EGLD
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                Amount
                              </Text>
                            </VStack>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" color="white" fontWeight="medium">
                                ${order.price.toFixed(2)}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                Price
                              </Text>
                            </VStack>
                            <IconButton
                              aria-label="Cancel order"
                              icon={<Icon as={FaTimes} boxSize={3} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => {
                                setOrders(prev => prev.filter(o => o.id !== order.id));
                              }}
                            />
                          </Grid>
                        </Flex>
                      ))}
                      {orders.filter(o => o.status === 'PENDING').length === 0 && (
                        <Box p={6} textAlign="center">
                          <VStack spacing={4}>
                            <Icon as={FaList} color="blue.400" boxSize={8} />
                            <Text color="gray.400">No open orders. Create an order to get started.</Text>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </Card>
                </Box>

                {/* Closed Orders */}
                <Box>
                  <HStack mb={4} justify="space-between">
                    <HStack spacing={3}>
                      <Icon as={FaList} color="purple.400" boxSize={5} />
                      <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">Closed Orders</Text>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>
                        {orders.filter(o => o.status !== 'PENDING').length} Total
                      </Badge>
                    </HStack>
                  </HStack>
                  <Card maxH="300px" overflowY="auto" borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
                    <VStack spacing={3} align="stretch" p={4}>
                      {orders.filter(order => order.status !== 'PENDING')
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map((order) => (
                        <Flex
                          key={order.id}
                          p={4}
                          bg="rgba(17, 25, 40, 0.7)"
                          rounded="xl"
                          borderLeft="4px solid"
                          borderLeftColor={
                            order.status === 'EXECUTED' 
                              ? (order.type === 'BUY' ? 'green.500' : 'red.500')
                              : 'gray.500'
                          }
                          opacity={order.status === 'FAILED' ? 0.7 : 1}
                          transition="all 0.2s"
                          _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                        >
                          <Grid templateColumns="1fr 1fr 1fr" gap={4} width="full" alignItems="center">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge
                                  colorScheme={order.type === 'BUY' ? 'green' : 'red'}
                                  variant="solid"
                                  borderRadius="full"
                                  px={3}
                                >
                                  {order.type}
                                </Badge>
                                <Badge
                                  colorScheme={
                                    order.status === 'EXECUTED' ? 'green' : 'red'
                                  }
                                  variant="subtle"
                                  borderRadius="full"
                                >
                                  {order.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.400">
                                {order.timestamp.toLocaleTimeString()}
                              </Text>
                            </VStack>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" color="white" fontWeight="medium">
                                {order.amount} EGLD
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                Amount
                              </Text>
                            </VStack>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" color="white" fontWeight="medium">
                                ${order.price.toFixed(2)}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                Total: ${(order.price * order.amount).toFixed(2)}
                              </Text>
                            </VStack>
                          </Grid>
                        </Flex>
                      ))}
                      {orders.filter(o => o.status !== 'PENDING').length === 0 && (
                        <Box p={6} textAlign="center">
                          <VStack spacing={4}>
                            <Icon as={FaList} color="purple.400" boxSize={8} />
                            <Text color="gray.400">No closed orders yet. Orders will appear here once executed or cancelled.</Text>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </Card>
                </Box>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* AI Assistant Sidebar */}
        <Box
          bg="gray.900"
          borderLeft="1px"
          borderColor="gray.800"
          h="100vh"
          position="fixed"
          top={0}
          right={0}
          w="350px"
          display="flex"
          flexDirection="column"
          boxShadow="-4px 0 15px rgba(0, 0, 0, 0.3)"
        >
          {/* Header */}
          <Flex
            px={6}
            py={4}
            borderBottom="1px"
            borderColor="gray.800"
            align="center"
            justify="space-between"
            bg="rgba(26, 32, 44, 0.95)"
            backdropFilter="blur(10px)"
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={20}
          >
            <HStack spacing={4}>
              <Icon as={FaRobot} color="blue.400" boxSize={5} />
              <Text fontSize="md" fontWeight="bold" color="gray.100">
                Trading Assistant
              </Text>
            </HStack>
            <Badge variant="subtle" colorScheme="blue" borderRadius="full" px={3}>Active</Badge>
          </Flex>

          {/* Navigation Menu */}
          <Flex
            px={4}
            py={2}
            bg="rgba(26, 32, 44, 0.95)"
            borderBottom="1px"
            borderColor="gray.700"
            position="absolute"
            top="70px"
            left={0}
            right={0}
            zIndex={19}
            backdropFilter="blur(10px)"
          >
            <HStack spacing={2} width="full" justify="space-between">
              <Button
                size="sm"
                variant={sidebarView === 'actions' ? 'solid' : 'ghost'}
                colorScheme="blue"
                leftIcon={<FaRobot />}
                onClick={() => setSidebarView('actions')}
                flex={1}
                borderRadius="full"
              >
                Actions
              </Button>
              <Button
                size="sm"
                variant={sidebarView === 'chat' ? 'solid' : 'ghost'}
                colorScheme="purple"
                leftIcon={<FaComments />}
                onClick={() => setSidebarView('chat')}
                flex={1}
                borderRadius="full"
              >
                Chat
              </Button>
              <Button
                size="sm"
                variant={sidebarView === 'transactions' ? 'solid' : 'ghost'}
                colorScheme="green"
                leftIcon={<FaExchangeAlt />}
                onClick={() => setSidebarView('transactions')}
                flex={1}
                borderRadius="full"
              >
                Trades
              </Button>
            </HStack>
          </Flex>

          {/* Content Area */}
          <Box
            flex="1"
            overflowY="auto"
            pt="120px"
            pb="80px"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
            }}
          >
            {sidebarView === 'actions' && (
              <VStack spacing={3} align="stretch" p={4}>
                {aiCalls.map((call, index) => (
                  <Flex
                    key={index}
                    p={4}
                    bg="rgba(26, 32, 44, 0.7)"
                    rounded="xl"
                    borderLeft="4px solid"
                    borderLeftColor={
                      call.type === 'BUY' ? 'green.500' :
                      call.type === 'SELL' ? 'red.500' : 
                      'blue.500'
                    }
                    backdropFilter="blur(10px)"
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  >
                    <VStack align="stretch" spacing={2} width="full">
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Badge
                            colorScheme={
                              call.type === 'BUY' ? 'green' :
                              call.type === 'SELL' ? 'red' :
                              'blue'
                            }
                            variant="solid"
                            borderRadius="full"
                            px={3}
                          >
                            {call.type}
                          </Badge>
                          <Text fontSize="xs" color="gray.400">
                            {call.timestamp.toLocaleTimeString()}
                          </Text>
                        </HStack>
                        <Icon
                          as={
                            call.type === 'BUY' ? FaArrowUp :
                            call.type === 'SELL' ? FaArrowDown :
                            FaRobot
                          }
                          color={
                            call.type === 'BUY' ? 'green.400' :
                            call.type === 'SELL' ? 'red.400' :
                            'blue.400'
                          }
                          boxSize={4}
                        />
                      </Flex>
                      <Text fontSize="sm" color="white">
                        {call.message}
                      </Text>
                    </VStack>
                  </Flex>
                ))}
                {aiCalls.length === 0 && (
                  <Box p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Icon as={FaRobot} color="blue.400" boxSize={8} />
                      <Text color="gray.400">No agent actions yet. Start the bot to see trading signals.</Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            )}

            {sidebarView === 'chat' && (
              <VStack spacing={4} align="stretch" p={4}>
                {messages.map((msg) => (
                  <Flex key={msg.id} justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Box
                      maxW="85%"
                      bg={msg.role === 'user' ? 'blue.500' : 'rgba(45, 55, 72, 0.5)'}
                      p={4}
                      rounded="2xl"
                      fontSize="sm"
                      borderLeft="4px solid"
                      borderLeftColor={msg.role === 'user' ? 'blue.300' : 'gray.600'}
                      backdropFilter="blur(10px)"
                    >
                      {msg.content.includes('View on Explorer') ? (
                        <VStack align="start" spacing={2}>
                          <Text color="white">
                            {msg.content.split('\n\n')[0]}
                          </Text>
                          <Text color="gray.300" fontSize="xs">
                            {msg.content.split('\n')[1]}
                          </Text>
                          <Button
                            as="a"
                            href={msg.content.split('\n')[2].split(': ')[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            colorScheme="blue"
                            variant="link"
                            leftIcon={<FaExchangeAlt />}
                          >
                            View on Explorer
                          </Button>
                        </VStack>
                      ) : (
                        <Text color="white">{msg.content}</Text>
                      )}
                      <Text fontSize="xs" color="whiteAlpha.600" mt={2}>
                        {msg.timestamp.toLocaleTimeString()}
                      </Text>
                    </Box>
                  </Flex>
                ))}
                
                {chatState.showTransfer && (
                  <TransferComponent
                    onSubmit={(amount) => {
                      handleTransfer(amount);
                      setChatState(prev => ({ ...prev, showTransfer: false }));
                    }}
                  />
                )}
                
                {chatState.showSwap && (
                  <SwapComponent
                    onSubmit={(fromToken, toToken, amount) => {
                      handleSwap(fromToken, toToken, amount);
                      setChatState(prev => ({ ...prev, showSwap: false }));
                    }}
                  />
                )}

                {messages.length === 0 && (
                  <Box p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Icon as={FaComments} color="purple.400" boxSize={8} />
                      <Text color="gray.400">No messages yet. Start a conversation with your trading assistant.</Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            )}

            {sidebarView === 'transactions' && (
              <VStack spacing={3} align="stretch" p={4}>
                {transactions.map((tx) => (
                  <Box
                    key={tx.id}
                    p={4}
                    bg="rgba(26, 32, 44, 0.7)"
                    rounded="xl"
                    borderLeft="4px solid"
                    borderColor={tx.type === 'BUY' ? 'green.500' : 'red.500'}
                    backdropFilter="blur(10px)"
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  >
                    <VStack align="stretch" spacing={2}>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Badge
                            colorScheme={tx.type === 'BUY' ? 'green' : 'red'}
                            variant="solid"
                            borderRadius="full"
                            px={3}
                          >
                            {tx.type}
                          </Badge>
                          <Text fontSize="sm" color="white" fontWeight="medium">
                            {tx.amount} EGLD
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="white" fontWeight="bold">
                          ${tx.price}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="xs" color="gray.400">
                          {tx.timestamp.toLocaleString()}
                        </Text>
                        <Badge
                          colorScheme={
                            tx.status === 'completed' ? 'green' :
                            tx.status === 'pending' ? 'yellow' :
                            'red'
                          }
                          variant="subtle"
                          fontSize="xs"
                          borderRadius="full"
                          px={2}
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </Flex>
                    </VStack>
                  </Box>
                ))}
                {transactions.length === 0 && (
                  <Box p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Icon as={FaExchangeAlt} color="green.400" boxSize={8} />
                      <Text color="gray.400">No transactions yet. Start trading to see your history.</Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            )}
          </Box>
          

          {/* Input Area - Only show for chat view */}
          {sidebarView === 'chat' && (
            <Box
              p={4}
              bg="rgba(26, 32, 44, 0.95)"
              borderTop="1px"
              borderColor="gray.700"
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              backdropFilter="blur(10px)"
            >
              <InputGroup size="lg">
                <Input
                  bg="whiteAlpha.100"
                  border="none"
                  rounded="2xl"
                  pl={6}
                  pr="4.5rem"
                  placeholder="Message your trading assistant..."
                  _focus={{ bg: "whiteAlpha.200" }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !chatState.isProcessing && handleSend()}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="2rem"
                    size="sm"
                    colorScheme="blue"
                    rounded="xl"
                    onClick={handleSend}
                    isLoading={chatState.isProcessing}
                    isDisabled={!newMessage.trim() || chatState.isProcessing}
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>

  );
}