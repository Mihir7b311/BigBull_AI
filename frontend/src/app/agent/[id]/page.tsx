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
import { FaChartLine, FaWallet, FaChartPie, FaTrophy, FaComments, FaRobot, FaPlay, FaStop, FaList, FaCog, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { Card } from '@/components/ui/Card';

// TradingView component
const TradingViewComponent = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (typeof TradingView !== 'undefined' && container.current) {
        new TradingView.widget({
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
            'Volume@tv-basicstudies',
            'MACD@tv-basicstudies',
            'RSI@tv-basicstudies'
          ],
          width: '100%',
          height: '100%',
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
const TransferComponent = ({ onSubmit }: { onSubmit: (address: string, amount: number) => void }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Card p={6} bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="blue.800" borderRadius="xl">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">Transfer Tokens</Text>
        <FormControl>
          <FormLabel color="gray.300">Recipient Address</FormLabel>
          <Input
            placeholder="Enter recipient address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="blue.600"
            _hover={{ borderColor: 'blue.500' }}
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel color="gray.300">Amount</FormLabel>
          <InputGroup>
            <NumberInput
              w="full"
              value={amount}
              onChange={(value) => setAmount(value)}
              min={0}
            >
              <NumberInputField
                placeholder="Enter amount"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="blue.600"
                _hover={{ borderColor: 'blue.500' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
              />
            </NumberInput>
            <InputRightAddon children="SOL" bg="blue.800" borderColor="blue.600" />
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="full"
          onClick={() => onSubmit(address, parseFloat(amount))}
          isDisabled={!address || !amount || parseFloat(amount) <= 0}
        >
          Confirm Transfer
        </Button>
      </VStack>
    </Card>
  );
};

const SwapComponent = ({ onSubmit }: { onSubmit: (fromToken: string, toToken: string, amount: number) => void }) => {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');

  const tokens = ['SOL', 'USDC', 'EGLD', 'ETH'];

  return (
    <Card p={6} bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="purple.800" borderRadius="xl">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">Swap Tokens</Text>
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
          onClick={() => onSubmit(fromToken, toToken, parseFloat(amount))}
          isDisabled={!amount || parseFloat(amount) <= 0 || fromToken === toToken}
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
  const [currentPrice, setCurrentPrice] = useState(65450.00);

  // Investment parameters
  const [investAmount, setInvestAmount] = useState(1000);
  const [profitTarget, setProfitTarget] = useState(currentPrice * 1.01); // 1% profit target
  const [stopLoss, setStopLoss] = useState(currentPrice * 0.99); // 1% stop loss

  const [priceChange, setPriceChange] = useState(2.5);
  const [volume24h, setVolume24h] = useState('1.2B');
  const [high24h, setHigh24h] = useState(65800.00);
  const [low24h, setLow24h] = useState(64200.00);

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

  const [sidebarView, setSidebarView] = useState<'chat' | 'transactions'>('chat');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // WebSocket state
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  const [chatView, setChatView] = useState<'chat' | 'transactions' | 'wallet'>('chat');
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  const [showTransfer, setShowTransfer] = useState(false);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate some initial data
    const initialTransactions: Transaction[] = [
      {
        id: '1',
        type: 'BUY',
        amount: 0.5,
        price: 64200.00,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'completed',
      },
      {
        id: '2',
        type: 'SELL',
        amount: 0.2,
        price: 65100.00,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'completed',
      },
    ];

    setTransactions(initialTransactions);

    // Simulate price updates
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setCurrentPrice((prev) => {
        const newPrice = prev + change;
        // Update profit target and stop loss when price changes
        setProfitTarget(newPrice * 1.01);
        setStopLoss(newPrice * 0.99);
        return newPrice;
      });
      setPriceChange((prev) => {
        const newChange = prev + (Math.random() - 0.5) * 0.5;
        return parseFloat(newChange.toFixed(2));
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      // Close WebSocket if open
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
      status: 'EXECUTED',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Also add to transactions
    const newTransaction: Transaction = {
      id: newOrder.id,
      type: newOrder.type,
      amount: newOrder.amount,
      price: newOrder.price,
      timestamp: newOrder.timestamp,
      status: 'completed',
    };

    setTransactions((prev) => [newTransaction, ...prev]);
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

  const handleTransfer = (address: string, amount: number) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Initiating transfer of ${amount} SOL to ${address.slice(0, 6)}...${address.slice(-4)}`,
      timestamp: new Date(),
      type: 'transfer',
      metadata: { address, amount }
    };
    setMessages(prev => [...prev, message]);
    setShowTransfer(false);
  };

  const handleSwap = (fromToken: string, toToken: string, amount: number) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Initiating swap of ${amount} ${fromToken} to ${toToken}`,
      timestamp: new Date(),
      type: 'swap',
      metadata: { fromToken, toToken, amount }
    };
    setMessages(prev => [...prev, message]);
    setShowSwap(false);
  };

  // Enhanced message handling
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Check for transfer command
    if (newMessage.toLowerCase().includes('transfer')) {
      setShowTransfer(true);
      setShowSwap(false);
      setIsLoading(false);
      return;
    }

    // Check for swap command
    if (newMessage.toLowerCase().includes('swap')) {
      setShowSwap(true);
      setShowTransfer(false);
      setIsLoading(false);
      return;
    }

    // Check for transaction history command
    if (newMessage.toLowerCase().includes('check transactions')) {
      const addressMatch = newMessage.match(/erd[a-zA-Z0-9]{59}/);
      if (addressMatch) {
        await handleTransactionCheck(addressMatch[0]);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, agentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
                    <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">$25,450</Text>
                  </VStack>
                </HStack>
              </Card>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor="green.800">
                <HStack spacing={4}>
                  <Icon as={FaChartPie} boxSize={6} color="green.400" />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">P/L</Text>
                    <HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="green.400">+$3,450</Text>
                      <Badge colorScheme="green" borderRadius="full">+12.5%</Badge>
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
                      <Text fontSize="2xl" fontWeight="bold" color="purple.400">78.5%</Text>
                      <Badge colorScheme="purple" borderRadius="full">124</Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
              <Card bg="rgba(26, 32, 44, 0.7)" p={6} borderRadius="xl" boxShadow="xl" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
                <HStack spacing={4}>
                  <Icon as={FaRobot} boxSize={6} color="blue.400" />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.400">Grid Strategy</Text>
                    <Badge colorScheme="green" fontSize="md" variant="subtle" borderRadius="full" px={3}>Active</Badge>
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
                    <Text fontSize="lg" fontWeight="bold" color="green.400">Buy SOL</Text>
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
                    >
                      <NumberInputField 
                        placeholder="Amount" 
                        bg="whiteAlpha.50"
                        borderColor="green.600"
                        _hover={{ borderColor: 'green.500' }}
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <InputRightAddon children="SOL" bg="green.800" borderColor="green.600" />
                  </InputGroup>
                  <Button 
                    colorScheme="green" 
                    size="lg"
                    onClick={handleOrderSubmit}
                    borderRadius="lg"
                  >
                    Buy SOL
                  </Button>
                </VStack>
              </Card>

              {/* Sell Side */}
              <Card p={6} borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="red.800">
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="red.400">Sell SOL</Text>
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
                    >
                      <NumberInputField 
                        placeholder="Amount" 
                        bg="whiteAlpha.50"
                        borderColor="red.600"
                        _hover={{ borderColor: 'red.500' }}
                        borderRadius="lg"
                      />
                    </NumberInput>
                    <InputRightAddon children="SOL" bg="red.800" borderColor="red.600" />
                  </InputGroup>
                  <Button 
                    colorScheme="red" 
                    size="lg"
                    onClick={handleOrderSubmit}
                    borderRadius="lg"
                  >
                    Sell SOL
                  </Button>
                </VStack>
              </Card>
            </Grid>

            {/* AI Calls Card */}
            <Box mt={8}>
              <HStack mb={4} justify="space-between">
                <HStack spacing={3}>
                  <Icon as={FaRobot} color="blue.400" boxSize={5} />
                  <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">AI Calls</Text>
                </HStack>
                {/* Bot Settings */}
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Bot settings"
                      icon={<FaCog />}
                      size="md"
                      variant="ghost"
                      color="blue.400"
                      _hover={{ bg: 'whiteAlpha.100' }}
                    />
                  </PopoverTrigger>
                  <PopoverContent bg="gray.800" borderColor="gray.700" p={4} width="300px" borderRadius="xl" boxShadow="xl">
                    <PopoverArrow bg="gray.800" />
                    <PopoverCloseButton />
                    <PopoverHeader borderColor="gray.700" fontSize="lg" fontWeight="bold">Bot Settings</PopoverHeader>
                    <PopoverBody>
                      <VStack spacing={6} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm">Investment Amount</FormLabel>
                          <NumberInput
                            value={investAmount}
                            onChange={(_, val) => setInvestAmount(val)}
                            min={10}
                            max={100000}
                          >
                            <NumberInputField bg="whiteAlpha.50" borderRadius="lg" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Profit Target (${profitTarget.toFixed(2)})</FormLabel>
                          <Slider
                            value={(profitTarget / currentPrice - 1) * 100}
                            onChange={(val) => setProfitTarget(currentPrice * (1 + val / 100))}
                            min={0.1}
                            max={5}
                            step={0.1}
                          >
                            <SliderTrack bg="whiteAlpha.100">
                              <SliderFilledTrack bg="green.500" />
                            </SliderTrack>
                            <SliderThumb boxSize={6} bg="green.500">
                              <Box color="white" as={FaArrowUp} />
                            </SliderThumb>
                          </Slider>
                          <Text fontSize="xs" color="gray.400" textAlign="right">
                            {((profitTarget / currentPrice - 1) * 100).toFixed(1)}% above current price
                          </Text>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Stop Loss (${stopLoss.toFixed(2)})</FormLabel>
                          <Slider
                            value={(1 - stopLoss / currentPrice) * 100}
                            onChange={(val) => setStopLoss(currentPrice * (1 - val / 100))}
                            min={0.1}
                            max={5}
                            step={0.1}
                          >
                            <SliderTrack bg="whiteAlpha.100">
                              <SliderFilledTrack bg="red.500" />
                            </SliderTrack>
                            <SliderThumb boxSize={6} bg="red.500">
                              <Box color="white" as={FaArrowDown} />
                            </SliderThumb>
                          </Slider>
                          <Text fontSize="xs" color="gray.400" textAlign="right">
                            {((1 - stopLoss / currentPrice) * 100).toFixed(1)}% below current price
                          </Text>
                        </FormControl>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
              <Card maxH="300px" overflowY="auto" borderRadius="xl" boxShadow="xl" bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="gray.700">
                <VStack spacing={3} align="stretch" divider={<Divider borderColor="gray.700" />} p={4}>
                  {aiCalls.map((call, index) => (
                    <Flex key={index} justify="space-between" p={3} bg="whiteAlpha.50" rounded="xl" borderLeft="4px solid" borderLeftColor={
                      call.type === 'BUY' ? 'green.500' : 
                      call.type === 'SELL' ? 'red.500' : 
                      'blue.500'
                    }>
                      <HStack spacing={3}>
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
                        <Text fontSize="sm" color="white">
                          {call.message}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.400">
                        {call.timestamp.toLocaleTimeString()}
                      </Text>
                    </Flex>
                  ))}
                  {aiCalls.length === 0 && (
                    <Box p={6} textAlign="center">
                      <Text color="gray.500">No AI calls yet. Start the bot to see trading signals.</Text>
                    </Box>
                  )}
                </VStack>
              </Card>
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
              <IconButton
                aria-label="Toggle view"
                icon={sidebarView === 'chat' ? <FaComments /> : <FaList />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={() => setSidebarView((prev) => (prev === 'chat' ? 'transactions' : 'chat'))}
                borderRadius="lg"
              />
              <Text fontSize="md" fontWeight="bold" color="gray.100">
                {sidebarView === 'chat' ? 'AI Chat' : 'Transactions'}
              </Text>
            </HStack>
            <Badge variant="subtle" colorScheme="blue" borderRadius="full" px={3}>GPT-4</Badge>
          </Flex>

          {sidebarView === 'chat' ? (
            <Flex direction="column" h="full">
              {/* Menu Bar */}
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
                <HStack spacing={4}>
                  <Button
                    size="sm"
                    variant={chatView === 'chat' ? 'solid' : 'ghost'}
                    colorScheme="blue"
                    leftIcon={<FaComments />}
                    onClick={() => setChatView('chat')}
                    borderRadius="full"
                  >
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant={chatView === 'transactions' ? 'solid' : 'ghost'}
                    colorScheme="purple"
                    leftIcon={<FaExchangeAlt />}
                    onClick={() => setChatView('transactions')}
                    borderRadius="full"
                  >
                    Transactions
                  </Button>
                  <Button
                    size="sm"
                    variant={chatView === 'wallet' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    leftIcon={<FaWallet />}
                    onClick={() => setChatView('wallet')}
                    borderRadius="full"
                  >
                    Wallet
                  </Button>
                </HStack>
              </Flex>

              {/* Messages Area */}
              <Box
                flex="1"
                overflowY="auto"
                pt="120px" // Increased to accommodate menu bar
                pb="80px"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
                }}
              >
                <VStack spacing={4} align="stretch" p={4}>
                  {/* Welcome Message */}
                  {messages.length === 0 && (
                    <Box bg="rgba(45, 55, 72, 0.5)" p={6} rounded="2xl" backdropFilter="blur(10px)" border="1px solid" borderColor="blue.800">
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Icon as={FaRobot} boxSize={6} color="blue.400" />
                          <Text fontSize="lg" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">
                            Web3 Assistant
                          </Text>
                        </HStack>
                        <Text color="white" fontWeight="medium">
                          👋 Welcome! I can help you with:
                        </Text>
                        <VStack align="start" spacing={2} pl={4}>
                          <HStack>
                            <Icon as={FaWallet} color="green.400" />
                            <Text color="gray.300">Check wallet balances and transactions</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaExchangeAlt} color="purple.400" />
                            <Text color="gray.300">View transaction history</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaChartLine} color="blue.400" />
                            <Text color="gray.300">Market analysis and trading signals</Text>
                          </HStack>
                        </VStack>
                        <Text color="blue.300" fontSize="sm">
                          Try: "Check transactions for erd1..."
                        </Text>
                      </VStack>
                    </Box>
                  )}

                  {messages.map((msg) => (
                    <Flex key={msg.id} justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
                      <Box
                        maxW="85%"
                        bg={msg.role === 'user' ? 'blue.500' : 'rgba(45, 55, 72, 0.5)'}
                        p={4}
                        rounded="2xl"
                        fontSize="sm"
                        borderLeft="4px solid"
                        borderLeftColor={msg.role === 'user' ? 'blue.300' : 
                          msg.type === 'transaction' ? 'purple.400' :
                          msg.type === 'wallet' ? 'green.400' :
                          msg.type === 'transfer' ? 'blue.400' :
                          msg.type === 'swap' ? 'purple.400' :
                          'gray.600'}
                        backdropFilter="blur(10px)"
                      >
                        {msg.role === 'assistant' && msg.type && (
                          <HStack mb={2}>
                            <Icon 
                              as={
                                msg.type === 'transaction' ? FaExchangeAlt :
                                msg.type === 'wallet' ? FaWallet :
                                msg.type === 'transfer' ? FaWallet :
                                msg.type === 'swap' ? FaWallet :
                                FaRobot
                              }
                              color={
                                msg.type === 'transaction' ? 'purple.400' :
                                msg.type === 'wallet' ? 'green.400' :
                                msg.type === 'transfer' ? 'green.400' :
                                msg.type === 'swap' ? 'green.400' :
                                'blue.400'
                              }
                            />
                            <Text color="gray.400" fontSize="xs">
                              {msg.type.toUpperCase()}
                            </Text>
                          </HStack>
                        )}
                        <Text color="white">{msg.content}</Text>
                        {msg.metadata?.address && (
                          <Text fontSize="xs" color="gray.400" mt={2}>
                            Address: {msg.metadata.address.slice(0, 6)}...{msg.metadata.address.slice(-4)}
                          </Text>
                        )}
                        <Text fontSize="xs" color="whiteAlpha.600" mt={2}>
                          {msg.timestamp.toLocaleTimeString()}
                        </Text>
                      </Box>
                    </Flex>
                  ))}

                  {showTransfer && (
                    <TransferComponent onSubmit={handleTransfer} />
                  )}

                  {showSwap && (
                    <SwapComponent onSubmit={handleSwap} />
                  )}

                  <div ref={messagesEndRef} />
                </VStack>
              </Box>

              {/* Input Area - Fixed at bottom */}
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
                    placeholder={
                      chatView === 'transactions' ? "Enter address to check transactions..." :
                      chatView === 'wallet' ? "Enter wallet address..." :
                      "Message Web3 Assistant..."
                    }
                    _focus={{ bg: "whiteAlpha.200" }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="2rem"
                      size="sm"
                      colorScheme="blue"
                      rounded="xl"
                      onClick={handleSend}
                      isLoading={isLoading}
                      isDisabled={!newMessage.trim() || isLoading}
                    >
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Flex>
          ) : (
            /* Transactions View */
            <Box
              flex={1}
              overflowY="auto"
              pt="70px" // Height of the header
              pb={4}
              css={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
              }}
            >
              <VStack spacing={3} align="stretch" px={4}>
                {transactions.map((tx) => (
                  <Box
                    key={tx.id}
                    p={4}
                    bg="whiteAlpha.50"
                    rounded="xl"
                    borderLeft="4px solid"
                    borderColor={tx.type === 'BUY' ? 'green.500' : 'red.500'}
                  >
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
                          {tx.amount} SOL
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="white" fontWeight="bold">
                        ${tx.price}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" mt={3}>
                      <Text fontSize="xs" color="gray.400">
                        {tx.timestamp.toLocaleString()}
                      </Text>
                      <Badge
                        colorScheme={
                          tx.status === 'completed'
                            ? 'green'
                            : tx.status === 'pending'
                            ? 'yellow'
                            : 'red'
                        }
                        variant="subtle"
                        fontSize="xs"
                        borderRadius="full"
                        px={2}
                      >
                        {tx.status.toUpperCase()}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
