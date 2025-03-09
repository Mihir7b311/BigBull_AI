'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Divider,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
  Progress,
  InputGroup,
  InputRightAddon,
  Flex,
} from '@chakra-ui/react'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Activity,
  DollarSign,
  BarChart2,
  Target,
  Percent,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'

// Dynamically import TradingView component with no SSR
const TradingViewWidget = dynamic(
  () => import('@/components/TradingViewWidget'),
  { ssr: false }
)

interface OrderFormState {
  type: 'BUY' | 'SELL'
  price: number
  amount: number
  total: number
  orderType: 'LIMIT' | 'MARKET'
  stopLoss?: number
  takeProfit?: number
}

const formatTime = (date: Date) => {
  return format(date, 'HH:mm:ss')
}

export default function AgentInterface() {
  const params = useParams()
  const agentId = params.id
  const [activeTab, setActiveTab] = useState(0)
  const [selectedPair, setSelectedPair] = useState('BTC/USDC')
  const [orderForm, setOrderForm] = useState<OrderFormState>({
    type: 'BUY',
    price: 0,
    amount: 0,
    total: 0,
    orderType: 'LIMIT'
  })

  // Add client-side only state for dynamic data
  const [mounted, setMounted] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(65450.00)
  const [priceChange, setPriceChange] = useState(2.5)
  const [volume24h, setVolume24h] = useState('1.2B')
  const [high24h, setHigh24h] = useState(65800.00)
  const [low24h, setLow24h] = useState(64200.00)

  // Mock data for order book with client-side state
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
    ]
  })

  // Mock data for recent trades with client-side state
  const [recentTrades, setRecentTrades] = useState([
    { price: 65450, amount: 0.5, time: new Date(), type: 'BUY' },
    { price: 65445, amount: 1.2, time: new Date(), type: 'SELL' },
    { price: 65452, amount: 0.3, time: new Date(), type: 'BUY' },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOrderSubmit = () => {
    // Implement order submission logic
    console.log('Order submitted:', orderForm)
  }

  const updateOrderTotal = (price: number, amount: number) => {
    setOrderForm(prev => ({
      ...prev,
      price,
      amount,
      total: price * amount
    }))
  }

  if (!mounted) {
    return null // or a loading skeleton
  }

  return (
    <Grid
      templateColumns="300px 1fr 300px"
      templateRows="auto 1fr"
      h="calc(100vh - 4rem)"
      gap={0}
      bg="gray.900"
    >
      {/* Top Stats Bar */}
      <GridItem colSpan={3} p={4} borderBottom="1px" borderColor="gray.700">
        <HStack spacing={4}>
          <Select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            w="200px"
            bg="whiteAlpha.50"
          >
            <option value="BTC/USDC">BTC/USDC</option>
            <option value="ETH/USDC">ETH/USDC</option>
            <option value="STRK/USDC">STRK/USDC</option>
          </Select>
          <Stat>
            <StatLabel>Last Price</StatLabel>
            <StatNumber>${currentPrice.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type={priceChange >= 0 ? "increase" : "decrease"} />
              {Math.abs(priceChange)}%
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>24h Volume</StatLabel>
            <StatNumber>${volume24h}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>24h High</StatLabel>
            <StatNumber>${high24h.toLocaleString()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>24h Low</StatLabel>
            <StatNumber>${low24h.toLocaleString()}</StatNumber>
          </Stat>
        </HStack>
      </GridItem>

      {/* Left Sidebar - Order Book & Recent Trades */}
      <GridItem bg="gray.800" borderRight="1px" borderColor="gray.700" overflowY="auto">
        <VStack spacing={4} p={4}>
          <Card w="full">
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Order Book</Heading>
              <Box>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Price</Th>
                      <Th isNumeric>Size</Th>
                      <Th isNumeric>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orderBook.asks.map((order, i) => (
                      <Tr key={i}>
                        <Td color="red.400">${order.price.toLocaleString()}</Td>
                        <Td isNumeric>{order.size}</Td>
                        <Td isNumeric>${order.total.toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Divider my={2} />
                <Table size="sm" variant="simple">
                  <Tbody>
                    {orderBook.bids.map((order, i) => (
                      <Tr key={i}>
                        <Td color="green.400">${order.price.toLocaleString()}</Td>
                        <Td isNumeric>{order.size}</Td>
                        <Td isNumeric>${order.total.toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Card>

          <Card w="full">
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Recent Trades</Heading>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Price</Th>
                    <Th isNumeric>Amount</Th>
                    <Th>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentTrades.map((trade, i) => (
                    <Tr key={i}>
                      <Td color={trade.type === 'BUY' ? 'green.400' : 'red.400'}>
                        ${trade.price.toLocaleString()}
                      </Td>
                      <Td isNumeric>{trade.amount}</Td>
                      <Td>{formatTime(trade.time)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </Card>
        </VStack>
      </GridItem>

      {/* Main Content - Chart & Trading Interface */}
      <GridItem bg="gray.900" position="relative">
        <VStack h="full" spacing={0}>
          {/* TradingView Chart */}
          <Box h="70%" w="full" p={4}>
            <TradingViewWidget symbol={selectedPair.replace('/', '')} />
          </Box>

          {/* Trading Interface */}
          <Box w="full" p={4} borderTop="1px" borderColor="gray.700">
            <Grid templateColumns="repeat(2, 1fr)" gap={8}>
              {/* Buy Form */}
              <Card>
                <VStack align="stretch" spacing={4}>
                  <HStack>
                    <Button
                      flex={1}
                      colorScheme={orderForm.type === 'BUY' ? 'green' : 'gray'}
                      onClick={() => setOrderForm(prev => ({ ...prev, type: 'BUY' }))}
                    >
                      Buy
                    </Button>
                    <Button
                      flex={1}
                      colorScheme={orderForm.type === 'SELL' ? 'red' : 'gray'}
                      onClick={() => setOrderForm(prev => ({ ...prev, type: 'SELL' }))}
                    >
                      Sell
                    </Button>
                  </HStack>

                  <FormControl>
                    <FormLabel>Order Type</FormLabel>
                    <Select
                      value={orderForm.orderType}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as 'LIMIT' | 'MARKET' }))}
                    >
                      <option value="LIMIT">Limit</option>
                      <option value="MARKET">Market</option>
                    </Select>
                  </FormControl>

                  {orderForm.orderType === 'LIMIT' && (
                    <FormControl>
                      <FormLabel>Price</FormLabel>
                      <InputGroup>
                        <NumberInput
                          value={orderForm.price}
                          onChange={(value) => updateOrderTotal(parseFloat(value), orderForm.amount)}
                          min={0}
                          w="full"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon>USDC</InputRightAddon>
                      </InputGroup>
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <InputGroup>
                      <NumberInput
                        value={orderForm.amount}
                        onChange={(value) => updateOrderTotal(orderForm.price, parseFloat(value))}
                        min={0}
                        w="full"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <InputRightAddon>{selectedPair.split('/')[0]}</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Total</FormLabel>
                    <InputGroup>
                      <NumberInput
                        value={orderForm.total}
                        isReadOnly
                        w="full"
                      >
                        <NumberInputField />
                      </NumberInput>
                      <InputRightAddon>USDC</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <Button
                    colorScheme={orderForm.type === 'BUY' ? 'green' : 'red'}
                    onClick={handleOrderSubmit}
                  >
                    {orderForm.type === 'BUY' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
                  </Button>
                </VStack>
              </Card>

              {/* Advanced Trading Options */}
              <Card>
                <VStack align="stretch" spacing={4}>
                  <Heading size="sm">Advanced Options</Heading>
                  
                  <FormControl>
                    <FormLabel>Stop Loss</FormLabel>
                    <InputGroup>
                      <NumberInput w="full">
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <InputRightAddon>USDC</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Take Profit</FormLabel>
                    <InputGroup>
                      <NumberInput w="full">
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <InputRightAddon>USDC</InputRightAddon>
                    </InputGroup>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Post Only</FormLabel>
                    <Switch colorScheme="blue" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Reduce Only</FormLabel>
                    <Switch colorScheme="blue" />
                  </FormControl>
                </VStack>
              </Card>
            </Grid>
          </Box>
        </VStack>
      </GridItem>

      {/* Right Sidebar - Portfolio & Agent Settings */}
      <GridItem bg="gray.800" borderLeft="1px" borderColor="gray.700" overflowY="auto">
        <VStack spacing={4} p={4}>
          <Card w="full">
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Portfolio Overview</Heading>
              <Stat>
                <StatLabel>Total Value</StatLabel>
                <StatNumber>$125,450.00</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8.5%
                </StatHelpText>
              </Stat>
              <Progress value={80} colorScheme="blue" rounded="full" />
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Available</Text>
                <Text fontSize="sm">$25,450.00</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">In Orders</Text>
                <Text fontSize="sm">$100,000.00</Text>
              </HStack>
            </VStack>
          </Card>

          <Card w="full">
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Active Orders</Heading>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Price</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <Badge colorScheme="green">BUY</Badge>
                    </Td>
                    <Td>$64,500</Td>
                    <Td>0.5 BTC</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Badge colorScheme="red">SELL</Badge>
                    </Td>
                    <Td>$66,000</Td>
                    <Td>0.8 BTC</Td>
                  </Tr>
                </Tbody>
              </Table>
            </VStack>
          </Card>

          <Card w="full">
            <VStack align="stretch" spacing={4}>
              <Heading size="sm">Agent Performance</Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Stat size="sm">
                  <StatLabel>Win Rate</StatLabel>
                  <StatNumber>78.5%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Last 24h
                  </StatHelpText>
                </Stat>
                <Stat size="sm">
                  <StatLabel>Profit</StatLabel>
                  <StatNumber>$3,450</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    +5.2%
                  </StatHelpText>
                </Stat>
              </Grid>
            </VStack>
          </Card>
        </VStack>
      </GridItem>
    </Grid>
  )
} 